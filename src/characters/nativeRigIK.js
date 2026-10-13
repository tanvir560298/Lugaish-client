import { Quaternion, Vector3 } from "three";
export function worldQuaternion(bone, quaternion) {
  bone.quaternion.copy(
    bone.parent
      .getWorldQuaternion(new Quaternion())
      .invert()
      .multiply(quaternion),
  );
  bone.updateWorldMatrix(false, true);
}
export function worldPosition(bone, point) {
  bone.position.copy(bone.parent.worldToLocal(point.clone()));
  bone.updateWorldMatrix(false, true);
}
export function nativeChain(scene, upperName, lowerName, endName) {
  const upper = scene.getObjectByName(upperName),
    lower = scene.getObjectByName(lowerName),
    end = scene.getObjectByName(endName);
  if (!upper || !lower || !end)
    throw Error(`Missing native chain ${upperName}`);
  scene.updateMatrixWorld(true);
  const a = upper.getWorldPosition(new Vector3()),
    b = lower.getWorldPosition(new Vector3()),
    c = end.getWorldPosition(new Vector3());
  return {
    upper,
    lower,
    end,
    lengthA: a.distanceTo(b),
    lengthB: b.distanceTo(c),
    directionA: b.clone().sub(a).normalize(),
    directionB: c.clone().sub(b).normalize(),
    rotationA: upper.getWorldQuaternion(new Quaternion()),
    rotationB: lower.getWorldQuaternion(new Quaternion()),
    rotationEnd: end.getWorldQuaternion(new Quaternion()),
    independent: end.parent !== lower,
  };
}
// Handles the Quaternius rig's root-parented feet as well as connected wrists.
// Rotate joints only: never stretch bone offsets or change mesh scale.
export function solveNativeChain(chain, target, pole) {
  const { upper, lower, end, lengthA: a, lengthB: b } = chain,
    hip = upper.getWorldPosition(new Vector3());
  const ray = target.clone().sub(hip),
    distance = Math.max(
      Math.abs(a - b) + 1e-5,
      Math.min(ray.length(), a + b - 1e-5),
    );
  ray.normalize();
  const bend = pole.clone().addScaledVector(ray, -pole.dot(ray)).normalize();
  const along = (a * a + distance * distance - b * b) / (2 * distance),
    knee = hip
      .clone()
      .addScaledVector(ray, along)
      .addScaledVector(bend, Math.sqrt(Math.max(0, a * a - along * along)));
  worldQuaternion(
    upper,
    new Quaternion()
      .setFromUnitVectors(chain.directionA, knee.clone().sub(hip).normalize())
      .multiply(chain.rotationA),
  );
  const actualKnee = lower.getWorldPosition(new Vector3()),
    tip = hip.clone().addScaledVector(ray, distance);
  worldQuaternion(
    lower,
    new Quaternion()
      .setFromUnitVectors(
        chain.directionB,
        tip.clone().sub(actualKnee).normalize(),
      )
      .multiply(chain.rotationB),
  );
  if (chain.independent) worldPosition(end, tip);
  return { reachError: tip.distanceTo(target), tip };
}
