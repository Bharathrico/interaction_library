import React from 'react'
import './Soundimage.css'
// import string from './violin/string.png'
// import stringtop from './violin/stringtop.png'
// import wood from './violin/wood.png'
import violin from './violin/violin.png'
import stone from './violin/stone.mp3'
import wood from './violin/wood.mp3'
import cello from './violin/cello.mp3'

const audioContext = new AudioContext();
let audioBuffer: AudioBuffer | null = null;

async function loadAudio(url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
}

function playAudio() {
  if (!audioBuffer) return;

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start(0);
}

const Violinimage = () => {

    return(
        <svg style={{position:"absolute", top:"0",width:"100%",height:"100%", opacity:"0"}} width="1000" height="1000" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
<path onMouseEnter={()=>{loadAudio(stone).then(() => playAudio());}} d="M522 136H563V165H522V171H563V200H437V171H479V165H437V136H479V79H522V136Z" fill="#D9D9D9"/>
<path onMouseEnter={()=>{loadAudio(wood).then(() => playAudio());}} d="M387.692 548.66C361.687 540.046 330.851 523.512 340.233 497.774C364.005 432.562 426.565 386 500 386C576.483 386 641.17 436.508 662.525 505.989C669.894 529.967 644.69 547.818 619.831 551.174C596.362 554.341 573.5 567.857 573.5 608.5C573.5 669.745 625.415 717.809 653.089 739.079C663.306 746.933 670.305 758.914 668.752 771.707C658.536 855.829 586.879 921 500 921C413.672 921 342.373 856.653 331.45 773.305C329.664 759.674 337.64 747.006 348.621 738.738C374.581 719.191 418.5 676.128 418.5 608.5C418.5 570.36 404.531 554.238 387.692 548.66Z" fill="#D9D9D9"/>
<path onMouseEnter={()=>{loadAudio(cello).then(() => playAudio());}} d="M532.5 785H475L469 661.5L485 201H515.5L532.5 661.5V785Z" fill="#D9D9D9"/>
</svg>

    )
}

export default function Soundimage() {
  return (
    <div className="maincard">
        <img style={{position:"absolute",width:"100%",height:"100%", top:"0"}} src={violin} alt="" />
        <Violinimage/>
    </div>
  )
}
