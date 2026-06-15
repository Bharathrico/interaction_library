precision mediump float;



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


void main()
{   
    ColorStop[3] colors = ColorStop[](
        ColorStop(vec3(0.0, 0.0, 0.0),0.0),
        ColorStop(vec3(0.220, 0.486, 0.984),0.5),
        ColorStop(vec3(0.0, 0.0, 0.0),1.0)
    );

    
    vec3 finalColor;
    ColorRamp(colors, vDisplacement, finalColor);
    gl_FragColor = vec4(finalColor,1.0  );
}

