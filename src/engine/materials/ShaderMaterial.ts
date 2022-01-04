import { Material } from "./Material";

type ShaderMaterialOptions = {
  uniforms?: Record<string, any>;
  fragmentShader: string;
}

type UniformType = '1f' | '2f' | '3f' | '4f';

type Uniform = {
  type: UniformType;
  value: any;
}

type UniformsMap = Record<string, Uniform>;

export default class ShaderMaterial extends Material {
  private fragmentShader: string;
  uniforms: UniformsMap;

  constructor (options: ShaderMaterialOptions) {
    super(options);
    // TODO: add support for custom vertex shader
    this.fragmentShader = options.fragmentShader;
    this.uniforms = ShaderMaterial.buildUniforms(options.uniforms);
  }

  /**
   * Update an existing uniform value.
   */
  setUniform(name: string, value: any) {
    this.uniforms[name].value = value;
  }

  static buildUniforms(uniforms: Record<string, any>) {
    let output: UniformsMap = {};
    for (const name in uniforms) {
      const value = uniforms[name];
      const type = ShaderMaterial.getUniformType(value);
      output[name] = {
        type,
        value
      };
    }
    return output;
  }

  static getUniformType(value: number | number[]) {
    if (typeof value === "number") {
      return `1f`;
    }
    if (value.hasOwnProperty("length")) {
      const l = value.length;
      return `${l}f` as UniformType;
    }
  }

}
