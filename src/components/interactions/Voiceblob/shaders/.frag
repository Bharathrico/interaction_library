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
uniform float audioLevel;



vec3 blendScreen(vec3 base, vec3 blend) {
    return 1.0 - (1.0 - base) * (1.0 - blend);
}

vec3 blendMultiply(vec3 base, vec3 blend) {
    return base * blend;
}

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




// 2D hash function - returns a pseudo-random 2D vector per cell
vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453123);
}

// Basic Voronoi: returns distance to nearest feature point,
// plus a per-cell id (useful for coloring each cell differently)
vec2 voronoi(vec2 st) {
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    float minDist = 8.0;
    vec2 minPoint;
    vec2 cellId;

    // Check the 3x3 neighborhood of cells around this pixel
    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));

            // Random point inside this neighboring cell
            vec2 point = hash2(i_st + neighbor);

            // Animate the points if you want movement (optional):
            // point = 0.5 + 0.5 * sin(uTime + 6.2831 * point);

            vec2 diff = neighbor + point - f_st;
            float dist = length(diff);

            if (dist < minDist) {
                minDist = dist;
                minPoint = point;
                cellId = i_st + neighbor;
            }
        }
    }

    return vec2(minDist, hash2(cellId).x); // distance, pseudo-random cell id
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

  float distx = length(uv);
  float disty = length(uv-vec2(0.1));
  float distz = length(uv+vec2(0.2));

  // Smooth edge (anti-aliased) circle: 1.0 inside, 0.0 outside
  float circleOne = 1.0 - smoothstep(0.3 - 0.004, 0.3 + 0.004, distx);
  float circleTwo = 1.0 - smoothstep(0.2- 0.1+(audioLevel*0.5), 0.2+ 0.1+(audioLevel*0.5), disty);
  float circleThree = 1.0 - smoothstep(0.2- 0.3+(audioLevel*0.2), 0.2+ 0.3+(audioLevel*0.2), distz);
  
  float circleMask = 1.0 - smoothstep(0.2 - 0.005, 0.2 + 0.005, length(uv));
  
  vec3 background = vec3(1.0); // white background
  vec3 black = vec3(0.0);
  vec3 red = vec3(1.,0.463,0.082);
  vec3 darkRed = vec3(0.875,0.047,0.047);
  vec3 blue = vec3(1.,0.604,0.082);

     vec2 st = vUv * (5.0);//scale
    float n = snoise(st+uTime * 0.2) * 0.5 + 0.5; // remap from [-1,1] to [0,1]
    vec3 circleOnePlane = mix(black, red, circleOne);
    vec3 circleTwoPlane = mix(black, blue, circleTwo);
    vec3 circleThreePlane = mix(background, darkRed, circleThree);
//   gl_FragColor = vec4(color, 1.0);
    
    //voronoi implementation
    st = vUv * 8.0; // scale = number of cells across

    vec2 result = voronoi(vec2(n)+uTime*0.2);
    float dist = result.x;
    float cellId = result.y;

    // Option A: plain distance field (classic mottled/cell look)
    vec3 color = vec3(dist);
    vec3 maskedCircle = mix(background,blendMultiply(blendScreen(circleOnePlane,circleTwoPlane),circleThreePlane),circleMask );
    gl_FragColor = vec4( maskedCircle,1.0);
}

