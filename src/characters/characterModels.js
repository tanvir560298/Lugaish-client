// Activate only after the authored GLB and its license pass visual/rig review.
// These are exact legacy-rig slots. Quaternius Zain uses the separate native adapter
// in RiggedStudent; stable avatar IDs remain unchanged.
export const CHARACTER_MODELS = Object.freeze({ maya:null, noor:null, zain:null });
export function characterModel(id) {
  const asset=CHARACTER_MODELS[id];
  if(!asset)return null;
  if(asset.contract!=='lugaish-existing-rig-v1'||!/^\/models\/student\/authored\/[\w-]+\.glb$/.test(asset.url)||!asset.license)throw new Error('Character asset configuration needs a reviewed GLB and license record.');
  return asset;
}
