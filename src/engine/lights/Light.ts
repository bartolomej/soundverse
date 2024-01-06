import {vec3} from "gl-matrix";

export class Light {

  public ambientColor: vec3;
  public diffuseColor: vec3;
  public specularColor: vec3;
  public attenuatuion: vec3;
  public shininess: number;

  constructor() {
    this.ambientColor = [51, 51, 51];
    this.diffuseColor = [0, 0, 0];
    this.specularColor = [0, 0, 0];
    this.attenuatuion = [1.0, 0, 0.02];
    this.shininess = 10;
  }

}
