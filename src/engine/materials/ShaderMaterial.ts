import { Material } from "./Material";

type ShaderMaterialOptions = {
  uniforms?: Record<string, any>;
  fragmentShader: string;
}

export default class ShaderMaterial extends Material {
  private fragmentShader: string;
  uniforms: Record<string, any>;

  constructor (options: ShaderMaterialOptions) {
    super(options);
    // TODO: add support for custom vertex shader
    this.fragmentShader = options.fragmentShader;
    this.uniforms = options.uniforms;
  }

}
