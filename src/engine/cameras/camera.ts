import type { mat4, vec3 } from "gl-matrix";
import type { WebGL } from "../webgl";

export interface Camera {
  update(gl: WebGL): void;
  getViewMatrix(): mat4;
  lookAt(position: vec3): void;
  clean(): void;
}
