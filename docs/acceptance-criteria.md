# Acceptance Criteria — PDF RAB to Formula-bearing XLSX

Status: draft v4. Release accuracy thresholds must be set from a representative golden-file baseline; these criteria define the required product behavior.

## 1. Entry, identity and file handling

- A visitor can perform local/basic preflight before sign-in.
- Before a durable owner-scoped job/source is stored or any paid provider call starts, the user is authenticated and the file/job is bound to that identity.
- The MVP does not permit guest wallet balances or guest paid processing.
- Upload accepts only PDF RAB/BOQ within explicit byte/page/runtime limits configured before release.
- File signature/MIME, readability, encryption, corruption and empty files are checked; extension alone is insufficient.
- Unsupported/invalid/oversized input returns a plain-language cause and next action; it creates no reservation and no charge.
- A user's jobs, source files, exports, wallet and ledger cannot be read or downloaded by another user; private storage and short-lived download authorization are tested.
- Job creation is idempotent. A repeat submit with the same intent returns the same job/result, not a second processing run/charge.

## 2. Provider and processing

- Initial runtime calls Reducto Deep Extract only through a server-side adapter.
- LlamaExtract and Pulse Ultra 2 are absent from runtime dependencies and fallback logic.
- Provider responses are schema-validated, source-page provenance is checked, payload size is bounded, and untrusted content is never rendered as executable markup.
- Retries are limited to transient transport/server/timeout errors and share stable job/run idempotency keys. Permanent errors are not retried.
- On timeout, the existing provider job/request ID and status are checked before a retry; no blind duplicate provider job is created while the original may be running.
- On timeout, the existing provider job/request ID and status are checked before a retry; no blind duplicate provider job is created while the original may be running.
- Every attempt records job/page scope, endpoint/config version, provider job ID/request ID, page/credit usage unit and quantity, status, latency, retry reason and reported cost/currency when available. Usage export/invoices are used for aggregate reconciliation; per-job attempt detail comes from RabConverter records.
- Real customer documents are not sent until the account-specific Reducto privacy/retention/region/DPA/plan gate is approved.
- Start without a queue unless measured runtime limits require one. If Cloudflare Queues is used, commit the database job and reservation first, dispatch after commit, and recover committed-but-undispatched jobs. Assume at-least-once delivery and idempotent worker actions; no second job-orchestration system is introduced.
- Deterministic CI uses synthetic/permitted fixtures and mocks, never paid provider calls.

## 3. Extraction and formula reconstruction

- Golden fixtures specify expected values, row kinds/order, source page, warnings, formula candidates, export rows and billing decisions.
- Code, description, unit, quantity, unit rate and printed amount are stored separately where present.
- Missing values remain null/blank; no quantity, price, tax, overhead, profit or formula semantics are invented.
- Section heading, note, item row, subtotal, carry-forward, grand total and adjustment are distinct row kinds.
- Wrapped descriptions, page continuations, repeated headers and Indonesian numeric locale are handled or reported as warnings.
- Low-confidence OCR/mapping carries source provenance and confidence where available.
- Source-value amounts stay separate from reconstructed formula/results.

## 4. Validation, review and XLSX

- The system automatically validates expected row mapping, arithmetic, section membership, totals, duplicate carry-forwards and source-page provenance.
- A normal successful document does not require full-document user review before download.
- Ambiguity that can safely remain unresolved is preserved as source value plus targeted warning; only material ambiguity that prevents an honest workbook blocks on a focused user decision.
- Formula provenance is labelled reconstructed/generated/user-confirmed, never recovered original.
- Eligible item totals use working formulas; rollups exist only where membership is unambiguous.
- A verified workbook is valid/openable XLSX with editable cells, correct sheet contract, provenance, warnings and no unacceptable formula errors.
- Eligible formulas recalculate in the selected supported calculation engine/spreadsheet environment. File-open validation alone is insufficient.
- If formula recalculation or error inspection cannot validate the deliverable to the export contract, do not mark it successfully completed/download-ready.
- Each export is immutable and versioned. Corrections before initial export remain in the same job. Regeneration after export creates a new artifact version in the same job and never creates a second customer job charge. If a confirmed post-settlement correction changes the amount, use an audited compensating ledger entry and preserve the original settled entry.
- Export failure/no verified artifact leads to no success download, Rp0 charge and reservation release.

## 5. Billable-page tests

A page is billable only when it contributes a substantive, identifiable RAB/BOQ record that is retained in the verified downloadable XLSX and traceable to that source page.

- Real work-item rows with meaningful fields are billable when retained.
- A substantive subtotal/recap/total record with an actual financial/quantity value and identifiable inclusion/source context may be billable when retained.
- Section heading only, title/cover only, header/footer only, notes/specification only, blank, unrelated appendix, drawing-only, unreadable/failed, duplicate-with-no-new-record, and discarded provider output are non-billable.
- Repeated header plus real RAB rows remains billable.
- A warning does not itself make a page non-billable.
- Assessment records a reason code, substantive-record count, artifact/export-manifest ID, classifier version and source page.
- `JobPageBillingAssessment` is canonical for final page assessment; any `SourcePage.billable` field is only a projection/cache and must reconcile.
- Assessment is unique per job/source-page/final assessment version.
- Customer charge = final billable pages × job price snapshot; provider attempts/usage are never the customer billing unit.
- No XLSX deliverable means Rp0 and full reservation release.
- Valid warning-bearing partial XLSX charges only qualifying pages represented in that artifact.
- A job is charged at most once. Every settled amount, billable-page count and receipt must reconcile with the immutable ledger.

## 6. Wallet, cancellation, expiry and settlement

- Wallet balance is integer rupiah; available balance never goes negative.
- Reservation, job state transition, charge and release use atomic database transactions/guarded state transitions.
- Concurrent jobs cannot spend/reserve the same available funds twice.
- Every reservation has finite expiry and a visible applicable policy; no hold remains indefinitely.
- Cancel before work begins atomically cancels and releases. In-flight cancellation is best-effort and cannot release a hold while a worker might still commit an artifact/charge.
- A stalled job is terminalized only after its active worker lease/runtime is expired and no artifact/settlement has committed.
- Late queue/provider workers cannot revive terminal jobs, rewrite immutable artifacts or create another charge.
- Terminal failed/canceled/expired/no-result jobs without a deliverable end with Rp0 and one release; idempotent retries of cleanup do not add ledger entries.
- Refund/reversal appends a linked compensating ledger entry; original settled history is immutable.

## 7. Top-up and payment tests

- Minimum top-up is Rp50.000; this is not a minimum conversion fee.
- Provider remains unselected/not live until a vendor is contracted and configured.
- Canonical payment state distinguishes `paid` (verified provider event) from `credited` (wallet-ledger credit committed).
- Only `credited` unlocks use of top-up balance.
- Callback authenticity, amount, currency, order identity and event ID are verified on server. Provider event ID is unique.
- Duplicate/out-of-order callbacks, callback-before-redirect, late callbacks and browser redirect-only signals never double-credit or falsely mark paid/credited.
- A verified payment arriving after local order expiry enters `reconciliation_required`; it can only produce one verified wallet credit or an explicit refund/reversal, never browser-driven credit or automatic conversion start.
- Credit, related ledger entry and state transition are atomic or recoverably idempotent; a persisted credit-pending state is not shown as credited until the ledger commit succeeds.
- Failed/canceled/expired orders do not credit wallet; ambiguous states are `reconciliation_required`.
- The user returns to the same conversion after verified credit but must explicitly select Konversi PDF; payment never automatically starts processing.
- Payment-fee, reconciliation and refund tests are added after gateway selection.

## 8. Security, CI and release

- Every customer-owned exposed Supabase table has RLS plus least-privilege grants; both allow and deny paths are tested.
- Service-role credentials remain server-side; privileged database functions validate ownership, restrict execute grants and pin `search_path` when `SECURITY DEFINER` is used.
- No raw document content, signed URLs, secrets or sensitive payment payloads are logged/artifacted.
- Deletion/retention policy covers originals, extracted data, exports, temporary uploads, provider-side copies where supported, and distinct financial record retention.
- GitHub Actions deterministic tests/typecheck/build run on each relevant PR before merge; until workflow exists and has passed, this gate is not satisfied.
- A real Cloudflare preview is deployed and inspected on desktop/mobile before release.
- Production release identifies exact commit SHA, URL and tested environment.
- Numeric accuracy/recall thresholds are fixed after representative legally usable golden fixtures are measured; do not claim accuracy before measurement.

## Quality gate

MVP is not ready until golden PDFs meet agreed field-level thresholds, formula errors are checked after recalculation, exception-driven review works, page billing matches the export manifest, payment/ledger idempotency and expiry/recovery tests pass, provider privacy is approved, deterministic CI is green, and a real preview is inspected.
