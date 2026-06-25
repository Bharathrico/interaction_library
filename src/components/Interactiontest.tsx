// import Mountaincard from "./interactions/Mountaincard/Mountaincard";
// import Wavecard from "./interactions/Wavecard/Wavecard";
import Rippleeffect from "./interactions/Rippleeffect/Rippleeffect"
// import Liquideffect from "./interactions/Liquideffect/Liquideffect"
import "./Interactiontest.css";

// function coin() {
//   const ctx = new AudioContext();
//   const osc = ctx.createOscillator();
//   const gain = ctx.createGain();

//   osc.connect(gain);
//   gain.connect(ctx.destination);

//   osc.type = 'sawtooth';
//   // Sweep frequency UP
//   osc.frequency.setValueAtTime(523, ctx.currentTime);       // C5
//   osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1); // E5
//   osc.frequency.setValueAtTime(784, ctx.currentTime + 0.15); // G5

//   gain.gain.setValueAtTime(0.05, ctx.currentTime);
//   gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

//   osc.start();
//   osc.stop(ctx.currentTime + 0.3);
//   navigator.vibrate([20]);
// }

export default function Interactiontest() {
  return (
    <div className="Testwrapper">
      
      <div className="component-titles">
        <div>
            Widget Pool
          </div>

          <div className="duration">
          Summer '26
          </div>
        </div> 
      <div className="component-wrapper">
        {/* <Liquideffect/> */}
        
      <Rippleeffect />
      {/* <Mountaincard></Mountaincard> */}
      </div>
      <div className="component-description">
        Keep the water clear ⚠️
      </div>
      {/* <button onClick={()=>coin()}>Hi</button> */}
    </div>
  );
}
