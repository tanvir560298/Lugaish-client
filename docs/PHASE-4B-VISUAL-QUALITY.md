# Phase 4B — visual quality and immersion

Implemented and inspected 2026-10-10, continuing Phase 4A. This is an environment refinement with actual local browser evidence; it is not a professional avatar replacement or a declaration that every visual/performance target is met.

## Evidence and initial inspection

[Before/after gallery](visual-checks/phase4b-comparison.html). Desktop 1440×900, tablet 768×900, mobile 390×844. New baseline screenshots were captured before this phase's edits for Classroom Lesson/Third Person and Library arrival. My Desk baseline uses Phase 4A's existing screenshots from the unchanged desk implementation. New desk framing is intentionally different. All images are actual renders, not concepts. Preview routes contain no fake enrolled lessons or live students.

The five main Classroom weaknesses were the crude existing avatar, schematic wood grain, painted/flat window scenery, weak material contrast under broad fill light, and repeated furniture that makes the third-person view feel synthetic. The five Library weaknesses were the same avatar, schematic furniture/floor surfaces, painted windows, weak zone differentiation with repeated laptops, and an oversized personal status label/desk framing competing with the study surface. Architecture and furniture layout already delivered in Phase 4A were retained.

The active server at 127.0.0.1:4174 serves Vite development modules, not a stale production preview. The production build was generated independently. Authenticated routes and preview routes use the same environment components; preview mode intentionally cannot demonstrate Google account enrollment or private live occupancy.

## Visible changes

- Local photographic wood color, normal and roughness maps replace the procedural wood when available; fallback surfaces still work if a download fails. Reused cached materials give desks, bookshelves, floor and timber framing consistent grain and roughness.
- A local daylight HDR capture supplies restrained environmental light on desktop/tablet non-low quality. Ambient/hemisphere fill was reduced to preserve contrast; the existing directional shadow has a softer radius. No post-processing, extra shadow lights or per-frame probes were added.
- Window bays now crop adjoining segments of one landscape panorama, with Phase 4A's deep frames and daylight washes. This is a real licensed landscape asset, not a photograph of a Lugaish campus.
- Library chairs use sage, ochre, blue and teal zone palettes. All 100 chairs remain in three shared seat/back instanced draws, including instance-specific selected/occupied colors. Decorative laptops now appear on ten of the twenty tables, reducing repetitive props; seating capacity is unchanged.
- My Desk targets the midpoint between the actual seat and table at a higher study-surface level. The user's redundant floating status chip is hidden only in this view; remote labels remain smaller and readable.
- Library orbit cameras are bounded by the room's ceiling/walls and clipped against real-height shelf/desk/chair bounds. Outside overview/transitional cameras temporarily use the established architectural cutaway, so walls do not cover the scene. Explore mode keeps its existing human-height collision behavior.
- A bounded seated wrist/torsal pose adjustment improves reach with the existing rig and tested IK. It does not solve the character's art quality or guarantee perfect contact for every seat/furniture relationship.

## Files changed in this phase

`src/shared/CampusLighting.jsx` (new), `campusMaterials.js`, `CampusWindows.jsx`; `src/classroom/Environment.jsx`; `src/study/shared/SharedScene.jsx`, `RemoteAvatar.jsx`, `libraryCamera.js`, `StudyTables.jsx`, `RoundedFurniture.jsx`; `src/characters/studyPose.js`; `tests/libraryCamera.test.mjs`, `tests/humanStudent.test.mjs`; local assets and license/source metadata in `public/textures/campus/`; this report, the avatar asset review and browser evidence. Temporary CDP verification helpers are in `tmp/platform-review/phase4b-*.mjs`. No dependency or backend contract changes were needed for this phase. The repository contains substantial unrelated prior changes; the full Git diff is not this phase's work.

## Assets and avatar status

Wood Floor by Dimitrios Savva and Kloofendal 48d Partly Cloudy by Greg Zaal, from Poly Haven, are CC0 actual assets. See [bundled license](../public/textures/campus/LICENSE.txt), [source metadata](../public/textures/campus/polyhaven-source-metadata.json), and [official asset rights](https://polyhaven.com/license). Maps were compressed from 1K JPG sources, daylight uses the original 1K HDR, panorama is optimized to 2048×1024. No webpage preview renders were used.

The existing CC0 student GLB remains active; all professional replacement registry entries remain null. [Asset review and integration requirements](PHASE-4B-AVATAR-ASSET-REVIEW.md) records the official Quaternius CC0 candidate and the actually downloaded/inspected Kenney CC0 archive. Kenney includes FBX idle/jump/run, no walk/seated/GLB. Quaternius student wardrobe/current rig/seated compatibility is unverified. Rights are not the blocker for those CC0 candidates; delivered art quality and rig/animation compatibility are. No purchase, professional replacement, retargeting or avatar geometry redesign is claimed.

## Verification

- `npm run build`: passed, 2872 modules; Vite still warns about existing chunks above 500KB.
- `node --test tests/*.test.mjs`: 55 passed, zero failures. Includes actual GLB rig/IK checks, camera obstacle/ceiling tests, seat navigation, rain lifecycle and social filtering.
- Real Library seat selection, arrival-to-seat transition, My Desk, Library/My Desk switches, notes retention, running timer retention and Leave Table passed at 1440, 768 and 390; [results](visual-checks/phase4b-library.json). No horizontal overflow.
- Final Classroom Lesson/Third Person, Library arrival/overview/My Desk and avatar standing/seated preview screenshots were captured at the three sizes. Reviewed desktop Classroom/Library, mobile Lesson/My Desk and seated customizer images for framing and overlap. Mobile default Library preserves 2D; explicit Try 3D also captured.
- [Renderer/asset check](visual-checks/phase4b-performance.json): desktop loaded five local assets, mobile loaded only color/panorama (no HDR/normal/roughness). Both reported no lost context and WebGL error 0. HTTP cached transfer values are not original asset sizes.

## Performance and remaining limitations

New on-disk assets total roughly 2.7MB: wood color 278KB, normal 95KB, roughness 217KB, HDR 1.6MB and panorama 560KB. Texture images/materials are shared and loaded once, not per avatar or frame. Mobile viewport skips the HDR and detailed maps; the working default 2D Library fallback remains. Zone color variation uses instance colors rather than extra per-zone material draws. Shared texture variants have different UV repeat settings; their GPU allocations plus HDR prefiltering are an added cost, not free optimization.

The isolated headless browser explicitly uses SwiftShader software rendering. Its sampled Classroom statistics were 1 FPS/86 calls/103,932 triangles at 1440 and 10 FPS/28 calls/102,882 triangles at 390. These low rates are recorded honestly; there is no comparable Phase 4A FPS baseline, so a performance regression percentage cannot be established. Physical-device GPU performance and sustained mobile usability remain unverified. Use low graphics/2D fallback where necessary; this phase cannot claim a hardware FPS acceptance pass.

The campus still uses simplified furniture and repeated architecture; it is not photorealistic. Floor grain repeats over a large room. The existing avatar remains the most serious quality gap. Hands can still appear slightly detached from the shared study surface, and the backpack/face/hair remain simplified. The welcome card occupies part of the view intentionally, and third-person avatar framing is still prominent; the lesson board remains unobstructed in Lesson View. A suitable dressed professional student collection and properly fitted animations are still required.

No authenticated Google user or paid enrollment was available for this verification. Paid access/private messaging/real remote video were not bypassed or claimed to be newly end-to-end tested. Their contracts and authorization code were untouched. Static evidence is not a movement video; camera/seat transitions were exercised by the browser harness and rig/controller behavior by existing tests.

## Follow-up — rear-wall third-person framing

On the repeated Phase 4B request, fixed one remaining verified camera issue: the entrance is close to the rear wall, so collision correctly compresses camera distance and previously made the avatar occupy excessive space. Third-person FOV now widens continuously from 62° to at most 86° on desktop as clearance shrinks; portrait uses 82–90°. Collision positions, spawn, seating and Lesson View remain unchanged. This exposes more of the teaching environment without placing the camera outside the room. `src/classroom/Player.jsx`, `world.js` and `tests/classroomCameraFraming.test.mjs` changed. Production build and all 55 tests passed. Updated third-person screenshots at 1440, 768 and 390; immediate prior camera images are retained as `phase4b-before-camera-room-{width}.png`. This does not resolve the professional avatar or real-device performance limitations above.
