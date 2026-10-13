# Staging and release preparation

Prepared only. No hosted staging or production deployment, DNS changes, purchases or cloud account changes were made.

## Suggested architecture

Keep the existing Vercel Vite frontend; use a persistent Node/Docker API on Render and an isolated MongoDB database. This minimizes frontend migration and retains long-lived Study SSE connections. [Render supports Node/Docker web services](https://render.com/docs/web-services) and [readiness health checks](https://render.com/docs/health-checks). This is a recommendation, not a selected/purchased service.

| Option | Fit / tradeoff |
|---|---|
| Existing Vercel frontend + Render API | Recommended continuity with the current frontend. Separate API origin requires exact CORS and Firebase domain configuration. |
| Render web API with another static host | Keeps the same container/API; moving the existing frontend needs a separate routing/auth-helper review. |
| Firebase Hosting frontend + persistent Render API | Native Firebase hosting integrates with the auth helper; frontend hosting migration is additional work. |

Provider costs, account entitlements and commercial suitability must be checked by the owner before purchase. No prices are assumed. Never put the SSE API into a request-only serverless function without verifying streaming/lifecycle limits.

## Isolated staging

1. Review and commit the backend changes in `Lugaish-server`, then update the frontend's `server` gitlink and commit the frontend. `.gitmodules` now identifies the existing server repository. Do not release the currently dirty working tree. Private repository checkout requires properly scoped access; no access token is included here.
2. Create a separate staging database and restricted credentials, separate Firebase project/web app, JWT secret, exact HTTPS frontend/API origins, and trusted proxy policy. Database names must explicitly contain `staging`; never use production student data. `APP_ENV=staging` excludes the production frontend CORS default.
3. Copy `.env.staging.example` to ignored `.env.staging`, and `deploy/api.env.staging.example` to a private host-side config. Validate with `npm run validate:env -- frontend PRIVATE_FRONTEND_ENV` and `npm run validate:env -- backend PRIVATE_API_ENV`. Templates intentionally fail validation until configured. URI/password values are never printed.
4. Run isolated tests, then use `npm run build:staging`. Release builds (`build:staging` / `build:release`) reject localhost API URLs, placeholders and secret-like browser variables. Ordinary `npm run build` remains a local code-verification build, not proof of deployable environment configuration.
5. Build the API from the **server context**: `docker build -f ../deploy/api.Dockerfile -t lugaish-api:COMMIT .` from `server/`. It installs production dependencies, copies only `src` and `study`, runs as non-root, and checks `/readyz`. Docker is unavailable on this workstation: image build/run is NOT TESTED.
6. Before booting a new isolated database, prepare required indexes with the guarded script in the backup runbook. Production startup does not auto-create indexes. Use reviewed migrations; do not seed retired courses.
7. Generate host routing using `node scripts/release/vercel-config.mjs PRIVATE_FRONTEND_ENV OUTPUT_CONFIG`. It targets the chosen Firebase project rather than routing staging callbacks to production. Generated public config belongs with the matching frontend artifact; deploy through the chosen host only after explicit approval.
8. Enable access protection for the staging frontend and appropriate network/access controls on the API. [Vercel deployment protection](https://vercel.com/docs/deployment-protection) is configurable, but protection has not been enabled/tested here. Check auth-helper routes through the actual protection setup.

## Google authentication

The app uses Firebase popup sign-in and redirect recovery; backend exchanges the verified Google token for its bearer JWT. It does **not** use an Express cookie session, so cookie-session settings are not applicable. API authorization headers and exact CORS handle split origins. JWTs remain in browser localStorage (an XSS exposure to review); existing session lifetime is seven days. Logout clears the local session and Firebase sign-in. API expiry invalidates stored tokens; this does not implement server-side revocation of every previously issued application JWT.

Firebase verification now checks revoked Firebase tokens at exchange. This requires configured Admin credentials; the project ID alone is not credentials. Supply application-default credentials or a securely mounted service-account file, not a frontend variable. No real provider sign-in was tested.

For reliable redirect recovery on browsers blocking third-party storage, configure `VITE_FIREBASE_AUTH_DOMAIN` to the approved frontend host and proxy `/__/auth/*` to that environment's Firebase project. Add the exact staging domain to Firebase authorized domains, configure the associated OAuth handler URI, and verify popup + redirect on the actual host. [Firebase redirect guidance](https://firebase.google.com/docs/auth/web/redirect-best-practices), [Google sign-in documentation](https://firebase.google.com/docs/auth/web/google-signin). The root `vercel.json` retains the existing production project; the generator produces the staging-specific version. Gmail administration OAuth is separate: configure its private backend redirect URI only if the owner enables that integration.

## CI and release artifacts

`verify.yml` installs both dependency trees, syntax-lints JS/JSX, discovers unit and isolated MongoDB tests, audits production dependencies and builds the frontend. It uploads a **verification-only** frontend artifact. Lint is syntax validation; semantic ESLint is not configured.

`prepare-release.yml` is manual (`workflow_dispatch`) and selects the `staging` or `production` GitHub environment. Configure environment variables and required reviewers in repository settings before using it. It validates public build configuration, builds and packages matching frontend/API sources and metadata. It has **no deploy command**. GitHub workflows have not been run remotely.

Local review snapshots are in ignored `release-artifacts/`. Their manifest sets `deployable:false` because this workspace is uncommitted and its configuration is local. Archives exclude `.env`, node_modules and private backups. Real release export refuses a dirty frontend/backend or a backend missing the publication/operations infrastructure. Configure the real staging environment and review commits before producing a deployable release.

See [backup and rollback](backup-recovery.md) and [monitoring](monitoring.md). Keep the previous verified safe release plus configuration metadata. Deployment, DNS, production restores and service purchases still require explicit owner approval.

## Development-tool advisories

Final full frontend audit reports nine development-tool findings (six high, three moderate), versus zero production dependency findings. They include unpatched `braces` pattern exhaustion propagated through Tailwind 3 and Vite 5 development-server issues. Do not expose Vite/esbuild development servers publicly; Vite now binds explicitly to loopback with a fixed port. CI accepts only reviewed source for release preparation and contains no automatic deploy. Replacing Tailwind 3/Vite across major versions needs a separate compatibility-tested migration; it was not silently forced during staging preparation. These are unresolved tooling findings, not a clean full audit. Review [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) and [Vite path traversal advisory](https://github.com/advisories/GHSA-4w7w-66w2-5vf9) before broader tool/server exposure.

## Phase 14 update

Installed Vite is now 6.4.4 (esbuild 0.25.12); full frontend audit decreased from nine to seven remaining Tailwind-chain development findings. Production-only findings remain zero. Do not treat development findings automatically as shipped runtime vulnerabilities; review their build/watch reachability. Restart an already-running old dev executable when convenient to load the installed patched version.

Use `node scripts/release/validate-pair.mjs PRIVATE_FRONTEND_ENV PRIVATE_BACKEND_ENV` to catch mismatched Firebase/API/CORS configuration, and `node scripts/release/verify-manifest.mjs ARTIFACT_DIR staging|production EXPECTED_HTTPS_API_ORIGIN` to check rollback archive integrity and destination compatibility. Neither command deploys, authenticates a real Google user, or proves migration safety. See `docs/PHASE-14-RELEASE-BLOCKERS.md` for current externally blocked checks and owner actions.

## Phase 19 release safeguards

Manual release preparation now chooses `.env.staging.local` plus `build:staging` or `.env.production.local` plus `build:release` according to the selected target, then verifies that the archive manifest matches that target and approved API origin. Previously the staging selection still built a production-mode receipt. Neither workflow deploys. The new workflow checks ran locally as source regression tests; remote GitHub Actions execution remains unverified.

Backend production startup requires explicit `APP_ENV=staging|production`, a named MongoDB database, an exact public HTTPS frontend origin present in the CORS allowlist, and existing Google/JWT requirements. Staging database names must contain a separate `staging` segment, and production rejects those staging names. Release environment validation now allows ordinary MongoDB driver query options such as `retryWrites` and `w`; it still rejects URI fragments. Trusted proxy configuration rejects malformed networks, boolean/hop-count trust and catch-all CIDRs. Configure the actual provider subnet or leave proxy trust disabled.

Both Git remotes use their existing GitHub repositories and both checked-out branches are `main`. There is no deploy command in the verification/manual preparation workflows. Local Vercel configuration does not establish whether the live hosting project is connected to Git auto-deployment; the owner must inspect the provider's connected repository, production branch and automatic deployment settings before any push. No push, branch publication or hosted deployment was performed.

Development API startup now binds `127.0.0.1` by default; production startup defaults to `0.0.0.0` for the container/host. `API_BIND_HOST` is an explicit override. This takes effect when that process next starts. The user's existing local API was not stopped or restarted during the audit.
