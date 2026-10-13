import { BufferAttribute, Color, Matrix4, MeshStandardMaterial, Skeleton, SkinnedMesh } from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Bone-attached shapes become one vertex-colored skinned draw call per person.
// This retains the rounded artwork and exact rig while avoiding thousands of
// individual draw calls when a shared hall fills up.
export function bakeCartoonSkin(scene) {
  scene.updateWorldMatrix(true,true);
  const bones=[];scene.traverse(o=>{if(o.isBone)bones.push(o);});
  const pieces=[],sources=[],inverse=scene.matrixWorld.clone().invert();
  scene.traverse(object=>{
    if(!object.isMesh||!object.visible)return;
    let bone=object.parent;while(bone&&!bone.isBone)bone=bone.parent;
    const index=bones.indexOf(bone);if(index<0)return;
    const geometry=object.geometry.clone().applyMatrix4(new Matrix4().multiplyMatrices(inverse,object.matrixWorld));
    const count=geometry.attributes.position.count,indices=new Uint16Array(count*4),weights=new Float32Array(count*4),colors=new Float32Array(count*3),color=new Color(object.material.color);
    for(let i=0;i<count;i++){indices[i*4]=index;weights[i*4]=1;colors.set([color.r,color.g,color.b],i*3);}
    if(!geometry.attributes.skinIndex)geometry.setAttribute('skinIndex',new BufferAttribute(indices,4));if(!geometry.attributes.skinWeight)geometry.setAttribute('skinWeight',new BufferAttribute(weights,4));geometry.setAttribute('color',new BufferAttribute(colors,3));
    geometry.setAttribute('surfaceRoughness',new BufferAttribute(new Float32Array(count).fill(object.material.roughness??.85),1));
    const transform=new Matrix4().multiplyMatrices(inverse,object.matrixWorld);
    const blink=object.geometry.clone();if(object.userData.blink)blink.scale(1,.06,1);blink.applyMatrix4(transform);
    const breath=object.geometry.clone();if(object.userData.breath)breath.scale(1.012,1,1.012);breath.applyMatrix4(transform);
    geometry.morphAttributes.position=[blink.attributes.position.clone(),breath.attributes.position.clone()];blink.dispose();breath.dispose();
    pieces.push(geometry);sources.push(object);
  });
  const geometry=mergeGeometries(pieces,false);if(!geometry)throw new Error('Cannot combine character geometry.');
  const material=new MeshStandardMaterial({vertexColors:true,roughness:1});
  material.onBeforeCompile=shader=>{shader.vertexShader='attribute float surfaceRoughness; varying float vAvatarRoughness;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvAvatarRoughness=surfaceRoughness;');shader.fragmentShader='varying float vAvatarRoughness;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor *= vAvatarRoughness;');};
  material.customProgramCacheKey=()=> 'lugaish-human-surfaces-v1';
  const mesh=new SkinnedMesh(geometry,material);mesh.name='LugaishCartoonSkin';mesh.castShadow=true;mesh.receiveShadow=true;mesh.frustumCulled=false;
  mesh.morphTargetDictionary={blink:0,breathing:1};mesh.morphTargetInfluences=[0,0];scene.add(mesh);mesh.bind(new Skeleton(bones),scene.matrixWorld);sources.forEach(o=>{o.visible=false;});pieces.forEach(g=>g.dispose());
  return mesh;
}
