import { Node } from "../Node";
import { mat4 } from "gl-matrix";


export class Camera extends Node {

  constructor () {
    super();
    this.projection = mat4.create();
  }

}
