//glass shader mostly based on this tutorial - https://blog.olivierlarose.com/tutorials/3d-glass-effect

import { Canvas, useFrame, useLoader} from "@react-three/fiber";
import { EffectComposer, DotScreen, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import "./Voiceblob.css";
import { useState, useRef, useEffect } from "react";
import {
  OrthographicCamera,
} from "@react-three/drei";
import { useGSAP } from "@gsap/react"; // <-- import the hook from our React package

import munnarimage from "./Munnarcard_image.png";
import VertexShader from './shaders/.vert?raw'
import FragmentShader from './shaders/.frag?raw'

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



export default function Voiceblob() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  // const [buttonhover, setButtonhover] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0);

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

  useGSAP({});
  useEffect(() => {
    console.log("in")
    if (zoomLevel == 0) {
      if (cardRef.current) {
        setZoomLevel(cardRef.current?.clientWidth);
      }
    }
    const handleResize = () => {
      if (cardRef.current) {
        setZoomLevel(cardRef.current?.clientWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [zoomLevel]);

  return (
    
    <div ref={cardRef} className="maincard" onMouseMove={mouseMove} onTouchMove={touchMove}>
      <Canvas
        className="mountaincard-canvas"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: "0",
          left: "0",
          background: "#fff",
          padding:"0",
          // borderRadius: "20%",
          // background: "transparent",
          boxShadow: " inset 0 0 10px 10px rgb(255, 255, 255) ",
        }}
      >
        <OrthographicCamera
          makeDefault
          
          position={[0, 0, 5]}
          zoom={zoomLevel} //zoomLevel adapts as per the canvas size
        />

        <ambientLight color="#fff" intensity={1}/>
        
        <directionalLight
          color="#494949"
          intensity={1}
          position={[0, -2, -2]}
        />
        <directionalLight color="#232323" intensity={1} position={[0, 2, -2]} />
        <spotLight
          penumbra={0.2}
          intensity={2}
          position={[0, 2, 0]}
        />

        <EffectComposer>
            <ShaderLayer mousePos={mousePos}/>
          {/* <DotScreen scale={0.5} /> */}
          <Bloom />
        </EffectComposer>
        {/* <OrbitControls/> */}
      </Canvas>
      </div>
  );
}
