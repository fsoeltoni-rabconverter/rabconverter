# Export Specification — PDF RAB to XLSX

Status: specification v1.1 — 2026-10-25.

## Primary output promise

Output is an editable XLSX workbook with supported, reconstructed formulas—not exact recovery of the original workbook formula graph. Provide it automatically on the normal path; ask the user to review only where a material decision is required for a safe output.

## Workbook tabs

1. **RAB** — primary rows in source order. Include item code/number, description, unit, quantity/volume, unit price, printed amount/source reference, formula amount/status, review state and source page.
2. **Rekap** — section subtotals and grand total only where row membership and arithmetic structure are clear.
3. **Review_Warnings** — unresolved rows/fields, confidence where available, source page, printed/calculated/difference values and suggested action.
4. **Source_Info** — original filename, source page count, PDF class, pipeline/provider version, numeric locale decision, generation time, export version, safe source identifier/checksum, billable-page count/policy version, price snapshot and customer charge reference.
5. **Original_Values** — optional audit view with extracted/printed values separated from reconstructed formula cells.

Do not include provider API keys, raw payment callbacks, private storage URLs, provider credentials or internal provider COGS. Customer billing summary may contain billable pages, price/page and final customer charge, not provider cost.

## Formula contract

- When quantity and unit price are present and semantically unambiguous, the amount cell has a formula equivalent to quantity_cell × unit_price_cell.
- Uncertain quantity, rate or column mapping means no automatic amount formula.
- Section subtotal is generated only with clear row membership; grand total only with clear recap inclusion logic.
- Tax, overhead, profit or contingency formula is used only when base, rate, order and inclusion/exclusion rules are explicit or confirmed.
- Formula provenance is reconstructed or user-confirmed, never original recovered.
- Preserve printed amount separately for reconciliation.
- Formula text, cached/displayed result and recalculated result are distinct; a formula string alone does not prove correctness.
- Formula errors/mismatches appear in Review_Warnings; do not silently replace printed source amounts.

## Verification and recalculation

A file is not considered a verified deliverable merely because it exists or opens.

Before setting the job result to completed/download-ready:
1. Validate the ZIP/XML workbook structure and required sheets/cell types.
2. Check row order, hierarchy, source-page provenance and the export manifest.
3. Confirm eligible formula cells exist and are assigned only to confident mappings.
4. Recalculate formulas in the selected, tested spreadsheet calculation engine/runtime for the supported formats. The exact library/engine is a launch decision and must be tested in CI against golden fixtures.
5. Scan recalculated values for formula errors, missing cached results when required, invalid references, circular/broken references and reconciliation mismatches.
6. Preserve printed values and show source/calculated/difference values for mismatch; do not auto-correct the source.
7. Verify the workbook can be consumed as editable cells, not a pasted image or values-only export.

If required verification fails, either safely fix/regenerate and re-verify, or mark export failed. No verified downloadable artifact means no success state, no page charge and reservation release.

## Numeric behavior

- Use decimal-safe parsing and explicit precision/rounding policy.
- Preserve locale context; common Indonesian formats use dots for thousands and commas for decimals.
- Blank rates remain blank, never coerce them to zero.
- Preserve leading zeros in item codes.
- Do not normalize units without explicit approved rules.
- Do not apply universal tax, overhead or profit values.
- Require targeted review/warning when numeric locale is ambiguous.

## Reconciliation checks

- Printed line amount vs quantity × unit price.
- Sum of work-item rows vs printed section subtotal.
- Included subtotals vs printed grand total.
- Subtotal rows mistakenly counted as work items.
- Carried-forward subtotal counted twice.
- Tax/overhead/profit lines already included in total.
- Recalculated formula result vs printed amount/total.
- Source-page mapping vs exported row references.
- Final billable-page assessment vs substantive records in this artifact's export manifest.

## Formatting, immutable artifacts and correction

- Preserve source row order and section hierarchy.
- Descriptions stay editable and wrapped; numeric columns scan consistently.
- Distinguish source and calculated values without destructive merges.
- Include source page and review status; deliver a clean structured workbook, not a pixel-perfect page facsimile.
- Each output is an immutable artifact version. Regeneration after a correction creates a new version attached to the same job; it does not create a new job or duplicate the job charge.
- If a confirmed correction changes final billability/amount after settlement, handle it only through an explicit, audited compensating ledger entry under the pricing policy; never silently alter settled history.

## Billable-page contract

The export manifest maps retained substantive records to source pages. A page is billable only when at least one substantive, traceable RAB/BOQ record from it appears in the verified downloadable artifact. Section heading alone, note-only, header/footer-only, cover, blank, unrelated or discarded extraction is insufficient. The canonical assessment is in `JobPageBillingAssessment`; any source-page flag is a projection.

## Export acceptance gate

Do not claim “Excel with formulas” until the XLSX is valid, eligible formulas recalculate in a tested engine without unacceptable formula errors, totals reconcile or produce explicit warnings, provenance is correct, source values remain recoverable, and the final page assessment/charge match the ledger and manifest.
