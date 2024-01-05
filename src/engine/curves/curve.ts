import type { vec3 } from "gl-matrix";
import { DEFAULT_DELTA, Segment } from "./segment";
import { DrawMethod, WebGL } from "../webgl";

export abstract class Curve {
  controlPoints: vec3[];
  level: CurveLevel;

  segments: Segment[];
  length: number = 0;

  B: Function[] = [];
  dB: Function[] = [];

  constructor(points: vec3[], level: CurveLevel) {
    this.controlPoints = points;
    this.level = level;
    this.segments = this.buildSegments();
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.segments.forEach((s) => {
      s.drawOnCanvas(ctx, true);
    });
  }

  glDraw(gl: WebGL, delta: number = DEFAULT_DELTA): void {
    let { p, n } = this.discretize(delta);
    const idx = [...Array(p.length).keys()];
    let points: number[] = [];
    for (let point of p) {
      points.push(...point);
    }
    let normals: number[] = [];
    for (let normal of n) {
      normals.push(...normal);
    }
    gl.draw(
      {
        position: points,
        index: idx,
        normal: normals,
      },
      DrawMethod.LineStrip
    );
  }

  discretize(delta = DEFAULT_DELTA): {
    p: vec3[];
    n: vec3[];
    b: vec3[];
    t: vec3[];
  } {
    let discretized: { p: vec3[]; n: vec3[]; b: vec3[]; t: vec3[] } = {
      p: [],
      n: [],
      b: [],
      t: [],
    };
    for (let u = 0; u <= 1.001; u += delta) {
      let data = this.getPointData(u);
      discretized.p.push(data.p);
      discretized.n.push(data.n);
      discretized.b.push(data.b);
      discretized.t.push(data.t);
    }
    return discretized;
  }

  getPointData(u: number): any {
    const { segment, localU } = this.coordToSegment(u);
    return segment.evaluate(localU);
  }

  buildSegments(): Segment[] {
    this.validateControlPoints();
    let segments: Segment[] = [];
    let segAmount = this.getSegmentAmount();
    for (let i = 0; i < segAmount; i++) {
      let points = this.segmentPoints(i);
      segments.push(new Segment(points, this));
    }
    return segments;
  }

  coordToSegment(u: number): { segment: Segment; localU: number } {
    let resultSegment = undefined;
    for (let s of this.segments) {
      let globalLength = s.length / this.length;
      if (u <= globalLength) {
        resultSegment = s;
        break;
      }
      u -= globalLength;
    }
    if (resultSegment == undefined) {
      return { segment: this.segments.slice(-1)[0], localU: 1 };
    }
    const localU = u / (resultSegment.length / this.length);
    return { segment: resultSegment, localU: localU };
  }

  validateControlPoints(): void {
    const n = this.controlPoints.length;
    let valid =
      this.level == CurveLevel.CUADRATIC
        ? n >= 3 && (n - 1) % 2 === 0
        : n >= 4 && (n - 1) % 3 === 0;
    if (!valid) {
      throw new Error("Invalid amount of control points.");
    }
  }

  changeBinormalDirection(segmentIndexes: number[], binormal: vec3) {
    for (let index of segmentIndexes) {
      this.segments[index].binormal = binormal;
    }
  }

  abstract getSegmentAmount(): number;
  abstract segmentPoints(segment: number): vec3[];
}

export enum CurveLevel {
  CUADRATIC = 2,
  CUBIC = 3,
}
