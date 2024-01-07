type CoreFragmentShaderProps = {
  nLights?: number; // max number of lights
}

export const createFragmentShader = ({
  nLights = 1
}: CoreFragmentShaderProps) => {
  // language=GLSL
  return `
#version 300 es
precision mediump float;

uniform mat4 uViewModel;
uniform mediump sampler2D uTexture;
uniform vec3 uAmbientColor[${nLights}];
uniform vec3 uDiffuseColor[${nLights}];
uniform vec3 uSpecularColor[${nLights}];
uniform float uShininess[${nLights}];
uniform vec3 uLightPosition[${nLights}];
uniform vec3 uLightAttenuation[${nLights}];

in vec3 vVertexViewPosition;
in vec3 vNormal;
in vec2 vTexCoord;
out vec4 oColor;

void main() {
    oColor = vec4(0.0);
    for (int i = 0; i < ${nLights}; i++) {
        vec3 lightPosition = (uViewModel * vec4(uLightPosition[i], 1)).xyz;
        float d = distance(vVertexViewPosition, lightPosition);
        float attenuation = 1.0 / dot(uLightAttenuation[i], vec3(1, d, d * d));

        vec3 N = (uViewModel * vec4(vNormal, 0)).xyz;
        vec3 L = normalize(lightPosition - vVertexViewPosition);
        vec3 E = normalize(-vVertexViewPosition);
        vec3 R = normalize(reflect(-L, N));

        float lambert = max(0.0, dot(L, N));
        float phong = pow(max(0.0, dot(E, R)), uShininess[i]);

        vec3 ambient = uAmbientColor[i];
        vec3 diffuse = uDiffuseColor[i] * lambert;
        vec3 specular = uSpecularColor[i] * phong;
        vec3 light = (ambient + diffuse + specular) * attenuation;

        oColor += texture(uTexture, vTexCoord) * vec4(light, 1);
     }
}`.trim()
}

export const createVertexShader = () => {
  // language=GLSL
  return `
#version 300 es
precision mediump float;
layout (location = 0) in vec3 aPosition;
layout (location = 1) in vec2 aTexCoord;
layout (location = 2) in vec3 aNormal;

uniform mat4 uViewModel;
uniform mat4 uProjection;

out vec3 vVertexViewPosition;
out vec3 vVertexPosition;
out vec3 vNormal;
out vec2 vTexCoord;

void main() {
    vVertexPosition = aPosition;
    vVertexViewPosition = (uViewModel * vec4(aPosition, 1)).xyz;
    vNormal = aNormal;
    vTexCoord = aTexCoord;
    gl_Position = uProjection * uViewModel * vec4(aPosition, 1);

}`.trim()
}
