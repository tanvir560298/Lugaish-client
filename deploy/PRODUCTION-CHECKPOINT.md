# Production deployment checkpoint — preparation only

Status: NO-GO. No public deployment, DNS change, purchase or production migration is authorized by Phase 13. A release artifact is not owner deployment approval.

## Required before approval

1. Review and commit both dirty repositories, then update the frontend backend gitlink. Confirm the exact commits are remotely accessible and CI runs against them.
2. Resolve known development-tool advisories with compatibility testing. Do not expose Vite/esbuild dev servers.
3. Supply an explicitly approved protected staging frontend/API, isolated MongoDB, Firebase credentials/domains and permitted test media. Validate private backend/public frontend config without printing values. Run actual hosted login, intended-page return, enrolled/unenrolled/revoked permissions and lecture playback. Complete physical-device, accessibility and human beta checks.
4. Set up approved production hosts/secrets/HTTPS, exact CORS and trusted proxy addresses, least-privilege MongoDB credentials/network access, authorized Firebase/OAuth domains and separately configured Gmail integration only if used. Existing bearer JWT uses browser localStorage, not a cookie session; seven-day app JWTs do not currently have universal server-side revocation. Review that risk explicitly.
5. Approve encrypted off-device backups, retention and restore objectives. Restore into isolated database and rehearse rollback. Configure privacy-conscious alerts and verify delivery. Existing local rehearsals are not production monitoring/recovery evidence.

## Candidate preparation (no deployment)

Use existing frontend host plus persistent Express API and isolated MongoDB; the architecture/runbooks in README.md remain applicable. No provider purchased or selected on the owner's behalf.

- Install both locked trees with `npm ci` and `npm ci --prefix server`.
- Run `npm run lint`, `npm test`, `npm run test:integration` with disposable local MongoDB. Integration fixtures must never use production accounts/data.
- Run production audits for both trees, and review the full development-tool audit separately.
- Configure and validate the frontend using `npm run validate:env -- frontend PRIVATE_ENV_FILE`; validate the API with `npm run validate:env -- backend PRIVATE_ENV_FILE`. The production template is `deploy/api.env.production.example`. Templates intentionally fail until configured.
- Run `npm run build:release` (production) or `npm run build:staging`. Validated builds emit `release-build.json` containing public API origin and frontend/backend commit IDs only. An ordinary local build is not a deployable release.
- Run `node scripts/release/artifacts.mjs`. It refuses dirty repositories, missing build evidence, mismatched commits and non-HTTPS release evidence. It invalidates old manifests before packaging and writes a success manifest atomically only after archive hashes exist. `--allow-dirty-local` produces review-only `deployable:false` snapshots.
- Generate matching host auth routing with the existing vercel-config tool. Build/run the API container from the server context, test its readiness and approve reviewed index preparation separately. Docker was unavailable locally; no container execution proof exists.
- The manual prepare-release workflow now runs isolated integration tests before packaging. GitHub environment protection/reviewers still require owner configuration; workflow files are not proof that remote CI ran.

## Exact approval request to use when ready

Prepare a concrete record: target host/project, frontend/backend commits, archive SHA256, public domains, configuration identifiers (no secret values), approved database, migration/index operations, verified staging evidence, maintenance window, monitoring owner and safe rollback release. Ask the owner to approve **uploading those exact artifacts and updating those named frontend/API services**. DNS, purchases and production migrations need separately identified approval if involved. Do not request an unspecified blanket “launch approval.”

No such release candidate exists yet, so this iteration stops before requesting an unsafe deployment.

## After explicit approval only

Back up the approved production database to approved private storage; verify backup integrity and isolated restore evidence. Apply only separately approved non-destructive index/migration operations. Upload the verified API and frontend artifacts through the approved providers; configure HTTPS/auth helper routing and secrets through private host settings. Do not run Vite dev or preview as production hosting.

Smoke-test liveness/readiness, real Google login/logout/expiry, intended-page navigation, empty catalog or approved new course, enrolled/unavailable lesson protection, authorized video/native recovery, quiz grading/progress, confirmed Library seating/private chat, notes/timer/rain and microphone cleanup. Watch redacted API/frontend errors and DB connectivity. Record results rather than assuming deployment success.

## Rollback

Freeze rollout on failed readiness, authentication, permissions, playback or data persistence. Redeploy the previous checksum-verified **post-archive access-safe** frontend/API pair and matching private configuration; do not roll back to code that exposes retired courses. Keep student data intact. A production DB restore is not the routine code rollback and requires separate approval, tested recovery plan and preservation of intervening writes. See backup-recovery.md. No real hosted rollback has been executed.
