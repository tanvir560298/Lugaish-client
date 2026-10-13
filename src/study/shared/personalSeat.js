import { STUDY_SEATS } from '../../../server/study/tableLayout.js';
const key=scope=>`lugaish-personal-library-seat:${scope}`;
export function restoredPersonalSeat(scope,id='personal-library'){
 try{const seat=localStorage.getItem(key(scope));if(!STUDY_SEATS.some(s=>s.id===seat))return null;return {id,name:'You · personal desk',seat,phase:'paused',focusMs:0,arrivesAt:0};}catch{return null;}
}
export function rememberPersonalSeat(scope,seat){try{if(seat)localStorage.setItem(key(scope),seat);else localStorage.removeItem(key(scope));}catch{/* A desk can still work when browser storage is unavailable. */}}
