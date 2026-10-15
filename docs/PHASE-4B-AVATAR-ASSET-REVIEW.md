# Phase 4B — professional avatar asset review

Reviewed 2026-10-10. No professional character replacement has been activated.

Existing repository: only `public/models/student/student.glb`, with its bundled CC0 license. `CHARACTER_MODELS` still contains null for maya/noor/zain. The existing runtime requires the reviewed `lugaish-existing-rig-v1` contract: bind transforms/inverse binds, weighted PBR meshes, metre scale, matching bone hierarchy and the bundled animation targets. A different humanoid rig is not compatible merely because the file extension is GLB.

## Candidates and actual limitations

| Source | Rights verified | Review result |
|---|---|---|
| [Quaternius Universal Base Characters](https://quaternius.com/packs/universalbasecharacters.html) | Official page identifies CC0 and personal/educational/commercial use; free Standard subset and paid Source delivery are separate availability tiers. | Approx. 13k triangles, humanoid rig, FBX/glTF, teen/regular proportions. Useful base-model candidate; student wardrobe, current DEF bone/bind contract and correctly fitted seated/desk clips are not verified. Official compatibility with the Universal Animation Library does not establish compatibility with our bundled rig. No purchase/download or runtime activation claimed. |
| [Kenney Animated Characters Protagonists](https://kenney.nl/assets/animated-characters-protagonists) | Official CC0 page plus actual `License.txt` in the downloaded archive confirms commercial use and redistribution; attribution optional. | Inspected the complete 568KB archive and preview in `/tmp`. One `Model/characterMedium.fbx`; idle/jump/run FBX animation files; four skins including skaters/cyborg/criminal. No GLB, walk or seated animation in this archive. Simplified angular art and themed wardrobe also do not meet the requested university collection. No files from this pack were installed in public/models. |

No licensing blocker was invented for the CC0 candidates. The blocker is a reviewed, dressed, compatible student collection and seated locomotion pipeline, not simply access to any humanoid mesh. Paid Source access is not authorization to purchase it.

## Deliverable for safe integration

Supply three coordinated dressed student GLBs matching the stable maya/noor/zain identities (or an explicit visual mapping), a commercial-use/redistribution license and source/author record, 1.4–2.2m floor-aligned scale, neutral bind pose and blended joints. Aim below 30k triangles per mobile-ready character (existing gate absolute maximum 60k), limited PBR materials, 1K atlases and approximately 5MB or less per GLB. Optional blink morphs should be named/documented.

Either conform to the current reviewed rig contract, or deliver a complete separately reviewed native-rig adapter with correct semantic bone mapping and its own idle/walk/run/sitDown/seated/standUp clips. A native-rig adapter must use its own AnimationMixer clip targets, gait distances, foot solver and desk pose mapping; renaming bones alone is insufficient. Do not relax the existing validator to approve an arbitrary GLB.

Validate feet/hips/hands against the actual floor, .46m chair seat and .78m desk surface, including all seat facings, before registration. Test weighted bind normals, skeleton cloning/morph isolation, material and geometry lifetime, every transition, blocked locomotion and animation speed. Register the reviewed assets in `characterModels.js` only after browser art/pose review. Keep the shared RiggedStudent rendering path, draft Save/Cancel, legacy stored IDs and meaningful SVG fallback.

This phase made a bounded desk-pose/contact adjustment to the existing animation, not another procedural character design. Current character facial/body quality remains a visible limitation.
