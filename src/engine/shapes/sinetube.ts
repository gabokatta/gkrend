import type { WebGL } from "../webgl";
import { Geometry } from "../geometry";
import { vec3 } from "gl-matrix";

export class SineTube implements Geometry {
  rows: number = 75;
  cols: number = 75;

  radius: number;
  length: number;
  heigth: number;
  amplitude: number;

  index: number[] = [];
  position: number[] = [];
  normal: number[] = [];
  binormal: number[] = [];
  tangent: number[] = [];

  reverseUV: boolean = false;
  uvFactors: number[] = [1, 1];
  uv: number[] = [];

  constructor(radius: number, length: number, amplitude: number, heigth: number) {
    this.radius = radius;
    this.length = length;
    this.amplitude = amplitude;
    this.heigth = heigth;

    this.buildBuffers();
    this.buildIndex();
  }

  getPointData(alfa: number, beta: number) {
    const p = this.getPosition(alfa, beta);
    const n = this.getNormals(alfa, beta);

    const b: vec3 = [0, 1, 0];
    const t: vec3 = vec3.cross(vec3.create(), n, b);

    // Calculate u and v
    const u: number = this.reverseUV ? 1 - beta : beta;
    const v: number = this.reverseUV ? 1 - alfa : alfa;

    return { p, n, b, t, u, v };
  }

  draw(gl: WebGL): void {
    gl.draw(this);
  }

  getPosition(alfa: number, beta: number): vec3 {
    const phi = alfa * Math.PI * 2;
    const theta = beta * Math.PI * 2;
    const sin_theta = Math.sin(theta / this.length);

    const x = (this.radius + this.amplitude * sin_theta) * Math.cos(phi);
    const y = this.heigth * beta;
    const z = (this.radius + this.amplitude * sin_theta) * Math.sin(phi);

    return vec3.fromValues(x, y, z);
  }

  getNormals(alfa: number, beta: number): vec3 {
    var p = this.getPosition(alfa, beta);
    var v = vec3.create();
    vec3.normalize(v, vec3.fromValues(p[0], p[1], p[2]));

    var delta = 0.05;
    var p1 = this.getPosition(alfa, beta);
    var p2 = this.getPosition(alfa, beta + delta);
    var p3 = this.getPosition(alfa + delta, beta);

    var v1 = vec3.fromValues(p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]);
    var v2 = vec3.fromValues(p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]);

    vec3.normalize(v1, v1);
    vec3.normalize(v2, v2);

    var n = vec3.create();
    vec3.cross(n, v1, v2);
    vec3.scale(n, n, -1);
    return n;
  }

  buildIndex(): void {
    var index = [];
    for (var i = 0; i < this.rows - 1; i++) {
      index.push(i * this.cols);
      for (var j = 0; j < this.cols - 1; j++) {
        index.push(i * this.cols + j);
        index.push((i + 1) * this.cols + j);
        index.push(i * this.cols + j + 1);
        index.push((i + 1) * this.cols + j + 1);
      }
      index.push((i + 1) * this.cols + this.cols - 1);
    }
    this.index = index;
  }

  buildBuffers(): void {
    var rows = this.rows;
    var cols = this.cols;

    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        var alfa = (j / (cols - 1)) * Math.PI * 2;
        var beta = (0.1 + (i / (rows - 1)) * 0.8) * Math.PI;

        var p = this.getPosition(alfa, beta);

        this.position.push(p[0]);
        this.position.push(p[1]);
        this.position.push(p[2]);

        var n = this.getNormals(alfa, beta);

        this.normal.push(n[0]);
        this.normal.push(n[1]);
        this.normal.push(n[2]);

        // Calculate u and v
        const u: number = j / (cols - 1);
        const v: number = i / (rows - 1);

        this.uv.push(u);
        this.uv.push(v);
      }
    }
  }
}
