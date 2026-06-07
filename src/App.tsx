import "./App.css";
import 'lenis/dist/lenis.css'
import { ReactLenis, useLenis } from 'lenis/react'
import Footballcomp from "./components/interactions/Footballcomp";
// lenis is used for smooth scrolling

export default function App() {
    useLenis((lenis) => {
    console.log(lenis)
  })
  return (
    <>
      <ReactLenis options={{syncTouch:true}} root />
    <div className="tabs-cover">
      <div className="component-tab-cover">
        <div className="component-tab">
          <Footballcomp/>
        </div>
      </div>
    </div>
    </>
  );
}
