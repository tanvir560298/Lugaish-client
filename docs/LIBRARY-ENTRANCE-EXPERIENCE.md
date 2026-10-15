# Library entrance and social seating

## Implemented

Phases 1–2: eye-level entrance, compact welcome, private invitation workflow,
solo desk selection, verified Return to My Desk, and optional overview/table/
desk/explore views. Existing timers, notes, goals, materials, twenty five-person
tables, and four zones remain. New seat arrival opens the desk tools; recovery
preserves membership and requires an explicit return choice.

Phase 3: authenticated public table discovery and random seating are enabled.
One uniquely indexed public hall is isolated from private rooms. A per-account
lock prevents duplicate room membership; room revision compare-and-swap claims
seats atomically. Existing seats and tab ownership are preserved on repeated
join. Full halls return a real error with personal/private alternatives.
Presence and avatar updates use the existing authenticated SSE snapshots and
heartbeats. Offline presence becomes reconnecting after 20 seconds and holds
its seat for two minutes; subsequent room edits release stale reservations.
Public occupants cannot kick, invite through private tokens, or call over
strangers. Public joining is rate limited. Existing table-scoped chat uses real
members, mutual blocking and message rate limits. Do Not Disturb pauses join
requests, direct message delivery and message alerts. Notes/materials remain
personal. No public email directory, synthetic production users or fake counts.

## Files changed for public seating

- `server/study/models.js`: public/private discriminator, unique public hall key, DND preference.
- `server/study/service.js`: discovery, atomic admission, preserved seats, public action restrictions.
- `server/study/routes.js`: authenticated discovery/join endpoints and rate limits.
- `server/study/timing.js`: room kind and no public host privilege in snapshots.
- `server/study/collaboration.js`, `social.js`: DND checks alongside existing blocking.
- `src/study/shared/SharedRoomPanel.jsx`: enabled public join, real availability, block actions.
- `src/study/shared/FriendSearch.jsx`: DND control.
- `src/pages/StudyRoomPage.jsx`, `src/study/shared/SharedScene.jsx`: assigned-table camera transition and public labels.
- `src/study/shared/transport.js`: shared connection error wording.
- `server/study/public.integration.test.js`: isolated MongoDB/authenticated HTTP coverage.

## Verification and limits

41 unit tests, authenticated public-seat integration and existing private social
integration pass. Public tests include parallel admissions, last-chair race,
full capacity, private isolation, tab recovery, blocking, DND, timeout release
and explicit leave. Test fixture occupancy exists only in a disposable test DB.
Production build passes with existing large-chunk warnings.

No course, enrollment, paid authorization or classroom access changes.
Browser automation currently exposes no browser sessions; rendered composition,
mobile interaction and multiple browser windows have not been visually verified.
HTTP integration is not browser verification. Existing procedural avatar artwork
is not represented as premium authored art. Table-session chat now follows sender membership with cleanup and a renewable
TTL safeguard; direct-message retention is unchanged. See
`TABLE-SESSION-CHAT-MOVEMENT.md`. No zero-retention claim about logs/backups is made.
Phase 4 visual/browser acceptance remains outstanding.
