# Canonical Data Model

Status: conceptual specification v4 — 2026-10-25. These are proposed entities/contracts, not deployed database tables. Implement only through reviewed versioned migrations.

## Model rules

- Keep source values and normalized interpretation separate; unknown values are null, never guessed.
- Use decimal-safe types for quantities/amounts and integer IDR for wallet arithmetic.
- Preserve locale, provider/pipeline version, page/region provenance and review state where available.
- Customer billable-page assessment and provider COGS records are separate.
- Ledger entries are immutable; cached wallet balance is a projection.
- Job state, financial state and top-up/payment state are separate state machines.
- Idempotency and uniqueness guards are mandatory for jobs, queue deliveries, artifacts, page assessment versions, wallet mutations and provider events.

## Entities

### ProjectJob
ID, owner user ID, creation/update timestamps, nullable optional project metadata, job state, source page count, price snapshot IDR/page, estimated maximum IDR, final billable count/charge IDR, billing state, idempotency key and expiry/worker lease metadata.

Suggested job states:
- `uploaded` / `preflight_complete`: no durable paid job/reservation yet;
- `queued` / `processing`;
- `review_required`;
- `completed` / `completed_with_warnings`;
- `failed` / `canceled` / `expired`.

Terminal states cannot transition back to processing/completed. A late worker must fail its guarded state update.

### SourceDocument
ID, job ID, original filename, media type, byte size, SHA-256, private storage key, detected document/page count/class, upload time, safe status/error code. Immutable original source.

### SourcePage
ID, source document ID, page number, classification, extraction method, provider run reference, region/layout metadata, timestamp. Do not store the canonical final billable decision here as independently mutable business truth.

### ExtractionRun
ID, job ID, source document ID, run number/idempotency key, pipeline/config version, state, start/end time, safe error/summary. Avoid raw PDF text in summary JSON.

### ProviderUsageRecord
ID, job/source page range, provider, endpoint/config version, provider job ID, provider request ID, attempt, idempotency/request key, usage unit (`page`, `credit`, or provider-specific unit), quantity, status, timestamps, latency, retry class, cost/currency if available and safe error code. Append every attempt; check a prior timed-out provider job's status before retrying, and do not overwrite earlier attempt cost/status. Provider exports/invoices reconcile aggregate spend; internal records provide per-job/attempt detail.

### BoqSection / BoqLineItem
Keep section, work-item, note, subtotal, carry-forward, grand-total, adjustment and unknown row kinds distinct. Store row order, raw and normalized fields, printed amount, formula/result/provenance, confidence/review, source page/region and timestamps. Printed amount is never overwritten by reconstructed amount.

### ValidationIssue
ID, job, optional row/source page, code/severity, safe message, source location, printed/calculated/difference values, suggested action, issue status/resolution. Review only blocks when a material decision is required.

### ExportArtifact
ID, job, immutable artifact version, private storage key, created time, pipeline/run version, row/warning counts, checksum, formula contract version, recalculation/verification status and export manifest reference. A regeneration creates a new immutable version.

### JobPageBillingAssessment — canonical page decision
ID, job ID, source document/page, assessment policy/version, `billable`, reason code, substantive-record count, artifact ID/export manifest ID, assessment time and finalization state. Final assessment has a uniqueness guard per job/source page/artifact/policy version.

The source page's convenience flags/counts, if retained for queries, are read projections updated from this canonical assessment and must be reconcilable; they are not independent write paths.

### Wallet / WalletLedgerEntry
Wallet ID, owner user ID, IDR currency, cached available/reserved balances and version/lock token. Ledger entries contain signed integer amount, type (credit, charge, reservation, release, reversal/refund, approved adjustment), related job/order, idempotency key, linked reversal, actor/reason and timestamps. Original settled entries are immutable.

### TopUpOrder / PaymentEvent
Order includes owner/wallet, requested amount (minimum Rp50.000), provider, provider order/reference, expiry, idempotency key, verified payment time and state: `created`, `pending`, `paid`, `credited`, `failed`, `canceled`, `expired`, `reconciliation_required`, optionally `refunded`. A provider-verified payment that arrives after local expiry enters `reconciliation_required` until exactly-once credit or explicit refund/reversal is recorded.

`paid` means the verified external event is recorded. `credited` means the associated wallet ledger credit has committed exactly once. Only `credited` unlocks funds. PaymentEvent stores provider event ID, order ID, verification and processing state, amount/currency, redacted metadata and idempotency key; enforce provider event uniqueness. Duplicate/out-of-order events cannot double-credit or regress the order.

### JobCharge / PriceSnapshot / RefundOrAdjustment
JobCharge records job/wallet, price snapshot, billable-page count, amount, ledger reference, state, idempotency key and settlement time/version. One settled customer charge per job. PriceSnapshot records price effective time/version and minimum top-up. RefundOrAdjustment points to the original transaction and a compensating ledger entry.

## Invariants

- Final billable page count equals the sum of final `JobPageBillingAssessment.billable` for the exact export manifest.
- A page is billable only when a substantive RAB/BOQ record on that page is retained in the downloadable artifact; heading/note/header/footer alone is insufficient.
- Charge = billable pages × price snapshot; provider call/retry count never affects customer amount.
- No valid downloadable XLSX means charge zero and one reservation release.
- Atomic reservation/settlement and uniqueness prevent overspend or duplicate charge/credit.
- Holds expire; terminal jobs cannot be revived by late queue workers.
- User-owned records/files require authenticated ownership and RLS/grant enforcement.
- Provider COGS comes from provider-usage records, not customer charge entries.

## Before schema implementation

Approve RLS/grants, storage ownership, auth boundary, file/job/hold expiry, provider account privacy/usage, payment callback contract, transaction locking, migrations/rollback and deletion/retention. The inspected Supabase public schema had no tables at the 2026-10-25 snapshot.
