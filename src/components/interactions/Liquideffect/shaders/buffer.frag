// following blob effect adapted from - https://www.shadertoy.com/view/WlsGRM


precision highp float;

#define PI 3.14159265

// desaturate vector
const vec3 DESATURATE=vec3(.2126,.7152,.0722);

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

uniform vec2 mousePos;
uniform float uTime;
uniform bool hovering;
uniform float resolution;
uniform sampler2D uBuffer;
uniform sampler2D imageTexture;
uniform float uFrame;

void main()
{   
    // blob buffer code
    float blob = 0.0;
    if(hovering)
    {
      blob = smoothstep(0.1,.05,length(mousePos-vUv));
    }
    
    vec3 stack= texture2D(uBuffer,vUv).xyz * vec3(0.99,.982,.93);
    float d = (stack.x+blob);
    d *= 0.94;
     gl_FragColor = vec4(d,0,0,1);
}