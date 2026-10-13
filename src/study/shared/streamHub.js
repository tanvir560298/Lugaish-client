export function createStreamHub(start){
 const streams=new Map();
 return function subscribe(key,signal,onSnapshot){
  if(signal.aborted)return Promise.resolve();
  let stream=streams.get(key);
  if(!stream){stream={controller:new AbortController(),listeners:new Set(),snapshot:null};streams.set(key,stream);}
  return new Promise((resolve,reject)=>{
   const listener={onSnapshot,resolve,reject};stream.listeners.add(listener);
   const finish=()=>{stream.listeners.delete(listener);signal.removeEventListener('abort',finish);resolve();if(!stream.listeners.size){stream.controller.abort();if(streams.get(key)===stream)streams.delete(key);}};
   listener.finish=finish;signal.addEventListener('abort',finish,{once:true});
   if(stream.snapshot)onSnapshot(stream.snapshot);
   if(!stream.started){stream.started=true;start(key,stream.controller.signal,value=>{
     let messages=value.tableMessages??stream.snapshot?.tableMessages??[];
     if(value.tableMessageDelta){const delta=value.tableMessageDelta,removed=new Set(delta.remove),reads=new Map(delta.read.map(m=>[m.id,m.read]));messages=messages.filter(m=>!removed.has(m.id)).map(m=>reads.has(m.id)?{...m,read:reads.get(m.id)}:m).concat(delta.append).sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt)||a.id.localeCompare(b.id));}
     stream.snapshot={...value,tableMessages:messages};
     for(const item of stream.listeners)item.onSnapshot(stream.snapshot);
   }).then(()=>{for(const item of [...stream.listeners])item.finish();}).catch(error=>{for(const item of [...stream.listeners]){item.reject(error);item.finish();}}).finally(()=>{if(streams.get(key)===stream)streams.delete(key);});}
  });
 };
}
