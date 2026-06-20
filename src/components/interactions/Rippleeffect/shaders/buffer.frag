//
// A simplified water effect by Tom@2016
//
// https://www.shadertoy.com/view/4dK3Ww

precision lowp float;

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
uniform sampler2D uBufferA;
uniform sampler2D uBufferB;
uniform float uFrame;

void main()
{   

    vec3 e = vec3(vec2(1.)/vec2(resolution),0.);
   vec2 q = vUv;
   
   vec4 c = texture2D(uBufferA, q);

    float p11=c.y;
    
    float p10 = texture2D(uBufferA, q-e.zy).x;
    float p01 = texture2D(uBufferA, q-e.xz).x;
    float p21 = texture2D(uBufferA, q+e.xz).x;
    float p12 = texture2D(uBufferA, q+e.zy).x;


    float blob = 0.0;
    if(hovering)
    {
      blob = smoothstep(0.05,.01,length(mousePos-vUv));
    }
    
    // vec3 stack= texture2D(uBufferA,vUv).xyz * vec3(0.99,.982,.93);
    float d = blob  ;
    d +=-(p11-.5)*2.0+(p10 + p01 + p21 + p12 - 2.);
    d *= 0.97;
    d *= min(1.,float(uFrame));
    d = d*.5 + .5;
     gl_FragColor = vec4(d,c.x,0,0);
    
}