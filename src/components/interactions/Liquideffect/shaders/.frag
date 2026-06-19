precision mediump float;

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
uniform sampler2D imageTexture;


void main()
{   
    vec2 q = vUv;
    // blob code
    // gl_FragColor = vec4(texture2D(uBuffer,vUv).xyz,1.0);


    vec3 e = vec3(vec2(1.)/vec2(resolution),0.);
    float p10 = texture2D(uBuffer, q-e.zy).x;
    float p01 = texture2D(uBuffer, q-e.xz).x;
    float p21 = texture2D(uBuffer, q+e.xz).x;
    float p12 = texture2D(uBuffer, q+e.zy).x;
    
    // Totally fake displacement and shading:
    vec3 grad = normalize(vec3(p21 - p01, p12 - p10, 1.));
    // vec4 c = vec4(0.1,0.1,0.1,1.0);
    vec4 c = texture2D(imageTexture, vUv + grad.xy*.35);
    vec3 light = normalize(vec3(.2,-.5,.7));
    float diffuse = dot(grad,light);
    float spec = pow(max(0.,-reflect(light,grad).z),32.);
    vec4 finalColor = mix(c,vec4(0.9647, 0.9765, 1.0, 1.0),.25)*max(diffuse,0.) + spec ;
    //brightness
    finalColor.rgb += 0.5;
    //contrast
    finalColor.rgb = (finalColor.rgb - 0.5) * 1.7 -0.3;
    gl_FragColor = finalColor;

    
    // vec2 q = vUv;

    // float h = texture2D(uBuffer, q).x;
    // float sh = 1.35 - h*2.;
    // vec3 c =
    //    vec3(exp(pow(sh-.75,2.)*-10.),
    //         exp(pow(sh-.50,2.)*-20.),
    //         exp(pow(sh-.25,2.)*-10.));
    // gl_FragColor = vec4(c,1.);

}

