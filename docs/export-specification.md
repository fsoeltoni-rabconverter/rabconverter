# Export Specification — PDF RAB to XLSX

Status: Draft v2

## Primary output promise

The default output is an editable XLSX workbook with formulas reconstructed for eligible line totals and rollups. It is not described as an exact recovery of the original Excel workbook because a PDF normally does not contain its original formula graph.

## Workbook tabs

1. **RAB** — primary rows in source order. Columns should include item code/number, description, unit, quantity/volume, unit price, amount, formula status and source page.
2. **Rekap** — section subtotals and grand total only where row membership and arithmetic structure are sufficiently clear.
3. **Review_Warnings** — unresolved rows, field-level confidence, source page, mismatch values and suggested correction.
4. **Source_Info** — original filename, source PDF page count, detected PDF class, processing version, number locale and generation time.
5. **Original_Values** — optional audit view containing the values as extracted/printed separately from reconstructed formulas.

## Formula contract

- If quantity and unit price are present and unambiguous, set amount to a formula equivalent to quantity_cell * unit_price_cell.
- If quantity, unit price or column mapping is uncertain, do not create an amount formula automatically.
- Generate section subtotal only if section start/end and included rows are clearly identified.
- Generate grand total only when the source's rollup logic is sufficiently clear.
- Apply tax, overhead, profit or contingency formulas only when their bases, rates, order and inclusion/exclusion rules are explicit or confirmed by the user.
- Label formula provenance as reconstructed, never original_recovered.
- Keep printed amount as a separate source value for comparison.
- Record the amount formula and calculated result separately where the export model supports it.
- Formula errors or mismatches must appear in Review_Warnings.
- Do not replace a source number with a formula result without retaining the source value for comparison.

## Numeric behavior

- Use decimal-safe parsing and documented rounding/precision behavior.
- Preserve locale information; common Indonesian formatting may use dots for thousands and commas for decimals.
- Do not turn a blank unit price into zero.
- Do not remove leading zeros from item codes.
- Do not convert or normalize units without explicit rules.
- Avoid hardcoding a tax rate or applying universal overhead/profit assumptions.
- Confirm ambiguous number formats before generating totals that depend on the interpretation.

## Reconciliation checks

- Extracted line item amount vs reconstructed quantity * unit price.
- Sum of line amounts vs printed section subtotal.
- Sum of accepted section totals vs printed grand total.
- Whether subtotal rows were accidentally counted as items and double-counted.
- Whether the same carried-forward subtotal is counted more than once.
- Whether tax/overhead/profit lines are already included in the grand total.
- Formula-generated final total vs printed PDF total.

A mismatch does not automatically prove that OCR is wrong: source documents may contain rounding, copied formula errors, manual adjustments or conventions that were not extracted. Display the difference and let the user decide.

## Formatting and fidelity

- Preserve source row order and section hierarchy.
- Keep descriptions editable and readable, wrapping text rather than clipping or merging it into neighboring items.
- Use currency/number formats consistent with the detected/confirmed locale.
- Distinguish section headers and totals with clear formatting.
- Include the source page and a review status for traceability.
- Provide a clean workbook, not only a pixel-perfect imitation of the PDF.
- Template-matched export can be added later for known templates, with its own explicit acceptance tests.

## Export acceptance gate

A release cannot claim “Excel with formulas” until:
- the output is a valid XLSX;
- formula cells exist for eligible rows;
- formulas recalculate correctly when quantities or rates are modified;
- section and grand totals follow the documented rule;
- discrepancies with printed source values are visible;
- formula provenance is accurately labelled.
