import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';
export default function CampusSign({text,position,width=3,height=.5}){
 const map=useMemo(()=>{const c=document.createElement('canvas');c.width=1024;c.height=160;const g=c.getContext('2d');g.fillStyle='#f2eee3';g.fillRect(0,0,1024,160);g.fillStyle='#294c43';g.font='600 62px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText(text,512,82,960);const t=new CanvasTexture(c);t.colorSpace=SRGBColorSpace;return t;},[text]);
 useEffect(()=>()=>map.dispose(),[map]);
 return <mesh position={position}><planeGeometry args={[width,height]}/><meshBasicMaterial map={map} toneMapped={false}/></mesh>;
}
