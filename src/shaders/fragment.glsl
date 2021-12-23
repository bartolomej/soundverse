precision highp float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time; // elapsed time in ms

const float radius = 0.5;

vec2 transform(vec2 v) {
    v = v - vec2(0.5, 0.5);
    return v * 2.;
}

vec2 normalizePos(vec2 v) {
    return vec2(v.x / resolution.x, v.y / resolution.y);
}

// Draws a circle with specified radius.
// Circle radius can be changed with mouse interaction.
void main() {
    vec2 tPos = transform(normalizePos(gl_FragCoord.xy));
    vec2 tMouse = transform(normalizePos(mouse));

    float r = length(tPos) * length(tMouse);
    float c = r > radius ? 1. : 0.;

    gl_FragColor = vec4(c, c, c, 1);
}
