precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    // gl_FragColor is a special variable a fragment shader
    // is responsible for setting

    gl_FragColor = vec4(
        fract((gl_FragCoord.xy - u_mouse) / u_resolution),
        fract(u_time),
        1
    );
}
