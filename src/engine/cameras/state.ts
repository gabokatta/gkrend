export interface CameraState {
  initial(): CameraState;
}

export class OrbitalState implements CameraState {
  x: number = 0;
  y: number = 0;
  z: number = 0;
  u: number = 0;
  v: number = 0;
  du: number = 0;
  dv: number = 0;
  dz: number = 0;

  initial(): CameraState {
    return new OrbitalState();
  }
}

export class DroneState implements CameraState {
  fwd: number = 0;
  right: number = 0;
  u: number = 0;
  v: number = 0;
  du: number = 0;
  dv: number = 0;

  initial(): CameraState {
    return new DroneState();
  }
}
