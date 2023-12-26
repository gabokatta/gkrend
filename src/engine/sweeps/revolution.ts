import { vec3 } from "gl-matrix";
import type { Curve } from "../curves/curve";
import type { Sweepable } from "./sweep";

export class Revolution implements Sweepable {

    shape: Curve;
    angle: number;

    constructor(shape: Curve, angle: number = Math.PI*2) {
        this.shape = shape;
        this.angle = angle;
    }
    
    getPath(): Curve {
        throw new Error("Method not implemented.");
    }

    getShape(): Curve {
        return this.shape;
    }

    discretizePath(delta: number): any {
        const points: vec3[] = []
        const normals: vec3[] = []
        const tangents: vec3[] = []
        const binormals: vec3[] = []

        for (let u = 0; u <= 1.001; u += delta) {

            let binormal = vec3.fromValues(0,1,0);
            let tangent = vec3.fromValues(Math.cos(u*this.angle), 0, Math.sin(u*this.angle));
            
            points.push(vec3.fromValues(0,0,0));
            binormals.push(vec3.fromValues(0,1,0));
            tangents.push(tangent);
            normals.push(vec3.cross(vec3.create(), binormal, tangent));
        }

        return {p: points, n: normals, b: binormals, t: tangents};
    }
}