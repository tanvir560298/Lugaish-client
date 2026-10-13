# Phase 19 external release prerequisites

These are unavailable external checks, not permission requests for completed local engineering. No hosted account configuration, push, deployment, production reset or production restore occurred.

| Area | Status | Exact owner prerequisite |
|---|---|---|
| Hosting and Git auto-deploy | BLOCKED | Confirm the approved frontend/API projects, connected repositories, deployment branches and auto-deploy settings in their dashboards. Existing local branches are both `main`; workflows do not deploy, but that does not prove provider auto-deploy is disabled. |
| Protected staging | BLOCKED | Supply approved staging frontend/API HTTPS origins and enable provider access protection, with authorized operator/tester access. Confirm auth-helper routes and API/SSE requests work through the actual protection policy. |
| Staging data isolation | BLOCKED | Provision a separate staging-named MongoDB database with least-privilege credentials and network restrictions, a distinct JWT secret, and sanitized test records. Never use production student data. |
| Google login | BLOCKED | Supply the chosen staging Firebase project/web-app config and private Admin application-default credentials, authorize the exact frontend domain and OAuth handler, and configure matching `/__/auth/*` routing. Then test actual popup/redirect, intended-page return, logout and expiry with an authorized Google account. Project ID alone is not an Admin credential. |
| Backend/frontend configuration | BLOCKED | Configure the private host environment from the example templates, validate both files and the paired environment, confirm actual proxy CIDRs, then start the approved staging service. `API_BIND_HOST` controls binding; production/staging normally use `0.0.0.0`, local development defaults to `127.0.0.1`. |
| Protected media | BLOCKED | Provide permitted private test media and an authorized enrolled test account on staging. Verify authorized playback and unauthorized/enrollment-revoked denial. Public demo playback or local fixture authorization tests are insufficient. |
| Container execution | NOT TESTED | Build and run `deploy/api.Dockerfile` in an authorized environment with Docker available; verify readiness, shutdown and approved index preparation. |
| Monitoring | BLOCKED | Configure an approved restricted logging/uptime provider, retention policy, operational owner and alert destination. Perform a controlled staging failure and verify alert delivery without logging tokens, private content or recordings. |
| Backups and hosted rollback | BLOCKED | Approve encrypted off-device storage, retention, RPO/RTO, least-privilege backup/restore principals and a safe previous release. Rehearse restore/cutover and code rollback in protected staging. The successful local fixture BSON restore and archive-integrity tests do not prove hosted recovery. |
| Phase 20 catalog reset | BLOCKED pending Phase 20 | Inventory the explicitly authorized target database, review a fresh backup and affected counts, and approve any archive/cutover operation. If its active catalog is already empty, skip the reset. Preserve user/enrollment/learning/note/goal/avatar/group history. |

The templates deliberately fail release validation until real approved settings are supplied. Existing dirty frontend/backend trees still require review and coordinated commits, including the backend gitlink, before a deployable artifact can be prepared. Do not push to a production-connected branch during that review. No Phase 20 operation is authorized or started by this document.
