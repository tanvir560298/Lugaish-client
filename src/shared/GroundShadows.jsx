import { useLayoutEffect, useRef } from 'react';
import { CanvasTexture, MeshBasicMaterial, Object3D, PlaneGeometry } from 'three';
let resources;
function shared(){
 if(resources)return resources;
 const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');
 const gradient=g.createRadialGradient(32,32,5,32,32,32);gradient.addColorStop(0,'#000000');gradient.addColorStop(.45,'#00000080');gradient.addColorStop(1,'#00000000');g.fillStyle=gradient;g.fillRect(0,0,64,64);
 resources={geometry:new PlaneGeometry(1,1),material:new MeshBasicMaterial({map:new CanvasTexture(c),transparent:true,opacity:.18,depthWrite:false})};return resources;
}
// A restrained static contact wash adds grounding even in low graphics mode.
// One shared texture and one instanced draw, no blur passes or moving lights.
export default function GroundShadows({items,size}){
 const ref=useRef(),{geometry,material}=shared();
 useLayoutEffect(()=>{const o=new Object3D();items.forEach((p,i)=>{o.position.set(p[0],.012,p[2]);o.rotation.set(-Math.PI/2,0,0);o.scale.set(size[0],size[1],1);o.updateMatrix();ref.current.setMatrixAt(i,o.matrix);});ref.current.instanceMatrix.needsUpdate=true;ref.current.computeBoundingSphere();},[items,size]);
 return <instancedMesh ref={ref} args={[geometry,material,items.length]} dispose={null} raycast={()=>null}/>;
}
