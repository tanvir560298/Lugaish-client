# Phase 15 — professional character replacement BLOCKED

Reviewed 2026-10-11. **No new professional model integrated. No rendered visual replacement completed.** No procedural cosmetic edits, registry activation, animation guesswork, asset purchases or deployment were performed. Phase 14 external launch blockers remain unchanged.

## Inspected actual implementation

Read Phase 3, Phase 4B, asset handoff and current blocker reports. Inspected `RiggedStudent`, model registry, authored-model validator, preview, shared resource cleanup and stored selection hook. Repository contains one character GLB: `public/models/student/student.glb` (943,252 bytes, 13,743 mesh triangles, 53-joint skin, one mesh, no textures), bundled with CC0 license text. Embedded clips: idle, walk, run, sitDown, seated and standUp. These measurements describe the bundled GLB, **not the generated runtime fallback mesh**.

All three registry slots `maya`, `noor`, `zain` remain null. Existing live character is generated fallback geometry on that animation rig. Loading a GLB is not the missing engineering capability: the pipeline already clones skeletons independently, gives each instance a mixer, shares GLTF/geometry caches and keeps cached resources alive. Preview uses the same component with well-lit cameras, poses and responsive Save/Cancel; draft choices/persistence failures are covered by existing tests. Existing velocity, foot planting, desk pose, seat confirmation and camera logic remain intact.

The authored path requires matching existing hierarchy, bind matrices/inverse binds and animation targets. An arbitrary humanoid asset cannot safely be registered by renaming bones. A different skeleton needs a reviewed native clip/retargeting adapter, floor contact and desk/seated alignment. There is no Blender executable on this workstation. Raster image generation does not produce skinned GLBs. No suitable newly delivered student collection is present.

## Candidate investigation

| Candidate / creator | Source, rights | Actual availability / format | Geometry, rig, animation / integration limits |
|---|---|---|---|
| Universal Base Characters / Quaternius | [Official source](https://quaternius.com/packs/universalbasecharacters.html), CC0, personal/educational/commercial use; attribution not required by CC0 | Official glTF/FBX/Blend listing; free Standard and paid Source tiers differ. No paid purchase or model activation | Official average ~13k triangles, six humanoid base bodies and hairstyle options. Texture dimensions, delivered clip contents and existing rig compatibility not inspected this phase. A base body is not verified student clothing; wardrobe authoring, native-rig review and actual seated clips are still required. |
| Free Stylized Cartoon Girl / Canino3d | [Public metadata](https://api.sketchfab.com/v3/models/dcaa822909ae4e04ad7eb85bc371a8c4), CC BY 4.0; commercial use with author credit, license link and change disclosure | Metadata HTTP 200; official download endpoint HTTP 401 without account. No binary obtained. Actual delivered format unknown until official download | 31,656 vertices, 57,345 faces, zero included animations according to current metadata. “Rigged” listing alone does not validate our bone/bind contract. Texture characteristics unknown; mobile reduction and proper retargeting likely require review. Single character does not establish a cohesive collection. |
| Rain / Blender Studio | [Official character listing](https://studio.blender.org/characters/rain/v3/); search-index description states CC-BY and Blender Foundation credit | Current official page access returned 402 in browsing. No binary or complete delivery/license record obtained | Blender character-rig candidate, not a reviewed mobile GLB. Export, textures/poly budget, deformation rig, baked clips and student identity collection unverified. Not approved or integrated. |

Kenney's Protagonists archive was inspected in Phase 4B: CC0 FBX with idle/jump/run, no seated clip/GLB and a different simplified art direction. That is prior investigation, not a newly downloaded pack. No authentication, viewer-cache extraction or paywall bypass was used for any source.

Current Canino metadata/download response is recorded in [candidate evidence](phase15-candidate-verification.json). Source listings establish candidate rights/claims, not technical or artistic acceptance. No unlicensed file was copied into public assets.

## Concrete missing delivery

Supply the **local file path** to a commercially redistributable, dressed student GLB collection and its author/source/license records. One first character is sufficient to review before producing the other two. Use stable identity mapping Amina (`maya`), Noor (`noor`), Zain (`zain`) or explicitly approve the new mapping. Do not send account passwords/tokens.

The reviewable delivery should include:

- Smooth authored face/hair/hands and appropriate student clothing, UVs/PBR textures and normalized skin weights.
- Either the unchanged existing 53-joint armature/bind contract, or native rig plus documented bones and actual idle/walk/sitDown/seated/standUp clips for a separate reviewed adapter.
- Metres, feet at floor Y=0, facing +Z; chair seat approximately .46m, desk approximately .78m. Validate hips/feet/hands at those dimensions.
- Mobile target roughly 12–30k triangles, limited materials and 1K atlases; file size target around 5MB. These are proposed review budgets, not measured new assets.
- Source files, redistribution/commercial rights, attribution requirements and optional documented blink morphs. A purchase or artist commission needs separately specified owner approval.

Existing [artist handoff](AVATAR-ASSET-HANDOFF.md) and [rig review](PHASE-4B-AVATAR-ASSET-REVIEW.md) contain the exact integration contract. No asset acquisition choice or purchase was made on the owner's behalf.

## Verification and visual comparison

Production build and **159 unit tests pass**, zero failures/skips. **Eight isolated integration tests pass**, zero failures/skips. [Verification summary](phase15-verification.json). No new avatar tests were necessary because runtime assets/code were not changed. Existing unit coverage exercises selection persistence/failure, separate skeleton/morph ownership, cache cleanup, movement, foot grounding and desk posing.

**New browser before/after screenshots: NOT PRODUCED.** There is no “after” replacement to demonstrate; relabelling existing screenshots would misrepresent completion. Prior real WebGL character baseline remains [Phase 3 Classroom](visual-checks/phase3-classroom-avatar.png), [customization](visual-checks/phase3-customization-1440.png) and [seated preview](visual-checks/phase4b-after-avatar-seated-preview-1440.png). They are historical screenshots, not new Phase 15 evidence. Mobile/physical performance and replacement deformation are not tested. No FPS/quality improvement is claimed.

## Files changed / final state

Only this report, candidate/verification evidence and a current status link in `AVATAR-REPLACEMENT-BLOCKER.md`; no application/model/animation/backend files changed this phase. No visual quality, complete avatar journey or professional asset acceptance claim.

Phase 15 stops at its explicit missing-asset condition rather than repeating procedural-avatar polish. Await the actual licensed GLB delivery or a specifically approved asset acquisition/artist-export path. Phase 14 remains NO-GO for real Google, authorized lecture, protected staging, monitoring/rollback and physical mobile verification. No public deployment.
