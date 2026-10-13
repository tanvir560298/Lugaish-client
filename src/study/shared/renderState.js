// Chat, focus counters and heartbeat revisions do not affect 3D artwork.
export function sceneSignature(room){return JSON.stringify([room?.id,room?.name,room?.kind,(room?.members||[]).map(m=>[m.id,m.name,m.characterId,m.seat,m.arrivesAt,m.motion,m.phase,m.greeting])]);}
export function createRenderClock(){
 let time=null;
 return {sample(delta,target){if(time===null){time=target;return {now:time,corrected:false};}const step=Math.max(0,delta)*1000,predicted=time+step,error=target-predicted;if(Math.abs(error)>1500){time=target;return {now:time,corrected:true};}time=predicted+Math.max(-step*.1,Math.min(step*.1,error));return {now:time,corrected:false};}};
}
