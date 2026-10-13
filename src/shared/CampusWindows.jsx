import { useEffect, useMemo, useState } from 'react';
import { CanvasTexture, SRGBColorSpace, TextureLoader, PlaneGeometry } from 'three';
import { Block, RepeatedBlocks } from '../classroom/Blocks.jsx';
let landscape;
function garden(){
 if(landscape)return landscape;
 const c=document.createElement('canvas');c.width=1024;c.height=512;const g=c.getContext('2d');
 const sky=g.createLinearGradient(0,0,0,512);sky.addColorStop(0,'#aecde0');sky.addColorStop(.6,'#e6ede4');sky.addColorStop(1,'#97ad86');g.fillStyle=sky;g.fillRect(0,0,1024,512);
 g.fillStyle='#b0c5b5';g.beginPath();g.moveTo(0,340);for(let x=0;x<=1024;x+=16)g.lineTo(x,315+Math.sin(x*.007)*28+Math.sin(x*.019)*9);g.lineTo(1024,512);g.lineTo(0,512);g.fill();
 for(let i=0;i<26;i++){const x=i*43-20,y=318+Math.sin(i*3)*32,r=30+i%5*8;g.fillStyle='#687a6366';g.fillRect(x-2,y,4,190);for(let j=0;j<5;j++){g.fillStyle=['#7f9b78','#91ac86','#9cb78e','#769570','#abc09b'][j];g.beginPath();g.ellipse(x+Math.sin(j*2+i)*r*.45,y+j*14,r*.68,r*.85,0,0,Math.PI*2);g.fill();}}
 g.fillStyle='#e9eee624';g.fillRect(0,0,1024,512);
 landscape=new CanvasTexture(c);landscape.colorSpace=SRGBColorSpace;return landscape;
}
let panoramaPromise;
function loadPanorama(){
 if(!panoramaPromise)panoramaPromise=new Promise(resolve=>new TextureLoader().load('/textures/campus/garden-panorama.jpg',t=>{t.colorSpace=SRGBColorSpace;t.anisotropy=4;resolve(t);},undefined,()=>resolve(null)));
 return panoramaPromise;
}
function WindowPane({x,z,center,width,height,map,index,photographic}){
 const geometry=useMemo(()=>{
  const g=new PlaneGeometry(width,height);
  if(photographic){const uv=g.attributes.uv;for(let n=0;n<uv.count;n++)uv.setXY(n,.22+index*.095+uv.getX(n)*.095,.32+uv.getY(n)*.36);}
  return g;
 },[width,height,index,photographic]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 return <mesh geometry={geometry} position={[x,center,z]} rotation={[0,-Math.PI/2,0]}><meshBasicMaterial map={map} toneMapped={false}/></mesh>;
}
export default function CampusWindows({x,bays,height=3.05,center=2.25,width=4.15}){
 const fallback=useMemo(garden,[]),[photo,setPhoto]=useState(null);
 useEffect(()=>{let active=true;loadPanorama().then(t=>{if(active)setPhoto(t);});return()=>{active=false;};},[]);
 const map=photo||fallback;
 return <group>
  {bays.map((z,index)=><group key={z}>
   <WindowPane x={x} z={z} center={center} width={width} height={height} map={map} index={index} photographic={Boolean(photo)}/>
   <Block at={[x-.06,center-height/2-.08,z]} size={[.23,.13,width+.28]} color="#cdb18d" surface="oak"/>
   <Block at={[x-.035,center+height/2+.08,z]} size={[.12,.13,width+.28]} color="#cdb18d" surface="oak"/>
   <RepeatedBlocks items={[z-width/2-.07,z,z+width/2+.07].map(zz=>[x-.07,center,zz])} size={[.16,height+.15,.09]} color="#b39774" surface="oak"/>
   <Block at={[x-.085,center+.23,z]} size={[.14,.065,width]} color="#b39774" surface="oak"/>
   <mesh position={[x-.1,center,z]} rotation={[0,-Math.PI/2,0]}><planeGeometry args={[width,height]}/><meshBasicMaterial color="#ffffff" transparent opacity={.035} depthWrite={false}/></mesh>
   <mesh position={[x-2.1,.018,z+.55]} rotation={[-Math.PI/2,0,-.28]}><planeGeometry args={[4.3,width*.83]}/><meshBasicMaterial color="#fff5da" transparent opacity={.16} depthWrite={false}/></mesh>
  </group>)}
 </group>;
}
