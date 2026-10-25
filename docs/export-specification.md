# Export Specification

## Formats

- **XLSX**: primary editable workbook output.
- **CSV**: optional flat interchange output; the user can choose delimiter/encoding/decimal locale if needed.
- PDF export/rendering is deferred unless a specific workflow requires it.

## Standard workbook shape (draft)

1. **RAB_BOQ** — line items in source order, section hierarchy represented explicitly, with columns for item code, description, unit, quantity, unit price, amount, source reference and review state.
2. **Rekap** — section subtotals and grand totals if these are represented in the source or can be recalculated without ambiguity.
3. **Exceptions** — unresolved warnings and blocking problems with source location and suggested action.
4. **Source_Metadata** — original filename, document revision, extraction version, generation time and normalization locale.
5. Optional **Original_Mapping** worksheet or direct template mapping when the template is supported.

## Numeric and formula behavior

- Preserve original raw value and parsed decimal separately internally.
- Use decimal-safe arithmetic and explicitly documented rounding rules.
- Never generate a unit price when it is blank.
- Distinguish source-provided amount from a calculated amount.
- Retain formula strings in audit metadata; do not execute macros.
- When exporting formulas, use formulas only where the output contract defines them, and include static values or supported recalculation behavior as appropriate.
- Reconcile row totals, section totals and final totals. Expose any difference.
- Taxes, overhead, profit, contingencies and provisional sums are not universal; only apply when selected or present in a known template.

## Fidelity

- Preserve item order, codes, wording, units, quantities, section boundaries, alternates and provisional markers.
- Keep descriptions that wrap across lines joined without deleting meaningful punctuation.
- Do not transform “LS”, “lot”, “unit”, “m1”, “m²”, “m³” or other units into another unit without explicit rules.
- Do not strip leading zeroes from identifiers.
- Keep source data separate from user edits and calculated output.
- Clearly distinguish an export that is normalized from one mapped back to an original client template.

## Export gate

If a blocking ambiguity affects the output (for example, a quantity can be interpreted as 1,250 or 1.250), ask the user to resolve it before producing a priced total. Otherwise allow export with a visible exceptions sheet and a clear warning summary.
