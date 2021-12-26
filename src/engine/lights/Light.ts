
export class Light {

  constructor() {

    Object.assign(this, {
      ambientColor     : [51, 51, 51],
      diffuseColor     : [0, 0, 0],
      specularColor    : [0, 0 ,0],
      shininess        : 10,
      attenuatuion     : [1.0, 0, 0.02]
    });
  }

}
