import { mat4, vec3 } from "gl-matrix";
import type { WebGL } from "../webgl";
import type { Camera } from "./camera";
import { OrbitalState } from "./state";

export class Orbital implements Camera {
  center: vec3;
  position: vec3;
  offset: vec3;

  up: vec3 = [0, 1, 0];
  side: vec3 = [1, 0, 0];

  state: OrbitalState = new OrbitalState();

  mouseWheelListener: any;
  mouseUpListener: any;
  mouseDownListener: any;
  mouseMoveListener: any;
  isMouseDown: boolean = false;

  touchStartListener: any;
  touchMoveListener: any;
  touchEndListener: any;
  isFingerDown: boolean = false;
  touchStartPosition: { x: number; y: number } = { x: 0, y: 0 };

  constructor(gl: WebGL, center: vec3 = [0, 0, 0], offset: vec3 = [0, 0, 10]) {
    this.center = center;
    this.offset = offset;
    this.position = vec3.add(vec3.create(), center, this.offset);

    this.state.y = this.offset[1];
    this.state.z = this.offset[2];

    this.mouseDownListener = document.addEventListener("mousedown", (_e) => {
      this.isMouseDown = true;
    });

    this.mouseUpListener = document.addEventListener("mouseup", (_e) => {
      this.isMouseDown = false;
      this.state.du = 0;
      this.state.dv = 0;
    });

    this.mouseWheelListener = gl.canvas.addEventListener("wheel", (e) => {
      const z_vel = 0.48;
      if (e.deltaY > 0) {
        this.state.z += z_vel * 2;
      } else this.state.z -= z_vel * 2;
    });

    this.mouseMoveListener = gl.canvas.addEventListener("mousemove", (e) => {
      const { movementX, movementY } = e;
      const amount = 0.1;
      if (this.isMouseDown) {
        this.state.du = linearInterpolation(this.state.du, movementX, amount);
        this.state.dv = linearInterpolation(this.state.dv, movementY, amount);
      }
    });

    this.touchStartListener = gl.canvas.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        this.isFingerDown = true;
        this.touchStartPosition.x = e.touches[0].clientX;
        this.touchStartPosition.y = e.touches[0].clientY;
      }
    });

    this.touchMoveListener = gl.canvas.addEventListener("touchmove", (e) => {
      if (this.isFingerDown && e.touches.length === 1) {
        const movementX = e.touches[0].clientX - this.touchStartPosition.x;
        const movementY = e.touches[0].clientY - this.touchStartPosition.y;

        const amount = 0.1;
        this.state.du = linearInterpolation(this.state.du, movementX, amount);
        this.state.dv = linearInterpolation(this.state.dv, movementY, amount);

        this.touchStartPosition.x = e.touches[0].clientX;
        this.touchStartPosition.y = e.touches[0].clientY;
      }
    });

    this.touchEndListener = gl.canvas.addEventListener("touchend", (_e) => {
      this.isFingerDown = false;
      this.state.du = 0;
      this.state.dv = 0;
    });
  }

  lookAt(position: vec3) {
    this.center = position;
  }

  update(gl: WebGL): void {
    gl.setView(this.getViewMatrix());

    let { du, dv } = this.state;
    let friction = 0.01;
    this.state.u += du * friction;
    this.state.v += dv * friction;

    if (this.state.v > 1) this.state.v = 1;
    if (this.state.v < -0.5) this.state.v = -0.5;
    if (this.state.z < 2) this.state.z = 2;

    let transform = mat4.create();
    rotateMat(transform, -this.state.v, this.side);
    rotateMat(transform, -this.state.u, this.up);

    let position = vec3.fromValues(0, this.state.y, this.state.z);
    vec3.transformMat4(position, position, transform);

    if (position[1] < 0.1) position[1] = 0.1;

    this.position = vec3.add(vec3.create(), position, this.center);
  }

  getViewMatrix(): mat4 {
    return mat4.lookAt(mat4.create(), this.position, this.center, this.up);
  }

  clean(): void {
    document.removeEventListener("wheel", this.mouseWheelListener);
    document.removeEventListener("mousemove", this.mouseMoveListener);
    document.removeEventListener("mousedown", this.mouseDownListener);
    document.removeEventListener("mouseup", this.mouseUpListener);
    document.removeEventListener("touchstart", this.touchStartListener);
    document.removeEventListener("touchmove", this.touchMoveListener);
    document.removeEventListener("touchend", this.touchEndListener);
  }
}

function rotateMat(mat: mat4, angle: number, axis: vec3) {
  let newMat = mat4.fromRotation(mat4.create(), angle, axis);
  return mat4.multiply(mat, newMat, mat);
}

function linearInterpolation(start: number, end: number, amount: number): number {
  return (1 - amount) * start + amount * end;
}
