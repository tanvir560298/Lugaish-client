// Cached GLTF artwork is shared. Only instance-owned resources may be released.
export function instanceResourceCleanup(scene,source) {
  const sharedGeometry=new Set(),sharedMaterials=new Set();
  source.traverse(o=>{if(o.isMesh){sharedGeometry.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])sharedMaterials.add(m);}});
  const geometry=new Set(),materials=new Set(),skeletons=new Set();
  scene.traverse(o=>{if(!o.isMesh)return;if(!sharedGeometry.has(o.geometry))geometry.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])if(!sharedMaterials.has(m))materials.add(m);if(o.isSkinnedMesh&&o.skeleton)skeletons.add(o.skeleton);});
  return ()=>{for(const g of geometry)g.dispose();for(const m of materials)m.dispose();for(const s of skeletons)s.dispose();};
}
