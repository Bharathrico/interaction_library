precision mediump float;

#define PI 3.1415926536
#define RHO 1.5707963268

struct ColorStop{
    vec3 color;
    float position;
};

// color ramp function
#define ColorRamp(colors,factor,finalColor) \
{ \
    int index = 0; \
    for(int i=0; i < colors.length() - 1;i++) \
    { \
        ColorStop currentColor = colors[i]; \
        ColorStop nextColor = colors[i+1]; \
        bool isInterpolating = currentColor.position <= factor && factor <= nextColor.position; \
        index = isInterpolating ? i : index; \
    } \
    ColorStop currentColor = colors[index]; \
    ColorStop nextColor = colors[index+1]; \
     float range = nextColor.position - currentColor.position; \
    float lerpFactor = (factor - currentColor.position)/range; \
    finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
    if(factor>1.0) \
    { \
        finalColor = colors[colors.length()-1].color; \
    } \
} \

// desaturate vector
const vec3 DESATURATE = vec3(0.2126, 0.7152, 0.0722);

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying float vDisplacement;

uniform sampler2D imageTexture;
uniform vec2 mousePos;
uniform float uTime;
uniform float resolution;
uniform float rotation;


float satan(in vec2 p, in float w) { // :)
    float a = abs(p.x) < 1e-8 ? RHO : atan(abs(p.y / p.x));
    float sy = 2.0 * smoothstep(-w, w, p.y) - 1.0;
    return abs(a + PI * min(0.0, sign(p.x))) * sy;
}

void main() {
    vec2 q = vUv;
    float unit = 0.004;

    float rot = 0.1 * (rotation/10.0);
    float co = cos(rot), si = sin(rot);
    q *= mat2(co, -si, si, co);

    gl_FragColor = vec4(0.5 * satan(q, unit) / PI + 0.1);
}

