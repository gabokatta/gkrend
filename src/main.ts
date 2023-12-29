import { Object3D } from "./engine/object";
import { Sphere } from "./engine/shapes/sphere";
import { WebGL } from "./engine/webgl";

var canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("canvas")!;
const gl: WebGL = await new WebGL(canvas).init();

var sphere: Object3D = new Object3D(new Sphere(4), [], []);
sphere.draw(gl);