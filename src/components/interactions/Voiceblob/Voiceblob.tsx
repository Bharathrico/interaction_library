//glass shader mostly based on this tutorial - https://blog.olivierlarose.com/tutorials/3d-glass-effect

import { Canvas, useFrame, useLoader} from "@react-three/fiber";
import { EffectComposer, DotScreen, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import "./Voiceblob.css";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  OrthographicCamera,
} from "@react-three/drei";
import { useGSAP } from "@gsap/react"; // <-- import the hook from our React package

import munnarimage from "./Munnarcard_image.png";
import VertexShader from './shaders/.vert?raw'
import FragmentShader from './shaders/.frag?raw'


interface UseVoiceActivityOptions {
  threshold?: number;      // 0-1, volume level considered "talking"
  smoothing?: number;      // 0-1, higher = smoother/slower response
}

function useVoiceActivity({ threshold = 0.8, smoothing = 0.1 }: UseVoiceActivityOptions = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(0); // 0-1, current loudness
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = smoothing;
      source.connect(analyser);

      audioCtxRef.current = audioCtx;
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteTimeDomainData(data);

        // RMS (root mean square) of the waveform = loudness
        let sumSquares = 0;
        for (let i = 0; i < data.length; i++) {
          const sample = (data[i] - 128) / 128; // normalize to -1..1
          sumSquares += sample * sample;
        }
        const rms = Math.sqrt(sumSquares / data.length);

        setVolume(rms);
        setIsSpeaking(rms > threshold);

        rafRef.current = requestAnimationFrame(tick);
      };

      tick();
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [threshold, smoothing]);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach(track => track.stop()); // releases the mic
    audioCtxRef.current?.close();
    streamRef.current = null;
    audioCtxRef.current = null;
    analyserRef.current = null;
    setIsSpeaking(false);
    setVolume(0);
  }, []);

  useEffect(() => stop, [stop]); // cleanup on unmount

  return { isSpeaking, volume, error, start, stop };
}

// a plane with shader
type ShaderLayerProps = {
  mousePos : THREE.Vector2,
  audioLevel : number
}
const ShaderLayer = ({mousePos, audioLevel}:ShaderLayerProps) => {

  const myShader = {
  uniforms: {
    uTime : {value:0},
    mousePos: { value: new THREE.Vector2(0.5, 0.5) },
    audioLevel:{value:0},
    imageTexture : {value: useLoader(THREE.TextureLoader, munnarimage)}
  },
  vertexShader: VertexShader,
  fragmentShader: FragmentShader
};
  const materialRef = useRef<THREE.ShaderMaterial | null >(null);

   useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.mousePos.value = mousePos;
      materialRef.current.uniforms.audioLevel.value = audioLevel;
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
  const { isSpeaking, volume, error, start, stop } = useVoiceActivity({ threshold: 0.08 });
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
      <div style={{position:"absolute", zIndex:2, width:"100%", height:"100%"}}>
      <button onClick={start}>Start listening</button>
      <button onClick={stop}>Stop</button>
      {error && <p>Error: {error}</p>}
      <div style={{
        width: 20, height: 20, borderRadius: '50%',
        background: isSpeaking ? 'limegreen' : 'lightgray',
        transition: 'background 0.1s',
      }} />
      <p>Volume: {(volume * 100).toFixed(0)}%</p>
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
            <ShaderLayer mousePos={mousePos} audioLevel={volume}/>
          {/* <DotScreen scale={0.5} /> */}
          <Bloom />
        </EffectComposer>
        {/* <OrbitControls/> */}
      </Canvas>
      </div>
  );
}
