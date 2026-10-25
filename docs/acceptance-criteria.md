# Acceptance Criteria — PDF RAB to Formula-bearing XLSX

Status: draft v2; release thresholds must be set after a golden-file baseline is measured.

## Upload and classification

- A signed-in user can upload a PDF RAB/BOQ.
- The system detects born-digital, scanned, mixed or unsupported PDF as well as safely possible.
- Unsupported, corrupt, encrypted or oversized files fail with clear actionable errors.
- Original file remains unchanged and associated with the job.
- Retries do not duplicate output artifacts unexpectedly.
- A user cannot list or download another user's job/artifact.

## Extraction

- Golden fixtures define expected rows, sections, order, values, source page and row kind.
- Code/number, description, unit, quantity, unit price and printed amount are captured independently where present.
- Blank values stay blank; parser never invents missing quantity, unit, price or amount.
- Section headers, notes, item rows, subtotals, carried totals, grand total and adjustments are distinguished.
- Multiline description rows and table continuations across pages are joined without losing meaningful content.
- Indonesian numeric formats are either parsed using confirmed context or flagged as ambiguous.
- OCR-derived numeric fields retain confidence/warning metadata.

## Formula reconstruction

- Where quantity and unit price are confidently identified, eligible amount cells contain working formulas equivalent to quantity multiplied by unit price.
- Every reconstructed formula is explicitly labelled as reconstructed/generated, not recovered from the source.
- Reconstructed formulas recalculate after a user changes quantity or unit price.
- Section subtotal formulas are generated only when row membership is unambiguous.
- Grand total is generated only when inclusion and recap logic are unambiguous.
- Tax, overhead, profit and contingency calculations are not invented or applied universally.
- Printed amounts remain available for comparison with formula results.
- Formula-vs-source mismatches are visible with printed value, calculated value, difference and source page.
- Ambiguous formula logic leaves a warning and does not silently alter the printed source amount.

## Review

- User can edit uncertain fields and see save state.
- User can inspect source page/context for a row/field.
- Issues can be resolved or ignored with state retained.
- Reload or processing failure does not silently discard accepted edits.

## Export

- XLSX opens as a valid workbook in supported spreadsheet software.
- XLSX includes actual editable cells and formula cells where eligible.
- Changing quantity/rate updates line amount and eligible rollups.
- Row order and section hierarchy are preserved.
- Blank rates remain blank.
- Warning sheet is included when unresolved issues remain.
- Formula provenance and source document metadata are visible.
- Export round-trip tests confirm the values and formulas contract.

## Cloud delivery

- Every pull request runs deterministic validation/tests/build in GitHub Actions.
- Cloudflare preview is available after CI succeeds.
- Production deploy only occurs from the approved trigger/branch.
- Credentials and raw tender document content never enter public logs or artifacts.
- Database schema changes are versioned in Git and applied deliberately.
- Deployment output includes exact commit SHA and preview URL.

## Quality gate

Do not call the MVP ready until the chosen golden PDFs pass field-level accuracy tests, the review UI handles exceptions, generated formulas recalculate correctly, printed totals reconcile or are flagged, and the cloud preview has been inspected at desktop and mobile sizes.
