import { SweepSurface } from "../sweeps/sweep";
import { Bezier } from "../curves/bezier";
import { CurveLevel } from "../curves/curve";
import { Revolution } from "../sweeps/revolution";
import { vec3 } from "gl-matrix";

export class Cone extends SweepSurface {
  public radius: number;
  public height: number;

  constructor(radius: number, height: number) {
    let shape: Bezier = new Bezier(
      [
        vec3.fromValues(0, 0, 0),
        vec3.fromValues(radius, 0, 0),
        vec3.fromValues(radius, 0, 0),
        vec3.fromValues(radius, 0, 0),
        vec3.fromValues(0, height, 0),
        vec3.fromValues(0, height, 0),
        vec3.fromValues(0, height, 0),
      ],
      CurveLevel.CUBIC
    );
    super(new Revolution(shape));
    this.radius = radius;
    this.height = height;
    this.useCovers = false;
  }
}
