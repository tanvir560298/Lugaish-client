import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { roomRequest, roomStream } from './transport.js';
import { playChime, unlockChime, soundEnabled, setSoundEnabled } from './chime.js';
import { createNotificationQueue } from './notificationQueue.js';
import './shared.css';
export default function StudyInvitations() {
  const {pathname}=useLocation();
  const queue=useRef(),[requests,setRequests]=useState([]),[error,setError]=useState('');
  const [count,setCount]=useState(0),[toast,setToast]=useState(null),[sound,setSound]=useState(soundEnabled);

  useEffect(()=>{const sync=e=>setSound(e.detail);window.addEventListener('lugaish-message-sound-change',sync);return()=>window.removeEventListener('lugaish-message-sound-change',sync);},[]);
  useEffect(()=>{
    let mounted=true;const controller=new AbortController();let retry;
    const notifications=createNotificationQueue({show:setToast,chime:playChime,acknowledge:(id,table)=>roomRequest(table?'/table/messages/read':'/messages/read',{ids:[id]}).catch(()=>{})});
    queue.current=notifications;const requestSeen=new Set();let tableIds=new Set();
    const unlock=()=>unlockChime();document.addEventListener('pointerdown',unlock);document.addEventListener('keydown',unlock);
    const connect=async()=>{try{await roomStream(controller.signal,value=>{if(!mounted)return;const nextIds=new Set((value.tableMessages||[]).map(m=>m.id));notifications.remove([...tableIds].filter(id=>!nextIds.has(id)));tableIds=nextIds;setCount((value.invitations?.length||0)+(value.joinRequests?.length||0));setRequests(value.joinRequests||[]);for(const r of value.joinRequests||[])if(!requestSeen.has(r.id)){requestSeen.add(r.id);playChime();}notifications.push(value.notifications||[]);});}catch{if(!controller.signal.aborted)retry=setTimeout(connect,2500);}};
    connect();
    return()=>{mounted=false;controller.abort();clearTimeout(retry);notifications.dispose();document.removeEventListener('pointerdown',unlock);document.removeEventListener('keydown',unlock);};
  },[]);
  return <>
    {count>0&&!pathname.startsWith('/study-room')&&<div className="px-4 py-2 text-center text-sm bg-emerald-950 text-emerald-100"><Link to="/study-room">Study invitations ({count}) — review when you’re ready</Link></div>}
    {requests.length>0&&!pathname.startsWith('/study-room')&&<aside className="sr-request-notice" aria-label="Study table invitation"><p>{requests[0].name} wants to join your study table.</p><button className="ls-button ls-primary" onClick={()=>roomRequest('/requests/answer',{id:requests[0].id,accept:true}).catch(e=>setError(e.message))}>Accept</button><button className="ls-button" onClick={()=>roomRequest('/requests/answer',{id:requests[0].id,accept:false}).catch(e=>setError(e.message))}>Decline</button>{error&&<p role="alert">{error}</p>}</aside>}
    {toast&&<aside className="sr-message-toast" role="status" aria-live="polite" onMouseEnter={()=>queue.current?.pause()} onMouseLeave={()=>queue.current?.resume()} onFocus={()=>queue.current?.pause()} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))queue.current?.resume();}}><div><strong>{toast.senderName}</strong><p>{toast.body}</p><Link to="/study-room">Open chat</Link><button type="button" className="ls-button" onClick={()=>queue.current?.dismiss()}>Dismiss</button></div><button type="button" aria-label={sound?'Mute message sound':'Enable message sound'} onClick={()=>{const value=!sound;setSound(value);setSoundEnabled(value);}}>{sound?'Sound on':'Sound off'}</button></aside>}
  </>;
}
