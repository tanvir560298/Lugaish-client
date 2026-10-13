import { useLayoutEffect, useRef } from 'react';
import { CylinderGeometry, DoubleSide, MeshStandardMaterial, Object3D, Shape, ShapeGeometry } from 'three';
const leaf=new Shape();leaf.moveTo(0,0);leaf.quadraticCurveTo(-.2,.15,0,.48);leaf.quadraticCurveTo(.21,.25,0,0);
const geometry=new ShapeGeometry(leaf,8),greens=['#58795c','#78976c'].map(color=>new MeshStandardMaterial({color,roughness:.92,side:DoubleSide}));
const pots=new CylinderGeometry(.3,.235,.58,20),soil=new CylinderGeometry(.275,.275,.015,20),stem=new CylinderGeometry(.016,.024,1.05,8);
const ceramic=new MeshStandardMaterial({color:'#bfaa8e',roughness:.9}),earth=new MeshStandardMaterial({color:'#5a4d3b',roughness:1}),bark=new MeshStandardMaterial({color:'#597151',roughness:.95});
const leaves=[[],[]];
for(let level=0;level<4;level++)for(const [i,side] of [-1,1].entries())for(let n=0;n<2;n++){
 const group=new Object3D(),blade=new Object3D();group.position.set(0,.76+level*.21,0);group.rotation.set(0,level*.8+i*.4,-side*.85);blade.rotation.set(0,n?1.7:0,n?.15:0);blade.scale.set(n?.8:1,n?.7:.85,1);group.add(blade);group.updateMatrixWorld(true);leaves[(level+n)%2].push(blade.matrixWorld.clone());
}
// Original pointed leaf silhouettes, two instanced draws per plant.
export default function CampusPlant({position=[0,0,0]}){
 const refs=useRef([]);
 useLayoutEffect(()=>{leaves.forEach((matrices,color)=>{const mesh=refs.current[color];matrices.forEach((matrix,i)=>mesh.setMatrixAt(i,matrix));mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();});},[]);
 return <group position={position} dispose={null}>
  <mesh position={[0,.29,0]} geometry={pots} material={ceramic} castShadow receiveShadow/>
  <mesh position={[0,.585,0]} geometry={soil} material={earth}/>
  <mesh position={[0,1.1,0]} geometry={stem} material={bark} castShadow/>
  {leaves.map((matrices,i)=><instancedMesh key={i} ref={mesh=>{refs.current[i]=mesh;}} args={[geometry,greens[i],matrices.length]} castShadow/>)}
 </group>;
}
