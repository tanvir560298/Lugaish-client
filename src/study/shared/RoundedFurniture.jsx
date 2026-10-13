import { useLayoutEffect, useRef } from 'react';
import { Object3D, MeshStandardMaterial, CanvasTexture, Color, SRGBColorSpace, RepeatWrapping } from 'three';
import { campusMaterial } from '../../shared/campusMaterials.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
function oakGrain(){
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;
 const ctx=canvas.getContext('2d');ctx.fillStyle='#f2e2cb';ctx.fillRect(0,0,512,128);
 for(let i=0;i<70;i++){ctx.strokeStyle=i%3?'#a28b6522':'#7e67431a';ctx.lineWidth=i%4===0?2:1;ctx.beginPath();for(let x=0;x<=512;x+=16){const y=i*2+Math.sin(x*.015+i)*1.6;if(!x)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();}
 const texture=new CanvasTexture(canvas);texture.colorSpace=SRGBColorSpace;texture.wrapS=texture.wrapT=RepeatWrapping;texture.repeat.set(2,1);return texture;
}
const shape=new RoundedBoxGeometry(1,1,1,2,.065),materials=new Map();
export function RoundedFurniture({items,size,color,onClick,onHover,surface,colors}){
 const ref=useRef();
 if(!materials.has(color))materials.set(color,new MeshStandardMaterial({color,roughness:color==='#b89b72'?.82:.72,metalness:.04,...(color==='#b89b72'?{map:oakGrain()}:{})}));
 useLayoutEffect(()=>{const o=new Object3D();items.forEach((p,i)=>{o.position.set(...p);o.scale.set(...size);o.updateMatrix();ref.current.setMatrixAt(i,o.matrix);if(colors)ref.current.setColorAt(i,new Color(colors[i]));});ref.current.instanceMatrix.needsUpdate=true;if(ref.current.instanceColor)ref.current.instanceColor.needsUpdate=true;ref.current.computeBoundingSphere();},[items,size,colors]);
 return <instancedMesh ref={ref} args={[shape,surface?campusMaterial(surface,color):materials.get(color),items.length]} dispose={null} castShadow receiveShadow onClick={onClick} onPointerOver={onHover} onPointerOut={()=>onHover?.(null)}/>;
}
