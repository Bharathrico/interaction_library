//glass shader mostly based on this tutorial - https://blog.olivierlarose.com/tutorials/3d-glass-effect

import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
// import { EffectComposer, DotScreen, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import "./Wavecard.css";
import { useState, useRef, useEffect } from "react";
// import scratchImage from "./scratch.jpg";
import VertexShader from "./shaders/.vert?raw";
import FragmentShader from "./shaders/.frag?raw";
import {
  MeshTransmissionMaterial,
  Plane,
  RoundedBox,
  OrthographicCamera,
  type MeshTransmissionMaterialProps,
} from "@react-three/drei";
import gsap from "gsap"; // <-- import GSAP
import { useGSAP } from "@gsap/react"; // <-- import the hook from our React package

// a plane with shader
type ShaderLayerProps = {
  mousePos: THREE.Vector2;
  hovering: boolean;
};
const ShaderLayer = ({ mousePos, hovering }: ShaderLayerProps) => {
  const myShader = {
    uniforms: {
      uTime: { value: 0 },
      mousePos: { value: new THREE.Vector2(0.5, 0.5) },
      hovering: { value: false },
    },
    vertexShader: VertexShader,
    fragmentShader: FragmentShader,
  };
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.mousePos.value = mousePos;
      materialRef.current.uniforms.hovering.value = hovering;
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh>
      <Plane args={[1, 1]}>
        <shaderMaterial
          // onBeforeCompile={(shader)=>{
            //  console.log("exec");
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
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const materialRef =
    useRef<MeshTransmissionMaterialProps | ThreeElements['meshTransmissionMaterial']>(null);
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
  

  //
  // onBeforeCompile for Transmission button
  useEffect(() => {
    if (!materialRef.current) return

    const mat = materialRef.current
    const originalOnBeforeCompile = mat.onBeforeCompile?.bind(mat)

    mat.onBeforeCompile = (shader, renderer) => {
      // Call the original first — critical for MeshTransmissionMaterial
      originalOnBeforeCompile(shader, renderer)
      // Now inject your modifications
      
      if(mat.userData)
      {
      mat.userData.shader = shader;
      }
      shader.uniforms.uTime = { value: 0 }
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_pars_fragment>',
        `
          // your custom GLSL here
          #include <color_pars_fragment>
          uniform float uTime;
        `
      )
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        `
          // your custom GLSL here
          #include <color_fragment>
          // diffuseColor.rgb = vec3(1,1,0);
        `
      )
    }

    // Force recompile
    mat.needsUpdate = true
  })

  // onBeforeCompile for Transmission button ends


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
      setHovering(true);
      setMousePos(new THREE.Vector2(x, y));
    } else {
      setHovering(false);
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

  const buttonHoverIn = () => {
    if (materialRef.current) {
      console.log(materialRef);

      gsap.to(materialRef.current, {
        distortion: 0.4,
        roughness: 0.1,
        chromaticAberration: 0.7,
        duration: 0.4,
        ease: "sine.inOut",
      });
      if (materialRef.current.color) {
        gsap.to(materialRef.current.color, {
          r: 0.298,
          g: 0.322,
          b: 0.38,
          duration: 0.4,
          ease: "sine.inOut",
        });
      }
    }
  };
  const buttonHoverOut = () => {
    if (materialRef.current) {
      gsap.to(materialRef.current, {
        distortion: 0.2,
        roughness: 0.0,
        chromaticAberration: 0.04,
        duration: 0.4,
        ease: "sine.inOut",
      });

      if (materialRef.current.color) {
        gsap.to(materialRef.current.color, {
          r: 0.522,
          g: 0.565,
          b: 0.663,
          duration: 0.4,
          ease: "sine.inOut",
        });
      }
    }
  };
  return (
    <div
      ref={cardRef}
      className="maincard"
      onMouseMove={mouseMove}
      onTouchMove={touchMove}
      onTouchEnd={() => setHovering(false)}
      onMouseDown={() => setHovering(true)}
      onMouseOut={() => setHovering(false)}
    >
      <div
        ref={buttonRef}
        className="herotext"
        // onMouseOver={() => setButtonhover(true)}
        // onMouseLeave={()=>setButtonhover(false)}
        // onTouchStart={()=>setButtonhover(true)}
        // onTouchEnd={() => setButtonhover(false)}
        onMouseOver={() => {
          buttonHoverIn();
        }}
        onMouseLeave={() => {
          buttonHoverOut();
        }}
        onTouchStart={() => {
          buttonHoverIn();
        }}
        onTouchEnd={() => {
          buttonHoverOut();
        }}
        onMouseOut={() => {
          buttonHoverOut();
        }}
        // onMouseUp={() => {
        //   buttonHoverOut();
        // }}
        onClick={(event) => {
          event.preventDefault();
        }}
      >
        Wave.
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
          // borderRadius: "20%",
          // background: "transparent",
          boxShadow: " inset 0 0 10px 10px rgb(255, 255, 255) ",
        }}
      >
        <OrthographicCamera
          makeDefault
          position={[0, 0, 3]}
          zoom={zoomLevel} //zoomLevel adapts as per the canvas size
        />
        <ShaderLayer mousePos={mousePos} hovering={hovering} />
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
        <mesh position={[0, -0.28, 2]}>
          <RoundedBox
            args={[0.8, 0.3, 0.4]} // width, height, depth
            radius={0.1} // radius of rounded corners
            steps={2} // extrusion steps
            smoothness={4} // curve segments
            bevelSegments={4} // number of bevel segments (0 = no bevel)
          >
            <MeshTransmissionMaterial
              ref={materialRef}
              color={"#9daac8"}
              thickness={0.2}
              roughness={0.04}
              transmission={1.0}
              ior={1.2}
              distortion={0.2}
              chromaticAberration={0.04}
              
              // roughnessMap={roughnessMap}
            />
          </RoundedBox>
        </mesh>

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
