# Decision Log

This log records decisions that affect product behavior, data contracts, cost and infrastructure. “Approved” means approved for the MVP baseline, not implemented or launched.

## DEC-001 — Formula-bearing XLSX from PDF RAB is the MVP

- Status: Approved.
- Decision: Focus on PDF RAB/BOQ extraction, safe formula reconstruction, comparison to printed values and XLSX download.
- Constraint: A PDF normally does not preserve the original workbook formula graph. Generated formulas are reconstructed.
- Non-goals: drawing takeoff, authoritative market pricing, portal submission and exact workbook recovery.

## DEC-002 — remove.bg is an interaction-simplicity reference only

- Status: Approved.
- Decision: One main upload action, automatic processing, result-first download and focused questions only for material ambiguity.
- Consequence: No prerequisite dashboard, full-document review or page per backend stage. Do not copy remove.bg technology, assets or business model.

## DEC-003 — Cloud-only workflow and minimal architecture

- Status: Approved for target architecture; implementation absent.
- Decision: GitHub is source of truth; GitHub Actions for deterministic CI; Cloudflare as intended web/API host and durable queue only if runtime limits require it; Supabase Auth/Postgres/Storage for ownership, durable job state, wallet/ledger and private files.
- Consequence: Avoid additional services unless a tested limit requires them. The database/job state is authoritative; a queue is delivery machinery, not a second state store.

## DEC-004 — Reconstructed formulas must be traceable and verified

- Status: Approved.
- Decision: Preserve printed values separately from formulas/results, record provenance, recalculate formulas using a tested engine and flag mismatches.
- Consequence: A valid file that opens is not by itself proof of a valid formula-bearing workbook. Formula/recalculation failures block a success-ready artifact unless fixed.

## DEC-005 — Reducto Deep Extract is the sole initial provider

- Status: Approved for MVP planning; provider/privacy/quality gates remain open.
- Decision: Use Reducto Deep Extract only, through a server-side adapter. Do not integrate LlamaExtract or Pulse Ultra 2 or use them as automatic fallback.
- Context: Public Standard list price currently lists US$40/1,000 pages, but extra per-field cost may apply and account usage may use specific units/terms.
- Consequence: Verify exact endpoint/account plan, usage unit/export, rate card, retention/training, region and DPA before customer data. Measure COGS from actual account logs/invoices, not list estimates or free credits.

## DEC-006 — Initial retail price and minimum top-up

- Status: Approved commercial baseline for MVP planning.
- Decision: Charge Rp2.500 per billable page; minimum wallet top-up Rp50.000; currency IDR.
- Consequence: Show maximum estimate before paid processing; final charge follows substantive page assessment after a verified XLSX.
- Non-goal: minimum top-up is not minimum job fee; list COGS/retry/FX assumptions are not verified profit.

## DEC-007 — Substantive billable page and no-charge failure rule

- Status: Approved commercial baseline.
- Decision: A page is billable only if it contributes substantive identifiable RAB/BOQ content (an actual work row or meaningful subtotal/recap with value/context) retained in a verified downloadable XLSX and traceable to the source page.
- Excluded by themselves: title/section heading, header/footer, notes/specification, cover, blank, unrelated, drawing-only, failed/unreadable and duplicate-with-no-new-record.
- Decision: No verified deliverable means charge Rp0 and reservation release. Retries are never additional customer charges.
- Consequence: Export manifest and final page assessment must reconcile; provider usage is measured separately.

## DEC-008 — Payment gateway remains unselected; QRIS is preferred for evaluation

- Status: Pending vendor selection.
- Decision: Do not describe any gateway as integrated. Select after QRIS, fees, verified callbacks, event ordering, expiry, settlement, refund and reconciliation are assessed.
- Consequence: Payment/production wallet remains blocked until callback verification and idempotency are tested.

## DEC-009 — Documentation-only state must be reported accurately

- Status: Approved.
- Decision: The repository has documentation but no verified running application/preview. The connected Cloudflare account had no RabConverter Worker/Pages resources and the active Supabase public schema had no tables at inspection.
- Consequence: Never claim app/provider/payment/CI is live without direct evidence; recheck dated infrastructure snapshots before release.

## DEC-010 — Identity boundary and owner-scoped file storage

- Status: Approved for MVP.
- Decision: Basic preflight may run before sign-in, but durable owner-scoped job/source storage, paid provider calls and wallet/payment actions require Supabase Auth identity. Guest wallet/paid jobs are out of MVP.
- Consequence: If a temporary preflight upload cannot be safely bound to the signed-in user, ask the user to reselect it rather than exposing a public temporary URL.

## DEC-011 — Payment verified and wallet credited are distinct states

- Status: Approved.
- Decision: Canonical top-up lifecycle separates paid (provider event verified) from credited (wallet-ledger credit committed exactly once). Duplicate/out-of-order callbacks are idempotent and only credited balance is spendable.
- Consequence: Return to saved conversion context after credit, but require an explicit user click to start conversion.

## DEC-012 — Finite reservations and terminal job states

- Status: Approved for MVP planning.
- Decision: Every job reservation and review hold has a bounded expiry. Cancellation, timeout, exhausted retries and no-result paths release holds exactly once. Terminal jobs cannot be revived or charged by late workers.
- Consequence: Exact runtime/lease/hold expiry values are configuration decisions to finalize and test before paid launch, not hidden defaults.

## DEC-013 — Canonical page assessment and immutable export versions

- Status: Approved.
- Decision: JobPageBillingAssessment is the canonical final billability record tied to an exact export manifest; any SourcePage.billable value is a projection only. Every artifact version is immutable. Re-export within a job does not create a second customer job charge.
- Consequence: Any legitimate post-settlement billing adjustment is an audited compensating ledger entry, never silent historical rewriting.

## DEC-014 — PR #3 operational and cost-accounting alignment

- Status: Approved for MVP planning; implementation absent.
- Corrections and billing: a correction/re-export creates a new immutable artifact version within the same job and never creates a second customer charge. If a confirmed post-settlement correction changes the settled amount, append an audited compensating ledger entry; do not rewrite settled history.
- Queue boundary: default to no queue unless measured request/runtime limits require one. If needed, commit the job and reservation in the database first, dispatch to the queue after commit, and recover committed-but-undispatched jobs. Do not add another orchestration service.
- Late payment: a provider-verified payment received after local expiry enters `reconciliation_required`; reconcile the provider state, then either credit exactly once or follow an explicit refund/reversal path. Never trust the browser redirect or auto-start conversion.
- Provider timeout: persist provider job/request IDs and check the existing provider job status before retrying; never blindly duplicate a possibly running provider operation.
- Provider COGS: log every attempt internally for per-job/per-attempt detail; use provider usage exports/invoices for aggregate reconciliation. Never infer provider cost from customer billable-page counts.
- Commercial assumptions: keep Rp900–Rp1.000/page as a provisional provider-cost reserve only. Do not publish or rely on a per-page contribution estimate until total measured costs support it.


## DEC-015 — Portable conversion worker; Cloudflare first, container by measured need

- Status: Approved target direction; implementation absent.
- Decision: Keep Cloudflare as the web/API starting point and Supabase as the durable system of record. Put conversion execution behind a narrow worker contract. Benchmark XLSX generation and required formula recalculation on the actual planned Worker runtime using permitted golden fixtures.
- Decision rule: Keep conversion in Workers only if measured runtime, CPU, memory, artifact size, calculation capability, and recovery behavior fit a safe, documented budget. Use a container worker when the required calculation engine (for example, LibreOffice) or resource/runtime requirements do not fit.
- Queue rule: Do not add a queue in advance. If evidence justifies it, retain one queue/consumer with database commit-before-dispatch, recovery for committed-but-undispatched work, and idempotent handling of at-least-once delivery.
- Consequence: Worker placement and queue delivery are execution details; they must not change the one durable job lifecycle, source-of-truth job state, ownership, page assessment, or billing invariants. Record the benchmark and final deployment choice before implementing the production pipeline.
