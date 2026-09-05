// import Mountaincard from "./interactions/Mountaincard/Mountaincard";
// import Wavecard from "./interactions/Wavecard/Wavecard";
import Rippleeffect from "./interactions/Rippleeffect/Rippleeffect";
// import Liquideffect from "./interactions/Liquideffect/Liquideffect"
// import Icontest from "./interactions/Icontest/Icontest"
import "./Interactiontest.css";

import gsap from "gsap";

import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

function useThreeSceneLoaded() {
  const { active, progress, total } = useProgress();
  const [started, setStarted] = useState(false);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setWaiting(true);
    }, 1000);
  });
  useEffect(() => {
    if (total > 0) setStarted(true);
  }, [total]);

  // Gotcha: before anything registers with the loading manager,
  // active=false and progress=100 by default — that looks "done"
  // even though nothing has loaded yet. Guard with `started`.
  return waiting && (started ? !active && progress === 100 : false);
}

function WidgetScreen() {
  const sceneReady = useThreeSceneLoaded();

  useEffect(() => {
    if (!sceneReady) return;

    gsap.fromTo(
      ".Testwrapper",
      { filter: "blur(12px)", opacity: 0 },
      { filter: "blur(0px)", opacity: 1, duration: 1, ease: "expo.out" },
    );
  }, [sceneReady]);

  return (
    <div
      className="Testwrapper"
      style={{
        visibility: sceneReady ? "visible" : "hidden",
        zIndex: "2",
        transform: "translateZ(0)",
        willChange: "transform",
        WebkitBackfaceVisibility: "hidden",
        MozBackfaceVisibility: "hidden",
        WebkitTransform: "translate3d(0,0,0)",
        MozTransform: "translate3d(0,0,0)",
      }}
    >
      <div className="component-titles">
        <div>Widget Pool</div>

        <div className="duration">Summer '26</div>
      </div>
      <div className="component-wrapper">
        <Rippleeffect />

        {/* <Icontest /> */}
        {/* <Mountaincard></Mountaincard> */}
      </div>
      <div className="component-description">Keep the water clear!</div>
      {/* <button onClick={()=>coin()}>Hi</button> */}
    </div>
  );
}

export default function Interactiontest() {
  const sceneReady = useThreeSceneLoaded();

  useEffect(() => {
    if (sceneReady) return;

    gsap.fromTo(
      ".spinner",
      { filter: "blur(12px)", opacity: 0, scale: 1.02 },
      {
        filter: "blur(0px)",
        opacity: 1,
        scale: 1,
        duration: 2,
        ease: "expo.out",
      },
    );
  }, [sceneReady]);

  useEffect(() => {
    if (!sceneReady) return;

    gsap.fromTo(
      ".spinner",
      { filter: "blur(0px)", opacity: 1, scale: 1 },
      {
        filter: "blur(12px)",
        opacity: 0,
        scale: 1.02,
        duration: 1,
        ease: "expo.out",
      },
    );
  }, [sceneReady]);

  return (
    <>
      {/* <div
        className="spinner"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: "translateZ(0)",
        willChange: "transform",
        WebkitBackfaceVisibility: "hidden",
        MozBackfaceVisibility: "hidden",
        WebkitTransform: "translate3d(0,0,0)",
        MozTransform: "translate3d(0,0,0)",
        }}
      >
        Loading scene…
      </div> */}
      <WidgetScreen />
    </>
  );
}
