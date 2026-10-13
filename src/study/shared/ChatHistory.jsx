import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
// Window the DOM only; the full authorized temporary history stays in memory.
export default function ChatHistory({messages,me,open}){
 const viewport=useRef(),nearBottom=useRef(true),anchor=useRef(null),heights=useRef(new Map());
 const [scroll,setScroll]=useState(0),[version,setVersion]=useState(0);
 const offsets=useMemo(()=>{let y=0;return messages.map(m=>{const entry={message:m,top:y,height:heights.current.get(m.id)||100};y+=entry.height+8;return entry;});},[messages,version]);
 const total=offsets.length?offsets.at(-1).top+offsets.at(-1).height:0;
 const visible=offsets.filter(row=>row.top+row.height>scroll-400&&row.top<scroll+700);
 useLayoutEffect(()=>{if(open&&nearBottom.current&&viewport.current){viewport.current.scrollTop=total;setScroll(viewport.current.scrollTop);}else if(viewport.current&&anchor.current){const row=offsets.find(r=>r.message.id===anchor.current.id);if(row){viewport.current.scrollTop=row.top+anchor.current.offset;setScroll(viewport.current.scrollTop);}}},[total,open,offsets]);
 useEffect(()=>{const element=viewport.current;if(!element)return;const observer=new ResizeObserver(entries=>{let changed=false;for(const entry of entries){const id=entry.target.dataset.messageId,height=entry.contentRect.height;if(id&&Math.abs((heights.current.get(id)||100)-height)>1){heights.current.set(id,height);changed=true;}}if(changed)setVersion(v=>v+1);});element.querySelectorAll('[data-message-id]').forEach(row=>observer.observe(row));return()=>observer.disconnect();},[visible.map(r=>r.message.id).join('|')]);
 useEffect(()=>{const ids=new Set(messages.map(m=>m.id));for(const id of heights.current.keys())if(!ids.has(id))heights.current.delete(id);},[messages]);
 return <div className="sr-message-history sr-virtual-history" ref={viewport} tabIndex={0} aria-label="Chronological table conversation" onScroll={e=>{const element=e.currentTarget;nearBottom.current=element.scrollHeight-element.scrollTop-element.clientHeight<70;const row=offsets.find(r=>r.top+r.height>=element.scrollTop);if(row)anchor.current={id:row.message.id,offset:element.scrollTop-row.top};setScroll(element.scrollTop);}}>
 {!messages.length&&<p>No messages yet. Say hello.</p>}
 <div style={{height:total,position:'relative'}}>{visible.map(({message:m,top})=><div key={m.id} data-message-id={m.id} style={{position:'absolute',top,left:0,right:0}}><p className={m.senderId===me?'sr-message-mine':''}><strong>{m.senderId===me?'You':m.senderName}</strong><span>{m.body}</span><small>{new Date(m.createdAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</small></p></div>)}</div>
 </div>;
}
