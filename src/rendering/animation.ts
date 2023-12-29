import { Object3D, Transformation } from "../engine/object";


export interface Animation {

    applyFrame(object: Object3D, t: number, ): void;

}

export class Rotate implements Animation {

    public axis: number[] = [1,0,1]

    applyFrame(object: Object3D, t: number): void {
        object.updateTransform([
            Transformation.rotation(t, this.axis)
        ]);
    }
    
}

export class Resize implements Animation {

    private flip: boolean = false;

    applyFrame(object: Object3D, t: number): void {

        var scaleFactor :number;
        const mod = (n: number) => { return Number((n).toFixed(2)) % 1.5; }

        if (mod(t) == 0) {
            this.flip = !this.flip;
        }

        scaleFactor =  this.flip ? mod(t) : 1.5 - mod(t);

        object.updateTransform([
            Transformation.scale([scaleFactor,scaleFactor,scaleFactor])
        ])
    }
    
}