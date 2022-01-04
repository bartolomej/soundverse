#version 300 es
precision mediump float;

// standard uniforms
uniform mediump sampler2D uTexture;

// standard inputs (varyings)
in vec2 vTexCoord;

out vec4 oColor;

void main() {
    oColor = texture(uTexture, vTexCoord);
}
