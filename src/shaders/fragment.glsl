#version 300 es
precision mediump float;

// standard uniforms
uniform mediump sampler2D uTexture;

// non-standard uniforms
uniform float time;

// standard inputs (varyings)
in vec2 vTexCoord;
in vec3 vVertexViewPosition;
in vec3 vVertexPosition;
in vec3 vNormal;

out vec4 oColor;

void main() {
    float t = time * 0.005;
    vec2 v = vec2(
        sin(vVertexPosition.x * 10. * sin(t)),
        cos(vVertexPosition.y * 10. * cos(t))
    );
    oColor = vec4(v, 0, 1);
}
