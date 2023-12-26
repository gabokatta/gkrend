import { mat4, vec3 } from "gl-matrix";
import type { WebGL } from "./webgl";

export class Object3D {
    transform: mat4;
    transformations: Transformation[] = [];
    children: Object3D[];

    geometry: any;
    
    useTexture: boolean = false;
    color: any;
  
    constructor(geometry: any, transformations: Transformation[], color: any) {
      this.transform = mat4.create();
      this.transformations = transformations.reverse();

      this.children = [];
      this.geometry = geometry;
      this.color = color;
  
      this.transformations.forEach((t) => this.applyTransformation(t));
    }
  
    draw(gl: WebGL, parent: mat4 = mat4.create()) {

      const m = mat4.create();
      mat4.multiply(m, parent, this.transform);

      if (this.geometry) {
        gl.setModel(m);
        gl.setColor(this.color);

        if (this.useTexture) {
          gl.setUseTexture(true);
          this.geometry.draw(gl);
          gl.setUseTexture(false);
        }
        else { 
          this.geometry.draw(gl);
        }
      }
  
      this.children.forEach((c) => c.draw(gl, m));
    }
  
    applyTransformation(transformation: Transformation): void {
      switch (transformation.type) {
        case TransformationType.Translation:
          mat4.translate(this.transform, this.transform, transformation.getData());
          break;
        case TransformationType.Scaling:
          mat4.scale(this.transform, this.transform, transformation.getData());
          break;
        case TransformationType.Rotation:
          var data: any = transformation.getRotData();
          mat4.rotate(this.transform, this.transform, data[0], data[1]);
          break;
        default:
          console.warn(`Invalid transformation type: ${transformation.type}`);
          break;
      }
    }

    updateTransform(newTransforms: Transformation[]){
      mat4.identity(this.transform);
      // Reapply base transformations.
      this.transformations.forEach((t) => this.applyTransformation(t));
      // Apply new transforms.
      newTransforms.forEach((t) => {
        this.applyTransformation(t);
      })
    }
  
    setChildren(children: Object3D[]): void {
      children.forEach((c) => {
        this.children.push(c);
      })
    }
}

enum TransformationType {
    Translation,
    Rotation,
    Scaling,
  }

export class Transformation {
    type: TransformationType;
    data: number[];

    static rotation(angle: number, axis: number[]): Transformation {
      return new Transformation(TransformationType.Rotation, [angle, axis[0], axis[1], axis[2]]);
    }

    static scale(factors: number[]): Transformation {
      return new Transformation(TransformationType.Scaling, factors);
    }

    static translate(movement: number[]): Transformation {
      return new Transformation(TransformationType.Translation, movement);
    }

    getData() : vec3 {
        return vec3.fromValues(this.data[0], this.data[1], this.data[2]);
    }

    getRotData() : any[] {
        return [this.data[0], [this.data[1], this.data[2], this.data[3]]]
    }
  
    constructor(type: TransformationType, data: number[]) {
      this.type = type;
      this.data = data;
    }
}
  