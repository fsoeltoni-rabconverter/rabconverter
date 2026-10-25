# Architecture and Cloud Delivery — PDF RAB MVP

## Operating constraint

All product work and deployment must happen through cloud-hosted tools. No local development environment is part of the required workflow. GitHub stores source/docs/migrations/workflows; GitHub Actions runs checks and deployment; Cloudflare hosts the web app and preview; Supabase supplies auth, metadata and private storage where appropriate.

## MVP path

PDF upload → private original storage → PDF classify/extract → RAB row mapping → safe formula reconstruction → reconcile against printed amounts → user review → formula-bearing XLSX download.

## Proposed components

- **Frontend web app:** one upload experience, processing status, row preview/review, warning panel and download.
- **Cloudflare:** Pages or Workers-based web host selected according to parser/runtime architecture; preview URLs must exist before implementation is treated as reviewable.
- **GitHub:** source of truth for app, docs, tests, migrations and CI workflows.
- **GitHub Actions:** deterministic lint/type/test/build and gated deployment.
- **Supabase Auth:** identity if sign-in is enabled for MVP.
- **Supabase Postgres:** jobs, source metadata, extraction runs, normalized rows, formula provenance, review edits, warnings and export metadata.
- **Supabase Storage:** private original PDFs and output XLSX files, with ownership-gated access.
- **PDF parser/OCR adapter:** replaceable service boundary; select the provider only after benchmark, latency/size testing, cost and privacy review.
- **XLSX generator:** writes editable cells and formula cells; does not depend on PDF-only source values masquerading as recovered workbook formulas.

## Important runtime decisions

Before locking the application framework or processing provider, evaluate:
1. Maximum intended PDF pages/bytes.
2. Runtime of native text extraction and scanned-page OCR.
3. Whether processing fits a single Worker/API request or needs a durable background job/queue.
4. Formula generation and recalculation verification strategy.
5. XLSX library compatibility with selected runtime.
6. Storage region, retention and document sensitivity.
7. Cost per page/file and error/retry rates across representative PDFs.

## Implementation order

1. Documentation and legal-to-use golden PDF fixtures.
2. Static UX shell with sample data clearly labelled as sample.
3. CI checks and Cloudflare preview.
4. Private PDF upload + job creation.
5. Parser for the first born-digital PDF RAB layout.
6. Row classification, formula candidate engine and reconciliation.
7. Review/correction interface.
8. XLSX generation and formula recalculation tests.
9. OCR for scans only if benchmarks justify supporting it.
10. Security, privacy, deletion and release hardening.

## Cloud-only Git workflow

- Create feature branches/PRs via GitHub cloud tools/API.
- PR runs formatting/lint/types/tests/build.
- Preview becomes available on Cloudflare after CI/deployment checks.
- Inspect the real URL before merge.
- Production deploy only via an explicit approved branch or release trigger.
- Keep one deployment owner to avoid duplicate or conflicting deploys.
- Database schema changes require versioned migrations in Git and deliberate application.

## Current infrastructure state

Initial inspection found an empty GitHub repository, no application workflow runs, an active but unused Supabase project, and no RabConverter Pages project or Worker. Documentation is now committed, but a running preview is not yet available.
