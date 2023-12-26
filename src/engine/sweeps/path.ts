import type { Curve } from "../curves/curve";
import type { Sweepable } from "./sweep";

export class Path implements Sweepable {

    shape: Curve;
    path: Curve;

    constructor(shape: Curve, path: Curve) {
        this.shape = shape;
        this.path = path;
    }

    getPath(): Curve {
        return this.path;
    }

    getShape(): Curve {
        return this.shape;
    }

    discretizePath(delta: number): any {
        return this.path.discretize(delta);
    }
}