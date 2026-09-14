precision highp float;



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



// Simplex 2D noise — Ashima Arts / Stefan Gustavson
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
      + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}



void main()
{   
    // ColorStop[3] colors = ColorStop[](
    //     ColorStop(vec3(0.0, 0.0, 0.0),0.0),
    //     ColorStop(vec3(0.220, 0.486, 0.984),0.5),
    //     ColorStop(vec3(0.0, 0.0, 0.0),1.0)
    // );

    
    // Center UV coords around (0,0), correct for aspect ratio
  vec2 uv = vUv - 0.5;

  float dist = length(uv);

  // Smooth edge (anti-aliased) circle: 1.0 inside, 0.0 outside
  float circle = 1.0 - smoothstep(0.2 - 0.004, 0.2 + 0.005, dist);

  vec3 background = vec3(1.0); // white background
  vec3 black = vec3(0.0);

  

     vec2 st = vUv * (5.0);
    float n = snoise(st+uTime * 0.2) * 0.5 + 0.5; // remap from [-1,1] to [0,1]
    vec3 color = mix(background, vec3(n), circle);
//   gl_FragColor = vec4(color, 1.0);
gl_FragColor = vec4(color, 1.0);
}

