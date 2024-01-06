import { mat4 } from "gl-matrix";
import {Object3D, Object3DOptions} from "../core/Object3D";

export type CameraOptions = Object3DOptions;

export class Camera extends Object3D {
  public projection: mat4;

  constructor (options: CameraOptions = {}) {
    super(options);
    this.projection = mat4.create();
  }

}
