# Soundverse

An interactive visual sound experience, made in WebGL 🎶.

## Architecture
This app has two major modules:
- `engine`: 3D rendering engine that uses WebGL
- `app`: application specific logic

Engine module has a similar API to some other well known 3D rendering libraries like [Three.js](https://threejs.org/), so this module could be replaced with some 3rd party library without much of a hassle.

App module also has a few useful classes (located in `app/sound` module) that are useful for retrieving, playing and analyzing sound data.

## Custom shaders

With the help of `ShaderMatarial`, we are able to create shaders that are applied to a specified geometry as materials.

Here is a simple shader that colors the surface of geometry with red:
```glsl
#version 300 es
precision mediump float;

out vec4 oColor;

void main() {
    oColor = vec4(1,0,0,1);
}
```

But we are not limited by static shaders. WebGLRenderer provides data for some standard uniforms and varyings, like:
- `uTexture` - texture that is applied to a primitive (optional)
- `vTextCoord` - texture coordinates
- `vVertexViewPosition` - transformed coordinates in view space
- `vVertexPosition` - non transformed coordinates (in world space)
- `vNormal` - normal to a vertex

In addition to that, we can also provide a set of non-standard uniforms with the help of `ShaderMaterial` class.
```typescript
const shaderMaterial = new ShaderMaterial({
   fragmentShader: simpleShader,
   uniforms: {
     time: 0, // updated with each rerender
     frequencies: [/* a list of frequency values that is updated every rerender */]
   }
});
```

Those values can be updated before each rerender in `update()` method, like so:
```typescript
shaderMaterial.setUniform("time", newTime);
```

As an example, here is a simple shader that colors the pixels with a color value that is dependent on the frequency vector:
```glsl
#version 300 es
precision mediump float;

// standard uniforms
uniform mediump sampler2D uTexture;

// standard inputs (varyings)
in vec2 vTexCoord;
in vec3 vVertexViewPosition;
in vec3 vVertexPosition;
in vec3 vNormal;

// non-standard uniforms
uniform float time;
uniform vec4 frequencies;

out vec4 oColor;

void main() {
    oColor = vec4(frequencies.xyz, 1);
}
```

## Resources
- [webgl2-examples](https://github.com/UL-FRI-LGM/webgl2-examples) - [Computer Graphics 2020](https://www.youtube.com/playlist?list=PLhMDcXgR0MToUfNKisP0MWu46RrTWmpiI) university course
- [webglfundamentals.org](https://webglfundamentals.org/) - WebGL from the ground up
- [shader-school](https://github.com/stackgl/shader-school) - 🎓 A workshopper for GLSL shaders
- [glslsandbox.com](https://glslsandbox.com/) - collection of cool shaders coupled with useful glsl editor

## Credits

A great part of the graphics engine source code was taken, modified and extended
from [UL-FRI-LGM/webgl2-examples](https://github.com/UL-FRI-LGM/webgl2-examples).


