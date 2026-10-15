# Phase 15B — acquisition attempt, integration pending

2026-10-11. No model integrated; no application/runtime/animation changes, purchase or deployment.

## Verified approved sources

- [Grab3D Character Mixer](https://grab3d.com/tools/character-mixer/): original publisher states exported characters are CC0 1.0, commercial use and no attribution required. Original page documents GLB, 19-bone A-pose skeleton, in-place idle/walk/run/wave/jump clips and no facial blend shapes. These are publisher descriptions, not measurements of a downloaded model. Direct HTTP request succeeds (200 HTML); export builds the GLB in the browser. Actual file/hash/poly count remain unavailable.
- [Poly Pizza Casual Character](https://poly.pizza/m/kZ3DmIoGip): listing identifies Quaternius, CC0 and FBX/GLTF. Browser search can read listing; direct acquisition request returns HTTP 403. No model data or protected viewer cache extracted. Original publisher rights should be paired with the delivered license when the actual asset arrives.
- [Quaternius Universal Base Characters](https://quaternius.itch.io/universal-base-characters): original publisher page accessible (200 HTML); base-model option still requires appropriate licensed student clothing. No dressed character GLB obtained.

## Concrete tool blocker

Browser automation inventory reports zero browser surfaces. `createBrowserTab` for Chrome and the in-app browser reports unavailable. Native Chrome is listed as running, but two `getApp('com.google.Chrome')` attempts fail with Computer Use error -10005 / timeoutReached. Consequently the approved character-mixer UI/export cannot currently be operated or verified here. No third-party downloaded executable script was installed/run to reproduce the exporter outside its browser.

## User delivery needed

On Grab3D, choose the Cozy style and a student-appropriate shirt/jacket, trousers, shoes, hair and face. Export **GLB** with Idle, Walk and Run (Wave optional). Save the actual `.glb` locally and provide its full filesystem path. Save the source/share link or settings as provenance. No account password or token is needed. Alternatively provide the officially downloaded Quaternius Casual Character GLB and included license files.

Once delivered: inspect GLB header/skin hierarchy/weights/materials/textures/clips/scale/triangles; record SHA256 and commercial redistribution/license provenance; compare current visual baseline; integrate one native-rig adapter preserving current IDs/selection/caching/fallback. The mixer 19-bone rig differs from the current 53-joint contract, so it must not be inserted into the existing exact-rig registry or renamed blindly. Missing sitDown/seated/standUp require properly reviewed retargeting or a separately verified natural seated solution; no sitting success is claimed now.

No new before/after comparison exists because no replacement binary exists. Build/tests were not rerun for this acquisition-only attempt; Phase 15's prior 159 unit/eight integration passes are historical evidence, not new Phase 15B results. Phase 14 launch blockers remain separate and NO-GO. This record does not declare Phase 15/15B complete.
