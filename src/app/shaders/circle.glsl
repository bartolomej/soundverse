#version 300 es
precision mediump float;

// https://glslsandbox.com/e#78318.8

// standard uniforms
uniform mediump sampler2D uTexture;

// standard inputs (varyings)
in vec2 vTexCoord;
in vec3 vVertexViewPosition;
in vec3 vVertexPosition;
in vec3 vNormal;

// non-standard uniforms
uniform float time;
uniform float[32] frequencies;

const float R_MAX = 0.5;
const float R_MIN = 0.06;

out vec4 oColor;

float f(float r)
{
    return (1.0 - sqrt(R_MIN / r)) / (r * r * r);
}

float hash (float n) {
    float number = sin(n) * 11.0;
    return number - floor(number);
}
float noise(float r, float alpha) {
    vec3 p = vec3(1.8* r, 0.5*sin(50.0 * time), 1.2 * (sin(alpha)));
    vec3 fl = floor(p);
    vec3 fr = fract(p);
    fr = fr * fr * (3.0 - 2.0 * fr);

    float n = fl[0] + fl[1] * 157.0 + 113.0 * fl[2];
    return mix( mix( mix( hash( n +   0.0), hash( n +   1.0 ), fr[0] ),
    mix( hash( n + 157.0), hash( n + 158.0 ), fr[0] ), fr[1] ),
    mix( mix( hash( n + 113.0), hash( n + 114.0 ), fr[0] ),
    mix( hash( n + 270.0), hash( n + 271.0 ), fr[0] ), fr[1] ), fr[2] );
}
vec4 colorGrad(float I) {
    float R = clamp(3.0 * I - 0.0, 0.0, 1.0);
    float G = clamp(3.0 * I - 1.0, 0.0, 1.0);
    float B = clamp(3.0 * I - 2.0, 0.0, 1.0);
    return vec4(R, G, B, 1.0);
}
float getIntensity(float r)
{
    return f(r) / f(1.36111 * R_MIN);
}

void main( void ) {
    vec2 position = (vTexCoord - vec2(0.5, 0.5)) * vec2(sin(time), 1.);

    float r2 = dot(position, position);
    if (r2 < R_MAX * R_MAX && r2 > R_MIN * R_MIN)  {
        float r = 100.0 * sqrt(r2);
        float alpha = atan(position.y, position.x);
        float Omega_k = sqrt(1.0 / (r * r * r));

        float I = getIntensity(r / 100.0) * noise(r, alpha - time);
        oColor = colorGrad(I);
    }
    else {
        oColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}
