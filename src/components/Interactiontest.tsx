import Mountaincard from "./interactions/Mountaincard/Mountaincard";
import Wavecard from "./interactions/Wavecard/Wavecard";
import "./Interactiontest.css";

export default function Interactiontest() {
  return (
    <div className="Testwrapper">
      <div className="component-wrapper">
      <Wavecard />
      </div>
    </div>
  );
}
