# Processing Pipeline

## Pipeline stages

1. **Ingress** — authorize user, validate request, create job and source metadata, calculate checksum, save source to private storage.
2. **File validation** — signature/type, size, page/sheet count, encryption/corruption and resource budget.
3. **Document classification** — identify likely BOQ/RAB, AHSP/AHS, invitation, drawing, specification, quote or unknown.
4. **Native extraction** — use the best structural representation first: workbook cells/formulas, CSV values, or PDF text/table geometry.
5. **Table segmentation** — locate sections, headings, item rows, continuation rows, notes, subtotals and totals.
6. **Normalization** — normalize field shapes and decimal values while preserving raw text, row order and source coordinates.
7. **Validation** — schema checks, arithmetic comparisons, duplicate/omission heuristics, locale ambiguity, revision conflicts, totals/recap consistency.
8. **Human review** — expose exceptions and let user confirm/correct/reject candidate fields.
9. **Export generation** — produce workbook/CSV from reviewed data, adding provenance and warning summary where appropriate.
10. **Audit/retention** — record run/version/status without logging full document content; expire/delete original and derived artifacts based on approved policy.

## Provider-independent interface

Document adapters should implement a conceptual contract:
- inspect(file) → document metadata, detected type and warnings
- extract(file) → candidate sections, rows, source references and raw values
- normalize(candidate, locale/context) → canonical records with normalization provenance
- validate(records, source metadata) → issues
- export(approved records, template options) → artifact

Keep parser/OCR implementations replaceable. Choose a provider only after a comparative benchmark on golden files and a privacy/cost review.

## Reliability

- Each job/run has a durable ID.
- Retries are idempotent and do not create duplicate exports.
- A failed stage records a stable error code and safe diagnostic summary.
- Partial extraction remains reviewable when feasible; do not label as full success.
- File processing is resource-limited and should not block normal app interactions.
- Never execute macros or arbitrary code from uploaded workbooks.
- Avoid long-running processing inside a single synchronous web request. Select background execution approach after establishing expected file sizes and runtime.

## Confidence and review

Confidence belongs at field/row level, not only document level. Unknown/unparsed values remain null. A number inferred from ambiguous localization, OCR or fuzzy row mapping must be flagged. The UI must show the source around the extraction and allow user correction.

## Revision handling

Record each source document and revision independently. Compare normalized row candidates across revisions only when identity matching confidence is sufficiently high. Report additions/deletions/changed descriptions/units/quantities; do not overwrite prior confirmed data silently.
