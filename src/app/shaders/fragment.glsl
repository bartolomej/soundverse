#version 300 es
precision mediump float;

// standard uniforms
uniform mediump sampler2D uTexture;

// non-standard uniforms
uniform float time;
uniform vec4 frequencies;

// standard inputs (varyings)
in vec2 vTexCoord;
in vec3 vVertexViewPosition;
in vec3 vVertexPosition;
in vec3 vNormal;

out vec4 oColor;

const float Pi = 3.14159;

float sinApprox(float x) {
    x = Pi + (2.0 * Pi) * floor(x / (2.0 * Pi)) - x;
    return (4.0 / Pi) * x - (4.0 / Pi / Pi) * x * abs(x);
}

float cosApprox(float x) {
    return sinApprox(x + 0.5 * Pi);
}

void main()
{
    vec2 p=(2.0*vTexCoord.xy);
    for(int i=1;i<50;i++)
    {
        vec2 newp=p;
        newp.x+=0.6/float(i)*sin(float(i)*p.y+time+0.3*float(i))+frequencies.x * 0.1;
        newp.y+=0.6/float(i)*sin(float(i)*p.x+time+0.3*float(i+10))-frequencies.y * 0.1;
        p=newp;
    }
    vec3 col=vec3(0.5*sin(3.0*p.x)+0.5,0.5*sin(3.0*p.y)+0.5,sin(p.x+p.y));
    oColor=vec4(col, 1.0);
}
