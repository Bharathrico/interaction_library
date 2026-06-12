import "./App.css";
import 'lenis/dist/lenis.css'
import { ReactLenis, useLenis } from 'lenis/react'
import Interactiontest from "./components/Interactiontest";
// lenis is used for smooth scrolling

export default function App() {
    useLenis((lenis) => {
    console.log(lenis)
  })
  return (
    <>
      <ReactLenis options={{syncTouch:true}} root />
      <Interactiontest/>
    </>
  );
}
