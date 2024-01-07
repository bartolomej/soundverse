import { mat4, vec3 } from 'gl-matrix';

import { WebGL } from "./WebGL";
import { Light } from "../lights/Light";

import { createFragmentShader, createVertexShader } from "./shaders";
import ShaderMaterial from "../materials/ShaderMaterial";

// This class prepares all assets for use with WebGL
// and takes care of rendering.

export class WebGLRenderer {

  constructor (gl, options = {}) {
    this.gl = gl;
    this.clearColor = options.clearColor || [1,1,1,1];
    this.glObjects = new Map();
    this.programs = new Map();

    this.preparePrograms(options);

    this.defaultTexture = WebGL.createTexture(gl, {
      data: new Uint8Array([255, 255, 255, 255]),
      width: 1,
      height: 1,
    });

    gl.clearColor(...this.clearColor);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
  }

  get defaultProgram() {
    return this.programs.get("default")
  }

  preparePrograms(options = {}) {
    const program = WebGL.buildProgram(this.gl, {
      vertex: createVertexShader(),
      fragment: createFragmentShader({
        nLights: options.nLights || 1
      })
    });
    this.programs.set("default", program);
  }

  prepareBufferView (bufferView) {
    if (this.glObjects.has(bufferView)) {
      return this.glObjects.get(bufferView);
    }

    const buffer = new DataView(
      bufferView.buffer,
      bufferView.byteOffset,
      bufferView.byteLength);
    const glBuffer = WebGL.createBuffer(this.gl, {
      target: bufferView.target,
      data: buffer
    });
    this.glObjects.set(bufferView, glBuffer);
    return glBuffer;
  }

  prepareSampler (sampler) {
    if (this.glObjects.has(sampler)) {
      return this.glObjects.get(sampler);
    }

    const glSampler = WebGL.createSampler(this.gl, sampler);
    this.glObjects.set(sampler, glSampler);
    return glSampler;
  }

  prepareImage (image) {
    if (this.glObjects.has(image)) {
      return this.glObjects.get(image);
    }

    const glTexture = WebGL.createTexture(this.gl, { image });
    this.glObjects.set(image, glTexture);
    return glTexture;
  }

  prepareTexture (texture) {
    const gl = this.gl;

    this.prepareSampler(texture.sampler);
    const glTexture = this.prepareImage(texture.image);

    const mipmapModes = [
      gl.NEAREST_MIPMAP_NEAREST,
      gl.NEAREST_MIPMAP_LINEAR,
      gl.LINEAR_MIPMAP_NEAREST,
      gl.LINEAR_MIPMAP_LINEAR,
    ];

    if (!texture.hasMipmaps && mipmapModes.includes(texture.sampler.min)) {
      gl.bindTexture(gl.TEXTURE_2D, glTexture);
      gl.generateMipmap(gl.TEXTURE_2D);
      texture.hasMipmaps = true;
    }
  }

  prepareMaterial (material) {
    if (material instanceof ShaderMaterial) {
      this.prepareShaderMaterial(material);
    }
    if (material.baseColorTexture) {
      this.prepareTexture(material.baseColorTexture);
    }
    if (material.metallicRoughnessTexture) {
      this.prepareTexture(material.metallicRoughnessTexture);
    }
    if (material.normalTexture) {
      this.prepareTexture(material.normalTexture);
    }
    if (material.occlusionTexture) {
      this.prepareTexture(material.occlusionTexture);
    }
    if (material.emissiveTexture) {
      this.prepareTexture(material.emissiveTexture);
    }
  }

  prepareShaderMaterial(material) {
    try {
      const program = WebGL.buildProgram(this.gl, {
        vertex: createVertexShader(), // TODO: add support for custom vertex shader
        fragment: material.fragmentShader,
      });
      this.programs.set(material, program);
    } catch (e) {
      console.error("ShaderMaterial error: ", e)
    }
  }

  preparePrimitive (primitive) {
    if (this.glObjects.has(primitive)) {
      return this.glObjects.get(primitive);
    }

    this.prepareMaterial(primitive.material);

    const gl = this.gl;
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    if (primitive.indices) {
      const bufferView = primitive.indices.bufferView;
      bufferView.target = gl.ELEMENT_ARRAY_BUFFER;
      const buffer = this.prepareBufferView(bufferView);
      gl.bindBuffer(bufferView.target, buffer);
    }

    // this is an application-scoped convention, matching the shaders
    const attributeNameToIndexMap = {
      POSITION: 0,
      TEXCOORD_0: 1,
      NORMAL: 2,
    };

    for (const name in primitive.attributes) {
      const accessor = primitive.attributes[name];
      const bufferView = accessor.bufferView;
      const attributeIndex = attributeNameToIndexMap[name];

      if (attributeIndex !== undefined) {
        bufferView.target = gl.ARRAY_BUFFER;
        const buffer = this.prepareBufferView(bufferView);
        gl.bindBuffer(bufferView.target, buffer);
        gl.enableVertexAttribArray(attributeIndex);
        gl.vertexAttribPointer(
          attributeIndex,
          accessor.numComponents,
          accessor.componentType,
          accessor.normalized,
          bufferView.byteStride,
          accessor.byteOffset);
      }
    }

    this.glObjects.set(primitive, vao);
    return vao;
  }

  prepareMesh (mesh) {
    for (const primitive of mesh.primitives) {
      this.preparePrimitive(primitive);
    }
  }

  prepareNode (node) {
    if (node.mesh) {
      this.prepareMesh(node.mesh);
    }
    for (const child of node.children) {
      this.prepareNode(child);
    }
  }

  prepareScene (scene) {
    // rebuild programs if complete scene info is known on startup
    this.preparePrograms({
      ...this.options,
      nLights: scene.getTotalLights()
    })
    for (const node of scene.nodes) {
      this.prepareNode(node);
    }
  }

  render (scene, camera) {
    const gl = this.gl;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let matrix = mat4.create();
    let {projection} = camera.camera;
    let matrixStack = [];

    const viewMatrix = camera.getGlobalTransform();
    mat4.invert(viewMatrix, viewMatrix);
    mat4.copy(matrix, viewMatrix);

    let lightCounter = 0;

    scene.traverse(
      node => {
        matrixStack.push(mat4.clone(matrix));
        mat4.mul(matrix, matrix, node.matrix);
        if (node.light instanceof Light) {
          this.renderLight(node, lightCounter)
          lightCounter++;
        }
        this.renderNode(node, matrix, projection)
      },
      node => {
        matrix = matrixStack.pop();
      }
    );
  }

  renderLight(node, lightCounter) {
    const { light } = node;
    const { gl, defaultProgram: program } = this;

    let color = vec3.clone(light.ambientColor);
    vec3.scale(color, color, 1.0 / 255.0);
    gl.uniform3fv(program.uniforms['uAmbientColor[' + lightCounter + ']'], color);
    color = vec3.clone(light.diffuseColor);
    vec3.scale(color, color, 1.0 / 255.0);
    gl.uniform3fv(program.uniforms['uDiffuseColor[' + lightCounter + ']'], color);
    color = vec3.clone(light.specularColor);
    vec3.scale(color, color, 1.0 / 255.0);
    gl.uniform3fv(program.uniforms['uSpecularColor[' + lightCounter + ']'], color);
    let position = [0, 0, 0];
    mat4.getTranslation(position, node.matrix);

    gl.uniform3fv(program.uniforms['uLightPosition[' + lightCounter + ']'], position);
    gl.uniform1f(program.uniforms['uShininess[' + lightCounter + ']'], light.shininess);
    gl.uniform3fv(program.uniforms['uLightAttenuation[' + lightCounter + ']'], light.attenuatuion);
  }

  renderNode (node, mvpMatrix, projection) {
    const program = this.defaultProgram;
    this.gl.uniformMatrix4fv(program.uniforms.uViewModel, false, mvpMatrix);

    if (node.mesh) {
      for (const primitive of node.mesh.primitives) {
        this.renderPrimitive(primitive, mvpMatrix, projection);
      }
    }

    for (const child of node.children) {
      this.renderNode(child, mvpMatrix, projection);
    }
  }

  renderPrimitive (primitive, mvpMatrix, projection) {
    const gl = this.gl;

    const vao = this.glObjects.get(primitive);
    const material = primitive.material;
    let program = this.defaultProgram;

    if (material instanceof ShaderMaterial) {
      program = this.programs.get(material);
    }

    gl.useProgram(program.program);

    // set standard uniform values
    gl.uniformMatrix4fv(program.uniforms.uProjection, false, projection);
    gl.uniformMatrix4fv(program.uniforms.uViewModel, false, mvpMatrix);
    gl.uniform1i(program.uniforms.uTexture, 0);

    if (material instanceof ShaderMaterial) {
      // set non-standard (custom) uniform values
      for (const name in material.uniforms) {
        const uniform = material.uniforms[name];
        const func = `uniform${uniform.type}`;
        for (const webGLName of uniform.getNames(name)) {
          const location = program.uniforms[webGLName];
          if (gl[func]) {
            if (uniform.isVector()) {
              gl[func](location, ...uniform.value);
            } else {
              gl[func](location, uniform.value);
            }
          } else {
            console.error(`GLSL uniform type ${uniform.type} not supported!`)
          }
        }
      }
    }

    const texture = material.baseColorTexture;
    const glTexture = this.glObjects.get(texture?.image);
    const glSampler = this.glObjects.get(texture?.sampler);

    gl.bindVertexArray(vao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, glTexture || this.defaultTexture);
    gl.bindSampler(0, glSampler);

    if (primitive.indices) {
      const mode = primitive.mode;
      const count = primitive.indices.count;
      const type = primitive.indices.componentType;
      gl.drawElements(mode, count, type, 0);
    } else {
      const mode = primitive.mode;
      const count = primitive.attributes.POSITION.count;
      gl.drawArrays(mode, 0, count);
    }
  }

}
