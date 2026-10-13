import { Box3, Sphere, Vector3 } from 'three';
const REQUIRED_CLIPS=['idle','walk','run','sitDown','standUp','seated'];
const normalize=name=>name.replaceAll('.','');
const checked=new WeakMap();
function bones(scene){const result=new Map();scene.traverse(o=>{if(o.isBone)result.set(normalize(o.name),o);});return result;}
// New artwork is skinned to the existing armature: no guessed retargeting.
export function validateAuthoredCharacter(authored,reference) {
  if(checked.has(authored.scene))return checked.get(authored.scene);
  const problems=[];
  authored.scene.updateWorldMatrix(true,true);reference.scene.updateWorldMatrix(true,true);
  const expected=bones(reference.scene),actual=bones(authored.scene);
  for(const [name,bone]of expected){
    const candidate=actual.get(name);
    if(!candidate){problems.push(`Missing bone ${name}`);continue;}
    const a=bone.matrixWorld.elements,b=candidate.matrixWorld.elements;
    if(a.some((value,i)=>Math.abs(value-b[i])>1e-4))problems.push(`Bind transform differs for ${name}`);
    if(normalize(bone.parent?.name||'')!==normalize(candidate.parent?.name||''))problems.push(`Bone hierarchy differs for ${name}`);
  }
  const names=new Set(reference.animations.map(c=>c.name));for(const name of REQUIRED_CLIPS)if(!names.has(name))problems.push(`Missing animation ${name}`);
  const inverseBinds=new Map();let referenceBind;
  reference.scene.traverse(mesh=>{if(!mesh.isSkinnedMesh)return;referenceBind=mesh.bindMatrix;mesh.skeleton.bones.forEach((bone,i)=>inverseBinds.set(normalize(bone.name),mesh.skeleton.boneInverses[i]));});
  let vertices=0,triangles=0,skinned=0,blended=0;
  const materials=new Set();
  authored.scene.traverse(mesh=>{
    if(!mesh.isMesh)return;
    vertices+=mesh.geometry.attributes.position?.count||0;
    triangles+=(mesh.geometry.index?.count||mesh.geometry.attributes.position?.count||0)/3;
    for(const material of Array.isArray(mesh.material)?mesh.material:[mesh.material]){
      materials.add(material);if(!material?.isMeshStandardMaterial&&!material?.isMeshPhysicalMaterial)problems.push(`${mesh.name} must use a PBR material`);
    }
    if(!mesh.isSkinnedMesh){if(!mesh.parent?.isBone)problems.push(`${mesh.name} accessory must be bone attached or skinned`);return;}
    skinned++;
    if(!referenceBind||referenceBind.elements.some((v,i)=>Math.abs(v-mesh.bindMatrix.elements[i])>1e-4))problems.push(`${mesh.name} bind matrix differs`);
    mesh.skeleton.bones.forEach((bone,i)=>{const expected=inverseBinds.get(normalize(bone.name)),actual=mesh.skeleton.boneInverses[i];if(!expected||!actual||expected.elements.some((v,j)=>Math.abs(v-actual.elements[j])>1e-4))problems.push(`Inverse bind differs for ${bone.name}`);});
    const p=mesh.geometry.attributes.position,w=mesh.geometry.attributes.skinWeight,j=mesh.geometry.attributes.skinIndex;
    if(!p||!w||!j||w.count!==p.count||j.count!==p.count||!mesh.geometry.attributes.normal){problems.push(`${mesh.name} needs normals and valid skin attributes`);return;}
    const seenBones=new Set(mesh.skeleton.bones.map(b=>normalize(b.name)));
    if([...seenBones].some(b=>!actual.has(b)))problems.push(`${mesh.name} skin references an unknown bone`);
    for(let i=0;i<w.count;i++){
      const weights=[w.getX(i),w.getY(i),w.getZ(i),w.getW(i)],indices=[j.getX(i),j.getY(i),j.getZ(i),j.getW(i)];
      if(weights.some(v=>!Number.isFinite(v)||v<0)||Math.abs(weights.reduce((a,b)=>a+b,0)-1)>.02||indices.some((n,k)=>weights[k]>0&&(!Number.isInteger(n)||n<0||n>=mesh.skeleton.bones.length))){problems.push(`${mesh.name} has invalid skin weights`);break;}
      if(weights.filter(v=>v>.01).length>1)blended++;
      if(![p.getX(i),p.getY(i),p.getZ(i)].every(Number.isFinite)){problems.push(`${mesh.name} has non-finite positions`);break;}
    }
  });
  if(!skinned)problems.push('No skinned character mesh');
  if(!blended)problems.push('Rigid single-bone weights cannot serve as the authored replacement');
  if(triangles>60000)problems.push('Character exceeds the 60k triangle review limit');
  const bounds=new Box3().setFromObject(authored.scene),size=bounds.getSize(new Vector3());
  if(size.y<1.4||size.y>2.2||Math.abs(bounds.min.y)>.15)problems.push('Expected floor-aligned, metre-scale student geometry (1.4–2.2 m)');
  if(problems.length)throw new Error(`Character compatibility failed: ${problems.slice(0,8).join('; ')}`);
  const report={vertices,triangles:Math.round(triangles),materials:materials.size,bones:actual.size,blendedVertices:blended};checked.set(authored.scene,report);return report;
}
export function prepareAuthoredCharacter(scene) {
  scene.traverse(mesh=>{
    if(!mesh.isMesh)return;
    mesh.castShadow=true;mesh.receiveShadow=true;
    // Materials/geometry remain shared; per-avatar skeleton and morph weights are cloned.
    if(mesh.morphTargetInfluences)mesh.morphTargetInfluences=mesh.morphTargetInfluences.slice();
    if(mesh.isSkinnedMesh){mesh.geometry.computeBoundingBox();const bound=mesh.geometry.boundingBox.getBoundingSphere(new Sphere());bound.radius+=1;mesh.boundingSphere=bound;}
    mesh.frustumCulled=true;
  });
}
export function createFaceMotion(scene,offset=0) {
  const channels=[];scene.traverse(mesh=>{
    if(!mesh.morphTargetDictionary||!mesh.morphTargetInfluences)return;
    for(const [name,index]of Object.entries(mesh.morphTargetDictionary))if(['eyeBlinkLeft','eyeBlinkRight','blinkLeft','blinkRight'].includes(name))channels.push({mesh,index});
  });
  let time=offset;
  return {supported:channels.length>0,update(dt){time+=Math.min(.05,Math.max(0,dt));const phase=time%4.7;const weight=phase<.16?Math.sin(phase/.16*Math.PI):0;for(const {mesh,index}of channels)mesh.morphTargetInfluences[index]=weight;}};
}
