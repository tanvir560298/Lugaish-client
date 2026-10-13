# Phase 15C — native Zain sitting and standing

Verified 2026-10-12. The same downloaded Quaternius mesh now stays active during approach, sitting, seated idle and standing. Routine chair states no longer substitute the procedural character. Pending native loading does not display a different avatar; actual load/validation failure still retains the procedural fallback. Stable Zain selection/storage keys, Amina/Noor and the failed-load fallback remain.

## Actual rig and animation source

The unchanged Casual Character GLB has 62 joints, four glTF skin records, ten rendered skinned primitives and 24 embedded clips. It has no embedded sitting clip. Body parents both upper legs; Hips parents the abdomen/chest/head chain. UpperLeg → LowerLeg is a connected chain, but FootL/FootR are separate Root children. Shoulders → UpperArm → LowerArm → Wrist form connected arm chains. Root/armature transforms include 100× unit conversion and opposite X rotations; runtime normalization remains 1.7m.

The project's CC0 `student.glb` has sitDown/seated/standUp clips on a different DEF/Rigify skeleton. Direct track renaming or the old connected-foot IK would be unsafe. No downloaded mocap or outside unlicensed asset was used. **Retargeting was not used:** new motions were authored directly on Zain's actual rig.

`node scripts/author-quaternius-study.mjs` reproducibly bakes:

| Clip | Duration | Use |
| --- | --- | --- |
| zainSitDown | 1.291667s | Lower and lean into chair |
| zainSeatedIdle | 4s loop | Seated study pose and restrained head movement |
| zainStandUp | 1s | Controlled rise from chair |

Source/license: original Lugaish keyframed motion, CC0 1.0, based on the Quaternius CC0 rig/neutral pose. See `public/models/student/quaternius/STUDY-ANIMATION-LICENSE.txt`. Native Idle_Neutral/Walk/Run and the existing native upper-body Wave overlay remain. The supplemental clips are real AnimationClip/keyframe data in `src/characters/animations/quaternius-study.js`; they are **not embedded in the original GLB**. Its SHA-256 remains `fea7e71271203e7073f1a073fa1208de7402df276f87f80e149bf7589b5d46b4`.

Authoring uses measured segment lengths and two-joint IK, with explicit handling of independent root-parented feet. Body/pelvis positioning aligns with the actual approximately 0.505m chair surface and canonical 0.33m forward root offset. Wrist orientations use the native finger direction; desk-surface clearance is checked on skinned vertices. Bone lengths and mesh scale remain unchanged. Constant tracks are reduced to endpoint samples; the generated module is approximately 103KB, rather than exporting millions of redundant samples. Clip IDs are unique so mixers cannot alias different motions.

## Runtime integration and camera behavior

`nativeSeating.js` drives the clips using confirmed motion state and transition progress. Timed network/Classroom transitions follow the existing authoritative timeline rather than a separate elapsed clock. Restored seats initialize directly in the correct pose. Boolean desk-preview transitions use the authored durations. Completion callbacks fire once. Reduced motion uses fixed poses and skips the standing animation.

During chair transitions, the feet retain world-space anchors while the legs adjust without stretching. Parent avatar pose updates run before skeleton updates, preventing frame-order foot drift. Browser samples show the same foot position through Library lowering, seated idle and standing. Skeletons/mixers are instance-local; cached geometry, clips and materials are reused without changing the source asset.

The local Library Leave Table action now uses the existing `leaveSeatMotion` timeline, matching the shared room's already authorized stand journey. Shared actions still wait for backend confirmation. No backend seating authorization or contract changed. The settled desk camera is retained during the initial stand, then eases back to the library; preview chair furniture remains visible until standing finishes.

The Classroom previously traced its seated shoulder camera from inside the oversized chair collision proxy, compressing the camera and hiding the character. Its trace starts above that proxy, with eased seated eye height/distance and collision-constrained interpolation. Zain and the board are now visible in the inspected room view; default lesson framing remains unchanged. The Library desk camera also pulls back to keep the seated character, chair and feet clear of the bottom controls.

Zain's avatar-card/mobile 2D thumbnail is rendered from the same actual GLB (`public/avatars/zain-quaternius.png`, transparent 256×320), not the old cartoon identity. Stored IDs and other presets are preserved. Mobile Study Library keeps its existing 2D mode; the mobile 3D seated preview is separately verified.

## Verification

- Production build and source syntax checks passed; the existing Vite large-chunk warning remains.
- 166 automated tests passed, including native mapping rejection, skin/floor/chair/desk alignment, length preservation, world-space foot anchors, transition callbacks, reduced-motion behavior and independent rigs/mixers.
- Eight isolated authenticated/database integration tests passed, preserving access, seat assignment and private chat restrictions.
- Actual browser checks at 1440px and 390px used the local preview routes. Mesh UUIDs stayed identical across the entire preview and Library journeys. These checks do not impersonate Google login or constitute a live production session.
- Missing-GLB simulation showed the existing procedural fallback; removing the simulated failure restored the native model and the saved Zain selection. Reduced-motion browser checks passed.
- Recorded WebM captures contain actual rendered animation frames, not a sequence of invented illustrations. The preview recording includes sitting and rising with the chair retained during transition; the Library recording captures stand-to-walk.

Evidence in `docs/visual-checks/`:

| Requested view | Artifact |
| --- | --- |
| Standing | phase15c-standing.png |
| Walking | phase15c-walking.png |
| Approaching a chair | phase15c-approaching-chair.png |
| Sitting at My Desk | phase15c-my-desk.png |
| Standing up | phase15c-library-stand-up.png |
| Classroom character view | phase15c-classroom-seated.png |
| Mobile seated 3D preview | phase15c-mobile-seated.png |
| Mobile 2D desk | phase15c-mobile-my-desk-2d.png |
| Sit/stand recording | phase15c-sit-stand-continuity.webm |
| Library stand/walk recording | phase15c-library-stand-walk.webm |

Machine-readable journey results: `phase15c-seating.json`; failure checks: `casual-fallback.json`.

## Changed files

- Authoring/data: `scripts/author-quaternius-study.mjs`, `src/characters/animations/quaternius-study.js`, `src/characters/nativeRigIK.js`.
- Character integration: `src/characters/nativeSeating.js`, `QuaterniusStudent.jsx`, `quaterniusCharacter.js`, `RiggedStudent.jsx`, `CharacterPreview.jsx`, `characterPresets.js`, `characterModels.js`.
- Pose/cameras: `src/classroom/Avatar.jsx`, `Player.jsx`; `src/study/shared/RemoteAvatar.jsx`, `SharedScene.jsx`, `StudyHallPreview.jsx`, `SharedRoomPanel.jsx`.
- Tests/QA: `tests/nativeSeating.test.mjs`, `scripts/qa/phase15cSeating.mjs`, `quaterniusAvatar.mjs`, `renderZainThumbnail.mjs` and visual artifacts.
- Asset/provenance: rendered thumbnail, `quaternius/asset.json`, `STUDY-ANIMATION-LICENSE.txt`, this report and the current blocker status.

## Limits

The character remains the supplied low-poly asset, not a new professionally sculpted model. The motions are constrained authored study animations, not motion capture; they target the existing standardized chairs/desks and do not claim arbitrary furniture compatibility. There are no native facial morph targets. Tests cover independent instances, not 100 concurrent real students or a device-performance benchmark. Software WebGL browser checks and a 390px viewport do not replace physical-phone testing. Mobile 2D mode is intentionally static. No public deployment occurred.
