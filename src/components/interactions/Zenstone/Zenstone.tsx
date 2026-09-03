import { Canvas, useLoader,useFrame} from "@react-three/fiber";
import { EffectComposer, DotScreen, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import "./Zenstone.css";
import munnarimage from "./Munnarcard_image.png";
import { useState, useRef,useEffect} from "react";
import Gyrocomponent from "./Gyrocomponent";
import VertexShader from './shaders/.vert?raw'
import FragmentShader from './shaders/.frag?raw'

// a plane with shader
type ShaderLayerProps = {
  mousePos : THREE.Vector2,
  resolution: number,
  rotation: number
}
const ShaderLayer = ({mousePos,resolution, rotation}:ShaderLayerProps) => {

  const myShader = {
  uniforms: {
    uTime : {value:0},
    mousePos: { value: new THREE.Vector2(0.5, 0.5) },
    resolution : {value: resolution},
    rotation: {value:rotation}
  },
  vertexShader: VertexShader,
  fragmentShader: FragmentShader
};
  const materialRef = useRef<THREE.ShaderMaterial | null >(null);

   useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.mousePos.value = mousePos;
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.resolution.value = resolution;
      materialRef.current.uniforms.rotation.value = rotation;
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
  const gyroData = Gyrocomponent();
  const [zoomLevel, setZoomLevel] = useState(0);

  useEffect(() => {
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
    <div ref={cardRef} className="maincard" onMouseMove={mouseMove} onTouchMove={touchMove}>
      <div className="herotext">
      </div>
      <div className="subtext">
        <div>Android: {gyroData.isAndroid?"yes":"no"}</div>
        <div>Alpha: {gyroData.alpha.toFixed(2)}</div>
        <div>Beta: {gyroData.beta.toFixed(2)}</div>
        <div>Gamma: {gyroData.gamma.toFixed(2)}</div>
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
        {/* <mesh position={[0, 0, 0]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={bgTexture} />
        </mesh> */}

        <EffectComposer>
          
          <ShaderLayer mousePos={mousePos} resolution={zoomLevel} rotation={parseFloat(gyroData.alpha.toFixed(1))}/>
          {/* <DotScreen scale={0.5}/> */}
          {/* <Bloom/> */}
        </EffectComposer>

        <ambientLight intensity={0.5} />
      </Canvas>
      {/* <img src="Munnar-card.png" alt="" /> */}
    </div>
  );
}
