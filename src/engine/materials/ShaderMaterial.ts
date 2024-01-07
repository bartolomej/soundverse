import { Material } from "./Material";

type ShaderMaterialOptions = {
  uniforms?: UniformProp;
  fragmentShader: string;
}

type UniformProp = Record<string, UniformValue | ShaderUniform>;

type UniformType =
  '1f' | '2f' | '3f' | '4f' |
  '1fv' | '2fv' | '3fv' | '4fv';

type UniformValue = number | number[];

export class ShaderUniform {
  public type: UniformType;
  public value: UniformValue;

  constructor (value: UniformValue, type?: UniformType) {
    this.value = value;
    this.type = type || ShaderUniform.getUniformType(value);
  }

  isVector() {
    return typeof this.value === "object" && this.value.length <= 4;
  }

  /**
   * Returns array of attribute names.
   * In case of single vector values (1f, 2f,..) array contains a single value.
   */
  getNames(name: string) {
    if (typeof this.value === "object") {
      const names = [];
      for (let i = 0; i < this.value.length; i++) {
        names.push(`${name}[${i}]`);
      }
      return names;
    } else {
      return [name]
    }
  }

  static getUniformType (value: number | number[]) {
    if (typeof value === "number") {
      return `1f`;
    }
    if (value.hasOwnProperty("length")) {
      const l = value.length;
      return (l > 4 ? `1fv` : `${l}f`) as UniformType;
    }
  }

}

type UniformsMap = Record<string, ShaderUniform>;

export default class ShaderMaterial extends Material {
  private fragmentShader: string;
  uniforms: UniformsMap;

  constructor (options: ShaderMaterialOptions) {
    super(options);
    this.fragmentShader = options.fragmentShader;
    this.uniforms = ShaderMaterial.buildUniforms(options.uniforms);
  }

  /**
   * Update an existing uniform value.
   */
  setUniform (name: string, value: any) {
    this.uniforms[name].value = value;
  }

  static buildUniforms (uniforms: UniformProp) {
    let output: UniformsMap = {};
    for (const name in uniforms) {
      const value = uniforms[name];
      output[name] = value instanceof ShaderUniform
        ? value
        : new ShaderUniform(value);
    }
    return output;
  }

}
