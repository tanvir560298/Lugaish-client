# Character movement

The classroom, campus and study rooms share an articulated character renderer and the six existing Quaternius CC0 skeletal clips in `public/models/student/student.glb`. The transparent SVG selector illustrations and saved IDs are retained. The in-room billboard rendering is replaced with rounded bone-attached geometry because a single flat image cannot animate individual limbs.

## Controller

`src/characters/characterController.js` implements a kinematic vertical capsule against static room AABBs, subdividing integration to 120 Hz and sweeping horizontal movement in steps no larger than a quarter radius. Circle/AABB narrow-phase checks avoid square collision corners. Collision responses retain safe positions and slide along walls. Animation receives achieved displacement, so pushing into furniture does not keep the character walking.

Walk/run speeds are 1.45/3.1 m/s, with bounded acceleration, braking and yaw rate. Translation follows body orientation and slows for sharp turns. Destination navigation brakes with stopping distance and previews upcoming corners. Gravity grounds falling characters; small supported elevation changes follow the floor. Campus ground heights match the actual four 7 cm staircase treads.

The study navigator searches capsule-clear corridors and simplifies only with full corridor visibility. Start and destination rows are included to find the narrow aisle behind the book divider. Furniture colliders mirror the current geometry and must be updated if furniture is moved. A blocked route returns null, rather than snapping to the requested destination.

## Animation

`studentMotion.js` owns idle/start/walk/turn/stop states and idle/walk/run blending. Start, stop and stationary turning use blended existing clips rather than additional authored clips. Gait phase follows measured travel distance; walking and running share normalized phases. The bundled clips' calibrated stance speeds are 1.055 and 5.84 m/s. Motion is frozen when translation is blocked. Bone lookup handles Three.js's removal of periods from glTF names.

`footPlanting.js` applies bounded two-bone leg IK after mixer evaluation. Low toes lock in world space during stance; airborne feet retain the authored swing. Segment lengths and foot orientation remain intact. Sitting and standing use the authored non-looping clips and completion events; IK is disabled during chair transitions. The study root docks/undocks over those clip durations instead of changing position instantly. Chair docking is a controlled interaction, not a normal capsule walk through the chair. Explicit instant/reduced-motion seat selection retains its existing immediate behavior.

## Verification and limits

Run `node --test tests/characterMovement.test.mjs` and `npm run build`. Regression checks cover sustained wall contact, diagonal sliding, long-frame collision safety, gravity, turning/braking, classroom bounds, every study-seat route, blocked navigation, campus stair/door readiness, sanitized rig bones, frozen gait and IK segment lengths.

This is a static-world kinematic controller, not a rigid-body simulation. It does not support jumping, pushing furniture, moving platforms, arbitrary slopes or dynamic body collisions. Wave, idle looking and chair interactions are supported; no new classroom object actions have been invented. Numerical checks cannot certify every rendered contact pose. Live browser review of walking, running, stair foot placement and chair alignment is still required; computer-use tools timed out in this session.

## 100-seat halls

The classroom uses `server/study/hallLayout.js`: 100 unique seat IDs, ten rows, two five-column blocks, central and side aisles, and a 24 × 30 m shell. The shared study hall uses `server/study/tableLayout.js`: 20 tables with five chairs each in a 32 × 34 m shell. Personal study stations remain available separately. Classroom desk clicks and the toolbar selector navigate to a desk, sit, and stand before resuming keyboard movement. `/study-room-preview` includes a local table-hall preview without creating a real shared room. See `STUDY-SOCIAL.md` for friend invitations, messages, and table-specific timers.

Shared-room admission and invitation availability now derive from the same 100-seat capacity. This is an admission limit, not evidence that 100 concurrent clients have passed a load test. The classroom remains a local session; this change does not create classroom multiplayer.

Shared movement includes analytic acceleration/braking, timed turns, chair approach from the front, and short docking/undocking transitions. The server and client sample the same timeline. Furniture is instanced; character shapes are combined into one vertex-colored skinned mesh per person while preserving the skeleton. Regression tests cover all 10,100 entry/seat-transfer combinations and verify that the combined skin matches the original animated bone-attached geometry.
