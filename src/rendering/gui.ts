import { GUI } from "dat.gui";
import { Shapes, props } from "./properties";
import { ANIMATION, changeAnimationStatus } from "./animation";

const MIN_SIZE_VALUE = 1;
const SLIDER_STEP = 1;
const INITIAL_VALUE_DIVISOR = 2;

var gui = new GUI({ autoPlace: false, width: 225 });
document.querySelector(".gui-container")?.append(gui.domElement);

var colorFolder: GUI = gui.addFolder("Color");
colorFolder.addColor(props, "shapeColor");

var sizingFolder: GUI = gui.addFolder("Sizing");
var sphereMenu = buildSphereMenu(sizingFolder);
var coneMenu = buildConeMenu(sizingFolder);
var cubeMenu = buildCubeMenu(sizingFolder);
var cylinderMenu = buildCylinderMenu(sizingFolder);
var sizeChildren = [coneMenu, cubeMenu, sphereMenu, cylinderMenu];

var animationFolder: GUI = gui.addFolder("Animation");
animationFolder.add(props, "rotspeed", 1, 10, 1).step(1);
animationFolder.add(props, "scalespeed", 1, 10).step(1);
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
sizingFolder.open();
sphereMenu.show();
sphereMenu.open();

// --------------------------

function buildSphereMenu(gui: GUI): GUI {
  var sphereMenu = gui.addFolder("Sphere");
  sphereMenu
    .add(props.sphere, "radius", MIN_SIZE_VALUE, props.sphere.radius, SLIDER_STEP)
    .setValue(props.sphere.radius / INITIAL_VALUE_DIVISOR);
  return sphereMenu;
}

function buildConeMenu(gui: GUI): GUI {
  var coneMenu = gui.addFolder("Cone");
  coneMenu
    .add(props.cone, "radius", MIN_SIZE_VALUE, props.cone.radius, SLIDER_STEP)
    .setValue(props.cone.radius / INITIAL_VALUE_DIVISOR);
  coneMenu
    .add(props.cone, "height", MIN_SIZE_VALUE, props.cone.height, SLIDER_STEP)
    .setValue(props.cone.height / INITIAL_VALUE_DIVISOR);
  return coneMenu;
}

function buildCylinderMenu(gui: GUI): GUI {
  var cylinderMenu = gui.addFolder("Cylinder");
  cylinderMenu
    .add(props.cylinder, "radius", MIN_SIZE_VALUE, props.cylinder.radius, SLIDER_STEP)
    .setValue(props.sphere.radius / INITIAL_VALUE_DIVISOR);
  cylinderMenu
    .add(props.cylinder, "height", MIN_SIZE_VALUE, props.cylinder.height, SLIDER_STEP)
    .setValue(props.sphere.radius / INITIAL_VALUE_DIVISOR);
  return cylinderMenu;
}

function buildCubeMenu(gui: GUI): GUI {
  var cubeMenu = gui.addFolder("Cube");
  cubeMenu
    .add(props.cube, "depth", MIN_SIZE_VALUE, props.cube.depth, SLIDER_STEP)
    .setValue(props.sphere.radius / INITIAL_VALUE_DIVISOR);
  cubeMenu
    .add(props.cube, "height", MIN_SIZE_VALUE, props.cube.height, SLIDER_STEP)
    .setValue(props.sphere.radius / INITIAL_VALUE_DIVISOR);
  cubeMenu
    .add(props.cube, "width", MIN_SIZE_VALUE, props.cube.width, SLIDER_STEP)
    .setValue(props.sphere.radius / INITIAL_VALUE_DIVISOR);
  return cubeMenu;
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
    case Shapes.CONE: {
      coneMenu.show();
      coneMenu.open();
      break;
    }
    case Shapes.CYLINDER: {
      cylinderMenu.show();
      cylinderMenu.open();
      break;
    }
    case Shapes.CUBE: {
      cubeMenu.show();
      cubeMenu.open();
      break;
    }
  }
}

function hideFolders(folders: GUI[]) {
  folders.forEach((f) => f.hide());
}
