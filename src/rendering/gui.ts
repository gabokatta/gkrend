import { GUI } from "dat.gui";
import { Shapes, props } from "./properties";
import { ANIMATION, Rotate } from "./animation";
import { scene } from "../main";

const MIN_SIZE_VALUE = 1;
const SLIDER_STEP = 0.1;
const INITIAL_VALUE_DIVISOR = 2;
const SCENE_ANIMATIONS = scene.animations;

var gui = new GUI({ autoPlace: false, width: 200 });
document.querySelector(".gui-container")?.append(gui.domElement);

var colorFolder: GUI = gui.addFolder("Color");
colorFolder
  .addColor(props, "shapeColor")
  .onChange(() => scene.updateColor(props.shapeColor))
  .name("Shape");

var sphereMenu = buildSphereMenu(gui);
var planeMenu = buildPlaneMenu(gui);
var cylinderMenu = buildCylinderMenu(gui);
var torusMenu = buildTorusMenu(gui);
var sizeChildren = [torusMenu, planeMenu, sphereMenu, cylinderMenu];

export var animationFolder: GUI = gui.addFolder("Animation");

animationFolder.add(props, "rotate").onChange((value) => {
  props.rotate = value;
  SCENE_ANIMATIONS.get(ANIMATION.ROTATE)?.setUsage(value);
});
animationFolder
  .add(props, "rotaxis", ["X", "Y", "Z"])
  .onChange((value: string) => {
    var rotateAnimation = <Rotate>SCENE_ANIMATIONS.get(ANIMATION.ROTATE)!.animation;
    rotateAnimation.axis = Rotate.AXIS.get(value)!;
  })
  .name("AXIS");
animationFolder
  .add(props, "rotspeed", 1, 5)
  .step(SLIDER_STEP)
  .onChange((value) => {
    SCENE_ANIMATIONS.get(ANIMATION.ROTATE)?.setVelocity(value);
  })
  .name("SPEED");

animationFolder.add(props, "scale").onChange((value) => {
  props.scale = value;
  SCENE_ANIMATIONS.get(ANIMATION.RESIZE)?.setUsage(value);
});
animationFolder
  .add(props, "scalespeed", 1.25, 5)
  .step(1.25)
  .onChange((value) => {
    SCENE_ANIMATIONS.get(ANIMATION.RESIZE)?.setVelocity(value);
  })
  .name("SPEED");

// Set Initial GUI State.
hideFolders(sizeChildren);
animationFolder.open();
colorFolder.open();
torusMenu.show();
torusMenu.open();

// --------------------------

function buildSphereMenu(gui: GUI): GUI {
  var sphereMenu = gui.addFolder("Sphere");
  var sphere = props.sphere;
  sphereMenu
    .add(sphere, "radius", MIN_SIZE_VALUE, sphere.radius, SLIDER_STEP)
    .setValue(sphere.radius / INITIAL_VALUE_DIVISOR);
  return sphereMenu;
}

function buildCylinderMenu(gui: GUI): GUI {
  var cylinderMenu = gui.addFolder("Cylinder");
  var cylinder = props.cylinder;
  cylinderMenu
    .add(cylinder, "radius", MIN_SIZE_VALUE, cylinder.radius, SLIDER_STEP)
    .setValue(cylinder.radius / INITIAL_VALUE_DIVISOR);
  cylinderMenu
    .add(cylinder, "height", MIN_SIZE_VALUE, cylinder.height, SLIDER_STEP)
    .setValue(cylinder.height / INITIAL_VALUE_DIVISOR);
  return cylinderMenu;
}

function buildTorusMenu(gui: GUI): GUI {
  var torusMenu = gui.addFolder("Torus");
  var torus = props.torus;
  torusMenu.add(torus, "tube", 0.1, torus.tube, SLIDER_STEP).setValue(1);
  torusMenu.add(torus, "ring", MIN_SIZE_VALUE, torus.ring, SLIDER_STEP).setValue(2.5);
  return torusMenu;
}

function buildPlaneMenu(gui: GUI): GUI {
  var planeMenu = gui.addFolder("Plane");
  var plane = props.plane;
  planeMenu
    .add(plane, "height", MIN_SIZE_VALUE, plane.height, SLIDER_STEP)
    .setValue(plane.height / INITIAL_VALUE_DIVISOR);
  planeMenu.add(plane, "width", MIN_SIZE_VALUE, plane.width, SLIDER_STEP).setValue(plane.width / INITIAL_VALUE_DIVISOR);
  return planeMenu;
}

const shapeButtons = document.querySelectorAll(".shape-btn");
shapeButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => renderShapeMenu(e));
});

function renderShapeMenu(e: Event) {
  const pressedButton = e.target as HTMLElement;
  hideFolders(sizeChildren);
  switch (pressedButton.id) {
    case Shapes.SPHERE: {
      sphereMenu.show();
      sphereMenu.open();
      break;
    }
    case Shapes.CYLINDER: {
      cylinderMenu.show();
      cylinderMenu.open();
      break;
    }
    case Shapes.PLANE: {
      planeMenu.show();
      planeMenu.open();
      break;
    }
    case Shapes.TORUS: {
      torusMenu.show();
      torusMenu.open();
      break;
    }
  }
}

function hideFolders(folders: GUI[]) {
  folders.forEach((f) => f.hide());
}

sizeChildren.forEach((gui) => {
  gui.__controllers.forEach((controller) => controller.onChange(() => scene.updateObject()));
});
