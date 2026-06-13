precision mediump float;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

uniform vec2 mousePos;
uniform float uTime;

struct ColorStop{
    vec3 color;
    float position;
};

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
} \

void main()
{   
    ColorStop[3] colors = ColorStop[](
        ColorStop(vec3(0.132, 0.015, 0.24),0.0),
        ColorStop(vec3(0.82, 0.17, 0.51),0.5),
        ColorStop(vec3(0.96, 0.75, 0.45),1.0)
    );

    vec3 finalColor;
    ColorRamp(colors, vUv.y, finalColor);
    vec2 uv = vUv;
    uv -= mousePos;
    gl_FragColor = vec4(vec3(length(uv)),1.0);
}