# Private-group-only chat — 2026-10-10

Interpreted “our group” as the existing invitation-only private study room, preserving its current same-table restriction. Public library members cannot send/read table messages, send/read direct conversations or mark direct messages read. These restrictions are enforced through the shared server table context, not just hidden controls. Public snapshots contain no chat messages or chat notifications.

Private direct messages now store their originating room ID. Conversation and notification queries require current private-room membership and an active, permitted peer at the same table. Block/DND checks remain. Public seating, private invitations, personal study tools and all course entitlements remain unchanged.

Files: `server/study/collaboration.js`, `social.js`, `models.js`, `public.integration.test.js`, `social.integration.test.js`; `src/study/shared/SharedRoomPanel.jsx`, `TableChat.jsx`.

Verification: 50 unit tests, 4 database integration suites and production build passed. Public integration explicitly checks HTTP 403 for table send/history, direct send/history/read and empty public chat/notification snapshots. Existing private chat/history, blocking, membership-generation and paid-access checks pass. Actual authenticated browser interaction was not exercised in this pass.

Legacy direct messages without a room ID are retained in storage until their existing expiry, but not surfaced, because their original group cannot be established safely. No migration or destructive deletion was performed. Friend invitations and their existing opt-out controls are preserved; this change restricts chat, not invitations.
