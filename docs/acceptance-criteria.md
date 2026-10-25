# Acceptance Criteria — PDF RAB to Formula-bearing XLSX

Status: draft v3; numeric accuracy/release thresholds must be fixed after a representative golden-file baseline.

## Upload, ownership and classification

- A signed-in user can upload a PDF RAB/BOQ within explicit byte/page limits.
- The system detects born-digital, scan, mixed, unsupported, corrupt and encrypted inputs as safely as possible.
- Unsupported, corrupt or oversized files return actionable errors.
- The original remains immutable and associated with the job.
- A user cannot list or download another user's job, source, export, wallet or ledger history.
- Job creation and retries are idempotent; repeated requests do not duplicate artifacts, processing or charges.

## Provider integration

- Initial runtime uses Reducto Deep Extract only behind a server-side adapter.
- LlamaExtract and Pulse Ultra 2 are absent from runtime configuration and fallback logic.
- Provider responses are schema-validated; raw document content and secrets do not enter logs.
- Transient errors have bounded observable retries; permanent errors are not retried endlessly.
- Every provider attempt records endpoint, request ID, page/credit usage, status, latency, retry reason and cost when available.
- CI tests use fixtures/mocks and do not require paid provider calls.
- Real customer documents are not sent until privacy, retention, region and account-plan reviews are recorded and approved.

## Extraction and normalization

- Golden fixtures define expected rows, values, row type/order, source page and warnings.
- Code, description, unit, quantity, unit rate and printed amount are captured separately where present.
- Blank values stay blank; parser never invents missing unit, rate or amount.
- Headers, notes, work items, subtotals, carried totals, grand totals and adjustments are distinct.
- Multiline descriptions and table continuations are preserved across pages.
- Indonesian numeric formats are parsed only with confirmed context; ambiguity is flagged.
- OCR-derived numeric fields retain confidence/warning metadata.
- Source-page provenance is available for extracted records and exported rows.

## Formula reconstruction and reconciliation

- Confident quantity × price rows export working formulas.
- Every generated formula is labelled reconstructed/generated, not recovered.
- Formulas recalculate after quantity/rate changes in tested spreadsheet software.
- Subtotals/grand totals are generated only with clear membership/inclusion rules.
- Tax, overhead, profit and contingency are not invented.
- Printed amounts remain separately available.
- Mismatch warnings include printed value, calculated value, difference and source page.
- Ambiguous formula logic remains unresolved instead of silently changing source values.

## Review and export

- Users edit uncertain values and see persisted save state.
- Users can inspect source context for each uncertain row/field.
- Warnings can be resolved/ignored with state retained.
- XLSX opens as a valid workbook with editable values/formula cells.
- Row order and hierarchy are preserved; blank rates remain blank.
- Review_Warnings appears when issues remain.
- Formula provenance, source metadata and customer-facing billing summary are consistent.
- Export failure results in no download and zero customer page charge.

## Billable-page and job settlement tests

- A page is billable only when it contributes at least one meaningful identifiable RAB/BOQ record retained in a successfully generated XLSX.
- Blank, cover-only, unrelated appendix, drawing-only and unreadable/failed pages with no usable record are not billable.
- A repeated header plus actual RAB rows remains billable.
- A recap/subtotal page is billable only when its record contributes to the export.
- Provider output discarded before export is not billable.
- Page assessments are deduplicated per job/source/page.
- Charge equals final billable pages × the job's price snapshot (baseline Rp2.500/page).
- No customer charge is added per retry or provider call.
- One completed job can be charged at most once; repeated callbacks/reruns do not duplicate a charge.
- No XLSX artifact means zero charge and full release of any reserved balance.
- A valid completed-with-warnings artifact charges only qualifying pages; a warning does not automatically make a page non-billable.
- Customer balance, reservations, ledger, job charge, page assessments and displayed receipt reconcile.
- Concurrent jobs cannot spend the same available balance twice.
- Wallet never becomes negative; IDR is integer arithmetic.
- Reversal/refund uses a compensating ledger entry; settled history is immutable.

## Top-up and payments

- Minimum top-up is Rp50.000; amount, currency and order ID are validated server-side.
- The payment provider is not considered live until selected and configured; QRIS preference is not evidence of implementation.
- A top-up credits balance only after a verified provider settlement event.
- Invalid signature, mismatched amount/currency/order, duplicate callback and replay do not credit the wallet.
- A duplicate verified event credits the wallet once through idempotency constraints.
- Browser return URL or screenshot alone cannot mark payment paid.
- Pending, failed, canceled, expired and reconciliation-required states are visible and persisted.
- Payment-fee, refund and provider-reconciliation tests are added when an actual gateway is chosen.

## Privacy and cloud delivery

- GitHub Actions runs deterministic checks, tests and build on each PR.
- A Cloudflare preview exists and is inspected before release.
- Production deployment occurs only through an approved trigger/branch.
- Credentials and raw tender data never enter public logs or artifacts.
- Database changes use versioned migrations and deliberate review.
- Deletion policy covers metadata, original, derived artifacts and provider data where deletion is supported/contractually available.
- Release output identifies exact commit SHA and preview URL.

## Quality gate

MVP is not ready until golden PDFs pass field-level tests, review handles ambiguous cases, XLSX formulas recalculate, totals reconcile or warn, charge/ledger logic passes idempotency tests, provider privacy is approved, payment callbacks are verified, and the deployed preview has been inspected on desktop/mobile.
