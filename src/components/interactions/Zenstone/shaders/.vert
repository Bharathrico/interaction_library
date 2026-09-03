precision mediump float;

uniform float uTime;



varying vec3 vPosition;
//more like uvu
varying vec2 vUv;
varying vec3 vNormal;



void main() {
    // varyings
    vPosition = position;
    vNormal = normal;
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}