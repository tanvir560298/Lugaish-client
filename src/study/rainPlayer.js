export const RAIN_ASSET='/audio/library-rain.mp3';
export function createRainPlayer({createContext,fetchAudio,onState=()=>{}}){
 let context,gain,buffer,source,loading,disposed=false,playing=false,offset=0,started=0,volume=18,generation=0;
 const stop=()=>{if(source){source.onended=null;source.stop();source.disconnect();source=null;}};
 return {
  setVolume(value){volume=Math.max(0,Math.min(100,Number(value)||0));if(gain)gain.gain.setTargetAtTime(volume/100*.5,context.currentTime,.12);},
  async play(){
   if(disposed||playing||loading)return;const request=++generation;
   try{
    if(!context){context=createContext();gain=context.createGain();gain.gain.value=volume/100*.5;gain.connect(context.destination);}
    // Resume synchronously from the click handler, before awaiting the asset.
    const resumed=context.resume();onState('loading');
    loading=buffer?Promise.resolve(buffer):fetchAudio(RAIN_ASSET).then(bytes=>context.decodeAudioData(bytes));
    const result=await Promise.all([resumed,loading]);buffer=result[1];
    if(disposed||request!==generation)return;
    if(context.state!=='running')throw new Error('Tap Play again to enable browser audio.');
    source=context.createBufferSource();source.buffer=buffer;source.loop=true;source.loopStart=0;source.loopEnd=buffer.duration;source.connect(gain);started=context.currentTime;source.start(0,offset%buffer.duration);playing=true;onState('playing');
   }catch(error){if(!disposed&&request===generation)onState('error',error.name==='NotAllowedError'?'Tap Play again to enable browser audio.':'Rain could not load or play. Check your connection and try Play again.');}
   finally{loading=null;}
  },
  pause(){generation++;if(playing&&buffer)offset=(offset+context.currentTime-started)%buffer.duration;playing=false;stop();onState('paused');},
  off(){this.pause();offset=0;onState('off');},
  dispose(){disposed=true;generation++;stop();gain?.disconnect();context?.close().catch(()=>{});},
 };
}
