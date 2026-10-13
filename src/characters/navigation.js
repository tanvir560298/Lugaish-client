import { capsuleBlocked } from './characterController.js';
export function planPath(start, goal, environment, bounds = { minX: -4.8, maxX: 4.2, minZ: -4.3, maxZ: 4.1 }) {
  const free = p => !capsuleBlocked(p.x, 0, p.z, environment.boxes);
  const clear = (a, b) => {
    const steps = Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) / .06);
    for (let i = 0; i <= steps; i++) {
      const t = steps ? i / steps : 0;
      if (!free({ x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t })) return false;
    }
    return true;
  };
  if (!free(start) || !free(goal)) return null;
  if (clear(start, goal)) return [goal];
  const spacing = .16;
  const nodes = [];
  for (let x = bounds.minX; x <= bounds.maxX; x += spacing) for (let z = bounds.minZ; z <= bounds.maxZ; z += spacing) {
    const p = { x, z }; if (free(p)) nodes.push(p);
  }
  // Include the destination's exact row/column: narrow furniture aisles can fall
  // between grid rows even though they are wide enough for the capsule.
  for (let x = bounds.minX; x <= bounds.maxX; x += spacing) { const p = { x, z: goal.z }; if (free(p)) nodes.push(p); }
  for (let z = bounds.minZ; z <= bounds.maxZ; z += spacing) { const p = { x: goal.x, z }; if (free(p)) nodes.push(p); }
  for (let x = bounds.minX; x <= bounds.maxX; x += spacing) { const p = { x, z: start.z }; if (free(p)) nodes.push(p); }
  for (let z = bounds.minZ; z <= bounds.maxZ; z += spacing) { const p = { x: start.x, z }; if (free(p)) nodes.push(p); }
  nodes.push({ ...start }, { ...goal });
  const nearest = p => nodes.map((n, i) => ({ i, d: Math.hypot(n.x - p.x, n.z - p.z) })).sort((a,b) => a.d-b.d).find(n => clear(p, nodes[n.i]))?.i;
  const from = nearest(start), to = nearest(goal);
  if (from === undefined || to === undefined) return null;
  const buckets = new Map(), cell = spacing * 1.5;
  const bucketKey = (x,z) => `${Math.floor(x/cell)},${Math.floor(z/cell)}`;
  nodes.forEach((p,i)=>{const key=bucketKey(p.x,p.z);if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(i);});
  const neighbors = i => { const p=nodes[i], bx=Math.floor(p.x/cell), bz=Math.floor(p.z/cell), result=[];for(let x=bx-1;x<=bx+1;x++)for(let z=bz-1;z<=bz+1;z++)result.push(...(buckets.get(`${x},${z}`)||[]));return result; };
  const open = new Set([from]), closed = new Set(), parent = new Map(), cost = new Map([[from, 0]]);
  const distance = (i, j) => Math.hypot(nodes[i].x - nodes[j].x, nodes[i].z - nodes[j].z);
  while (open.size) {
    let current, best = Infinity;
    for (const i of open) { const score = cost.get(i) + distance(i, to); if (score < best) { best = score; current = i; } }
    if (current === to) {
      const path = [goal]; let i = to;
      while (i !== undefined) { path.unshift(nodes[i]); i = parent.get(i); }
      // Remove unnecessary turns only when the whole capsule corridor is clear.
      const result = []; let anchor = start;
      for (let j = 0; j < path.length;) {
        let last = j; while (last + 1 < path.length && clear(anchor, path[last + 1])) last++;
        result.push(path[last]); anchor = path[last]; j = last + 1;
      }
      return result;
    }
    open.delete(current); closed.add(current);
    for (const i of neighbors(current)) {
      if (closed.has(i) || i === current || distance(current, i) > spacing * 1.45 || !clear(nodes[current], nodes[i])) continue;
      const tentative = cost.get(current) + distance(current, i);
      if (tentative < (cost.get(i) ?? Infinity)) { parent.set(i, current); cost.set(i, tentative); open.add(i); }
    }
  }
  return null;
}
