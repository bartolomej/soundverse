import {Material, MaterialOptions} from "./Material";

type ShaderMaterialOptions = MaterialOptions & {
  uniforms?: UniformsMap;
  fragmentShader: string;
}

export type UniformType =
  '1f' | '2f' | '3f' | '4f' |
  '1fv' | '2fv' | '3fv' | '4fv';

type UniformValue = number | number[];

export type ShaderUniform = {
  type: UniformType;
  value: UniformValue;
}

type UniformsMap = Record<string, ShaderUniform>;

export default class ShaderMaterial extends Material {
  fragmentShader: string;
  uniforms: UniformsMap;

  constructor (options: ShaderMaterialOptions) {
    super(options);
    this.fragmentShader = options.fragmentShader;
    this.uniforms = options.uniforms ?? {};
  }

  /**
   * Update an existing uniform value.
   */
  setUniform (name: string, value: any) {
    this.uniforms[name].value = value;
  }

}
