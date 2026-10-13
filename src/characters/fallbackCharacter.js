import { clone } from 'three/addons/utils/SkeletonUtils.js';
import { attachHumanStudent } from './HumanStudent.js';
import { bakeCartoonSkin } from './bakeCartoonSkin.js';
// At most three current preset templates per cached source rig. Geometry and
// materials are immutable/shared; clone creates separate bones and morph arrays.
const templates=new WeakMap();
export function fallbackCharacterTemplate(source,preset){
 let presets=templates.get(source);if(!presets){presets=new Map();templates.set(source,presets);}
 if(!presets.has(preset.id)){const scene=clone(source);attachHumanStudent(scene,preset);bakeCartoonSkin(scene);presets.set(preset.id,scene);}
 return presets.get(preset.id);
}
