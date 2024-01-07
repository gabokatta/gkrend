import { Scene } from "./rendering/scene";

const canvas = <HTMLCanvasElement>document.getElementById("canvas")!;
setClientDimensions(canvas);
export const scene = new Scene(canvas);
scene.initScene();

window.addEventListener("resize", () => {
  setClientDimensions(canvas);
  scene.clean();
});

function setClientDimensions(canvas: HTMLCanvasElement) {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
