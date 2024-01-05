import type { vec3 } from "gl-matrix";
import { Curve, CurveLevel } from "./curve";
import { DEFAULT_DELTA } from "./segment";

export class BSpline extends Curve {
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

  getSegmentAmount(): number {
    return this.controlPoints.length - this.level;
  }

  segmentPoints(segment: number): vec3[] {
    return this.controlPoints.slice(segment, segment + this.level + 1);
  }

  static straightLines(points: vec3[]): BSpline {
    let _points = [];
    for (let p of points) {
      _points.push(p, p, p);
    }
    _points.push(...points.slice(-1));
    let splineStraight = new BSpline(_points, CurveLevel.CUBIC);
    // Removing redundant segment.
    splineStraight.segments.pop();
    // Make segment lengths uniform.
    splineStraight.segments.forEach((s) => {
      s.length = 1;
    });
    splineStraight.length = splineStraight.segments.length;
    return splineStraight;
  }
}

function cuadraticBases(): Function[] {
  return [(u: number) => 0.5 * (1 - u) * (1 - u), (u: number) => 0.5 + u * (1 - u), (u: number) => 0.5 * u * u];
}

function cubicBases(): Function[] {
  return [
    (u: number) => ((1 - 3 * u + 3 * u * u - u * u * u) * 1) / 6,
    (u: number) => ((4 - 6 * u * u + 3 * u * u * u) * 1) / 6,
    (u: number) => ((1 + 3 * u + 3 * u * u - 3 * u * u * u) * 1) / 6,
    (u: number) => (u * u * u * 1) / 6,
  ];
}

function cuadraticDer(): Function[] {
  return [(u: number) => -1 + u, (u: number) => 1 - 2 * u, (u: number) => u];
}

function cubicDer(): Function[] {
  return [
    (u: number) => (-3 + 6 * u - 3 * u * u) / 6,
    (u: number) => (-12 * u + 9 * u * u) / 6,
    (u: number) => (3 + 6 * u - 9 * u * u) / 6,
    (u: number) => (3 * u * u * 1) / 6,
  ];
}
