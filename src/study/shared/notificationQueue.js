export function notificationDuration(text='') {
  const readable=String(text).trim();
  const words=readable.split(/\s+/u).filter(Boolean).length;
  return Math.max(2000,Math.min(10000,Math.round(1700+Math.max(words*240,Array.from(readable).length*32))));
}
export function createNotificationQueue({show,chime,acknowledge,setTimer=setTimeout,clearTimer=clearTimeout}) {
  const seen=new Set(),queue=[];let active=null,timer=null,disposed=false,paused=false;
  const expire=()=>{active=null;show(null);next();};
  const schedule=()=>{clearTimer(timer);if(active&&!paused)timer=setTimer(expire,notificationDuration(active.body));};
  const next=()=>{
    if(disposed||active||!queue.length)return;
    active=queue.shift();show(active);chime();
    if(!active.local)acknowledge(active.id,active.table);
    schedule();
  };
  return {
    push(messages){if(disposed)return;for(const message of messages){if(!message?.id||seen.has(message.id))continue;if(queue.length>=20)break;seen.add(message.id);queue.push(message);}next();},
    remove(ids){const removed=new Set(ids);for(let i=queue.length-1;i>=0;i--)if(removed.has(queue[i].id))queue.splice(i,1);if(active&&removed.has(active.id)){clearTimer(timer);expire();}},
    pause(){paused=true;clearTimer(timer);},resume(){paused=false;schedule();},dismiss(){clearTimer(timer);paused=false;expire();},
    dispose(){disposed=true;clearTimer(timer);queue.length=0;},
  };
}
