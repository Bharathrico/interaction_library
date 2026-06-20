//glass shader mostly based on this tutorial - https://blog.olivierlarose.com/tutorials/3d-glass-effect

import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
// import { EffectComposer, DotScreen, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import "./Rippleeffect.css";
import { useState, useRef, useEffect, useMemo } from "react";
import VertexShader from "./shaders/.vert?raw";
import FragmentShader from "./shaders/.frag?raw";
import BufferVertexShader from "./shaders/buffer.vert?raw";
import BufferFragmentShader from "./shaders/buffer.frag?raw";
import {
  Plane,
  OrthographicCamera,
  useFBO,
  // shaderMaterial,
} from "@react-three/drei";
import backgroundImage from "./image.jpg"
import { useGSAP } from "@gsap/react"; // <-- import the hook from our React package


const Treesvg = () => {
  return (
    <svg
      style={{ height: "auto", width: "100%" }}
      viewBox="0 0 26 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g style={{ mixBlendMode: "plus-lighter" }}>
        <path d="M13 46L13 0" stroke="gray" strokeWidth="4" />
        <path
          d="M13 0V1C13 8.1797 7.1797 14 0 14"
          stroke="gray"
          strokeWidth="4"
        />
        <path
          d="M13 11V12C13 19.1797 7.1797 25 0 25"
          stroke="gray"
          strokeWidth="4"
        />
        <path
          d="M13 24C13 31.1797 7.1797 37 0 37"
          stroke="gray"
          strokeWidth="4"
        />
        <path
          d="M13 0V1C13 8.1797 18.8203 14 26 14"
          stroke="gray"
          strokeWidth="4"
        />
        <path
          d="M13 11V12C13 19.1797 18.8203 25 26 25"
          stroke="gray"
          strokeWidth="4"
        />
        <path
          d="M13 24C13 31.1797 18.8203 37 26 37"
          stroke="gray"
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
        <path d="M4.5 31L25.5 10L38.5 23" stroke="gray" strokeWidth="2.32" />
        <circle
          cx="14.3538"
          cy="7.35383"
          r="4.35383"
          stroke="gray"
          strokeWidth="2.32204"
        />
        <path d="M-3.5 22.5L5 14L13 22" stroke="gray" strokeWidth="2.32" />
      </g>
      <defs>
        <clipPath id="clip0_152_767">
          <rect width="29" height="27" fill="gray" />
        </clipPath>
      </defs>
    </svg>
  );
};


// a plane with shader
type ShaderLayerProps = {
  mousePos: THREE.Vector2;
  hovering: boolean;
  resolution: number;
};

function BufferPass({ mousePos, hovering, resolution }: ShaderLayerProps) {
  const fbomain = useFBO(128, 128, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter
  });
  const fbocopy = useFBO(128,128,  {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter
  });
  const { gl } = useThree();
  const frameRef = useRef(false);
  const frameCount = useRef(0.0); 

  const bufferScene = useMemo(() => new THREE.Scene(), []);
  const bufferCamera = useMemo(
    () => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
    [],
  );
  bufferCamera.updateProjectionMatrix()


  const bufferMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          mousePos: { value: mousePos },
          hovering: { value: hovering },
          resolution: {
            value: 128
          },
          uBufferA:{value:null},
          uBufferB:{value:null},
          uFrame : {value:0.0}
        },
        vertexShader: BufferVertexShader,
        fragmentShader: BufferFragmentShader,
      }),
    [hovering,mousePos],
  );

  useMemo(() => {
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2,2), bufferMaterial);
    bufferScene.add(quad);
  }, [bufferScene, bufferMaterial]);
  useFrame((state) => {

    const read = frameRef.current ? fbocopy : fbomain
    const write = frameRef.current ? fbomain : fbocopy
    
    bufferMaterial.uniforms.uBufferA.value = read.texture;
    // bufferMaterial.uniforms.uBufferB.value = write.texture;
    bufferMaterial.uniforms.mousePos.value = mousePos;
    bufferMaterial.uniforms.resolution.value = 128;
    bufferMaterial.uniforms.hovering.value = hovering;
    bufferMaterial.uniforms.uTime.value = state.clock.elapsedTime;
   
    console.log(frameCount.current);
    bufferMaterial.uniforms.uFrame.value = frameCount.current;

    frameCount.current+=1.0;

    frameRef.current = !frameRef.current;
     gl.setRenderTarget(write);
    gl.render(bufferScene, bufferCamera);
    gl.setRenderTarget(null);


  });    

  return {renderTarget:fbomain};
}

const ShaderLayer = ({ mousePos, hovering, resolution }: ShaderLayerProps) => {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const {renderTarget} = BufferPass({mousePos,hovering,resolution});
  
  const myShader = {
    uniforms: {
      uTime: { value: 0 },
      mousePos: { value: new THREE.Vector2(0.5, 0.5) },
      hovering: { value: false },
      resolution: { value: document.getElementById("ripplecard")?.clientWidth },
      uBuffer: { value: renderTarget.texture },
      imageTexture : {value: useLoader(THREE.TextureLoader, backgroundImage)}
      
    },
    vertexShader: VertexShader,
    fragmentShader: FragmentShader,
  };
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.mousePos.value = mousePos;
      materialRef.current.uniforms.resolution.value = resolution;
      materialRef.current.uniforms.hovering.value = hovering;
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uBuffer.value = renderTarget.texture;
    }
  });

  return (
    <mesh>
      <Plane args={[1, 1]}>
        <shaderMaterial
          // onBeforeCompile={(shader) => {
            //  shader.fragmentShader = shader.fragmentShader.replace('gl_FragColor = vec4(finalColor,1.0) ;','gl_FragColor = vec4(1,1,0,1) ;')
          // }}
          depthWrite={false}
          ref={materialRef}
          args={[myShader]}
          transparent
        />
      </Plane>
    </mesh>
  );
};

export default function Wavecard() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState(new THREE.Vector2(0.5, 0.5));
  const [hovering, setHovering] = useState(false);
  // const [buttonhover, setButtonhover] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0);
  //  const roughnessMap = useLoader(THREE.TextureLoader, scratchImage);
  useGSAP({});
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

  const mouseMove = (e: { clientX: number; clientY: number }) => {
    if (
      cardRef.current?.getBoundingClientRect() &&
      e.clientX < cardRef.current?.getBoundingClientRect().right &&
      e.clientX > cardRef.current?.getBoundingClientRect().left &&
      e.clientY < cardRef.current?.getBoundingClientRect().bottom &&
      e.clientY > cardRef.current?.getBoundingClientRect().top
    ) {
      const clickPosX =
        e.clientX - cardRef.current?.getBoundingClientRect().left;
      const clickPosY =
        e.clientY - cardRef.current?.getBoundingClientRect().top;
      const x =
        clickPosX /
        (cardRef.current?.getBoundingClientRect().right -
          cardRef.current?.getBoundingClientRect().left);
      const y =
        1 -
        clickPosY /
          (cardRef.current?.getBoundingClientRect().bottom -
            cardRef.current?.getBoundingClientRect().top);
      setMousePos(new THREE.Vector2(x, y));
    } 
  };

  const touchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.changedTouches) {
      const touch = e.changedTouches[0];
      if (
        cardRef.current?.getBoundingClientRect() &&
        touch.clientX < cardRef.current?.getBoundingClientRect().right &&
        touch.clientX > cardRef.current?.getBoundingClientRect().left &&
        touch.clientY < cardRef.current?.getBoundingClientRect().bottom &&
        touch.clientY > cardRef.current?.getBoundingClientRect().top
      ) {
        const touchPosX =
          touch.clientX - cardRef.current?.getBoundingClientRect().left;
        const touchPosY =
          touch.clientY - cardRef.current?.getBoundingClientRect().top;
        const x =
          touchPosX /
          (cardRef.current?.getBoundingClientRect().right -
            cardRef.current?.getBoundingClientRect().left);
        const y =
          1 -
          touchPosY /
            (cardRef.current?.getBoundingClientRect().bottom -
              cardRef.current?.getBoundingClientRect().top);
        setHovering(true);
        setMousePos(new THREE.Vector2(x, y));
      }
    }
  };

  return (
    <div
      ref={cardRef}
      id="ripplecard"
      className="maincard"
      onMouseMove={mouseMove}
      onTouchStart={touchMove}
      onTouchMove={touchMove}
      onTouchEnd={() => setHovering(false)}
      onMouseDown={() => setHovering(true)}
      onMouseUp={() => setHovering(false)}
      onMouseOut={() => setHovering(false)}
    >
      <div className="herotext">
        <div>
          Kolukku{" "}
          <span style={{height:"100%",maxWidth:"30%", width:"auto",minWidth:"10%"}}>
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
      <Canvas
        className="mountaincard-canvas"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: "0",
          left: "0",
          background: "#fff",
          boxShadow: " inset 0 0 10px 10px rgb(255, 255, 255) ",
        }}
      >
        <OrthographicCamera
          makeDefault
          position={[0, 0, 3]}
          zoom={zoomLevel} //zoomLevel adapts as per the canvas size
        />
        <ShaderLayer
          mousePos={mousePos}
          hovering={hovering}
          resolution={zoomLevel}
        />
        <directionalLight
          color="#232323"
          intensity={1}
          position={[0, -2, -2]}
        />
        <directionalLight color="#232323" intensity={1} position={[0, 2, -2]} />
        <spotLight
          penumbra={0.2}
          intensity={2}
          position={[hovering ? (mousePos.x - 0.5) * 5 : 0, 2, 0]}
        />
        <spotLight
          penumbra={0.7}
          intensity={0.2}
          position={[hovering ? (mousePos.x - 0.5) * 5 : 0, 2, 0]}
        />
        <spotLight
          penumbra={0.1}
          intensity={1}
          position={[hovering ? -(mousePos.x - 0.5) * 5 : 0, -2, 0]}
        />

        {/* <EffectComposer>
          <DotScreen scale={0.5} /> */}
        {/* <Bloom /> */}
        {/* </EffectComposer> */}
        {/* <OrbitControls/> */}
      </Canvas>
      {/* <img src="Munnar-card.png" alt="" /> */}
    </div>
  );
}
