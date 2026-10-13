import { Group, Mesh, MeshStandardMaterial, SphereGeometry, TorusGeometry, CapsuleGeometry } from 'three';

// Rounded forms follow the existing skeleton, so room interactions retain their animations.
export function attachCartoonStudent(scene, preset) {
  scene.traverse(object => { if (object.isMesh) object.visible = false; });
  const materials = new Map();
  const material = color => {
    if (!materials.has(color)) materials.set(color, new MeshStandardMaterial({ color, roughness: .95, metalness: 0 }));
    return materials.get(color);
  };
  const sphere = new SphereGeometry(1, 24, 16);
  const add = (parent, color, position, scale) => {
    const mesh = new Mesh(sphere, material(color));
    mesh.position.set(...position); mesh.scale.set(...scale); mesh.castShadow = true;
    parent.add(mesh); return mesh;
  };
  const bone = name => scene.getObjectByName(name) || scene.getObjectByName(name.replaceAll('.', ''));
  const segment = (name, length, radius, color) => {
    const parent = bone(name); if (!parent) return;
    const mesh = new Mesh(new CapsuleGeometry(radius, Math.max(0, length - radius * 2), 8, 16), material(color));
    mesh.position.y = length / 2; mesh.castShadow = true; parent.add(mesh);
  };
  const torso = bone('DEF-spine.001');
  if (torso) {
    add(torso, preset.jacketColor, [0, .17, 0], [.205, .27, .125]);
    add(torso, preset.innerColor, [0, .26, .12], [.07, .115, .014]);
    // Soft canvas backpack and visible shoulder straps.
    add(torso, preset.backpackColor, [0, .2, -.145], [.18, .23, .08]);
    for (const x of [-.14, .14]) add(torso, preset.backpackColor, [x, .25, .095], [.022, .18, .025]);
  }
  const hips = bone('DEF-hips');
  if (hips) add(hips, preset.pantsColor, [0, .025, 0], [.19, .115, .13]);
  for (const side of ['L', 'R']) {
    segment(`DEF-upper_arm.${side}`, .275, .065, preset.jacketColor);
    segment(`DEF-forearm.${side}`, .273, .05, preset.skinColor);
    const hand = bone(`DEF-hand.${side}`);
    if (hand) {
      add(hand, preset.skinColor, [0, .065, 0], [.047, .075, .03]);
      add(hand, preset.skinColor, [.035, .045, .015], [.025, .035, .025]);
    }
    segment(`DEF-thigh.${side}`, .4, .09, preset.pantsColor);
    segment(`DEF-shin.${side}`, .425, .065, preset.pantsColor);
    const foot = bone(`DEF-foot.${side}`);
    if (foot) {
      add(foot, preset.shoeColor, [0, .065, -.022], [.08, .105, .04]);
      add(foot, '#fff6df', [0, .065, .018], [.082, .105, .012]);
      for (const y of [.04, .075, .11]) add(foot, '#fff6df', [0, y, -.065], [.045, .008, .008]);
    }
  }
  segment('DEF-neck', .09, .06, preset.skinColor);
  const head = bone('DEF-head');
  if (!head) return;
  const face = new Group(); head.add(face);
  add(face, preset.skinColor, [0, .12, 0], [.165, .19, .14]);
  for (const x of [-.165, .165]) add(face, preset.skinColor, [x, .105, 0], [.03, .045, .028]);
  for (const x of [-.06, .06]) {
    add(face, '#fffdf6', [x, .135, .129], [.03, .037, .015]);
    add(face, '#302017', [x, .132, .143], [.017, .023, .008]);
    add(face, '#ffffff', [x - .006, .143, .151], [.006, .008, .003]);
    add(face, '#ed927d', [x * 1.65, .086, .112], [.028, .015, .008]);
    const brow = add(face, preset.hairColor, [x, .183, .125], [.031, .006, .007]);
    brow.rotation.z = x < 0 ? .12 : -.12;
  }
  add(face, preset.skinColor, [0, .105, .145], [.022, .026, .025]);
  const smile = new Mesh(new TorusGeometry(.043, .006, 8, 24, Math.PI), material('#9a4436'));
  smile.rotation.z = Math.PI; smile.position.set(0, .073, .133); face.add(smile);
  // Crown stays behind the forehead; overlapping curls make a soft scalloped fringe.
  add(face, preset.hairColor, [0, .24, -.025], [.173, .095, .145]);
  for (let i = 0; i < 7; i++) {
    const x = (i - 3) * .044;
    add(face, preset.hairColor, [x, .245 - Math.abs(x) * .22 + Math.sin(i * 1.7) * .009, .075], [.043, .049, .045]);
  }
  if (preset.hairStyle !== 'short') {
    for (const side of [-1, 1]) {
      for (let i = 0; i < (preset.hairStyle === 'wavy' ? 5 : 3); i++) {
        add(face, preset.hairColor, [side * .153, .19 - i * .052, -.024], [.045, .06, .10]);
      }
    }
    add(face, preset.hairColor, [0, .08, -.115], [.15, .17, .05]);
  }
  if (preset.hasGlasses) {
    for (const x of [-.06, .06]) {
      const rim = new Mesh(new TorusGeometry(.041, .003, 8, 32), material(preset.glassesColor));
      rim.position.set(x, .135, .158); face.add(rim);
    }
    add(face, preset.glassesColor, [0, .14, .158], [.019, .003, .003]);
  }
}
