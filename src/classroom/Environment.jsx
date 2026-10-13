import CampusLighting from '../shared/CampusLighting.jsx';
import CampusPlant from '../shared/CampusPlant.jsx';
import { useLayoutEffect, useMemo } from 'react';
import { Block, RepeatedBlocks } from './Blocks.jsx';
import { CanvasTexture, SRGBColorSpace } from 'three';

export { Block } from './Blocks.jsx';
import { HallArchitecture, HallFurniture } from '../shared/LearningHall.jsx';
function Sign({ text, sub='', position, rotation=[0,0,0], width=1.8, height=.6, dark=false }) {
  const texture=useMemo(()=> {
    const c=document.createElement('canvas');c.width=768;c.height=256;
    const ctx=c.getContext('2d');ctx.fillStyle=dark?'#183a3b':'#f1efe7';ctx.fillRect(0,0,c.width,c.height);
    ctx.fillStyle=dark?'#e5dfc9':'#203c3e';ctx.font='600 53px Arial';ctx.fillText(text,36,100);
    ctx.fillStyle=dark?'#acc6bf':'#647572';ctx.font='28px Arial';ctx.fillText(sub,36,164);
    const t=new CanvasTexture(c);t.colorSpace=SRGBColorSpace;return t;
  },[text,sub,dark]);
  useLayoutEffect(()=>()=>texture.dispose(),[texture]);
  return <mesh position={position} rotation={rotation}><planeGeometry args={[width,height]} /><meshBasicMaterial map={texture} toneMapped={false} /></mesh>;
}
export function Environment({phase,quality,onSeat,selectedSeat,onBrowse}) {
  return <>
    <CampusLighting quality={quality}/><color attach="background" args={['#e9e7dc']}/>
    <ambientLight intensity={.25}/><hemisphereLight args={['#f4f5ed','#8e897a',.95]}/>
    <directionalLight position={[10,7,5]} intensity={2.35} color="#fff5df" castShadow={quality==='high'} shadow-mapSize={[1024,1024]} shadow-camera-left={-15} shadow-camera-right={15} shadow-camera-top={18} shadow-camera-bottom={-18} shadow-normalBias={.035} shadow-radius={3}/>
    <directionalLight position={[-6,3,-12]} intensity={.35} color="#e3ecf4"/><HallArchitecture classroom/><HallFurniture onSeat={onSeat} selected={selectedSeat}/>
    <Block at={[0,4.16,0]} size={[24,.08,30]} color="#e6dac4" surface="oak"/>
    <RepeatedBlocks items={Array.from({length:61},(_,i)=>[-11.8+i*.39,4.105,0])} size={[.075,.045,30]} color="#c3ab89" surface="oak"/>
    <Sign text="LUGAISH" sub="100 SEATS / LANGUAGE STUDIO" position={[-7,2.6,-14.76]} width={3} height={.8} dark/>
    <RepeatedBlocks items={[-10,-5,0,5,10].map(z=>[-11.86,2.15,z])} size={[.06,1.75,3.6]} color="#c3cfc2" surface="fabric"/>
    <RepeatedBlocks items={[-10,-5,0,5,10].flatMap(z=>[1.23,3.07].map(y=>[-11.8,y,z]))} size={[.1,.08,3.75]} color="#e0ceb0" surface="oak"/>
    <Sign text="LISTEN. PRACTISE. GROW." sub="One lesson at a time." position={[-11.75,2.4,-4]} rotation={[0,Math.PI/2,0]} width={3.2} height={1}/>
    <CampusPlant position={[11.35,0,-13.7]}/>
    <Sign text="ROOM 01" sub="100 seats · Choose a desk" position={[-10.8,2.7,14.94]} rotation={[0,Math.PI,0]} width={2} height={.6}/>
  </>;
}
