import { Canvas, useLoader,useFrame} from "@react-three/fiber";
import { EffectComposer, DotScreen, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import "./Mountaincard.css";
import munnarimage from "./Munnarcard_image.png";
import { useState, useRef} from "react";
import VertexShader from './shaders/.vert?raw'
import FragmentShader from './shaders/.frag?raw'

const Treesvg = () => {
  return (
    <svg
      style={{ height: "auto", width: "100%" }}
      viewBox="0 0 26 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g style={{ mixBlendMode: "plus-lighter" }}>
        <path d="M13 46L13 0" stroke="white" strokeWidth="4" />
        <path
          d="M13 0V1C13 8.1797 7.1797 14 0 14"
          stroke="white"
          strokeWidth="4"
        />
        <path
          d="M13 11V12C13 19.1797 7.1797 25 0 25"
          stroke="white"
          strokeWidth="4"
        />
        <path
          d="M13 24C13 31.1797 7.1797 37 0 37"
          stroke="white"
          strokeWidth="4"
        />
        <path
          d="M13 0V1C13 8.1797 18.8203 14 26 14"
          stroke="white"
          strokeWidth="4"
        />
        <path
          d="M13 11V12C13 19.1797 18.8203 25 26 25"
          stroke="white"
          strokeWidth="4"
        />
        <path
          d="M13 24C13 31.1797 18.8203 37 26 37"
          stroke="white"
          strokeWidth="4"
        />
      </g>
    </svg>
  );
};

const Mountainsvg = () => {
  return (
    <svg
      style={{ height: "100%", width: "auto" }}
      viewBox="0 0 29 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_152_767)">
        <path d="M4.5 31L25.5 10L38.5 23" stroke="white" strokeWidth="2.32" />
        <circle
          cx="14.3538"
          cy="7.35383"
          r="4.35383"
          stroke="white"
          strokeWidth="2.32204"
        />
        <path d="M-3.5 22.5L5 14L13 22" stroke="white" strokeWidth="2.32" />
      </g>
      <defs>
        <clipPath id="clip0_152_767">
          <rect width="29" height="27" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};





// a plane with shader
type ShaderLayerProps = {
  mousePos : THREE.Vector2,
}
const ShaderLayer = ({mousePos}:ShaderLayerProps) => {

  const myShader = {
  uniforms: {
    uTime : {value:0},
    mousePos: { value: new THREE.Vector2(0.5, 0.5) },
    imageTexture : {value: useLoader(THREE.TextureLoader, munnarimage)}
  },
  vertexShader: VertexShader,
  fragmentShader: FragmentShader
};
  const materialRef = useRef<THREE.ShaderMaterial | null >(null);

   useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.mousePos.value = mousePos;
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return(
    <mesh>
      <planeGeometry args={[1,1,100,100]}></planeGeometry>
      <shaderMaterial depthWrite={false} transparent ref={materialRef} args={[myShader]}/>
    </mesh>
  )
}


export default function Mountaincard() {

  const cardRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState(new THREE.Vector2(0.5, 0.5));

  const mouseMove = (e: { clientX: number; clientY: number; }) => {
    if(
      cardRef.current?.getBoundingClientRect() &&
      e.clientX < cardRef.current?.getBoundingClientRect().right &&
      e.clientX > cardRef.current?.getBoundingClientRect().left &&
      e.clientY < cardRef.current?.getBoundingClientRect().bottom &&
      e.clientY > cardRef.current?.getBoundingClientRect().top)
      {
        const clickPosX = e.clientX-cardRef.current?.getBoundingClientRect().left;
    const clickPosY = e.clientY-cardRef.current?.getBoundingClientRect().top;
    const x = clickPosX/ (cardRef.current?.getBoundingClientRect().right-cardRef.current?.getBoundingClientRect().left);
    const y = 1 - clickPosY / (cardRef.current?.getBoundingClientRect().bottom-cardRef.current?.getBoundingClientRect().top);
    console.log(x,y);
    setMousePos(new THREE.Vector2(x, y));
    }
  };

  const touchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if(e.changedTouches )
    {
    const touch = e.changedTouches[0];
    if(
      cardRef.current?.getBoundingClientRect() &&
      touch.clientX < cardRef.current?.getBoundingClientRect().right &&
      touch.clientX > cardRef.current?.getBoundingClientRect().left &&
      touch.clientY < cardRef.current?.getBoundingClientRect().bottom &&
      touch.clientY > cardRef.current?.getBoundingClientRect().top)
    {
    const touchPosX = touch.clientX-cardRef.current?.getBoundingClientRect().left;
    const touchPosY = touch.clientY-cardRef.current?.getBoundingClientRect().top;
    const x = touchPosX/ (cardRef.current?.getBoundingClientRect().right-cardRef.current?.getBoundingClientRect().left);
    const y = 1 - touchPosY / (cardRef.current?.getBoundingClientRect().bottom-cardRef.current?.getBoundingClientRect().top);
    console.log(x,y);
    setMousePos(new THREE.Vector2(x, y));
    }
  }
}
  const bgTexture = useLoader(THREE.TextureLoader, munnarimage);
  return (
    <div ref={cardRef} className="mountaincard" onMouseMove={mouseMove} onTouchMove={touchMove}>
      <div className="herotext">
        <div>
          Kolukku{" "}
          <span style={{height:"100%",maxWidth:"30%", width:"auto"}}>
            <Mountainsvg />
          </span>
        </div>
        <div>
          <span style={{maxWidth:"45%", gap:"5%"}}>
            <Treesvg />
            <Treesvg />
            <Treesvg />
            <Treesvg />
          </span>
          Malai
        </div>
      </div>
      <div className="subtext">
        <div>Tue, 15 Sep</div>
        <div>Munnar</div>
      </div>
      <Canvas
        className="mountaincard-canvas"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: "0",
          left: "0",
          // borderRadius: "20%",
          background: "transparent",
          boxShadow: " inset 0 0 10px 10px rgb(255, 255, 255) "
        }}
        camera={{fov:11}}
      >
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={bgTexture} />
        </mesh>

        <EffectComposer>
          
          <ShaderLayer mousePos={mousePos}/>
          <DotScreen scale={0.5}/>
          <Bloom/>
        </EffectComposer>

        <ambientLight intensity={0.5} />
      </Canvas>
      {/* <img src="Munnar-card.png" alt="" /> */}
    </div>
  );
}
