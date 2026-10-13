import { useLayoutEffect, useRef } from 'react';
import { campusMaterial } from '../shared/campusMaterials.js';
import { BoxGeometry, MeshStandardMaterial, Object3D } from 'three';
const unitBox = new BoxGeometry(1,1,1), materials = new Map();
function material(color) { if(!materials.has(color))materials.set(color,new MeshStandardMaterial({color,roughness:.78}));return materials.get(color); }
export function Block({at,size,color='#e4e2d9',surface,...rest}) {return <mesh geometry={unitBox} material={surface?campusMaterial(surface,color):material(color)} position={at} scale={size} castShadow receiveShadow dispose={null} {...rest}/>;}
export function RepeatedBlocks({items,size,color,onClick,surface}) {
  const ref=useRef();
  useLayoutEffect(()=>{const o=new Object3D();items.forEach((p,i)=>{o.position.set(...p);o.scale.set(...size);o.updateMatrix();ref.current.setMatrixAt(i,o.matrix);});ref.current.instanceMatrix.needsUpdate=true;ref.current.computeBoundingSphere();},[items,size]);
  return <instancedMesh ref={ref} args={[unitBox,surface?campusMaterial(surface,color):material(color),items.length]} castShadow receiveShadow dispose={null} onClick={onClick}/>;
}
