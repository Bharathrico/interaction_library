//
// A simplified water effect by Tom@2016
//
// https://www.shadertoy.com/view/4dK3Ww

precision mediump float;

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
    //  #include <tonemapping_fragment>
    // #include <colorspace_fragment>
    // blob buffer code ends



    //ripple code
    // vec3 e = vec3(vec2(1.)/vec2(resolution),0.);
    // vec2 q = gl_FragCoord.xy/vec2(resolution);
    // vec4 c = texture2D(uBuffer, q);
    

    // float p11 = c.x;
   
    // float p10 = texture2D(uBuffer, q-e.zy).x;
    // float p01 = texture2D(uBuffer, q-e.xz).x;
    // float p21 = texture2D(uBuffer, q+e.xz).x;
    // float p12 = texture2D(uBuffer, q+e.zy).x;


    // float d = 0.;


//     if (hovering) 
//    {
    //   Mouse interaction:
//       d = smoothstep(.011,.01,length(mousePos - q));
//    }
//     else
//    {
    //   Simulate rain drops
//       float t = uTime*2.;
//       vec2 pos = fract(floor(t)*vec2(0.456665,0.708618))*vec2(resolution);
//       float amp = 1.-step(.05,fract(t));
//       d = -amp*smoothstep(2.5,.5,length(pos - q));
//    }

    // The actual propagation:
    // d += -(p11-.5)*2. + (p10 + p01 + p21 + p12 - 2.);
    // d *= .99; // dampening
    // d *= min(1.,float(uFrame)); // clear the buffer at iFrame == 0
    // d = d*.5 + .5;

    // gl_FragColor = vec4(d,0,0,1);
}