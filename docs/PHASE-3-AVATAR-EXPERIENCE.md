# Phase 3 — avatar experience and integration

## Scope and asset reality

Inspected CharacterSelector/AvatarChooser/CharacterPreview/useCharacter, RiggedStudent, HumanStudent, authored rig gate, character resources/motion, Classroom and Library pipeline and existing licenses. Repository search found only `public/models/student/student.glb`, bundled under CC0 (`public/models/student/LICENSE.txt`). No additional GLB/GLTF/FBX/BVH character asset exists. Reviewed external-model entries remain empty. No new download or external licensed art was installed.

The existing original HumanStudent artwork and CC0 skeleton/clips remain a procedural fallback, not a professionally sculpted replacement. This pass fixes real customization, persistence and render-resource problems without adding more primitive shapes and relabeling them as professional art.

Art direction for a future collection: restrained stylized university students; human-scale heads/hands, soft facial features, fabric/skin/hair roughness distinction; coordinated forest/teal/lilac/coral with navy/neutral clothing; approximately current rig stature so existing chairs/desk IK remain valid. External deliverables need license/credit record, compatible weighted bind rig (or a reviewed retargeting pipeline), natural seated and locomotion clips, normals/PBR materials and tested bounds. Exact current-rig validation remains the fail-closed gate; arbitrary GLBs are not enabled by filename alone.

## Changes

- AvatarChooser now owns draft selection: preview does not broadcast a saved identity. Save persists explicitly; Cancel/close/Escape abandon the draft and restore trigger focus. Storage failures stay in the dialog instead of pretending success. Current/unsaved label and only three real preset options; no pretend hair/outfit editor.
- CharacterSelector accepts controlled draft value/onChange while preserving immediate standalone selection. Arrow/Home/End keyboard selection and roving radio focus added.
- Invalid legacy IDs normalize to the stable default; existing maya/noor/zain IDs and storage key remain. Read-blocked storage falls back safely. Failed writes do not announce changes. useCharacter listens to cross-tab storage and existing same-tab events.
- Removed character-keyed whole preview remount. Selection changes update the rig inside the same Canvas. Mobile/reduced-motion preview uses DPR1 and reduced shadows; reduced motion disables moving walk/run cycle controls and reaches the rig's existing reduced flag.
- New fallbackCharacter cache builds/bakes immutable preset geometry once per cached source rig. Every live instance still clones its skeleton and owns its mixer/morph arrays. Resource cleanup releases instance skeletons without disposing shared template buffers. Cache is bounded to the three established presets per source, retained with the GLTF cache. No FPS improvement claim without measurement.
- Revised responsive customization dialog, preview/selection layout, sticky Save/Cancel footer and readable supporting text.

## Animations and cameras

Existing idle/walk/run/start/stop/turn, seated/stand transitions, grounded foot planting, desk IK, breathing/blink and wave pipeline retained. No new clip or invented interaction. Preview walk/run explicitly represent in-place clip inspection, not walking to a real destination. Campus movement continues using actual controller velocity and authoritative chair motion. Default Classroom Lesson view and first/third person camera/collision behavior preserved; lesson remains unobstructed.

## Files

`src/characters/AvatarChooser.jsx`, `CharacterSelector.jsx`, `CharacterPreview.jsx`, `characterPresets.js`, `useCharacter.js`, `RiggedStudent.jsx`, `characterSelector.css`; new `fallbackCharacter.js`; new `tests/avatarSelection.test.mjs`; this report, browser harness and visual evidence.

No backend/access/enrollment/seating schema change. Character selection does not modify daily goals, notes, timer, lesson progress or rain ownership.

## Verification

Production build passed; 53 unit tests passed. New tests verify safe legacy/persistence failure behavior, shared template geometry, separate skeleton/morph state and cleanup that does not invalidate another instance. Existing locomotion/foot-grounding/desk-IK tests remain passing.

Actual customization browser checks at 1440×900, 768×900 and 390×844: draft does not write, Canvas identity retained, Cancel leaves saved selection intact, Save changes preset and restores focus, Arrow-key selection works, no horizontal overflow. Screenshots use real fallback geometry, not externally authored models. Evidence: `visual-checks/phase3-avatar.json`, `phase3-customization-{1440,768,390}.png`, `phase3-classroom-avatar.png`, `phase3-lesson-view.png`.

## Remaining limits

Production visual-art target is still blocked by missing professionally authored character assets. New geometry, retargeted animations or visual equivalence to professional reference images is not claimed. Real Google-account classroom lecture playback remains unverified; preview checks do not bypass paid content. No physical-device FPS or full accessibility audit. No deployment.

Final Library browser journey passed at 1440 and 390: actual saved Noor preset seated/2D presentation, seat confirmation, notes and running timer retained across cameras/tools, Leave returns arrival. Evidence: `phase3-library-journey.json`, `phase3-library-my-desk-1440.png`, `phase3-library-my-desk-390.png`.

### Follow-up: seated preview and selection failure feedback

CharacterPreview now uses the Library's `studyDesk` pose for Sit, with a chair back/legs, desk and notebook at the existing floor/seat/desk heights. This is preview furniture, not a replacement character asset. The same rig and animation pipeline remain in use. CharacterSelector now catches persistence failures and displays an alert instead of leaving a standalone selection click with an unhandled error.

Build and all 53 unit tests passed after this follow-up. Desktop/tablet/mobile seated preview screenshots are saved as `visual-checks/phase3-seated-preview-{1440,768,390}.png`; the browser harness is `tmp/platform-review/phase3-seated-preview.mjs`. Existing bundled CC0 rig/animations and original procedural fallback remain; professional visual replacement is still outstanding. No paid access, server seating, timer, notes or chat logic changed.
