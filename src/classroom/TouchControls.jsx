import { useEffect, useRef } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
export function TouchControls({controlsRef}) {
  const held=useRef(new Map());
  const update=()=>{let x=0,z=0;for(const v of held.current.values()){x+=v[0];z+=v[1];}controlsRef.current?.move(Math.max(-1,Math.min(1,x)),Math.max(-1,Math.min(1,z)));};
  useEffect(()=>{const clear=()=>{held.current.clear();controlsRef.current?.move(0,0);};window.addEventListener('blur',clear);document.addEventListener('visibilitychange',clear);return()=>{clear();window.removeEventListener('blur',clear);document.removeEventListener('visibilitychange',clear);};},[controlsRef]);
  const end=e=>{held.current.delete(e.pointerId);update();};
  return <div className="cr-touch-pad" aria-label="Touch movement controls">{[[0,-1,ArrowUp,'Forward'],[-1,0,ArrowLeft,'Left'],[1,0,ArrowRight,'Right'],[0,1,ArrowDown,'Backward']].map(([x,z,Icon,label])=><button key={label} className={`cr-touch-${label.toLowerCase()}`} aria-label={`Move ${label.toLowerCase()}`} onPointerDown={e=>{e.preventDefault();document.activeElement?.blur?.();e.currentTarget.setPointerCapture(e.pointerId);held.current.set(e.pointerId,[x,z]);update();}} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end}><Icon size={21}/></button>)}</div>;
}
