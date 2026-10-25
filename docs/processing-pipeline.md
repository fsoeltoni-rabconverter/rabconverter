# Processing Pipeline — PDF RAB

## Pipeline stages

1. **Ingress** — authorize user, validate request, create job/source metadata, checksum file and store original privately.
2. **PDF classification** — identify born-digital, scanned, mixed, encrypted, corrupt or unsupported pages as reliably as possible.
3. **Text/layout extraction** — extract selectable text, words, coordinates, page images and candidate table geometry.
4. **OCR fallback** — use for scanned/image pages; attach confidence to recognized numeric and structural fields.
5. **Table segmentation** — detect columns, rows, repeated headers, section headings, descriptions spanning multiple lines, notes, subtotals, carry-forward and grand-total rows.
6. **Normalization** — map source labels to canonical fields while preserving raw values, row order, page/region and number locale.
7. **Formula candidate creation** — identify eligible quantity × rate rules and possible subtotal/grand-total membership; mark each candidate as reconstructed.
8. **Validation** — compare line formulas, subtotals and totals with printed source amounts; detect double-counted carry-forward rows, omitted items, ambiguous numeric formats and likely duplicate rows.
9. **Human review** — expose uncertain fields and formula mappings; let user confirm, correct or reject candidates.
10. **Export generation** — produce XLSX formulas for accepted rules and a warning sheet for unresolved items.
11. **Audit/retention** — save run/version/status without full source contents in logs; apply approved retention/deletion behavior.

## Provider-independent interface

Conceptual parser contract:
- inspect(file) → PDF class, metadata, page count and warnings
- extract(file) → text/layout/table candidates with source references
- normalize(candidate, locale/context) → canonical records and normalization provenance
- classify_rows(records) → item/section/note/subtotal/total/adjustment candidates
- propose_formulas(records, confirmed mapping) → formula candidates with provenance and confidence
- validate(records, formulas, printed totals) → issues
- export(approved records, formula contract) → XLSX/CSV artifact

Keep OCR/parser implementations replaceable. Choose a provider only after a comparative test using representative Indonesian PDF RABs, plus cost, privacy, latency, size-limit and output-fidelity review.

## Reliability

- Every job/run has a durable ID and deterministic version.
- Retries are idempotent; no duplicate exports.
- A failed stage produces a stable error code and safe diagnostic summary.
- Partial extraction remains reviewable when possible; never label partial output as complete.
- File processing is resource-limited and does not block normal app interaction.
- Do not execute embedded content from uploads.
- Use background processing when file size/duration makes a synchronous request unreliable.

## Confidence and review

Confidence belongs at field/row level, not just document level. Unknown values remain null. A number inferred from ambiguous localization, OCR or uncertain column mapping is flagged. The user can inspect the source context before accepting the row/formula.

## Formula policy

- A PDF's printed amount is not proof of its formula.
- New formulas are reconstructed and labelled.
- Do not create price or unit values.
- Do not silently insert tax/overhead/profit.
- Reconciliation differences may be source errors, rounding, manual adjustments or parser errors; display the delta and source rather than automatically replacing the printed total.

## Revision handling

Treat each uploaded revision independently. Compare rows across revisions only when row identity matching is sufficiently confident. Report added/removed/changed rows and amounts; never overwrite confirmed prior rows silently.
