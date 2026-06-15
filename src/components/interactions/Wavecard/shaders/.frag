precision lowp float;

#define PI 3.14159265

#define MAX_POINTS 6

struct ColorStop{
    vec3 color;
    float position;
};

struct MouseTrack{
    vec2 position;
    float time;
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

uniform vec2 mousePos;
uniform float uTime;
uniform bool hovering;


MouseTrack[MAX_POINTS] track = MouseTrack[](
    MouseTrack(vec2(0),0.0),
    MouseTrack(vec2(0),0.0),
    MouseTrack(vec2(0),0.0),
    MouseTrack(vec2(0),0.0),
    MouseTrack(vec2(0),0.0),
    MouseTrack(vec2(0),0.0)
);

int trackindex = 0;

void addTrack(vec2 p)
{
    if(trackindex<MAX_POINTS)
    {   
        if(trackindex>0)
        {
        if(uTime-track[trackindex-1].time>2.0)
        {
        track[trackindex].position = p;
        track[trackindex].time = uTime;
        trackindex++;
        }
        }
        else if(trackindex==0)
        {
        track[trackindex].position = p;
        track[trackindex].time = uTime;
        trackindex++;
        }
    }
    else
    {
        trackindex=0;
    }
}

//	Classic Perlin 3D Noise 
//	by Stefan Gustavson
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float noise(vec3 P){
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}
//perlin noise ends

// Map function for GLSL
float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

//smooth mod function
float smoothMod(float axis, float amp, float rad)
{
    float top =  cos(PI * (axis / amp)) * sin( PI * (axis / amp));
    float bottom = pow(sin(PI * (axis / amp)),2.0) + pow(rad, 2.0);
    float at = atan(top/bottom);
    return amp * (1.0/2.0) - (1.0/PI) * at;
}

//fit function
float fit(float unscaled, float originalMin, float originalMax, float minAllowed, float maxAllowed)
{
    return (maxAllowed-minAllowed) * (unscaled-originalMin)/(originalMax - originalMin) + minAllowed;
}

//wave function 
float wave(vec3 position)
{
    return fit(smoothMod(position.y*6.0,1.0,1.5),0.35,0.6,0.0,1.0);
}


void main()
{   
    ColorStop[3] colors = ColorStop[](
        ColorStop(vec3(0.0, 0.0, 0.0),0.0),
        ColorStop(vec3(0.220, 0.486, 0.984),0.5),
        ColorStop(vec3(0.0, 0.0, 0.0),1.0)
    );
     vec3 coords = vPosition;
    coords.z+=uTime/10.0;
    coords += noise(coords);
    if(hovering)
    {
    addTrack(mousePos);
    }
    for(int i=0;i<MAX_POINTS;i++)
    {   
       if(trackindex>0)
       {
       if((uTime-track[i].time)<6.0)
       {
        coords *= vec3(length(vUv-track[i].position));
        }
        else
        {
            coords *= vec3(1.0);
        }   
        }
    }
    
    float adjustedPattern = wave(coords);
    vec3 finalColor;
    ColorRamp(colors, adjustedPattern, finalColor);
    gl_FragColor = vec4(finalColor,1.0  );
}

