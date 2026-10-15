# Casual Character integration — 2026-10-11

The real downloaded Quaternius GLB is integrated as the existing **Zain** selection. Amina/Noor, stored selection keys and the original seated/failed-load fallback remain. No backend or enrollment contract changed; no public deployment occurred.

## Asset verification

- File: `public/models/student/quaternius/casual-character.glb` — 1,430,660 bytes, valid GLB v2, matching declared length.
- SHA-256: `fea7e71271203e7073f1a073fa1208de7402df276f87f80e149bf7589b5d46b4` — exact user-provided match.
- Quaternius, Ultimate Modular Men Pack, CC0 1.0. The [creator's pack page](https://quaternius.com/packs/ultimatemodularcharacters.html) links CC0; the [collection](https://poly.pizza/bundle/Ultimate-Modular-Men-Pack-ZiH8muWqwQ) identifies Casual Character as CC0. Download mirror and license links are recorded in `public/models/student/quaternius/LICENSE.txt` and `asset.json`.
- Four modular glTF meshes become **10 skinned draw primitives** in Three.js. Four skin records reference the same 62-joint rig. 5,776 triangles; nine PBR materials; no textures or external resources.
- 24 embedded clips. Native `Idle_Neutral`, `Walk`, `Run` are used. An upper-body overlay uses the embedded `Wave` clip. Combat clips are retained in the unchanged file but not exposed as student interactions.
- **No sitting clip exists.** Native seated animation is not integrated or verified. Seating uses the existing character fallback, so the visible character changes when seated. This is a limitation, not a claim that the downloaded character can sit.

## Integration

`quaterniusCharacter.js` validates the skin/clip structure and creates an immutable cached template. Native skeletons are cloned with SkeletonUtils, not remapped to the unrelated legacy DEF rig. Geometry/materials are shared; skeletons and mixer state are instance-local. Runtime materials use nonmetallic finishes. Height is normalized to 1.7m; the source floor offset is compensated.

Native grounded-foot travel calibrates gait speeds once per cached template: walk approximately 1.2904m/s, run 2.7998m/s. The existing motion controller accepts these clip speeds without changing its default legacy calibration or destination/collision logic. Reduced-motion mode uses a fixed idle pose. The native GLB loads only when a Zain instance is rendered. Browser loading/render errors retain the existing fallback.

The adapter switches to the legacy component for sit/seated/stand states, preserving chair transition callbacks and existing desk alignment. This avoids applying incompatible sitting clips or legacy bone IK to the native skeleton. React development effect cleanup/restart is tested to avoid invalid mixer bindings.

## Verification and limits

- Production build, source syntax check, 160 automated tests and eight isolated database integration tests passed. Vite retains its existing large-chunk warning.
- Browser checks use the real local development application and public preview routes with an isolated Chrome profile. They do not bypass authentication or prove live paid-course access with a real account.
- Actual native mesh names and 62-bone skins are asserted in the browser. Walk/Run checks compare bone poses across frames; screenshot evidence includes the preview, Classroom and Library. Preview Walk/Run are deliberately in-place demonstrations, while environment movement uses existing controllers.
- Mobile width is 390px. Native avatar preview renders at DPR 1; the Study Library keeps its existing 2D mobile fallback. Desktop browser uses software WebGL, so this is visual compatibility evidence, not a physical-device FPS benchmark.
- The supplied asset is a modest low-poly adult character. It does not match the sculpted reference artwork and has no facial morph targets or seated clip.

Failure simulation blocks only the native GLB in the isolated test browser: the legacy mesh remains visible and Zain stays saved; clearing the block restores the real model. Reduced-motion checks confirm a fixed leg pose and disabled Walk/Run controls. Results are in `casual-fallback.json`.

Run the native visual journey with an isolated CDP browser on port 9229:
`node scripts/qa/quaterniusAvatar.mjs`
`node scripts/qa/quaterniusFallback.mjs`

Evidence: `docs/visual-checks/casual-avatar.json`, `casual-preview-idle-desktop.png`, `casual-preview-walk-1.png`, `casual-preview-run-1.png`, `casual-classroom-desktop.png`, `casual-library-desktop.png`, `casual-library-seated-fallback.png`, `casual-preview-mobile.png`, `casual-library-mobile.png`.

Changed files: `src/characters/{RiggedStudent.jsx,QuaterniusStudent.jsx,quaterniusCharacter.js,studentMotion.js,CharacterPreview.jsx,characterPresets.js}`, `tests/quaterniusCharacter.test.mjs`, `scripts/qa/{quaterniusAvatar.mjs,quaterniusFallback.mjs}`, the three native asset/provenance files, this report and the blocker status.
