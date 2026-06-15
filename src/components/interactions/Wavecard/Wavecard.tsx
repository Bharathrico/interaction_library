import { Canvas, useLoader,useFrame} from "@react-three/fiber";
import { EffectComposer, DotScreen, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import "./Wavecard.css";
import munnarimage from "./Munnarcard_image.png";
import { useState, useRef} from "react";
import VertexShader from './shaders/.vert?raw'
import FragmentShader from './shaders/.frag?raw'


// a plane with shader
type ShaderLayerProps = {
  mousePos : THREE.Vector2,
  hovering : boolean
}
const ShaderLayer = ({mousePos, hovering}:ShaderLayerProps) => {

  const myShader = {
  uniforms: {
    uTime : {value:0},
    mousePos: { value: new THREE.Vector2(0.5, 0.5) },
    hovering: {value:false}
  },
  vertexShader: VertexShader,
  fragmentShader: FragmentShader
};
  const materialRef = useRef<THREE.ShaderMaterial | null >(null);

   useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.mousePos.value = mousePos;
      materialRef.current.uniforms.hovering.value = hovering;
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return(
    <mesh>
      <planeGeometry args={[1,1,1,1]} />
      <shaderMaterial depthWrite={false} transparent ref={materialRef} args={[myShader]}/>
    </mesh>
  )
}


export default function Wavecard() {

  const cardRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState(new THREE.Vector2(0.5, 0.5));
  const [hovering, setHovering] = useState(false);
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
    setHovering(true);
    setMousePos(new THREE.Vector2(x, y));
    }
    else
    {
      setHovering(false);
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
    setHovering(true);
    }
    else
    {
      setHovering(false);
    }
  }
}
  return (
    <div ref={cardRef} className="maincard" onMouseDown={mouseMove} onTouchMove={touchMove} >
      <div className="herotext">
          Liquid.
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

        <EffectComposer>
          
          <ShaderLayer mousePos={mousePos} hovering={hovering}/>
          <DotScreen scale={0.5}/>
          <Bloom/>
        </EffectComposer>

        <ambientLight intensity={0.5} />
      </Canvas>
      {/* <img src="Munnar-card.png" alt="" /> */}
    </div>
  );
}
