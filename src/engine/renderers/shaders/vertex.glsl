#version 300 es
precision mediump float;

layout (location = 0) in vec4 aPosition;
layout (location = 1) in vec2 aTexCoord;
layout (location = 2) in vec3 aNormal;

//uniform mat4 uViewModel;
uniform mat4 uProjection;

//out vec3 vVertexPosition;
out vec3 vNormal;
out vec2 vTexCoord;

void main() {
//    vVertexPosition = (uViewModel * vec4(aPosition, 1)).xyz;
//    vNormal = aNormal;
    vTexCoord = aTexCoord;
//    gl_Position = uProjection * vec4(vVertexPosition, 1);
    gl_Position = uProjection * aPosition;
}
