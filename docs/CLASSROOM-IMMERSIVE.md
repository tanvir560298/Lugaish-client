# Immersive Classroom

`/classroom` and the development-only `/classroom-preview` render the scene immediately in a fixed, edge-to-edge 100dvh root. The route uses a minimal Layout branch without website header, footer, mobile navigation or surrounding app-shell padding. Overflow is locked while mounted and restored on exit. Other routes retain the standard layout.

The HUD contains a small room/logo identifier, exit, browser fullscreen, settings, lecture playback, desk selection, camera switching and wave. Movement hints minimize while walking. Lecture/day selection, graphics, recovery, media status and performance samples live inside a native settings dialog. Authentication and lecture entitlement checks remain unchanged. Classroom playback is still local and does not certify lesson completion or introduce classroom multiplayer.

Browser fullscreen requires a button click. The controller listens to fullscreenchange, handles rejection and unsupported APIs, and exits only this root's fullscreen during cleanup. Immersive viewport mode remains active after exiting browser fullscreen. R3F's existing ResizeObserver and camera projection lifecycle handle container size changes; resize debounce is zero. Fullscreen and camera/HUD changes do not change the scene key or remount Canvas. Explicit reload/replay still resets the scene as before.

Touch devices receive a directional pad using the existing physics controller, plus drag-to-look on the canvas. Hybrid touch/mouse devices also have mouse capture. Touch input clears on pointer cancellation, focus loss or visibility changes. Keyboard controls remain disabled while typing or interacting with dialogs; opening settings releases mouse capture. Safe-area insets and dynamic viewport units protect mobile controls.

## Changed files

- `src/components/Layout.jsx`: classroom-only layout branch.
- `src/pages/ClassroomPage.jsx`: immediate scene, floating HUD, native settings and fullscreen lifecycle.
- `src/classroom/classroom.css`: scoped viewport/HUD/dialog/touch styles.
- `src/classroom/immersive.js`: fullscreen lifecycle, overflow cleanup and typing guard.
- `src/classroom/TouchControls.jsx`: pointer-based movement pad.
- `src/classroom/Player.jsx`: touch input/look and movement activity reporting; existing seat paths, collision and camera behavior retained.
- `src/classroom/ClassroomScene.jsx`: immediate resize handling and activity callback.
- `tests/classroomImmersive.test.mjs`: fullscreen state, rejection/unsupported APIs, cleanup and typing protection.

## Verification

```
node --test tests/classroomImmersive.test.mjs tests/characterMovement.test.mjs
npm run build
```

Tests use a DOM event fixture for Fullscreen API lifecycle, not a real browser fullscreen session. Physics, collision, navigation and skinning regressions are checked by the movement suite. No lint/type-check command is defined in package.json.

The computer-use browser provider returned no browser surfaces and the native Chrome provider timed out. Therefore real browser fullscreen/Escape, viewport dimensions, orientation, pointer lock, touch gestures, visual animation and projector playback remain unverified interactively.

Manual acceptance:
1. Open `/classroom-preview`: no website header/footer, no lobby or page scrolling; scene occupies the viewport.
2. Click fullscreen, then Escape: fullscreen button state follows the browser; viewport mode remains.
3. Capture mouse, move with WASD, choose a desk, wave and switch cameras. Open settings and type/interact: movement shortcuts must remain inactive.
4. Resize the window and rotate a phone: scene stays edge-to-edge without stretched perspective. Use direction pad and drag-to-look on touch devices.
5. Choose an available lecture from Settings, start class and check projector/teacher controls.
6. Exit to campus: website layout and prior overflow behavior return. Repeat on the authenticated `/classroom` route for entitlement/catalog checks.
