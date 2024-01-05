import { mat4, vec3 } from "gl-matrix";
import type { Camera } from "./camera";
import type { WebGL } from "../webgl";
import { DroneState } from "./state";

export class Drone implements Camera {
  initialPosition: vec3;
  initialDirection: vec3;

  position: vec3;
  direction: vec3;

  state: DroneState = new DroneState();

  up: vec3 = vec3.fromValues(0, 1, 0);
  side: vec3 = vec3.fromValues(1, 0, 0);

  keyUpListener: any;
  keyDownListener: any;
  mouseListener: any;

  constructor(gl: WebGL, position: vec3 = [0, 0, 0], direction: vec3 = [0, 0, -1]) {
    this.initialPosition = position;
    this.initialDirection = direction;

    this.position = position;
    this.direction = direction;
    this.keyDownListener = document.addEventListener("keydown", (e: KeyboardEvent) => {
      const velocity = 1;
      switch (e.key) {
        case "ArrowUp":
        case "w":
          this.state.fwd = velocity;
          break;
        case "ArrowDown":
        case "s":
          this.state.fwd = -velocity;
          break;
        case "ArrowLeft":
        case "a":
          this.state.right = -velocity;
          break;
        case "ArrowRight":
        case "d":
          this.state.right = velocity;
      }
    });
    this.keyUpListener = document.addEventListener("keyup", (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "ArrowDown":
        case "s":
          this.state.fwd = 0;
          break;
        case "ArrowLeft":
        case "a":
        case "ArrowRight":
        case "d":
          this.state.right = 0;
      }
    });

    gl.canvas.onclick = function () {
      gl.canvas.requestPointerLock();
    };

    this.mouseListener = gl.canvas.addEventListener("mousemove", (e) => {
      const { movementX, movementY } = e;
      const amount = 0.1;
      this.state.du = linearInterpolation(this.state.du, movementX, amount);
      this.state.dv = linearInterpolation(this.state.dv, movementY, amount);
    });
  }

  lookAt(_position: vec3) {
    throw new Error("Method not implemented.");
  }

  updateDirection() {
    const velocityFactor = 0.01;
    const { du, dv } = this.state;
    this.state.u += du * velocityFactor;
    this.state.v += dv * velocityFactor;

    if (this.state.v > 1) this.state.v = 1;
    if (this.state.v < -0.5) this.state.v = -0.5;

    let transform = mat4.create();
    rotateMat(transform, -this.state.v, this.side);
    rotateMat(transform, -this.state.u, this.up);

    const dir = vec3.fromValues(this.initialDirection[0], this.initialDirection[1], this.initialDirection[2]);
    vec3.transformMat4(dir, dir, transform);

    const frictionFactor = 0.5;
    this.state.du *= frictionFactor;
    this.state.dv *= frictionFactor;

    this.direction = dir;
  }

  updatePostion() {
    const { fwd, right } = this.state;
    const velocityFactor = 0.3;

    let forwardVec = vec3.normalize(vec3.create(), this.direction);
    let rightVec = vec3.cross(vec3.create(), this.direction, this.up);
    vec3.normalize(rightVec, rightVec);

    vec3.scale(forwardVec, forwardVec, fwd * velocityFactor);
    vec3.scale(rightVec, rightVec, right * velocityFactor);

    vec3.add(this.position, this.position, forwardVec);
    vec3.add(this.position, this.position, rightVec);
  }

  update(gl: WebGL): void {
    this.updateDirection();
    this.updatePostion();
    gl.setView(this.getViewMatrix());
  }

  getViewMatrix(): mat4 {
    const target = vec3.add(vec3.create(), this.position, this.direction);
    return mat4.lookAt(mat4.create(), this.position, target, this.up);
  }

  clean(): void {
    document.removeEventListener("keyup", this.keyUpListener);
    document.removeEventListener("keydown", this.keyDownListener);
    document.removeEventListener("mousemove", this.mouseListener);
    document.exitPointerLock();
  }
}

function rotateMat(mat: mat4, angle: number, axis: vec3) {
  let newMat = mat4.fromRotation(mat4.create(), angle, axis);
  return mat4.multiply(mat, newMat, mat);
}

function linearInterpolation(start: number, end: number, amount: number): number {
  return (1 - amount) * start + amount * end;
}
