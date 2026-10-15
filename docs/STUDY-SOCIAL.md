# Lugaish campus collaboration

Learning Spaces presents two destinations, Classroom and Study Room, plus a compact native-dialog avatar selector. Speaking Practice routes remain available elsewhere. Avatar IDs and persistence are unchanged. Classroom retains its separate 100-desk layout; shared study rooms use 20 tables with five seats each.

## Two students

1. Sign in with two distinct accounts in different browsers, or a normal and private window.
2. Open `/learning-spaces`, choose avatars using My Avatar, enter Study Room.
3. Each student chooses Study with friends, creates a hall and enters it. Student B sits at a table and waits for arrival.
4. Student A opens Invite Friend to Table and enters B's exact account email. A gets the same generic response for unknown, opted-out, blocked, self or eligible accounts.
5. B receives a real in-app request. Accept reserves an empty seat at B's current table. Decline leaves membership unchanged.
6. A joins B's hall through the entrance flow if changing rooms; in the same scene, observers see the greeting. The synchronized server timeline contains greeting, turns, acceleration/braking, obstacle-aware walking and sitting. Existing skeletal clips and foot planting remain in use.
7. Open Table chat. Send to Everyone at this table or select a participant for a private message. History survives refresh for up to 24 hours. Table messages are shared only with participants present when sent; a new participant does not acquire earlier members' messages.
8. Incoming previews last 2–10 seconds based on readable text length. Hover or keyboard focus pauses dismissal; Dismiss closes the preview. Only received messages chime, and rapid chimes are throttled. Sound requires a user gesture and honors mute.
9. Leave table walks back to the entry area. Leave room removes membership. Reconnecting clients retain seats for two minutes and reclaim their controlling tab on refresh.

## Privacy and authority

Email lookup does not return account existence, names, email addresses or presence. Email is an account identifier, not Gmail authorization. No external email is sent. Invitations can be disabled. Requester names can be hidden. Invitation requesters and table participants can be blocked/unblocked.

Authenticated server handlers validate identities, active membership, table membership, recipients, capacity, blocking and message text limits. Messages are rendered as React text. Tables have session IDs that rotate on occupancy turnover; messages are additionally scoped to their audience. Private conversation history is limited to its sender and recipient. Personal notes, materials and earlier solo timer data remain private.

MongoDB revisions serialize seat changes and simultaneous last-seat reservations. Account locks serialize room transfers. Cross-room acceptance reserves the destination first and compensates by removing that reservation if source-room removal fails; deployments requiring crash-atomic multi-document transfers should use MongoDB replica-set transactions. This local standalone MongoDB setup does not certify crash-atomic transfer across API termination.

## Main implementation files

- `src/pages/LearningSpacesPage.jsx`, `src/characters/AvatarChooser.jsx`, `src/university/university.css`: compact campus and avatar UI; entrance portals reduced to two.
- `server/study/collaboration.js`, `models.js`, `routes.js`, `service.js`, `social.js`: invitation eligibility/preferences, requests, table sessions, authenticated table/private messages and event snapshots.
- `src/study/shared/FriendSearch.jsx`, `TableChat.jsx`, `SharedRoomPanel.jsx`: invitation dialog, privacy controls, participants and chat.
- `RemoteAvatar.jsx`, `SharedScene.jsx`, `useSharedRoom.js`: synced character choices, greeting/movement state and audience-scoped speech bubbles.
- `notificationQueue.js`, `StudyInvitations.jsx`, `chime.js`: accessible timed previews, request notifications and sound preferences.

## Verification

```
node --test tests/characterMovement.test.mjs tests/studySocial.test.mjs server/study/study.test.js
RUN_STUDY_INTEGRATION=1 node --test server/study/social.integration.test.js
npm run build
```

The integration suite uses two independently authenticated HTTP sessions, an actual event stream and synthetic accounts in its own uniquely named local database. It checks generic email responses, authorization, accept/decline, cross-room acceptance, motion timeline, concurrent last-seat reservations, table/private messaging, cross-table isolation, read ownership, blocking, anonymity and persisted snapshots. It deletes only its own temporary database.

No lint or type-check scripts are provided by this project. Unit tests cover movement/corridors, grounded skinning and notification duration. Browser automation was unavailable (in-app browser unavailable; Chrome computer-use timeout). The following remain unverified in real browsers: avatar modal keyboard operation and persistence, responsive layout, visual foot/chair contact and animation quality, audible autoplay/mute behavior, floating bubble readability, and two-browser rendering/reconnection. Use the two-student procedure above to verify them. Backend multi-user behavior has been exercised over HTTP, which does not certify these visual/audio checks or 100-client load performance.
