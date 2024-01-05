import type { vec3 } from "gl-matrix";
import { CurveLevel, Curve } from "./curve";
import { DEFAULT_DELTA } from "./segment";
export class Bezier extends Curve {
  constructor(points: vec3[], level: CurveLevel, delta = DEFAULT_DELTA) {
    super(points, level);
    switch (this.level) {
      case CurveLevel.CUADRATIC: {
        this.B = cuadraticBases();
        this.dB = cuadraticDer();
        break;
      }
      case CurveLevel.CUBIC: {
        this.B = cubicBases();
        this.dB = cubicDer();
        break;
      }
    }
    this.segments.forEach((s) => {
      s.length = s.getLength(delta);
      this.length += s.length;
    });
  }

  segmentPoints(segment: number): vec3[] {
    return this.level == CurveLevel.CUBIC
      ? this.controlPoints.slice(segment * 3, segment * 3 + 4)
      : this.controlPoints.slice(segment * 2, segment * 2 + 3);
  }

  getSegmentAmount(): number {
    const n = this.controlPoints.length;
    return (n - 1) / this.level;
  }
}

function cuadraticBases(): Function[] {
  return [
    (u: number) => (1 - u) * (1 - u),
    (u: number) => 2 * u * (1 - u),
    (u: number) => u * u,
  ];
}

function cubicBases(): Function[] {
  return [
    (u: number) => (1 - u) * (1 - u) * (1 - u),
    (u: number) => 3 * (1 - u) * (1 - u) * u,
    (u: number) => 3 * (1 - u) * u * u,
    (u: number) => u * u * u,
  ];
}

function cuadraticDer(): Function[] {
  return [
    (u: number) => -2 + 2 * u,
    (u: number) => 2 - 4 * u,
    (u: number) => 2 * u,
  ];
}

function cubicDer(): Function[] {
  return [
    (u: number) => -3 * u * u + 6 * u - 3,
    (u: number) => 9 * u * u - 12 * u + 3,
    (u: number) => -9 * u * u + 6 * u,
    (u: number) => 3 * u * u,
  ];
}
