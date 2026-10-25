# Canonical Data Model

Status: specification draft v3 — 2026-10-25. All fields below are conceptual contract fields, not a claim that database tables already exist. Implement through versioned migrations only after review.

## Model rules

- Keep raw source and normalized interpretation separate.
- Null is valid for unknown fields; do not invent values.
- Store quantities and currency values using decimal-safe types; wallet currency uses integer IDR rupiah.
- Preserve raw locale and parser/provider version.
- Every row/field retains provenance and review state where possible.
- Printed PDF values and reconstructed formula/result are separate facts.
- Customer billable-page assessment and provider usage metering are separate facts.
- Wallet history is immutable ledger data; cached balance is only a projection.
- Idempotency is mandatory for job runs, page charges, top-up credits, payment events and reversals.

## Extraction and RAB entities

### ProjectJob
ID, owner user ID, nullable project/client/tender metadata, created/updated timestamps, job status, source page count, price-per-billable-page snapshot IDR, estimated maximum charge IDR, final billable-page count, final charge IDR, billing status and idempotency key.

Job states may include uploaded, queued, processing, review_required, ready, completed_with_warnings, failed, canceled and deleted. Do not mix job status with billing status.

### SourceDocument
ID, job ID, original filename, media type, byte size, SHA-256 checksum, private storage path, detected document type, page count, PDF class, upload timestamp, processing status and safe error code. Original is immutable.

### SourcePage
ID, source document ID, page number, classification, extraction method, provider request/run reference, source region/layout metadata, billable flag, billable reason code, usable-record count, assessment version and timestamp. Repeated processing attempts live in separate metering records.

### ExtractionRun
ID, job ID, source document ID, run number/idempotency key, pipeline version, provider/configuration version, state, start/end times, safe error code/details and bounded summary counts. Do not put unbounded raw PDF content in summary JSON.

### ProviderUsageRecord
ID, job ID, source page/range, provider, endpoint, provider request ID, attempt number, idempotency/request key, start/end time, status, reported pages/credits/units, actual provider cost/currency if available, retry classification, latency and safe error code. Append one record per attempt; do not overwrite failed attempts with the final retry.

### BoqSection
ID, job/source IDs, nullable source section ID/code/title, normalized title, display order, source page start/end and source location.

### BoqLineItem
ID, job/source IDs, optional section ID, display order and source row index/page/cell range/bounding box; row kind; raw/normalized code, description and unit; raw/decimal quantity, unit price and printed amount; reconstructed formula and amount; formula provenance (not applicable, reconstructed, user confirmed, unresolved); currency, extraction method, field confidence, review status/correction note and timestamps. Row kinds include item, section, note, subtotal, carried-forward, grand total, adjustment and unknown.

### ValidationIssue
ID, job ID, optional line/source IDs, issue code/severity, safe message, source location, suggested action, printed value, calculated value, difference, status and resolution timestamps.

### ExportArtifact
ID, job ID, format/version, private storage path, created timestamp, source extraction run, row/warning counts, checksum, formula contract version and whether reconstructed formulas exist. Exports are immutable; regeneration creates a new artifact/version.

## Wallet and payment entities

### Wallet
ID, owner user ID, currency fixed to IDR, cached available balance IDR, reserved balance IDR, timestamps and version/lock token. Unique per owner/currency as applicable. Cached values must reconcile with ledger and outstanding holds.

### WalletLedgerEntry
Immutable financial event with wallet/owner IDs, entry type, signed integer amount IDR, currency, related job/top-up/refund, idempotency key, optional reversed-entry ID, actor/source, safe metadata, timestamp and reason. Entry types include top-up credit, job charge, reservation, reservation release, refund, charge reversal and manual adjustment. Never edit/delete a settled entry; post a compensating entry.

### TopUpOrder
ID, wallet/owner IDs, requested amount IDR (minimum Rp50.000), provider, provider order/reference ID, state (created, pending, paid, credited, failed, canceled, expired, reconciliation_required or refunded), expiry, timestamps, idempotency key, verified payment timestamp and safe failure/reconciliation code. An order is not wallet credit by itself.

### PaymentEvent
ID, provider, provider event ID, top-up order ID, received timestamp, verification status, event type, parsed amount/currency, safe metadata, processing status and idempotency key. Store only necessary redacted metadata. Enforce provider-event uniqueness to prevent replay/double credit.

### JobPageBillingAssessment
ID, job/source-page IDs, assessment version, billable boolean, reason code, usable-record count, export artifact ID, assessment timestamp and finalization state. Unique on job/source/page for final assessment. Billability is deterministic application logic, not a model response.

### JobCharge
ID, job/wallet IDs, price snapshot IDR/page, billable page count, amount IDR, related ledger entry, state (estimated, reserved, settled, zero_charge or reversed), idempotency key, settlement timestamp and calculation version. One settled charge per job; source-page assessments sum to its billable count.

### PriceSnapshot
ID, effective timestamp, price IDR/page, currency, minimum top-up IDR, policy version, status and decision reference. A job references the snapshot used at booking; old jobs are not repriced retroactively.

### RefundOrAdjustment
ID, wallet/top-up/job reference, linked ledger entry/reversal, type, amount, reason, status, requested/approved/processed timestamps, actor and optional external refund reference. Keep provider payment refund separate from internal wallet credit/reversal.

## Invariants and relationships

- Sum of final billable-page assessments equals JobCharge billable count.
- Final customer amount equals billable pages × price snapshot; no extra charge for retries.
- No job charge is settled before the downloadable XLSX exists.
- No deliverable means charge zero and reservation release.
- A page is billed at most once per job; replay does not create a second charge.
- Duplicate verified payment callbacks do not create another wallet credit.
- No negative available balance; reservation and final charge run transactionally.
- Users can access only their own jobs, documents, exports, wallet and transactions.
- Provider COGS is derived from provider usage records, not customer billing entries.

## Before schema implementation

Approve tenant ownership/RLS, retention/deletion, maximum file size/page count, supported MIME, provider privacy, price snapshot semantics, wallet transaction locking, migration rollback, webhook verification, event idempotency and ledger reconciliation. At inspection on 2026-10-25, the connected Supabase public schema had no tables; this specification must not be mistaken for deployed tables.
