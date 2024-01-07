import { ANIMATIONS, DEFAULT_VELOCITY } from "./animation";

import grass from "../engine/textures/grass.png";
import lava from "../engine/textures/lava.png";
import water from "../engine/textures/water.png";

export enum Textures {
  NONE,
  LAVA,
  WATER,
  GRASS,
}

export enum Render {
  SMOOTH,
  NORMAL,
  WIREFRAME,
}

export const TEXTURES = new Map<Textures, string>([
  [Textures.LAVA, lava],
  [Textures.GRASS, grass],
  [Textures.WATER, water],
]);

export enum Shapes {
  CYLINDER = "cylinder",
  SPHERE = "sphere",
  PLANE = "plane",
  TORUS = "torus",
}

export var props = {
  shape: Shapes.SPHERE,
  texture: Textures.NONE,
  render: Render.SMOOTH,

  shapeColor: [100, 200, 100],

  animations: ANIMATIONS,
  rotate: false,
  rotspeed: DEFAULT_VELOCITY,
  rotaxis: "X",
  scale: false,
  scalespeed: DEFAULT_VELOCITY,

  sphere: { radius: 4 },
  cylinder: { radius: 4, height: 7 },
  plane: { width: 5, height: 5 },
  torus: { ring: 4, tube: 3 },
};
