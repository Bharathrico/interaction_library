precision highp float;

#define PI 3.14159265

// desaturate vector
const vec3 DESATURATE = vec3(0.2126, 0.7152, 0.0722);

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying float vDisplacement;

uniform vec2 mousePos;
uniform float uTime;
uniform bool hovering;
uniform float resolution;
uniform sampler2D uBuffer;


void main()
{   
    // blob code
    gl_FragColor = vec4(texture2D(uBuffer,vUv).xyz,1.0);

    // vec2 q = vUv;

    // float h = texture2D(uBuffer, q).x;
    // float sh = 1.35 - h*2.;
    // vec3 c =
    //    vec3(exp(pow(sh-.75,2.)*-10.),
    //         exp(pow(sh-.50,2.)*-20.),
    //         exp(pow(sh-.25,2.)*-10.));
    // gl_FragColor = vec4(c,1.);

}

