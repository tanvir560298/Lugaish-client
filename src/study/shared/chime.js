let context=null,lastChime=-Infinity;
export function soundEnabled(){try{return localStorage.getItem('lugaish-message-sound')!=='off';}catch{return true;}}
export function setSoundEnabled(enabled){try{localStorage.setItem('lugaish-message-sound',enabled?'on':'off');}catch{}if(enabled)unlockChime();window.dispatchEvent(new CustomEvent('lugaish-message-sound-change',{detail:enabled}));}
export function unlockChime(){try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;if(!context)context=new Audio();if(context.state==='suspended')context.resume().catch(()=>{});}catch{}}
export function playChime(){
  if(!soundEnabled()||context?.state!=='running')return;
  const at=context.currentTime;if(at-lastChime<.5)return;lastChime=at;
  for(const [frequency,offset] of [[880,0],[1174.66,.09]]){const oscillator=context.createOscillator(),gain=context.createGain();oscillator.type='sine';oscillator.frequency.value=frequency;gain.gain.setValueAtTime(0,at+offset);gain.gain.linearRampToValueAtTime(.07,at+offset+.008);gain.gain.exponentialRampToValueAtTime(.001,at+offset+.32);oscillator.connect(gain);gain.connect(context.destination);oscillator.start(at+offset);oscillator.stop(at+offset+.34);oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};}
}
