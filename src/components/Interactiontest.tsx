// import Mountaincard from "./interactions/Mountaincard/Mountaincard";
// import Wavecard from "./interactions/Wavecard/Wavecard";
// import Rippleeffect from "./interactions/Rippleeffect/Rippleeffect"
import Liquideffect from "./interactions/Liquideffect/Liquideffect"
import "./Interactiontest.css";

export default function Interactiontest() {
  return (
    <div className="Testwrapper">
      <div className="component-wrapper">
        <Liquideffect/>
      {/* <Rippleeffect /> */}
      {/* <Mountaincard></Mountaincard> */}
      </div>
    </div>
  );
}
