import { Geometry } from "../engine/geometry";
import { Object3D, Transformation } from "../engine/object";
import { Cone } from "../engine/shapes/cone";
import { Cube } from "../engine/shapes/cube";
import { Cylinder } from "../engine/shapes/cylinder";
import { Sphere } from "../engine/shapes/sphere";
import { WebGL } from "../engine/webgl";
import { scene } from "../main";
import { applyAnimations, toRads } from "./animation";
import { Shapes, TEXTURES, Textures, props } from "./properties";

export class Scene {
  public canvas: HTMLCanvasElement;
  gl: WebGL;
  t: number = 0;
  object: Object3D;
  textureInit: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.gl = new WebGL(canvas);
    this.object = new Object3D(
      currentGeometry(props.shape),
      [Transformation.rotation(toRads(60), [0, -1, 0])],
      props.shapeColor.map((value) => value / 255)
    );
  }

  async initScene() {
    await this.gl.init();
    this.tick();
  }

  tick() {
    requestAnimationFrame(this.tick.bind(this));
    this.object.draw(this.gl);

    this.t += 1 / 60;
    if (this.t >= 100) this.t = 0;

    applyAnimations(props.animations, this.object, this.t);
  }

  updateObject() {
    this.object.geometry = currentGeometry(props.shape);
  }

  updateColor(color: number[]) {
    this.object.color = color.map((value) => value / 255);
  }

  updateTexture(selectedTexture: Textures) {
    if (selectedTexture == Textures.NONE) {
      this.object.useTexture = false;
    } else {
      this.gl.setTexture(TEXTURES.get(selectedTexture)!);
      this.object.useTexture = true;
    }
  }

  clean() {
    this.gl.cleanGL();
  }
}

function currentGeometry(shape: Shapes): Geometry {
  switch (shape) {
    case Shapes.CONE: {
      return new Cone(props.cone.radius, props.cone.height);
    }
    case Shapes.SPHERE: {
      return new Sphere(props.sphere.radius);
    }
    case Shapes.CYLINDER: {
      return new Cylinder(props.cylinder.radius, props.cylinder.height);
    }
    case Shapes.CUBE: {
      return new Cube(props.cube.width, props.cube.height, props.cube.depth);
    }
  }
}

const shapeButtons = document.querySelectorAll(".shape-btn");
shapeButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const pressedButton = e.target as HTMLElement;
    props.shape = <Shapes>pressedButton.id;
    scene.updateObject();
  });
});

const NEXT_TEXTURE = new Map<Textures, Textures>([
  [Textures.NONE, Textures.LAVA],
  [Textures.LAVA, Textures.GRASS],
  [Textures.GRASS, Textures.WATER],
  [Textures.WATER, Textures.NONE],
]);

const textureButton = document.getElementById("texture")!;
textureButton.addEventListener("click", toggleTextures);

async function toggleTextures() {
  if (!scene.textureInit) {
    await scene.gl.initTextures(Array.from(TEXTURES.values()));
    scene.textureInit = true;
  }
  props.texture = NEXT_TEXTURE.get(props.texture)!;
  scene.updateTexture(props.texture);
}
