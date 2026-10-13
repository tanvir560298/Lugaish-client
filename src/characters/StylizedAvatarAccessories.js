import {
  BoxGeometry,
  BufferAttribute,
  CircleGeometry,
  Color,
  CylinderGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  SphereGeometry,
  TorusGeometry
} from 'three';

/**
 * Assigns anatomical vertex colors to the character's skinned mesh geometry
 * based on bone skinning weights and rest-pose vertex positions.
 */
export function styleMannequinMesh(mannequin, preset) {
  if (!mannequin || !mannequin.isSkinnedMesh) return;

  const geom = mannequin.geometry.clone();
  mannequin.geometry = geom;

  const pos = geom.attributes.position;
  const skinIndex = geom.attributes.skinIndex || geom.attributes.JOINTS_0;
  const skinWeight = geom.attributes.skinWeight || geom.attributes.WEIGHTS_0;
  if (!pos || !skinIndex || !skinWeight) {
    console.warn('Mannequin missing skinIndex/skinWeight', geom.attributes);
    return;
  }

  const count = pos.count;
  const colors = new Float32Array(count * 3);

  const cSkin = new Color(preset.skinColor);
  const cJacket = new Color(preset.jacketColor);
  const cInner = new Color(preset.innerColor);
  const cPants = new Color(preset.pantsColor);
  const cShoe = new Color(preset.shoeColor);
  const cWhite = new Color('#ffffff');

  const bones = mannequin.skeleton?.bones || [];

  for (let i = 0; i < count; i++) {
    let bestJoint = 0;
    let maxW = -1;

    const jIndices = [
      skinIndex.getX(i),
      skinIndex.getY(i),
      skinIndex.getZ(i),
      skinIndex.getW(i),
    ];
    const wValues = [
      skinWeight.getX(i),
      skinWeight.getY(i),
      skinWeight.getZ(i),
      skinWeight.getW(i),
    ];

    for (let k = 0; k < 4; k++) {
      if (wValues[k] > maxW) {
        maxW = wValues[k];
        bestJoint = jIndices[k];
      }
    }

    const boneName = bones[bestJoint]?.name || '';
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    let chosen = cJacket;

    if (boneName === 'DEF-head' || boneName === 'DEF-neck' || y > 1.45) {
      chosen = cSkin;
    } else if (
      boneName.startsWith('DEF-hand') ||
      boneName.startsWith('DEF-thumb') ||
      boneName.startsWith('DEF-f_')
    ) {
      chosen = cSkin;
    } else if (boneName.startsWith('DEF-foot') || boneName.startsWith('DEF-toe') || y < 0.09) {
      chosen = y < 0.045 ? cWhite : cShoe;
    } else if (
      boneName.startsWith('DEF-thigh') ||
      boneName.startsWith('DEF-shin') ||
      boneName === 'DEF-hips' ||
      boneName.startsWith('DEF-pelvis') ||
      (y >= 0.09 && y < 0.88)
    ) {
      chosen = cPants;
    } else {
      // Upper body: check for inner shirt cutout
      if (Math.abs(x) < 0.07 && z > 0.035 && y > 0.95 && y < 1.35) {
        chosen = cInner;
      } else {
        chosen = cJacket;
      }
    }

    colors[i * 3] = chosen.r;
    colors[i * 3 + 1] = chosen.g;
    colors[i * 3 + 2] = chosen.b;
  }

  geom.setAttribute('color', new BufferAttribute(colors, 3));
  if (geom.clearGroups) {
    geom.clearGroups();
  }

  const mat = new MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.78,
    metalness: 0.05,
  });
  mannequin.material = mat;
}

/**
 * Attaches procedural 3D hair, cartoon Pixar eyes, smile, round glasses,
 * collegiate canvas backpack, and textbook to the skeleton bones.
 */
export function attachStylizedAccessories(scene, preset) {
  // 1. Head Bone: Pixar Eyes, Smile, Eyebrows, Glasses, and 3D Hair
  const headBone = scene.getObjectByName('DEF-head');
  if (headBone) {
    const oldHeadAcc = headBone.getObjectByName('stylized-head-accessories');
    if (oldHeadAcc) headBone.remove(oldHeadAcc);

    const headGroup = new Group();
    headGroup.name = 'stylized-head-accessories';

    // Expressive Pixar Cartoon Eyes
    const eyeMatWhite = new MeshStandardMaterial({ color: '#fbfbfb', roughness: 0.25 });
    const eyeMatPupil = new MeshBasicMaterial({ color: '#161311' });
    const eyeMatHighlight = new MeshBasicMaterial({ color: '#ffffff' });

    [-0.038, 0.038].forEach((eyeX) => {
      const eye = new Group();
      eye.position.set(eyeX, 0.125, 0.108);

      // White Sclera
      const sclera = new Mesh(new SphereGeometry(0.022, 16, 12), eyeMatWhite);
      sclera.scale.set(1, 1.25, 0.4);
      eye.add(sclera);

      // Dark Pupil / Iris
      const pupil = new Mesh(new CircleGeometry(0.0125, 16), eyeMatPupil);
      pupil.position.set(0, 0, 0.01);
      eye.add(pupil);

      // Cute Glossy Catchlight Highlight Dot
      const highlight = new Mesh(new CircleGeometry(0.0042, 12), eyeMatHighlight);
      highlight.position.set(0.0035, 0.004, 0.012);
      eye.add(highlight);

      headGroup.add(eye);
    });

    // Cute Eyebrows
    const browMat = new MeshBasicMaterial({ color: preset.hairColor });
    [-0.038, 0.038].forEach(browX => {
      const brow = new Mesh(new BoxGeometry(0.032, 0.0055, 0.004), browMat);
      brow.position.set(browX, 0.158, 0.108);
      brow.rotation.z = browX > 0 ? -0.1 : 0.1;
      headGroup.add(brow);
    });

    // Cute Friendly Smile
    const mouthMat = new MeshBasicMaterial({ color: '#ba564e' });
    const mouth = new Mesh(new BoxGeometry(0.028, 0.005, 0.004), mouthMat);
    mouth.position.set(0, 0.076, 0.112);
    headGroup.add(mouth);

    // Cute Round Spectacles / Glasses (Amina & Zain)
    if (preset.hasGlasses) {
      const glassMat = new MeshStandardMaterial({ color: preset.glassesColor, roughness: 0.4, metalness: 0.6 });
      const glassGroup = new Group();
      glassGroup.position.set(0, 0.125, 0.116);

      // Left rim
      const leftRim = new Mesh(new TorusGeometry(0.028, 0.0035, 12, 24), glassMat);
      leftRim.position.x = -0.038;
      glassGroup.add(leftRim);

      // Right rim
      const rightRim = new Mesh(new TorusGeometry(0.028, 0.0035, 12, 24), glassMat);
      rightRim.position.x = 0.038;
      glassGroup.add(rightRim);

      // Bridge across nose
      const bridge = new Mesh(new CylinderGeometry(0.003, 0.003, 0.02, 8), glassMat);
      bridge.rotation.z = Math.PI / 2;
      bridge.position.set(0, 0.004, 0.004);
      glassGroup.add(bridge);

      headGroup.add(glassGroup);
    }

    // 3D Hair Mesh
    const hairMat = new MeshStandardMaterial({ color: preset.hairColor, roughness: 0.75 });
    const hairGroup = new Group();

    if (preset.hairStyle === 'wavy') {
      // Amina: Wavy hair with flowing side waves & bangs
      const crown = new Mesh(new SphereGeometry(0.105, 20, 16), hairMat);
      crown.position.set(0, 0.145, -0.01);
      crown.scale.set(1.02, 1.05, 1.15);
      hairGroup.add(crown);

      const bangs = new Mesh(new BoxGeometry(0.14, 0.045, 0.05), hairMat);
      bangs.position.set(0, 0.185, 0.09);
      bangs.rotation.x = -0.2;
      hairGroup.add(bangs);

      const leftWave = new Mesh(new CylinderGeometry(0.04, 0.025, 0.32, 12), hairMat);
      leftWave.position.set(-0.095, 0.02, 0.01);
      leftWave.rotation.z = -0.15;
      hairGroup.add(leftWave);

      const rightWave = new Mesh(new CylinderGeometry(0.04, 0.025, 0.32, 12), hairMat);
      rightWave.position.set(0.095, 0.02, 0.01);
      rightWave.rotation.z = 0.15;
      hairGroup.add(rightWave);

      const backHair = new Mesh(new BoxGeometry(0.18, 0.3, 0.08), hairMat);
      backHair.position.set(0, 0.04, -0.1);
      hairGroup.add(backHair);

    } else if (preset.hairStyle === 'bob') {
      // Noor: Sleek bob cut with front fringe
      const bobCap = new Mesh(new SphereGeometry(0.11, 20, 16), hairMat);
      bobCap.position.set(0, 0.14, -0.01);
      bobCap.scale.set(1.05, 1.08, 1.18);
      hairGroup.add(bobCap);

      const fringe = new Mesh(new BoxGeometry(0.13, 0.04, 0.04), hairMat);
      fringe.position.set(0, 0.18, 0.095);
      hairGroup.add(fringe);

      [-0.095, 0.095].forEach(bx => {
        const flap = new Mesh(new BoxGeometry(0.04, 0.16, 0.14), hairMat);
        flap.position.set(bx, 0.08, 0.01);
        hairGroup.add(flap);
      });

    } else {
      // Zain: Textured modern styled short hair
      const shortCrown = new Mesh(new SphereGeometry(0.102, 20, 16), hairMat);
      shortCrown.position.set(0, 0.15, -0.015);
      shortCrown.scale.set(1.02, 1.05, 1.12);
      hairGroup.add(shortCrown);

      const quiff = new Mesh(new BoxGeometry(0.12, 0.05, 0.06), hairMat);
      quiff.position.set(0.01, 0.19, 0.08);
      quiff.rotation.z = -0.1;
      hairGroup.add(quiff);
    }

    headGroup.add(hairGroup);
    headBone.add(headGroup);
  }

  // 2. Chest / Spine Bone: Collegiate Canvas Backpack
  const spineBone = scene.getObjectByName('DEF-spine003') || scene.getObjectByName('DEF-spine.003');
  if (spineBone) {
    const oldSpineAcc = spineBone.getObjectByName('stylized-spine-accessories');
    if (oldSpineAcc) spineBone.remove(oldSpineAcc);

    const bpGroup = new Group();
    bpGroup.name = 'stylized-spine-accessories';

    const bpMat = new MeshStandardMaterial({ color: preset.backpackColor, roughness: 0.75, metalness: 0.05 });
    const bpZipMat = new MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.5 });
    const bpMetalMat = new MeshStandardMaterial({ color: '#d4af37', metalness: 0.7, roughness: 0.3 });

    // Main backpack body
    const bpBody = new Mesh(new BoxGeometry(0.24, 0.30, 0.12), bpMat);
    bpBody.position.set(0, -0.05, -0.16);
    bpGroup.add(bpBody);

    // Front pocket
    const bpPocket = new Mesh(new BoxGeometry(0.18, 0.15, 0.05), bpMat);
    bpPocket.position.set(0, -0.09, -0.23);
    bpGroup.add(bpPocket);

    // Metal zipper pull
    const zipPull = new Mesh(new BoxGeometry(0.012, 0.03, 0.012), bpMetalMat);
    zipPull.position.set(0, -0.02, -0.26);
    bpGroup.add(zipPull);

    // Handle loop on top
    const handle = new Mesh(new TorusGeometry(0.03, 0.005, 8, 16), bpZipMat);
    handle.rotation.x = Math.PI / 2;
    handle.position.set(0, 0.11, -0.16);
    bpGroup.add(handle);

    // Shoulder straps
    [-0.08, 0.08].forEach(sx => {
      const strap = new Mesh(new BoxGeometry(0.035, 0.28, 0.018), bpMat);
      strap.position.set(sx, 0.01, -0.05);
      bpGroup.add(strap);
    });

    spineBone.add(bpGroup);
  }

  // 3. Left Hand Bone: Colorful Study Textbook
  const handBone = scene.getObjectByName('DEF-handL') || scene.getObjectByName('DEF-hand.L');
  if (handBone) {
    const oldHandAcc = handBone.getObjectByName('stylized-hand-accessories');
    if (oldHandAcc) handBone.remove(oldHandAcc);

    const bookGroup = new Group();
    bookGroup.name = 'stylized-hand-accessories';

    const bookCoverMat = new MeshStandardMaterial({ color: preset.bookColor, roughness: 0.7 });
    const bookPagesMat = new MeshStandardMaterial({ color: '#f7f4ea', roughness: 0.8 });

    const book = new Mesh(new BoxGeometry(0.035, 0.22, 0.16), bookCoverMat);
    book.position.set(0.03, 0.05, 0.02);
    book.rotation.z = 0.2;
    bookGroup.add(book);

    const pages = new Mesh(new BoxGeometry(0.026, 0.20, 0.14), bookPagesMat);
    pages.position.set(0.03, 0.05, 0.02);
    pages.rotation.z = 0.2;
    bookGroup.add(pages);

    handBone.add(bookGroup);
  }
}
