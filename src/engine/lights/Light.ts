
export class Light {

  public ambientColor: number[];
  public diffuseColor: number[];
  public specularColor: number[];
  public attenuatuion: number[];
  public shininess: number;

  constructor() {
    this.ambientColor = [51, 51, 51];
    this.diffuseColor = [0, 0, 0];
    this.specularColor = [0, 0, 0];
    this.attenuatuion = [1.0, 0, 0.02];
    this.shininess = 10;
  }

}
