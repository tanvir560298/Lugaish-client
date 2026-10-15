# Current Phase 15C status — 2026-10-12

**Native Zain sitting/standing is integrated and visually verified.** Routine chair states retain the same real GLB mesh; the procedural model is used only for failed-loading/unsafe-asset fallback. New directly authored native-rig sitDown/seated/standUp clips are supplemental data, not fabricated claims of clips embedded in the source GLB.

See [source, license, rig requirements, screenshots, recordings, tests and limitations](PHASE-15C-NATIVE-SEATING.md). The original GLB checksum and saved avatar IDs remain unchanged. Professional sculpting and physical-device/100-user performance testing remain separate limitations. No public deployment occurred.

The earlier Phase 15B and acquisition entries below are historical.

# Current status — 2026-10-11

**The supplied Casual Character acquisition blocker is resolved.** Its actual GLB was downloaded, verified against the supplied SHA-256 and integrated through a native-skeleton adapter for Zain. See [asset inspection, integration, verification and limitations](CASUAL-CHARACTER-INTEGRATION.md).

Native Idle/Walk/Run are supported. The GLB has no sitting clip; chair states deliberately use the existing seated fallback. Professional sculpted artwork and native seated animation remain separate limitations. The exact-rig registry still has null slots because this model uses a different skeleton and its own adapter.

The older acquisition notes below are historical and do not describe the current Casual Character integration.

# Phase 15 status — 2026-10-11

Professional replacement is still **BLOCKED by the actual asset delivery**. Registry slots remain null. No cosmetic procedural changes were made this phase. See [current model measurements, candidate review and precise delivery requirements](PHASE-15-CHARACTER-ASSET-REVIEW.md). Need a licensed dressed student GLB and source/license record; no paid purchase or external-account access is authorized implicitly.

The following is historical implementation/acquisition context.

# Avatar replacement status — updated 2026-10-10

The previous capsule-based visible fallback has now been replaced in the active rig pipeline by original `HumanStudent.js` artwork for all three presets. Continuous weighted sleeves and legs, connected shoulders, individual fingers, facial features, hair, differentiated material roughness, blink/breath morphs and seated arm IK are active. Existing selected identities/customization and the compatible CC0 skeleton/animation clips remain.

See [implementation and verification](HUMAN-AVATARS-RAIN.md), including real WebGL before/after canvas renders and a sit/stand demonstration. This is a genuine change to visible geometry, not merely a smoothing setting or loader.

A professionally sculpted external character GLB is still unavailable: `characterModels.js` registry entries remain null. The original procedural mesh is an improvement, but does not establish equivalence to the supplied professionally rendered reference images. Further art refinement and real-device visual QA remain appropriate.

## Historical acquisition investigation

The following record predates the new original mesh and describes only the external-asset acquisition blocker.

## Acquisition attempted

A real rigged character candidate was found:

- Artist listing: https://sketchfab.com/3d-models/free-stylized-cartoon-girl-rigged-character-dcaa822909ae4e04ad7eb85bc371a8c4
- Public authoritative metadata: https://api.sketchfab.com/v3/models/dcaa822909ae4e04ad7eb85bc371a8c4
- Corresponding Fab listing: https://www.fab.com/listings/fe501f98-a9bb-4acb-b96e-e5b65d8f0d00

The Sketchfab metadata request succeeded (HTTP 200). It reports CC Attribution / CC BY 4.0, explicitly permitting commercial use with author credit, 31,656 vertices, 57,345 faces, download availability and zero included animations. The metadata/license findings are recorded in `avatar-candidate-research.json`. License terms require credit, the license link and disclosure of changes: https://creativecommons.org/licenses/by/4.0/

The supported original-file download endpoint returned HTTP 401 without an authenticated account:

https://api.sketchfab.com/v3/models/dcaa822909ae4e04ad7eb85bc371a8c4/download

No asset files were obtained or installed. Viewer caches were not extracted to evade the authenticated download. The candidate's rig compatibility, visual quality, similarity to Amina and performance are not approved by metadata alone. It may require significant art changes and retargeting; the existing exact-rig contract cannot simply accept an arbitrary new skeleton.

The repository contains no other professional character asset. No Blender executable or 3D generation tool is available here. The supplied images are style references, not rigged three-dimensional meshes.


## Phase 3 integration update

See [Phase 3 avatar experience](PHASE-3-AVATAR-EXPERIENCE.md). Draft/Save/Cancel, storage failure handling, keyboard selection, stable preview Canvas and immutable fallback-template reuse are implemented. This improves the working character experience and resource ownership; it does not supply the missing professionally sculpted GLB or change the external-asset status above.
