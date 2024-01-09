import { ANIMATION, ApplicableAnimation, DEFAULT_VELOCITY, Resize, Rotate } from "./animation";

import grass from "../engine/textures/grass.png";
import lava from "../engine/textures/lava.png";
import water from "../engine/textures/water.png";
import { Geometry } from "../engine/geometry";
import { Cylinder } from "../engine/shapes/cylinder";
import { Plane } from "../engine/shapes/plane";
import { Sphere } from "../engine/shapes/sphere";
import { Torus } from "../engine/shapes/torus";

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

export const NEXT_TEXTURE = new Map<Textures, Textures>([
  [Textures.NONE, Textures.LAVA],
  [Textures.LAVA, Textures.GRASS],
  [Textures.GRASS, Textures.WATER],
  [Textures.WATER, Textures.NONE],
]);

export const NEXT_RENDER = new Map<Render, Render>([
  [Render.SMOOTH, Render.NORMAL],
  [Render.NORMAL, Render.WIREFRAME],
  [Render.WIREFRAME, Render.SMOOTH],
]);

var ANIMATIONS: Map<ANIMATION, ApplicableAnimation> = new Map<ANIMATION, ApplicableAnimation>([
  [ANIMATION.RESIZE, new ApplicableAnimation(new Resize(), false, DEFAULT_VELOCITY)],
  [ANIMATION.ROTATE, new ApplicableAnimation(new Rotate(), true, DEFAULT_VELOCITY)],
]);

export var props = {
  shape: Shapes.TORUS,
  texture: Textures.NONE,
  render: Render.NORMAL,

  shapeColor: [100, 200, 100],

  animations: ANIMATIONS,
  rotate: ANIMATIONS.get(ANIMATION.ROTATE)?.enabled,
  rotspeed: DEFAULT_VELOCITY,
  rotaxis: "X",
  scale: ANIMATIONS.get(ANIMATION.RESIZE)?.enabled,
  scalespeed: DEFAULT_VELOCITY,

  sphere: { radius: 4 },
  cylinder: { radius: 4, height: 7 },
  plane: { width: 5, height: 5 },
  torus: { ring: 4, tube: 3 },
};

export function currentGeometry(shape: Shapes): Geometry {
  switch (shape) {
    case Shapes.SPHERE: {
      return new Sphere(props.sphere.radius);
    }
    case Shapes.CYLINDER: {
      return new Cylinder(props.cylinder.radius, props.cylinder.height);
    }
    case Shapes.PLANE: {
      return new Plane(props.plane.width, props.plane.height);
    }
    case Shapes.TORUS: {
      return new Torus(props.torus.tube, props.torus.ring);
    }
  }
}
