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
import backgroundImage from "./image.jpg";
import { useGSAP } from "@gsap/react"; // <-- import the hook from our React package
import displacementMap from './displacement.png';

type svgRes = {
 resolution :number 
}

const SurfLogo = ({resolution}:svgRes) => {
  return (
    <svg
      width="300"
      height="300"
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_ii_276_85)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M213.631 0.00683594C261.435 0.612312 300 39.5526 300 87.5V212.5L299.993 213.631C299.388 261.435 260.447 300 212.5 300H87.5C39.1751 300 0 260.825 0 212.5V87.5C3.58158e-09 87.4463 0.000879769 87.3926 0.000976562 87.3389V78.125H0.498047C5.13689 34.5756 41.7231 0.572313 86.3691 0.00683594L87.5 0H212.5L213.631 0.00683594ZM25.001 203.125L25 212.5C25 247.018 52.9822 275 87.5 275H212.5C247.018 275 275 247.018 275 212.5V200.951H115.18C75.9845 200.951 55.0479 169.257 55.8359 139.21C56.1666 126.605 60.2283 113.797 68.4746 103.125H25.001C25.0008 125.616 25.001 144.964 25.001 203.125ZM87.5 25C56.1686 25 30.2226 48.0547 25.6992 78.125H125.444L125.445 103.125C108.956 103.125 98.1391 108.29 91.4258 114.851C87.547 118.641 84.7341 123.192 82.9824 128.125H187.499L187.5 153.125C171.182 153.125 160.46 158.362 153.765 165.076C150.608 168.242 148.148 171.937 146.388 175.951H275V87.5C275 52.9822 247.018 25 212.5 25H87.5ZM82.7236 153.125C86.9793 166.094 98.2224 175.951 115.18 175.951H120.069C122.097 167.866 125.713 160.047 131.056 153.125H82.7236Z"
          fill="#4F6780"
          fillOpacity="0.25"
        />
      </g>

      <mask id="my-clip">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M213.631 0.00683594C261.435 0.612312 300 39.5526 300 87.5V212.5L299.993 213.631C299.388 261.435 260.447 300 212.5 300H87.5C39.1751 300 0 260.825 0 212.5V87.5C3.58158e-09 87.4463 0.000879769 87.3926 0.000976562 87.3389V78.125H0.498047C5.13689 34.5756 41.7231 0.572313 86.3691 0.00683594L87.5 0H212.5L213.631 0.00683594ZM25.001 203.125L25 212.5C25 247.018 52.9822 275 87.5 275H212.5C247.018 275 275 247.018 275 212.5V200.951H115.18C75.9845 200.951 55.0479 169.257 55.8359 139.21C56.1666 126.605 60.2283 113.797 68.4746 103.125H25.001C25.0008 125.616 25.001 144.964 25.001 203.125ZM87.5 25C56.1686 25 30.2226 48.0547 25.6992 78.125H125.444L125.445 103.125C108.956 103.125 98.1391 108.29 91.4258 114.851C87.547 118.641 84.7341 123.192 82.9824 128.125H187.499L187.5 153.125C171.182 153.125 160.46 158.362 153.765 165.076C150.608 168.242 148.148 171.937 146.388 175.951H275V87.5C275 52.9822 247.018 25 212.5 25H87.5ZM82.7236 153.125C86.9793 166.094 98.2224 175.951 115.18 175.951H120.069C122.097 167.866 125.713 160.047 131.056 153.125H82.7236Z"
          fill="#ffffff"
        />
      </mask>

      <defs>
        {/* filter needs understanding */}
        <filter id="glass_effect">
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation="1"
            result="blurred"
          />
          <feImage
              href={displacementMap}
              x="0"
              y="0"
              width={resolution*45/100}
              height={resolution*45/100}
              result="displacement_map"
            />
            <feDisplacementMap
              in="blurred_source"
              in2="displacement_map"
              scale="55"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
        </filter>

        <filter
          id="filter0_ii_276_85"
          x="-3.9"
          y="-3.9"
          width="307.8"
          height="307.8"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="-1" dy="-1" />
          <feGaussianBlur stdDeviation="3" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.113481 0 0 0 0 0.221454 0 0 0 0 0.344851 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_276_85"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="1" dy="1" />
          <feGaussianBlur stdDeviation="3" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_innerShadow_276_85"
            result="effect2_innerShadow_276_85"
          />
        </filter>
      </defs>
    </svg>
  );
};
type ShaderLayerProps = {
  mousePos: THREE.Vector2;
  hovering: boolean;
  resolution: number;
};

function BufferPass({ mousePos, hovering, resolution }: ShaderLayerProps) {
  const fbomain = useFBO(resolution, resolution, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    stencilBuffer: false,
    depthBuffer: false,
  });
  const fbocopy = useFBO(resolution, resolution, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    depthBuffer: false,
    stencilBuffer: false,
  });
  const last = useRef(0);
  const { gl } = useThree();
  const frameRef = useRef(false);
  const frameCount = useRef(0.0);

  const bufferScene = useMemo(() => new THREE.Scene(), []);
  const bufferCamera = useMemo(
    () => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
    [],
  );
  bufferCamera.updateProjectionMatrix();

  const bufferMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          mousePos: { value: mousePos },
          hovering: { value: hovering },
          resolution: {
            value: resolution,
          },
          uBufferA: { value: null },
          uBufferB: { value: null },
          uFrame: { value: 0.0 },
        },
        vertexShader: BufferVertexShader,
        fragmentShader: BufferFragmentShader,
      }),
    [hovering, mousePos, resolution],
  );

  useMemo(() => {
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bufferMaterial);
    bufferScene.add(quad);
  }, [bufferScene, bufferMaterial]);
  useFrame((state) => {
    const now = state.clock.getElapsedTime();
    if (now - last.current < 1 / 120) return;
    last.current = now;
    const read = frameRef.current ? fbocopy : fbomain;
    const write = frameRef.current ? fbomain : fbocopy;

    bufferMaterial.uniforms.uBufferA.value = read.texture;
    // bufferMaterial.uniforms.uBufferB.value = write.texture;
    bufferMaterial.uniforms.mousePos.value = mousePos;
    bufferMaterial.uniforms.resolution.value = resolution;
    bufferMaterial.uniforms.hovering.value = hovering;
    bufferMaterial.uniforms.uTime.value = state.clock.elapsedTime;

    console.log(frameCount.current);
    bufferMaterial.uniforms.uFrame.value = frameCount.current;

    frameCount.current += 1.0;

    frameRef.current = !frameRef.current;
    gl.setRenderTarget(write);
    gl.render(bufferScene, bufferCamera);
    gl.setRenderTarget(null);
  });

  return { renderTarget: fbomain };
}

const ShaderLayer = ({ mousePos, hovering, resolution }: ShaderLayerProps) => {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const { renderTarget } = BufferPass({
    mousePos,
    hovering,
    // resolution
    resolution: resolution / 2.0,
  });

  const myShader = {
    uniforms: {
      uTime: { value: 0 },
      mousePos: { value: new THREE.Vector2(0.5, 0.5) },
      hovering: { value: false },
      resolution: { value: document.getElementById("ripplecard")?.clientWidth },
      uBuffer: { value: renderTarget.texture },
      imageTexture: { value: useLoader(THREE.TextureLoader, backgroundImage) },
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
  const backdropRef = useRef<HTMLDivElement | null>(null);
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
        <div ref={backdropRef} className="svg-backdrop"></div>
        <SurfLogo resolution={zoomLevel} />
      </div>
      <div className="overlay">
        <div className="overlay-inner"></div>
        <Canvas
          className="mountaincard-canvas"
          style={{
            // position: "absolute",
            // width: "100%",
            // height: "100%",
            zIndex: "1",
            borderRadius: "inherit",
            top: "0",
            left: "0",
            background: "#fff",
            // filter: "url(#glass_effect) brightness(150%)"
            // boxShadow: " inset 0 0 10px 10px rgb(255, 255, 255) ",
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
          <directionalLight
            color="#232323"
            intensity={1}
            position={[0, 2, -2]}
          />
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
        </Canvas>
      </div>

      {/* <img src="Munnar-card.png" alt="" /> */}
    </div>
  );
}
