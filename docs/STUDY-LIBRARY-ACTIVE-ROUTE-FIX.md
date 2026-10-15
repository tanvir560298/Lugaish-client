# Active Study Library route fix

Root cause: `/study-room` renders StudyRoomPage → StudyWorkspace. StudyWorkspace still mounted the old StudyScene whenever no private room was active. The upgraded SharedScene was gated behind room creation and an entrance step. Thus previous shared-scene work did not change the default landing page. Port 4174 is running Vite development, confirmed by process command and React-refresh HTML; it is not a stale production preview. Backend health reports MongoDB connected.

Changed files:
- `src/pages/StudyRoomPage.jsx`: removes old personal scene from this route; default Library Overview, My Desk/Back to Library, compact timer, collapsible four-tool workspace, existing timer/notes/material access and focus controls.
- `src/components/Layout.jsx`: Study Room uses an edge-to-edge shell below the existing global header; suppresses footer in this immersive route.
- `src/study/shared/SharedRoomPanel.jsx`: always renders SharedScene, even without private membership; room/table/invitation/chat/host controls are in a native dialog. Empty personal library has no fake users. Personal seat animation is explicitly local; private seat requests still use authoritative backend actions. Seat arrival opens desk tools; avatar customization and leaving personal seat remain available.
- `src/study/shared/SharedScene.jsx`: parent Library/Desk mode selects the camera; local scene explicitly avoids live-occupancy claims.
- `src/study/shared/StudyHallPreview.jsx`: development preview coordinates seat readiness, camera and desk tools.
- `src/study/shared/useSharedRoom.js`: initial authenticated home snapshot followed by SSE, explicit connection-error state rather than a permanently unexplained warning.
- `src/study/shared/transport.js`: SSE errors retain HTTP status for sign-in diagnostics.
- `src/study/study.css`: dominant library canvas, compact controls, responsive desk drawer and room dialog; no permanent timer sidebar.

Current private rooms and 20 five-seat tables are preserved. Public drop-in remains unimplemented; personal/local seats are not public reservations. Paid Batch/Arabic/English/auth/payment/classroom/backend permissions are untouched.

Validation: 37 unit tests pass, authenticated real HTTP/Mongo social integration passes (seat races, invitations, SSE, privacy and reconnect), production build passes. Running Vite serves `ls-library-header` and `ls-desk-drawer` in the active route module and no `ls-desk-panel`. Interactive browser tooling has no available browser surface, so no screenshot or actual rendered desktop/mobile/seat-transition acceptance check is claimed. Scene assets remain the existing procedural library/avatars; premium art quality is not claimed.

Reconnect investigation: backend is healthy and authenticated SSE passes the integration test. The actual user's browser token/console could not be inspected; no specific session failure is assumed. Failed auth/network responses are now surfaced with useful errors. Shared connection failures do not gate the personal library overview. No database migration or new dependency.
