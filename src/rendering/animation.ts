import { Object3D, Transformation } from "../engine/object";

export class ApplicableAnimation {
  public animation: Animation;
  public enabled: boolean = false;

  constructor(animation: Animation, enabled: boolean) {
    this.animation = animation;
    this.enabled = enabled;
  }
}

export interface Animation {
  applyFrame(object: Object3D, t: number): void;
}

export class Rotate implements Animation {
  public axis: number[] = [1, 0, 1];

  public applyFrame(object: Object3D, t: number): void {
    object.updateTransform([Transformation.rotation(t, this.axis)]);
  }
}

export class Resize implements Animation {
  private flip: boolean = false;

  public applyFrame(object: Object3D, t: number): void {
    var scaleFactor: number;
    var modFactor: number = 1.5;
    const mod = (n: number) => {
      return Number(n.toFixed(2)) % modFactor;
    };

    if (mod(t) == 0) {
      this.flip = !this.flip;
    }

    scaleFactor = this.flip ? mod(t) : modFactor - mod(t);

    object.updateTransform([Transformation.scale([scaleFactor, scaleFactor, scaleFactor])]);
  }
}

export enum ANIMATION {
  ROTATE,
  RESIZE,
}

export var ANIMATIONS: Map<ANIMATION, ApplicableAnimation> = new Map<ANIMATION, ApplicableAnimation>([
  [ANIMATION.RESIZE, new ApplicableAnimation(new Resize(), false)],
  [ANIMATION.ROTATE, new ApplicableAnimation(new Rotate(), false)],
]);

export function applyAnimations(animations: Map<ANIMATION, ApplicableAnimation>, object: Object3D, tick: number) {
  animations.forEach((applicable, _type) => {
    if (applicable.enabled) {
      applicable.animation.applyFrame(object, tick);
    }
  });
}

export function changeAnimationStatus(
  animations: Map<ANIMATION, ApplicableAnimation>,
  type: ANIMATION,
  status: boolean
) {
  if (animations.has(type)) {
    animations.get(type)!.enabled = status;
  }
}
