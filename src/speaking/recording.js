export function createVoiceRecorder({env=globalThis,onChange=()=>{},onLevel=()=>{},onRecorded=()=>{}}={}){
 let status='idle',stream=null,recorder=null,context=null,source=null,frame=null,timer=null,url=null,audio=null,chunks=[],generation=0,disposed=false,started=0,duration=0;
 const now=()=>env.performance?.now?.()??Date.now();
 const publish=(next,error='')=>{status=next;if(!disposed)onChange({status,error,url,duration});};
 const tracks=()=>{stream?.getTracks().forEach(t=>t.stop());stream=null;};
 function meterStop(){if(frame!=null)env.cancelAnimationFrame?.(frame);frame=null;source?.disconnect?.();source=null;context?.close?.().catch?.(()=>{});context=null;if(!disposed)onLevel(0);}
 function playbackStop(){if(audio){audio.onended=audio.onerror=null;audio.pause();audio=null;}if(status==='playing')publish(url?'ready':'idle');}
 function erase(){playbackStop();if(url)env.URL.revokeObjectURL(url);url=null;duration=0;}
 function cancel(){generation++;env.clearTimeout(timer);timer=null;if(recorder){recorder.ondataavailable=recorder.onstop=recorder.onerror=null;if(recorder.state!=='inactive')try{recorder.stop();}catch{}recorder=null;}tracks();meterStop();chunks=[];erase();if(!disposed)publish('idle');}
 function stop(){if(status==='requesting'){cancel();return;}if(status!=='recording')return;duration=Math.max(0,(now()-started)/1000);env.clearTimeout(timer);timer=null;publish('stopping');meterStop();try{recorder.stop();}catch{tracks();publish('error','Recording could not finish. Please try again.');}tracks();}
 async function start(){if(disposed||['requesting','recording','stopping'].includes(status))return;cancel();
 if(!env.navigator?.mediaDevices?.getUserMedia||!env.MediaRecorder){publish('error','Local recording is unavailable. Use a supported browser on HTTPS or localhost.');return;}
 const token=generation;publish('requesting');
 try{const received=await env.navigator.mediaDevices.getUserMedia({audio:true,video:false});if(disposed||token!==generation){received.getTracks().forEach(t=>t.stop());return;}stream=received;
 const type=['audio/webm;codecs=opus','audio/mp4','audio/webm'].find(t=>env.MediaRecorder.isTypeSupported?.(t));recorder=new env.MediaRecorder(stream,type?{mimeType:type}:{});const current=recorder;chunks=[];let bytes=0;
 current.ondataavailable=e=>{if(token!==generation||!e.data?.size)return;bytes+=e.data.size;if(bytes>8*1024*1024){cancel();publish('error','Recording was too large. Try a shorter phrase.');return;}chunks.push(e.data);};
 current.onstop=()=>{if(disposed||token!==generation)return;if(status==='recording')duration=Math.max(0,(now()-started)/1000);env.clearTimeout(timer);timer=null;tracks();meterStop();const blob=new env.Blob(chunks,{type:current.mimeType||chunks[0]?.type||'audio/webm'});chunks=[];recorder=null;if(!blob.size){publish('error','No audio was captured. Check your microphone and try again.');return;}url=env.URL.createObjectURL(blob);publish('ready');onRecorded({duration,bytes:blob.size});};
 current.onerror=()=>{cancel();publish('error','The browser could not record audio. Please retry.');};
 const AudioContext=env.AudioContext??env.webkitAudioContext;
 if(AudioContext)try{context=new AudioContext();context.resume?.().catch?.(()=>{});source=context.createMediaStreamSource(stream);const analyser=context.createAnalyser();analyser.fftSize=256;source.connect(analyser);const values=new Uint8Array(256);let last=0;const tick=()=>{if(status!=='recording')return;if(now()-last>100){analyser.getByteTimeDomainData(values);const rms=Math.sqrt(values.reduce((sum,n)=>sum+((n-128)/128)**2,0)/values.length);onLevel(Math.min(1,rms*3));last=now();}frame=env.requestAnimationFrame(tick);};frame=env.requestAnimationFrame(tick);}catch{meterStop();}
 current.start(250);started=now();publish('recording');timer=env.setTimeout(stop,60000);
 }catch(e){if(disposed||token!==generation)return;tracks();meterStop();publish('error',e.name==='NotAllowedError'?'Microphone permission was denied. Allow it and try again.':e.name==='NotFoundError'?'No microphone was found. Connect one and try again.':'The microphone could not start. Stop other capture and try again.');}}
 async function play(){if(!url||disposed||['recording','requesting','stopping'].includes(status))return;playbackStop();const token=generation;audio=new env.Audio(url);audio.onended=()=>{if(token===generation){audio=null;publish('ready');}};audio.onerror=()=>{if(token===generation){playbackStop();publish('error','This recording could not play. Try recording again.');}};publish('playing');try{await audio.play();}catch{if(token===generation){playbackStop();publish('error','Playback was blocked. Press Play again or record a new attempt.');}}}
 return{start,stop,play,pause:playbackStop,reset:cancel,dispose(){disposed=true;cancel();},getStatus:()=>status};
}
