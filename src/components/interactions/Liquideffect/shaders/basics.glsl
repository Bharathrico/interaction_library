precision mediump float;

// desaturate vector
const vec3 DESATURATE = vec3(0.2126, 0.7152, 0.0722);

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;


uniform sampler2D imageTexture;
uniform vec2 mousePos;
uniform float uTime;


struct ColorStop{
    vec3 color;
    float position;
};

// a simple line drawing function
vec3 drawLine(float inputValue, float thickness)
{
    return vec3(step(thickness,abs(inputValue-0.5)));
}

// centerpoint takes mousePos to track the mouse movement, 
// other wise intended center point to be added
vec3 drawCircle(vec2 inputValue, float thickness, vec2 centerPoint)
{
    return vec3(smoothstep(thickness-0.005,thickness,distance(inputValue,centerPoint)));
}


// to create an box SDF
vec3 sdBox( in vec2 p, in vec2 b, float thickness, float radius )
{
    vec2 d = abs(p)-b;
    return vec3(smoothstep(thickness-0.005,thickness,pow(length(max(d,0.0)) + min(max(d.x,d.y),0.0),radius)));
}

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

void main()
{   
    ColorStop[3] colors = ColorStop[](
        ColorStop(vec3(0.132, 0.015, 0.24),0.0),
        ColorStop(vec3(0.82, 0.17, 0.51),0.5),
        ColorStop(vec3(0.96, 0.75, 0.45),1.0)
    );

    vec3 finalColor;
    vec2 uv = vUv;
    uv -= mousePos;
    ColorRamp(colors, smoothstep(0.0,0.99,fract(length(uv)*20.0)), finalColor);
    vec3 newPosition = normalize(cameraPosition-vPosition);
    float fresnel = dot(newPosition, vNormal);
    //drawCircle(uv, 0.2,mousePos)
    // smoothstep(0.2-0.005,0.2,distance(vUv,mousePos))
    vec3 colorImage = texture2D(imageTexture, vUv).xyz;
    float bwImage = dot(DESATURATE, colorImage);
    gl_FragColor = vec4(vec3(bwImage),1.0  );

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}

