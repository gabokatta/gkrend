import { Cone } from "../engine/shapes/cone";
import { Cube } from "../engine/shapes/cube";
import { Cylinder } from "../engine/shapes/cylinder";
import { Sphere } from "../engine/shapes/sphere";
import { DrawMethod } from "../engine/webgl";
import { ANIMATIONS } from "./animation";

export enum Cameras {
  DRONE,
  ORBITAL,
}

export enum Textures {
  NONE,
  LAVA,
  WATER,
  GRASS,
}

export enum Shapes {
  CONE = "cone",
  CYLINDER = "cylinder",
  SPHERE = "sphere",
  CUBE = "cube",
}

export var props = {
  shape: Shapes.SPHERE,
  texture: Textures.NONE,
  camera: Cameras.ORBITAL,
  render: DrawMethod.Smooth,

  shapeColor: [255, 0, 255],

  animations: ANIMATIONS,
  rotate: false,
  rotspeed: 2,
  scale: false,
  scalespeed: 2,

  // Parameters will determine maximum size.
  // Actual initial render will be set to half the amounts to allow incentivize slider usage.
  sphere: new Sphere(5),
  cone: new Cone(5, 7),
  cylinder: new Cylinder(5, 7),
  cube: new Cube(5, 5, 5),
};
