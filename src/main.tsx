import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* adapted from - https://x.com/guerriero_se/status/2069791907392200784/photo/1 */}
    <figure
      // className="absolute inset-0 z-10 pointer-events-none filter-[url('#noise-bg-fx')_grayscale(100%)] opacity-10 mix-blend-screen"
      style={{
        position:"absolute",
        width:"100%",
        height:"100%",
        overflow:"hidden",
        top:"0px",
        left:"0px",
        inset:"0",
        zIndex:"0",
        pointerEvents:"none",
        // filter:"url(#noise-bg-fx) grayscale(100%)",
        // opacity:"10%",
        // mixBlendMode:"normal",
        // backgroundColor:"#000000"
      }}
      aria-hidden="true"
    >
      <svg
      style={{width:"100vw",height:"100vh"}}>
        <filter id="noise-bg-fx">
          <feTurbulence type="turbulence" result="turbulence" baseFrequency={0.8}/>
        </filter>
      </svg>
    </figure>
    <App />
  </StrictMode>,
);
