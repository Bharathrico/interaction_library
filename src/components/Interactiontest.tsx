// import Mountaincard from "./interactions/Mountaincard/Mountaincard";
// import Wavecard from "./interactions/Wavecard/Wavecard";
import Rippleeffect from "./interactions/Rippleeffect/Rippleeffect"
// import Liquideffect from "./interactions/Liquideffect/Liquideffect"
// import Icontest from "./interactions/Icontest/Icontest"
import "./Interactiontest.css";

import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

function useThreeSceneLoaded() {
  const { active, progress, total } = useProgress();
  const [started, setStarted] = useState(false);
  const [waiting, setWaiting] = useState(false);


  useEffect(()=>{
    setTimeout(()=>{setWaiting(true)},1000)
  })
  useEffect(() => {
    if (total > 0) setStarted(true);
  }, [total]);

  // Gotcha: before anything registers with the loading manager,
  // active=false and progress=100 by default — that looks "done"
  // even though nothing has loaded yet. Guard with `started`.
  return waiting && (started ? !active && progress === 100 : false);
}

export default function Interactiontest() {
  const sceneReady = useThreeSceneLoaded();

  return (
    <>
    {!sceneReady && <div className="spinner">Loading scene…</div>}
    <div className="Testwrapper" style={{ visibility: sceneReady ? "visible" : "hidden" }}>
      
      <div className="component-titles">
        <div>
           
            Widget Pool
          </div>

          <div className="duration">
          Summer '26
          </div>
        </div> 
      <div className="component-wrapper">
        <Rippleeffect/>
        
      {/* <Icontest /> */}
      {/* <Mountaincard></Mountaincard> */}
      </div>
      <div className="component-description">
        Keep the water clear!
      </div>
      {/* <button onClick={()=>coin()}>Hi</button> */}
    </div>
    </>
  );
}
