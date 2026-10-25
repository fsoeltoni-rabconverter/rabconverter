# Architecture and Cloud Delivery

## Operating constraint

Product work happens through cloud-hosted tools and services. No local development environment is required or part of the prescribed workflow. Code, documentation, migrations and workflow definitions are committed in GitHub; GitHub Actions builds/tests; Cloudflare serves preview/production; Supabase provides application data/auth/private storage where appropriate.

## Proposed components

- **Frontend web app**: upload, job status, extraction review, editing and export.
- **Cloudflare**: static web app/Pages or Workers-based host depending on final runtime; preview URLs for branches/PRs.
- **GitHub repository**: only source of truth for application code/docs/migrations/workflows.
- **GitHub Actions**: check formatting/lint/types/tests/build; deploy to Cloudflare with scoped secrets after checks pass.
- **Supabase Auth**: identity and sessions if user accounts are included in the MVP.
- **Supabase Postgres**: job metadata, document metadata, extraction runs, normalized rows, review edits and validation issues.
- **Supabase Storage**: private original and derived document objects, gated through user-bound access controls.
- **Processing worker/provider**: a background-capable, replaceable boundary for parsing/OCR. Final service selection requires a representative test and review of timeout, privacy, size, cost and output fidelity.

## Architecture decision still open

Do not assume the file parser or host framework yet. Evaluate:
1. Whether first release is a static web client with direct Supabase integration and a separately hosted processing endpoint, or a Worker/API-backed application.
2. Typical and maximum source document sizes and processing duration.
3. Whether XLSX/PDF structural parsers can run within supported cloud runtime and request limits.
4. Need for queue/background jobs vs short synchronous processing.
5. Data residency and handling requirements for client tender files.

## Suggested implementation order

1. Documentation and test fixtures.
2. UI skeleton with deterministic mock result for design review only, visually labeled as sample data.
3. Real upload and private storage.
4. Parser adapter and first supported file path.
5. Review UI backed by persisted extraction.
6. XLSX/CSV export.
7. Hardening, telemetry without source content, privacy and deletion.
8. Expand formats/provider only with benchmark evidence.

## Cloud-only Git workflow

- Create feature branches and PRs from GitHub web/API.
- Run CI automatically on PR.
- Cloudflare preview gives an inspectable URL.
- Review the preview before merge.
- Merge only after CI and acceptance checks pass.
- Production deployment must be a separate, explicit configured action; do not infer that a preview is production.
- No direct production mutation without a migration/change record and review.

## Decision on Cloudflare hosting

Cloudflare account access is connected, but no RabConverter Pages project or Worker was found during initial inspection. The repo and app need to be bootstrapped before a preview URL can exist. Cloudflare supports Git-integrated preview deployments and GitHub Actions deployment workflows; choose one clear owner for deploys to avoid double deployments.
