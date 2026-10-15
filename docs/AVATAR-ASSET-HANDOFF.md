# Premium character overhaul: audit and required asset

## Status — visual replacement is not complete

No new professionally modeled character GLB has been supplied or generated. The runtime still uses the original procedural avatar fallback. The compatibility pipeline and live preview below are engineering preparation, not a finished premium character collection. No visual-quality acceptance or screenshot evidence is claimed.

## Findings

`public/models/student/student.glb` is a 921 KiB Quaternius animation-library mannequin with 53 skin joints, two mesh primitives, two materials, no textures and six clips. Its existing license record is `public/models/student/LICENSE.txt` (CC0).

`CartoonStudent.js` hides the source geometry and attaches rounded primitives to bones. Amina's fallback has 66 visible primitive pieces, 26,523 vertices and 45,184 triangles. `bakeCartoonSkin.js` merges these into a single draw call, but every vertex has exactly one influencing bone. That preserves rigid piece movement rather than smooth garment/body deformation. Hair is overlapping rounded pieces; the backpack is an oval; hands are not articulated fingers. Facial geometry has no blink morphs. The two-dimensional selector artwork does not accurately represent all current three-dimensional clothing/skin details.

The environment has no Blender executable and no 3D asset generation service. The available image generator produces raster images, not animated humanoid GLBs. Creating more procedural spheres or recoloring the mannequin would fail the user's explicit requirement.

## Implemented preparation

- `characterModels.js`: reviewed authored asset slots keyed by existing IDs `maya`, `noor`, `zain`; all remain null until an actual model is approved.
- `authoredCharacter.js`: checks exact current armature rest transforms, hierarchy and inverse bind matrices, skin-weight validity, blended influences, normals, PBR materials, metre scale and a geometry review ceiling. This validates structural compatibility, not artistic quality.
- `RiggedStudent.jsx`: uses the authored mesh's geometry, materials and morphs when configured. It retains the existing six bundled animations, locomotion, IK and wave pipeline. The procedural fallback remains available. Cached materials/geometry are shared; skeletons are per instance.
- Optional blink animation recognizes `eyeBlinkLeft`/`eyeBlinkRight` or `blinkLeft`/`blinkRight`. It does not fake blinking on the current fallback.
- Authored skinned meshes have conservative animation bounds for frustum culling. The loader/preloader shares GLTF caches.
- `characterResources.js`: disposes instance-owned resources while retaining cached source geometry/materials.
- `CharacterPreview.jsx` / `AvatarChooser.jsx`: lazy live preview using the same RiggedStudent component and selected ID as the rooms. Includes controlled rotation, front/side/back/three-quarter cameras and animation inspection. The preview currently shows the existing avatar, not upgraded artwork. The SVG choice buttons and saved IDs remain compatible.

## First model: artist delivery brief

Create one original Amina reference character before producing additional variants. Use the existing original Lugaish avatar artwork and this project's palette for identity, not a copied movie/game/reference-image character. Model a coherent smooth head, expressive eyes with eyelids, layered sculpted hair, sewn clothing, articulated hands and a compact canvas backpack with connected straps, seams, zipper and a defined flat-backed silhouette. Do not build the character from overlapping primitive body segments.

Provide:

1. `amina.glb`, with original authored geometry, smooth normals, UVs and PBR materials. Apply mesh transforms. Aim for 12–20k triangles for the shared-room/mobile reference, 2–4 materials, and 1k–2k textures. The 60k compatibility ceiling is not a performance recommendation. Supply lower-detail variants if intended for many simultaneously visible students.
2. The exact existing armature from `public/models/student/student.glb`, imported into Blender. Replace the mannequin mesh while preserving bone names, hierarchy, rest poses, world transforms and inverse binds. Export metres, Y-up, facing +Z, feet at Y=0. Do not enlarge/reorient the armature to change proportions; author body geometry around it. Weighted elbow/knee/shoulder/hip loops must blend smoothly across adjacent bones.
3. Optional eye-blink morphs using the names above and artist-designed smile/expression morphs. Existing bones animate the hands; finger topology and weights must be authored.
4. Blender source, texture sources and a written license/source record permitting website redistribution and the intended use. `license` in the manifest is a reference to a reviewed record, not automatic legal clearance.
5. Front, side, back and three-quarter renders plus walk, wave, sit and stand clips in the intended classroom lighting. Review all-angle silhouette, ground contact, chair clipping, hand deformation and backpack attachment before approval.

A different skeleton requires a separately implemented and visually validated retargeting pipeline. This implementation deliberately rejects mismatched rigs rather than guessing bone mapping.

After review, place the GLB under `public/models/student/authored/amina.glb` and configure the `maya` entry:

```js
maya: {
  url: '/models/student/authored/amina.glb',
  contract: 'lugaish-existing-rig-v1',
  license: '/models/student/authored/AMINA-LICENSE.txt'
}
```

Only after Amina meets the visual/animation target should Noor and Zain receive equivalent authored models. Their existing saved IDs must remain unchanged. Camera framing, lighting, LODs, texture compression and multi-avatar performance must then be reviewed against those actual assets, not guessed from the placeholder.

## Verification and remaining work

```
node --test tests/authoredCharacter.test.mjs tests/characterMovement.test.mjs
npm run build
```

The compatibility tests intentionally use the existing weighted mannequin as a structural fixture. Passing them does not approve the mannequin's appearance as premium artwork. Negative tests reject orientation changes, invalid weights, incorrect inverse binds, unlit materials and rigid-only skins. Movement/IK regression tests remain applicable.

Outstanding: actual professional model production; collection expansion; new-model deformation and artistic review; textured-asset license verification; real rendered screenshots; room lighting/camera review; mobile/100-student performance. The live Chrome browser provider was unavailable. An isolated headless Chrome capture was also attempted; macOS CVDisplayLink errors prevented any screenshot and that review process was stopped. Interactive preview and visual captures remain unverified. No completion claim is made for the requested premium visual overhaul.
