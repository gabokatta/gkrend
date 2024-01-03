import { DrawMethod } from "../engine/webgl";
import { Animation } from "./animation";


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
    CONE = "cone",
    CYLINDER = "cylinder",
    SPHERE = "sphere",
    CUBE = "cube"
}


export var props = {
    shape: Shapes.SPHERE,
    texture: Textures.NONE,
    camera: Cameras.ORBITAL,
    render: DrawMethod.Smooth,

    shapeColor: [255, 0, 255],

    animations: [],
    rotate: false,
    rotspeed: 2,
    scale: false,
    scalespeed: 2,
    
    sphereRadius: 3,
    coneRadius: 2,
    coneHeight: 4,
    cubeWidth: 2,
    cubeHeight: 2,
    cubeDepth: 2,
    cylinderHeight: 4,
    cylinderRadius: 2
};