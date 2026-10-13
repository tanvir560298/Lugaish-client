import { Quaternion, Vector3 } from 'three';
export const findBone = (scene, name) => scene.getObjectByName(name) || scene.getObjectByName(name.replaceAll('.', ''));

// Two-bone IK preserves segment lengths and the authored foot orientation/heel roll.
export function solveLeg(thigh, shin, foot, target) {
  const hip = thigh.getWorldPosition(new Vector3()), knee = shin.getWorldPosition(new Vector3()), ankle = foot.getWorldPosition(new Vector3());
  const upper = hip.distanceTo(knee), lower = knee.distanceTo(ankle);
  const direction = target.clone().sub(hip); const distance = Math.max(Math.abs(upper - lower) + .001, Math.min(direction.length(), upper + lower - .001));
  direction.normalize();
  const bend = knee.clone().sub(hip); bend.addScaledVector(direction, -bend.dot(direction));
  if (bend.lengthSq() < 1e-8) bend.set(0, 0, 1).addScaledVector(direction, -direction.z);
  bend.normalize();
  const along = (upper * upper + distance * distance - lower * lower) / (2 * distance);
  const desiredKnee = hip.clone().addScaledVector(direction, along).addScaledVector(bend, Math.sqrt(Math.max(0, upper * upper - along * along)));
  const rotate = (bone, child, goal) => {
    const origin = bone.getWorldPosition(new Vector3());
    const from = child.getWorldPosition(new Vector3()).sub(origin).normalize(), to = goal.clone().sub(origin).normalize();
    const q = bone.getWorldQuaternion(new Quaternion()).premultiply(new Quaternion().setFromUnitVectors(from, to));
    bone.quaternion.copy(bone.parent.getWorldQuaternion(new Quaternion()).invert().multiply(q));
    bone.updateWorldMatrix(false, true);
  };
  const orientation = foot.getWorldQuaternion(new Quaternion());
  rotate(thigh, shin, desiredKnee); rotate(shin, foot, hip.clone().addScaledVector(direction, distance));
  foot.quaternion.copy(foot.parent.getWorldQuaternion(new Quaternion()).invert().multiply(orientation));
  foot.updateWorldMatrix(false, true);
}
export function createFootPlanting(scene) {
  const feet = ['L', 'R'].map(side => ({
    thigh: findBone(scene, `DEF-thigh.${side}`), shin: findBone(scene, `DEF-shin.${side}`),
    foot: findBone(scene, `DEF-foot.${side}`), toe: findBone(scene, `DEF-toe.${side}`), anchor: null,
  })).filter(f => f.thigh && f.shin && f.foot && f.toe);
  return {
    reset() { feet.forEach(f => { f.anchor = null; }); },
    update({ grounded = true, seated = false, ground = () => 0 } = {}) {
      if (!grounded || seated) { this.reset(); return; }
      scene.updateWorldMatrix(true, true);
      for (const f of feet) {
        const toe = f.toe.getWorldPosition(new Vector3()), floor = ground(toe.x, toe.z);
        if (floor === null) { f.anchor = null; continue; }
        if (toe.y > floor + .075 || (f.anchor && toe.distanceTo(f.anchor) > .22)) f.anchor = null;
        if (!f.anchor && toe.y < floor + .045) f.anchor = toe.clone().setY(floor + .015);
        if (!f.anchor) continue;
        const ankle = f.foot.getWorldPosition(new Vector3());
        const correction = f.anchor.clone().sub(toe);
        // Bounded correction protects joints on abrupt turns and stair edges.
        if (correction.length() > .18) correction.setLength(.18);
        solveLeg(f.thigh, f.shin, f.foot, ankle.add(correction));
      }
    },
  };
}
