import "./App.css";
import 'lenis/dist/lenis.css'
import { ReactLenis, useLenis } from 'lenis/react'
// lenis is used for smooth scrolling

export default function App() {
    useLenis((lenis) => {
    console.log(lenis)
  })
  return (
    <>
      <ReactLenis root />
    <div className="tabs-cover">
      <div className="component-tab-cover">
        <div className="component-tab">
          content
        </div>
      </div>
      <div className="component-tab-cover">
        <div className="component-tab">
          content
        </div>
      </div>
      <div className="component-tab-cover">
        <div className="component-tab">
          content
        </div>
      </div>
      <div className="component-tab-cover">
        <div className="component-tab">
          content
        </div>
      </div>
      <div className="component-tab-cover">
        <div className="component-tab">
          content
        </div>
      </div>
    </div>
    </>
  );
}
