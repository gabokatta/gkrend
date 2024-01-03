import { GUI } from "dat.gui";
import { Shapes, props } from "./properties";


var gui = new GUI({ autoPlace:false, width:225 });
document.querySelector('.gui-container')?.append(gui.domElement);

var colorFolder: GUI = gui.addFolder("Color");
colorFolder.addColor(props, 'shapeColor')

var sizingFolder: GUI = gui.addFolder("Sizing")
var sphereMenu = buildSphereMenu(sizingFolder);
var coneMenu = buildConeMenu(sizingFolder);
var cubeMenu = buildCubeMenu(sizingFolder);
var cylinderMenu = buildCylinderMenu(sizingFolder);
var sizeChildren = [coneMenu, cubeMenu, sphereMenu, cylinderMenu]

var animationFolder: GUI = gui.addFolder("Animation")
animationFolder.add(props, 'rotspeed', 1, 10, 1).step(1)
animationFolder.add(props, 'scalespeed', 1, 10).step(1)
animationFolder.add(props, 'rotate').onChange((value) => { props.rotate = value;})
animationFolder.add(props, 'scale').onChange((value) => { props.scale = value;})
animationFolder.open()

hideFolders(sizeChildren)
colorFolder.open()
sizingFolder.open()
sphereMenu.show()
sphereMenu.open()


function buildSphereMenu(gui: GUI): GUI {
    var sphereMenu = gui.addFolder('Sphere')
    sphereMenu.add(props, 'sphereRadius', 1, 5, 1)
    return sphereMenu
}

function buildConeMenu(gui: GUI): GUI {
    var coneMenu = gui.addFolder('Cone')
    coneMenu.add(props, 'coneRadius', 1, 5, 1)
    coneMenu.add(props, 'coneHeight', 1, 5, 1)
    return coneMenu
}

function buildCylinderMenu(gui: GUI): GUI {
    var cylinderMenu = gui.addFolder('Cylinder')
    cylinderMenu.add(props, 'cylinderRadius', 1, 5, 1)
    cylinderMenu.add(props, 'cylinderHeight', 1, 5, 1)
    return cylinderMenu
}

function buildCubeMenu(gui: GUI): GUI {
    var cubeMenu = gui.addFolder('Cube')
    cubeMenu.add(props, 'cubeDepth', 1, 5, 1)
    cubeMenu.add(props, 'cubeHeight', 1, 5, 1)
    cubeMenu.add(props, 'cubeWidth', 1, 5, 1)
    return cubeMenu
}


const shapeButtons = document.querySelectorAll('.shape-btn');
shapeButtons.forEach((btn) => {
    btn.addEventListener('click', (e) =>  renderShapeMenu(e));
})


function renderShapeMenu(e: Event) {
    const pressedButton = e.target as HTMLElement;
    hideFolders(sizeChildren);
    switch (pressedButton.id) {
        case Shapes.SPHERE: {
            sphereMenu.show()
            sphereMenu.open()
            break
        }
        case Shapes.CONE: {
            coneMenu.show()
            coneMenu.open()
            break
        }
        case Shapes.CYLINDER: {
            cylinderMenu.show()
            cylinderMenu.open()
            break
        }
        case Shapes.CUBE: {
            cubeMenu.show()
            cubeMenu.open()
            break
        }
    }
}

function hideFolders(folders: GUI[]) {
    folders.forEach((f) => f.hide())
}