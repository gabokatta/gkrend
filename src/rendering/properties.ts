import { DrawMethod } from "../engine/webgl";
import { Animation } from "./animation";


export class SceneProperties {

    public shape: Shapes = Shapes.SPHERE;
    public texture: Textures = Textures.NONE;
    public camera: Cameras = Cameras.ORBITAL;
    public render: DrawMethod = DrawMethod.Smooth;

    public animations: ApplicableAnimation[] = []
    public velocity: number = 2;
    
    public sphereRadius: number = 3;
    public coneRadius: number = 2;
    public coneHeight: number = 4;
    public cubeWidth: number = 2;
    public cubeHeight: number = 2;
    public cubeDepth: number = 2;
    public cylinderHeight: number = 4;
    public cylinderRadius: number = 2;


}

export class ApplicableAnimation {
    public animation: Animation;
    public enabled: boolean = false;

    constructor(animation: Animation, enabled: boolean) {
        this.animation = animation;
        this.enabled = enabled;
    }
}

export enum Cameras {
    DRONE,
    ORBITAL
}

export enum Textures {
    NONE,
    LAVA,
    WATER,
    GRASS
}

export enum Shapes {
    CONE,
    CYLINDER,
    SPHERE,
    CUBE
}