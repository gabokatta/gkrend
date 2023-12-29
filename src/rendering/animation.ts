import { Object3D, Transformation } from "../engine/object";
import { ApplicableAnimation } from "./properties";


export interface Animation {

    applyFrame(object: Object3D, t: number, ): void;

}

export class Rotate implements Animation {

    public axis: number[] = [1,0,1]

    public applyFrame(object: Object3D, t: number): void {
        object.updateTransform([
            Transformation.rotation(t, this.axis)
        ]);
    }
    
}

export class Resize implements Animation {

    private flip: boolean = false;

    public applyFrame(object: Object3D, t: number): void {

        var scaleFactor :number;
        var modFactor: number = 1.5;
        const mod = (n: number) => { return Number((n).toFixed(2)) % modFactor; }

        if (mod(t) == 0) {
            this.flip = !this.flip;
        }

        scaleFactor =  this.flip ? mod(t) : modFactor - mod(t);

        object.updateTransform([
            Transformation.scale([scaleFactor,scaleFactor,scaleFactor])
        ])
    }
    
}

export const RESIZE: Animation = new Resize();
export const ROTATE: Animation = new Rotate();
export function applyAnimations(animations: ApplicableAnimation[], object: Object3D, tick: number) {
    animations.forEach( (applicable) => {
        if (applicable.enabled) {
            applicable.animation.applyFrame(object, tick);
        } 
    })
}