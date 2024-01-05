import { mat4, vec3 } from "gl-matrix";
import type { WebGL } from "../webgl";
import { buildBuffers, buildIndex, Geometry } from "../geometry";

export class Sphere implements Geometry {
  rows: number = 75;
  cols: number = 75;

  radius: number;

  index: number[] = [];
  position: number[] = [];
  normal: number[] = [];
  binormal: number[] = [];
  tangent: number[] = [];

  reverseUV: boolean = false;
  uvFactors: number[] = [1, 1];
  uv: number[] = [];

  constructor(radius: number) {
    this.radius = radius;
    buildBuffers(this);
    buildIndex(this);
  }

  getPointData(alfa: number, beta: number) {
    let applyRot = (mat: mat4, angle: number, axis: vec3) => {
      const newMat = mat4.fromRotation(mat4.create(), angle, axis);
      return mat4.multiply(mat, newMat, mat);
    };

    let transformVec = (vec: number[], transform: mat4) => {
      let _vec = vec3.fromValues(vec[0], vec[1], vec[2]);
      vec3.transformMat4(_vec, _vec, transform);
      return [_vec[0], _vec[1], _vec[2]];
    };

    let transaleMat = (mat: mat4, vec: vec3) => {
      const newMat = mat4.fromTranslation(mat4.create(), vec);
      return mat4.multiply(mat, newMat, mat);
    };

    let mat = mat4.create();
    let rot = mat4.create();

    transaleMat(mat, [this.radius, 0, 0]);
    applyRot(mat, Math.PI * (0.5 - beta), [0, 0, 1]);
    applyRot(mat, 2 * Math.PI * alfa, [0, 1, 0]);
    applyRot(rot, Math.PI * (0.5 - beta), [0, 0, 1]);
    applyRot(rot, 2 * Math.PI * alfa, [0, 1, 0]);

    let p = [0, 0, 0];
    p = transformVec(p, mat);

    let t = [0, 1, 0];
    t = transformVec(t, rot);

    let b = [0, 0, 1];
    b = transformVec(b, rot);

    return {
      p,
      n: vec3.normalize(vec3.create(), vec3.fromValues(p[0], p[1], p[2])),
      u: alfa,
      v: beta,
      t,
      b,
    };
  }

  draw(gl: WebGL): void {
    gl.draw(this);
  }
}
