//
// A simplified water effect by Tom@2016
//
// https://www.shadertoy.com/view/4dK3Ww

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
uniform float uFrame;

void main()
{   
    vec3 blob = vec3(.11-clamp(length(vUv-mousePos),0.,.11))*2.;
    vec3 stack= texture2D(uBuffer,vUv).xyz * vec3(0.99,.982,.93);
     gl_FragColor = vec4(stack+blob,1);
}