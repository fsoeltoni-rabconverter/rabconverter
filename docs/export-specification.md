# Export Specification — PDF RAB to XLSX

Status: specification v1.0 — 2026-10-25.

## Primary output promise

Default output is an editable XLSX workbook with formulas reconstructed for eligible line totals and rollups. It is not described as exact recovery of the original workbook because a PDF normally does not retain the original formula graph.

## Workbook tabs

1. **RAB** — primary rows in source order. Include item code/number, description, unit, quantity/volume, unit price, printed amount or source reference, formula amount/status, review state and source page.
2. **Rekap** — section subtotals and grand total only where row membership and arithmetic structure are clear.
3. **Review_Warnings** — unresolved rows/fields, confidence where available, source page, printed/calculated/difference values and suggested action.
4. **Source_Info** — original filename, source page count, PDF class, pipeline/provider version, numeric locale decision, generation time, export version, source checksum or safe identifier, billable page count, page price snapshot and customer charge reference.
5. **Original_Values** — optional audit view with extracted/printed values separate from reconstructed formula cells.

Do not include internal provider API keys, raw payment callbacks, private storage URLs, provider credentials or internal COGS in the workbook. A customer-facing billing summary may include billable pages, customer price/page and final customer charge, not provider cost.

## Formula contract

- If quantity and unit price are present and unambiguous, the amount cell contains a formula equivalent to quantity_cell × unit_price_cell.
- Uncertain quantity, rate or column mapping means no automatic amount formula.
- Section subtotal is generated only with clear row membership.
- Grand total is generated only with clear recap logic.
- Tax, overhead, profit or contingency formula is applied only when base, rate, order and inclusion/exclusion rules are explicit or confirmed.
- Formula provenance is reconstructed or user-confirmed; never label as original recovered.
- Preserve the printed amount separately for reconciliation.
- Formula string and cached/displayed result are separate concepts; test recalculation in supported spreadsheet apps.
- Formula errors/mismatches appear in Review_Warnings; do not silently replace printed source amounts.

## Numeric behavior

- Decimal-safe parsing and explicit precision/rounding rules.
- Preserve locale context; common Indonesian number formats use dots for thousands and commas for decimals.
- Blank rate stays blank; do not coerce it to zero.
- Preserve leading zeros in item codes.
- Do not normalize units without explicit approved rules.
- Do not apply universal tax, overhead or profit values.
- Require review when number format is ambiguous.

## Reconciliation checks

- Printed line amount versus quantity × unit price.
- Sum of line items versus printed section subtotal.
- Accepted subtotals versus printed grand total.
- Subtotal rows mistakenly included as regular items.
- Carried-forward subtotal counted twice.
- Tax/overhead/profit lines already included in total.
- Final formula result versus printed total.
- Source-page mapping versus exported row references.
- Billable-page list versus pages that contributed meaningful rows/recap records to this export.

Mismatch may originate from OCR/extraction error, source rounding, copied spreadsheet errors, manual adjustments or rules not visible in the PDF. Show printed value, calculated value and difference; allow review instead of silently correcting the source.

## Formatting and fidelity

- Preserve source row order and section hierarchy.
- Keep descriptions editable and wrapped.
- Align numeric columns consistently and use supported locale formatting.
- Distinguish headers and totals with formatting, not destructive merges.
- Include source page and review status.
- Produce a clean structured workbook rather than a pixel-perfect imitation.
- Template-matched exports are later scope with independent acceptance tests.

## Export acceptance gate

Do not claim “Excel with formulas” until the file is a valid XLSX; eligible formulas exist and recalculate; totals follow documented membership rules; discrepancies are visible; provenance is correct; source values remain recoverable; billable page count and charge match the job ledger and export manifest.
