# RabConverter Implementation Plan

Status: approved delivery direction; implementation has not started. Reviewed 2026-10-26.

## Purpose

Turn the existing product and architecture specifications into a small, testable implementation sequence. This plan governs sequencing and evidence; the product, application-flow, pricing, data-model, processing, export, security, and acceptance documents remain authoritative for their respective contracts.

This repository was documentation-only at the last verified baseline. Do not describe an app, deployment, provider integration, billing flow, or payment flow as implemented until the code and running evidence have been inspected.

## Delivery decisions

1. **Keep the product flow single-job.** The user uploads and completes basic preflight, then explicitly selects Konversi PDF. After authentication and an atomic reservation, one durable RabConverter job owns extraction, normalization, formula reconstruction, XLSX generation, verification, page assessment, and settlement/release. Do not create a second job simply because Reducto finished.
2. **Keep Cloudflare as the web/API starting point.** Keep Supabase Auth, Postgres, and private Storage as the identity/data system of record. Keep GitHub as source of truth and GitHub Actions as deterministic CI.
3. **Make conversion execution portable.** Put execution behind a small conversion-worker contract. First benchmark the actual pipeline against the current Cloudflare plan and supported runtime limits. Keep the work in Workers if the measured workload fits safely. Move the conversion stage to a container worker if the workload needs a real spreadsheet engine such as LibreOffice, more memory, or longer execution. The API, job state, ownership, and billing contract must not depend on the selected worker host.
4. **Do not add a queue pre-emptively.** First use durable database job state and explicit recovery. Add one queue/consumer only if measured runtime/reliability requirements justify it. If a queue is used, commit the job and reservation before dispatch, recover committed-but-undispatched work, and assume at-least-once delivery.
5. **Treat generation and calculation as separate capabilities.** Writing formula cells into XLSX does not prove that those formulas have been recalculated. Select an XLSX library and a calculation engine based on golden-file tests.
6. **Keep provider and financial behavior server-side and idempotent.** Reducto Deep Extract is the sole initial extraction provider. No LlamaExtract or Pulse Ultra 2 runtime/fallback. Payment vendor remains unselected until QRIS, fees, callbacks, settlement, refund, and reconciliation are assessed.
7. **No verified deliverable, no customer charge.** Charge only for qualifying substantive pages represented in the verified downloadable workbook. Retries do not add customer charges. Provider usage/COGS is recorded separately from wallet transactions.

## Work packages and exit gates

### P0 — Evidence and provider gates

**Work:** build a legally usable golden PDF corpus; define expected rows, values, source-page provenance, warnings, formula candidates, and billability; verify the account-specific Reducto endpoint, usage unit, rate card, privacy/retention, region, contractual terms, request/job identifiers, and status/retry behavior.

**Exit evidence:**
- Each golden fixture has a documented reuse basis and expected result; customer-confidential documents are not committed.
- A reproducible benchmark protocol records input identity, versions, execution environment, measurements, and known errors.
- Reducto has an explicit go/no-go for real customer documents based on account terms and privacy review.
- Costs are based on the actual account usage unit and terms, not only public estimates.

### P1 — Runnable foundation and runtime proof

**Work:** establish the smallest application skeleton, documented scripts, pull-request CI, and a verifiable Cloudflare preview. In a separate proof-of-feasibility test, benchmark XLSX generation, formula recalculation, verification, payload sizes, runtime, CPU, memory, concurrency, and failures against the actual planned Cloudflare runtime. Test a container/calculation-engine path when needed.

**Exit evidence:**
- A clean checkout can install, lint, typecheck, test, and build using documented commands.
- CI runs deterministically without paid provider calls or customer data.
- A preview is verified and recorded with commit SHA and URL.
- A decision record explains Worker-only versus container worker using measured evidence and versioned test inputs.
- Queue is either omitted with rationale or introduced only with concrete recovery/idempotency design.

### P2 — Identity, durable job, and private files

**Work:** implement Supabase Auth ownership, durable job state, private upload/export storage, file preflight, authorized downloads, migrations, RLS, least-privilege grants, and cross-user access tests. Keep job state separate from wallet/payment state. Do not introduce paid processing before identity and ownership checks.

**Exit evidence:**
- Migrations work against a fresh test database.
- Cross-user access to jobs, PDFs, exports, wallet/ledger data, and download links is denied by tests.
- Invalid, corrupt, encrypted, unreadable, or over-limit files stop before reservation and provider usage.
- No public bucket or long-lived public file URL is used.

### P3 — Reducto adapter and recoverable processing

**Work:** implement the server-only Reducto adapter, schema validation, bounded input/output, persisted job and provider request identifiers, stage state/progress, and internal per-attempt usage/latency/retry/cost records. A timeout checks the existing provider job status before any retry.

**Exit evidence:**
- Adapter tests use mocks and permitted fixtures; routine CI never calls paid APIs.
- Transient retry behavior is bounded and idempotent; no blind duplicate provider job.
- Provider privacy/account gate has passed before real customer data is sent.
- The complete conversion is still one durable job, regardless of where its stages execute.

### P4 — Normalization, formulas, workbook, and verification

**Work:** normalize source rows and page provenance; distinguish items, section headings, notes, subtotals, carry-forwards, totals, and adjustments; retain printed values separately from reconstructed formulas/results; generate immutable XLSX artifact versions; run recalculation where required; scan formula errors and reconcile row ordering, totals, source-page provenance, and export manifest.

**Exit evidence:**
- Golden tests cover Indonesian number formats, wrapped descriptions, page continuations, repeated headers, subtotals/carry-forwards, ambiguous rows, and duplicate structures.
- Unknown values remain blank/null and unsupported assumptions are never invented.
- Every substantive retained row and billable page traces to the source.
- Only a verified artifact can become download-ready or enter settlement.
- Re-export creates another immutable artifact version within the same job, not another customer job charge.

### P5 — Wallet, page assessment, and payment

**Work:** implement bounded atomic reservation, settlement/release, immutable ledger, canonical page billing assessment linked to the exact verified workbook, top-up order/payment event handling, and exactly-once wallet credit. Evaluate payment vendors with QRIS first among the required Indonesian payment methods, without selecting a vendor until evidence is recorded.

**Exit evidence:**
- No verified downloadable artifact means Rp0 customer charge and reservation release exactly once.
- Concurrent requests, retries, duplicate callbacks, cancellations, expiry, and late worker updates cannot double-charge or revive terminal jobs.
- Payment verified/paid and wallet credited are distinct states; browser redirects are not proof of payment.
- Late verified payment is reconciled into exactly-once credit or explicit refund/reversal, never automatic conversion start.
- Per-attempt provider COGS and aggregate account usage reconciliation remain separate from customer billing.

### P6 — End-to-end readiness and release gate

**Work:** test the whole workflow, privacy/ownership, runtime/load behavior, job recovery, provider timeout, duplicate events, expiry, payment reconciliation, financial invariants, artifact correctness, and rollback. Record preview/release evidence and remaining limitations.

**Exit evidence:**
- The acceptance criteria pass against golden fixtures and synthetic failure scenarios.
- One job cannot be processed or charged twice due to retry/redelivery.
- No charge can occur without a verified downloadable artifact.
- Provider usage records are reconciled with account exports/invoices and differences explained.
- Release evidence, commit SHA, deployment URL, rollback steps, and accepted residual risks are documented.

## Dependency order

P0 fixture work and provider-term verification can proceed in parallel. P1 application baseline can start while P0 is underway, but runtime/worker selection must wait for the fixture-based benchmark. P2 must precede durable paid processing. P3 follows P2 plus the provider gate and runtime decision. P4 depends on P0 fixtures and P3 extraction contracts. P5 wallet settlement depends on a verified XLSX and the approved billing contract; payment-gateway integration can proceed in parallel after its vendor decision. P6 blocks production release until the required evidence is collected.

## Delivery rules

- Work through the GitHub Issues linked from implementation-tracker.md; one issue should represent one reviewable work package.
- Update the tracker when a package starts, becomes blocked, or meets its exit gate. Link PRs, CI runs, previews, benchmark reports, and decision records as evidence.
- Mark work Done only when acceptance criteria are verified, not when code has merely been written.
- If test evidence changes an architecture decision, update the decision log and this plan in the same reviewed change.
- Do not do production schema changes, real customer document processing, or live payment transactions as side effects of documentation work.
- No dates or completion estimates are assumed. Sequence is governed by dependencies and evidence.
