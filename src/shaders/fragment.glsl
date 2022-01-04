#version 300 es
precision mediump float;

// standard uniforms
uniform mediump sampler2D uTexture;

// non-standard uniforms
uniform float time;

// standard inputs (varyings)
in vec2 vTexCoord;

out vec4 oColor;

void main() {
    vec3 t = texture(uTexture, vTexCoord).xyz * sin(time * 0.01);
    oColor = vec4(t, 1);
}
