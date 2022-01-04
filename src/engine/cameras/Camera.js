import { mat4 } from "gl-matrix";


export class Camera {

  constructor () {
    this.projection = mat4.create();
  }

}
