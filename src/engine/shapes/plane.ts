import type { WebGL } from "../webgl";
import { buildBuffers, buildIndex, Geometry } from "../geometry";

export class Plane implements Geometry {
  rows: number = 75;
  cols: number = 75;

  width: number;
  height: number;

  index: number[] = [];
  position: number[] = [];
  normal: number[] = [];
  binormal: number[] = [];
  tangent: number[] = [];

  reverseUV: boolean = false;
  uvFactors: number[] = [1, 1];
  uv: number[] = [];

  constructor(width: number, height: number = width) {
    this.width = width;
    this.height = height;
    buildBuffers(this);
    buildIndex(this);
  }

  getPointData(alfa: number, beta: number) {
    const p: number[] = [(alfa - 0.5) * this.width, 0, (beta - 0.5) * this.height];

    const n: number[] = [0, 1, 0];
    const t: number[] = [1, 0, 0];
    const b: number[] = [0, 0, 1];

    const u: number = this.reverseUV ? 1 - beta : beta;
    const v: number = this.reverseUV ? 1 - alfa : alfa;

    return { p, n, b, t, u, v };
  }

  draw(gl: WebGL): void {
    gl.draw(this);
  }
}
