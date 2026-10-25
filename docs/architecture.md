# Architecture and Cloud Delivery — PDF RAB MVP

Status: target architecture only; not implementation evidence. Infrastructure snapshot reviewed 2026-10-25.

## Principles

Keep the design small. The database is the source of truth for identity ownership, job state, wallet/ledger, page assessments and payment credit. The UX stays upload-first. Do not add services simply to mirror each processing step.

## Target runtime path

Browser upload/preflight → sign-in before durable owner-scoped job/storage → compact estimate and wallet status → explicit Konversi PDF → atomic job creation and max reservation in Supabase Postgres → durable job processing (Cloudflare Worker/Queue only if actual runtime limits require it) → Reducto extraction → deterministic row/formula validation → exception-only user decision if required → verified/recalculated XLSX → substantive page assessment → atomic settlement/release → authenticated download and compact receipt.

A status label or architecture diagram is not evidence a component exists.

## Components and ownership

- **Frontend:** one main upload action; inline estimate, progress, exception and result states. No prerequisite dashboard.
- **Cloudflare Pages/Workers:** intended web/API runtime. If PDF/provider duration exceeds request limits, use one durable queue/consumer pattern. Queue delivery is at least once; consumers must be idempotent. Add a DLQ only if needed for actionable recovery, not as a second workflow system.
- **GitHub/GitHub Actions:** source of truth, deterministic CI, preview/release workflow. Current repository has no verified application/CI.
- **Supabase Auth:** required before durable owner-scoped jobs/source storage and before any paid provider call or wallet operation. Basic preflight can precede login; the MVP does not offer guest wallet/guest paid jobs.
- **Supabase Postgres:** conceptual jobs/pages/rows/issues/artifact metadata, wallet/immutable ledger, top-up orders/payment events and page assessments. No tables exist in the inspected public schema snapshot.
- **Supabase Storage:** private originals and exports; short-lived signed URLs or authenticated proxy.
- **Reducto Deep Extract:** only extraction provider for initial runtime, through a server-only adapter. LlamaExtract/Pulse Ultra 2 excluded.
- **Payment gateway:** unselected. Evaluate QRIS support, fees, verified callbacks, duplicate/event handling, settlement reports and refund mechanics before choosing.
- **XLSX generation/verification:** generate formula-bearing editable XLSX; validate structure, recalculate eligible formulas in the selected supported engine, scan formula errors and verify row/page provenance.
- **Billing transaction:** application-owned, database transaction/functions for reservation/settlement/release and unique idempotency keys; customer billing is separate from provider usage COGS.

## State and financial invariants

- Job state and billing/payment state are distinct.
- `paid` means payment event verified; `credited` means wallet credit committed exactly once. Only `credited` makes funds available.
- One job has one reservation lifecycle and at most one customer job charge; retries/queue redelivery cannot create more jobs/charges.
- A substantive page assessment references the exact XLSX artifact and export manifest. `JobPageBillingAssessment` is canonical; `SourcePage.billable` (if kept) is only a reconciled projection.
- A job may not be charged until a verified downloadable XLSX exists.
- If no deliverable exists, charge Rp0 and release reservation once.
- All holds have bounded expiry. Guarded terminal state prevents a late worker from reviving/charging a failed, canceled or expired job.
- Provider spend on non-billable source pages is tracked as RabConverter COGS.
- All money arithmetic uses integer IDR and transactional wallet checks; browser values are not authoritative.
- Privileged database functions need explicit ownership checks and least privilege; security-definer functions pin `search_path` and restrict execute grants.

## Concrete launch decisions (keep as release gates)

Before implementing paid processing, decide and test:
1. Maximum upload bytes/pages, total job runtime/worker lease, provider timeout and bounded retry limit.
2. Exact Reducto endpoint/schema/options, account plan, page-versus-credit metering and account usage export.
3. Data retention/training/region/DPA/terms for the selected Reducto account.
4. Workbook generation and formula recalculation/error-scanning approach.
5. Payment vendor and exact QRIS/webhook/settlement/refund/reconciliation contract.
6. Reservation expiry and review-required expiry duration.
7. Deletion/retention policy and customer notice.
8. Whether a queue is needed. Start without one only if request/runtime limits and reliability tests prove it safe; otherwise choose one queue/consumer plus bounded retry.

Do not leave unspecified values as silent product behavior. Use config values and gates; avoid premature numeric limits until the provider and runtime have been tested.

## Implementation sequence

1. Finish docs, source licensing and golden fixture expectations.
2. Build a static upload-first UI shell with clearly labelled sample data.
3. Add GitHub Actions deterministic lint/typecheck/test/build and Cloudflare preview.
4. Add Supabase migrations, RLS/grants, private upload and authenticated ownership.
5. Add the server-side Reducto adapter and measured extraction fixtures.
6. Implement normalization, rows, formula candidates, source provenance and deterministic reconciliation.
7. Implement XLSX generation, recalculation and formula error verification.
8. Implement atomic reservation/settlement/release, page assessments and payment event/credit idempotency.
9. Select/integrate payment provider after provider evaluation.
10. Test cancellation/timeout, late worker, duplicate callback, concurrent reservation, privacy and financial reconciliation.
11. Inspect a real desktop/mobile preview and deploy only through the reviewed release flow.

## Cloud-only workflow

Feature branch → PR → automated checks → preview URL → desktop/mobile inspection → reviewed merge. Do not apply schema or production changes as a side effect of doc work.

## Infrastructure snapshot (2026-10-25)

- The connected GitHub repo contains documentation; no application source tree was verified.
- The connected Cloudflare account had no RabConverter Workers or Pages project.
- The active Supabase project had zero public tables at inspection time.
- No working preview or production application URL was verified.

Recheck the connected resources before any future implementation/release claim.
