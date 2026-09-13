//glass shader mostly based on this tutorial - https://blog.olivierlarose.com/tutorials/3d-glass-effect

import { Canvas, useFrame, useLoader} from "@react-three/fiber";
// import { EffectComposer, DotScreen, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import "./Holecard.css";
import { useState, useRef, useEffect } from "react";
import {
  OrthographicCamera,
} from "@react-three/drei";
import dotpattern from "./dotpattern.png";
import topbit from "./topbit.png";
import bottombit from "./bottombit.png";
import { useGSAP } from "@gsap/react"; // <-- import the hook from our React package

function Cube() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Optional: spin the cube every frame
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[0.3,0.3,0.3]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function Holecard() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  // const [buttonhover, setButtonhover] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0);
  //  const roughnessMap = useLoader(THREE.TextureLoader, scratchImage);
  const backgroundImage  = useLoader(THREE.TextureLoader,dotpattern);
  const bottomImage  = useLoader(THREE.TextureLoader,bottombit);
  const topImage  = useLoader(THREE.TextureLoader,topbit);
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
    
    <div ref={cardRef} className="maincard">
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

        
          <mesh position={[0, 0, -1]}>
          <planeGeometry args={[1.2,1.2]} />
          <meshBasicMaterial map={topImage} transparent/>
        </mesh>
        <mesh position={[0, 0, 1]}>
          <planeGeometry args={[1.2,1.2]} />
          <meshBasicMaterial map={bottomImage} transparent />
        </mesh>

        <Cube/>
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

        {/* <EffectComposer>
          <DotScreen scale={0.5} /> */}
          {/* <Bloom /> */}
        {/* </EffectComposer> */}
        {/* <OrbitControls/> */}
      </Canvas>
      </div>
  );
}
