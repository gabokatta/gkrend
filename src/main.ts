import { Scene } from "./rendering/scene";
import { initSound } from "./rendering/miscellaneous";
const canvas = <HTMLCanvasElement>document.getElementById("canvas")!;
export const scene = new Scene(canvas);
scene.initScene();
setClientDimensions(canvas);
initSound();

window.addEventListener("resize", () => {
  setClientDimensions(canvas);
  scene.clean();
});

function setClientDimensions(canvas: HTMLCanvasElement) {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  scene.gl.setUpMatrices();
}
