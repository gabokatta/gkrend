import { GUI } from "dat.gui";
import { Shapes, props } from "./properties";
import { ANIMATION, Rotate, changeAnimationStatus, setAnimationVelocity } from "./animation";
import { scene } from "../main";

const MIN_SIZE_VALUE = 1;
const SLIDER_STEP = 1;
const INITIAL_VALUE_DIVISOR = 2;

var gui = new GUI({ autoPlace: false, width: 225 });
document.querySelector(".gui-container")?.append(gui.domElement);

var colorFolder: GUI = gui.addFolder("Color");
colorFolder.addColor(props, "shapeColor").onChange(() => scene.updateColor(props.shapeColor));

var sphereMenu = buildSphereMenu(gui);
var planeMenu = buildPlaneMenu(gui);
var cylinderMenu = buildCylinderMenu(gui);
var torusMenu = buildTorusMenu(gui);
var sizeChildren = [torusMenu, planeMenu, sphereMenu, cylinderMenu];

export var animationFolder: GUI = gui.addFolder("Animation");
animationFolder.add(props, "rotaxis", ["X", "Y", "Z"]).onChange((value: string) => {
  var rotateAnimation = <Rotate>props.animations.get(ANIMATION.ROTATE)!.animation;
  rotateAnimation.axis = Rotate.AXIS.get(value)!;
});
animationFolder
  .add(props, "rotspeed", 1, 3, 1)
  .step(1)
  .onChange((value) => {
    setAnimationVelocity(props.animations, ANIMATION.ROTATE, value);
  });
animationFolder
  .add(props, "scalespeed", 1, 3)
  .step(1)
  .onChange((value) => {
    setAnimationVelocity(props.animations, ANIMATION.RESIZE, value);
  });
animationFolder.add(props, "rotate").onChange((value) => {
  props.rotate = value;
  changeAnimationStatus(props.animations, ANIMATION.ROTATE, value);
});
animationFolder.add(props, "scale").onChange((value) => {
  props.scale = value;
  changeAnimationStatus(props.animations, ANIMATION.RESIZE, value);
});

// Set Initial GUI State.
hideFolders(sizeChildren);
animationFolder.open();
colorFolder.open();
sphereMenu.show();
sphereMenu.open();

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
  torusMenu.add(torus, "tube", 0.1, torus.tube, SLIDER_STEP / 10).setValue(1);
  torusMenu.add(torus, "ring", MIN_SIZE_VALUE, torus.ring, SLIDER_STEP / 10).setValue(2.5);
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
