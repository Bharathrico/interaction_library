precision mediump float;

#define PI 3.14159265

#define tau 6.28318530718

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


//caustics code taken from  - https://www.shadertoy.com/view/XttyRX
float sin01(float x) {
	return (sin(x*tau)+1.)/2.;
}
float cos01(float x) {
	return (cos(x*tau)+1.)/2.;
}

// rand func from theartofcode (youtube channel)
vec2 rand01(vec2 p) {
    vec3 a = fract(p.xyx * vec3(123.5, 234.34, 345.65));
    a += dot(a, a+34.45);
    
    return fract (vec2(a.x * a.y, a.y * a.z));
}

float circ(vec2 uv, vec2 pos, float r) {
    return smoothstep(r, 0., length(uv - pos));
}

float smoothFract(float x, float blurLevel) {
	return pow(cos01(x), 1./blurLevel);
}

float manDist(vec2 from, vec2 to) {
    return abs(from.x - to.x) + abs(from.y - to.y);
}


float distFn(vec2 from, vec2 to) {
	float x = length (from - to);
    return pow (x, 4.);
}

float voronoi(vec2 uv, float t, float seed, float size) {
    
    float minDist = 100.;
    
    float gridSize = size;
    
    vec2 cellUv = fract(uv * gridSize) - 0.5;
    vec2 cellCoord = floor(uv * gridSize);
    
    for (float x = -1.; x <= 1.; ++ x) {
        for (float y = -1.; y <= 1.; ++ y) {
            vec2 cellOffset = vec2(x,y);
            
            // Random 0-1 for each cell
            vec2 rand01Cell = rand01(cellOffset + cellCoord + seed);
			
            // Get position of point
            vec2 point = cellOffset + sin(rand01Cell * (t+10.)) * .5;
            
			// Get distance between pixel and point
            float dist = distFn(cellUv, point);
    		minDist = min(minDist, dist);
        }
    }
    
    return minDist;
}
// caustics function ends


void main()
{   
   
    // Displacement technique adapted from - https://www.shadertoy.com/view/Xsd3DB
    vec2 q = vUv;
    // blob code
    // gl_FragColor = vec4(texture2D(uBuffer,vUv).xyz,1.0);


    vec3 e = vec3(vec2(1.)/vec2(resolution),0.);
    float p10 = texture2D(uBuffer, q-e.zy).x;
    float p01 = texture2D(uBuffer, q-e.xz).x;
    float p21 = texture2D(uBuffer, q+e.xz).x;
    float p12 = texture2D(uBuffer, q+e.zy).x;
    
    // Totally fake displacement and shading:
    vec3 grad = normalize(vec3(p21 - p01, p12 - p10, 1.0));
    // vec4 c = vec4(0.1,0.1,0.1,1.0);
    float imgR = texture2D(imageTexture, vUv + grad.xy*.33+0.001).r;
    float imgG = texture2D(imageTexture, vUv + grad.xy*.36+0.002).g;
    float imgB = texture2D(imageTexture, vUv + grad.xy*.40+0.003).b;
    vec4 c = vec4(imgR,imgG,imgB,1.0);
    vec3 light = normalize(vec3(.2,-.5,.7));
    float diffuse = dot(grad,light);
    float spec = pow(max(0.,-reflect(light,grad).z),32.);
    vec4 finalColor = mix(c,vec4(0.5725, 0.702, 0.8196, 1.0),.25)*max(diffuse,0.5) + spec ;
    //brightness
    finalColor.rgb += 0.1;
    //contrast
    // finalColor.rgb = (finalColor.rgb - 0.5) * 1.6 -0.2;
    
     // caustics
    vec2 cUv = (vUv + grad.xy*.35)*2.;
    float t = uTime *1.2;
    
	// Distort uv coordinates
    float amplitude = .04;
    float turbulence = .03;
    cUv.xy += sin01(cUv.x*turbulence + t) * amplitude;
    cUv.xy -= sin01(cUv.y*turbulence + t) * amplitude;
    
	// Apply two layers of voronoi, one smaller   
    float v;
    float sizeDistortion = abs(cUv.x)/3.;
    v += voronoi(cUv+grad.xy*0.35, t * 2. , 0.5, 2.5 - sizeDistortion);
    v += voronoi(cUv+grad.xy*0.35, t * 4. , 0., 4. - sizeDistortion) / 2.;
    
    // Foreground color
    vec3 col = v * vec3(1.0, 1.0, 1.0);
    
    // Background color
    col += (1.-v) * finalColor.rgb;
    //caustics code ends
   
    gl_FragColor = vec4(col,1.0);

}

