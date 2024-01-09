import { Camera } from "../engine/cameras/camera";
import { Orbital } from "../engine/cameras/orbital";
import { Object3D, Transformation } from "../engine/object";
import { WebGL } from "../engine/webgl";
import { scene } from "../main";
import { ANIMATION, ApplicableAnimation } from "./animation";
import { Render, Shapes, TEXTURES, Textures, currentGeometry, props } from "./properties";

export class Scene {
  public canvas: HTMLCanvasElement;
  gl: WebGL;
  t: number = 0;
  object: Object3D;
  camera: Camera;
  animations: Map<ANIMATION, ApplicableAnimation> = props.animations;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.gl = new WebGL(canvas);
    this.object = new Object3D(
      undefined,
      [Transformation.rotation(toRads(60), [-1, -1, 0])],
      props.shapeColor.map((value) => value / 255)
    );
    this.camera = new Orbital(this.gl);
  }

  async initScene() {
    await this.gl.init();
    this.object.geometry = currentGeometry(props.shape);
    const texturesPromise = this.gl.initTextures(Array.from(TEXTURES.values()));
    this.tick();
    await texturesPromise;
  }

  tick() {
    requestAnimationFrame(this.tick.bind(this));
    this.object.draw(this.gl);
    this.camera.update(this.gl);
    this.t += 1 / 60;
    if (this.t >= 100) this.t = 0;
    this.applyAnimations(this.object, this.t);
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

  updateRender(selectedRender: Render) {
    switch (selectedRender) {
      case Render.SMOOTH: {
        resetRender(scene);
        props.render = Render.SMOOTH;
        break;
      }
      case Render.NORMAL: {
        resetRender(scene);
        scene.gl.setNormalColoring(true);
        props.render = Render.NORMAL;
        break;
      }
      case Render.WIREFRAME: {
        resetRender(scene);
        scene.gl.setShowSurfaces(false);
        scene.gl.setNormalColoring(false);
        scene.gl.setShowLines(true);
        props.render = Render.WIREFRAME;
        break;
      }
    }
  }

  applyAnimations(object: Object3D, tick: number) {
    let frames: Transformation[] = [];
    this.animations.forEach((applicable, _type) => {
      if (applicable.enabled) {
        frames.push(applicable.animation.getTransformationFrame(tick * applicable.velocity));
      }
    });
    object.updateTransform(frames);
  }

  clean() {
    this.gl.cleanGL();
  }
}

const NEXT_TEXTURE = new Map<Textures, Textures>([
  [Textures.NONE, Textures.LAVA],
  [Textures.LAVA, Textures.GRASS],
  [Textures.GRASS, Textures.WATER],
  [Textures.WATER, Textures.NONE],
]);

const NEXT_RENDER = new Map<Render, Render>([
  [Render.SMOOTH, Render.NORMAL],
  [Render.NORMAL, Render.WIREFRAME],
  [Render.WIREFRAME, Render.SMOOTH],
]);

const shapeButtons = document.querySelectorAll(".shape-btn");
shapeButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const pressedButton = e.target as HTMLElement;
    props.shape = <Shapes>pressedButton.id;
    scene.updateObject();
  });
});

const textureButton = document.getElementById("texture")!;
textureButton.addEventListener("click", toggleTextures);

const renderButton = document.getElementById("render")!;
renderButton.addEventListener("click", toggleRender);

async function toggleTextures() {
  resetRender(scene);
  props.texture = NEXT_TEXTURE.get(props.texture)!;
  scene.updateTexture(props.texture);
}

function resetTexture(scene: Scene) {
  scene.updateTexture(Textures.NONE);
}

async function toggleRender() {
  resetTexture(scene);
  props.render = NEXT_RENDER.get(props.render)!;
  scene.updateRender(props.render);
}

function resetRender(scene: Scene) {
  scene.gl.setShowSurfaces(true);
  scene.gl.setShowLines(false);
  scene.gl.setNormalColoring(false);
}

export function toRads(degrees: number) {
  return degrees * (Math.PI / 180);
}
