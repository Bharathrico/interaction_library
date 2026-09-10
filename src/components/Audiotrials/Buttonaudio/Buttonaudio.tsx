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