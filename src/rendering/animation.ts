import { Transformation } from "../engine/object";

export const DEFAULT_VELOCITY: number = 1.5;

export interface Animation {
  getTransformationFrame(t: number): Transformation;
}

export class ApplicableAnimation {
  public animation: Animation;
  public enabled: boolean = false;
  public velocity: number;

  constructor(animation: Animation, enabled: boolean, velocity: number) {
    this.animation = animation;
    this.enabled = enabled;
    this.velocity = velocity;
  }

  setUsage(status: boolean) {
    this.enabled = status;
  }

  setVelocity(amount: number) {
    this.velocity = amount;
  }
}

export class Rotate implements Animation {
  public static AXIS: Map<string, number[]> = new Map<string, number[]>([
    ["X", [1, 0, 0]],
    ["Y", [0, 1, 0]],
    ["Z", [0, 0, 1]],
  ]);

  public axis: number[] = Rotate.AXIS.get("X")!;

  public getTransformationFrame(t: number): Transformation {
    return Transformation.rotation(t, this.axis);
  }
}

export class Resize implements Animation {
  private flip: boolean = false;

  public getTransformationFrame(t: number): Transformation {
    var scaleFactor: number;
    var modFactor: number = 1.5;
    const mod = (n: number) => {
      return Number(n.toFixed(2)) % modFactor;
    };

    if (mod(t) == 0) {
      this.flip = !this.flip;
    }

    scaleFactor = this.flip ? mod(t) : modFactor - mod(t);

    return Transformation.scale([scaleFactor, scaleFactor, scaleFactor]);
  }
}

export enum ANIMATION {
  ROTATE,
  RESIZE,
}
