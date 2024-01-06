import { Scene } from "./rendering/scene";

const canvas = <HTMLCanvasElement>document.getElementById("canvas")!;
export const scene = new Scene(canvas);
scene.initScene();
