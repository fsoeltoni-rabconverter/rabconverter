# Supported Formats and Golden Test Matrix

Status: proposed; not yet a compatibility promise

## Proposed starting set

| Format | Initial target | Notes |
|---|---|---|
| XLSX | Primary | Native rows/sheets/formulas/cell types/merged regions matter; preserve formulas and source addresses |
| Text-based PDF | Primary | Extract tables with source page/position; detect repeated headers and split tables |
| CSV | Interchange | Require explicit or detected delimiter, encoding and decimal/number locale where ambiguous |
| XLS (legacy Excel) | Pending test | Requires a safe compatible parser or conversion path |
| Scanned PDF | Limited/experimental initially | OCR errors and table geometry can create false quantities; review required |
| JPG/PNG scans/photos | Limited/experimental initially | No guarantee for handwritten or skewed/low-resolution text |
| DOCX | Later | Useful for bid forms/specs; table extraction and clause analysis need separate criteria |
| ZIP archives | Later | If added, block path traversal and unsafe file expansion; apply expanded-size limits |
| DWG/DXF/CAD | Out of MVP | Requires specialized rendering/measurement semantics |

## File validation

At minimum validate:
- Actual file signature/content rather than trusting extension alone.
- Allowed media type and extension.
- Size and page/sheet count limits.
- Password/encryption state.
- Parse safety and time/resource budgets.
- Duplicate checksum within a job.
- Empty or malformed document.
- Dangerous embedded content/macros are not executed.

## Golden-file test suite

Create non-confidential fixtures that cover:
1. Plain BOQ XLSX with one sheet.
2. Multisheet BOQ with section headers and subtotal rows.
3. Merged section headings, repeated print headers and page breaks.
4. Formula totals with cached formula values.
5. Localized Indonesian numeric formats (e.g. decimal commas and thousand separators).
6. Blank rates with quantity and units populated.
7. Priced BOQ with nontrivial amount values.
8. Text PDF with a table that continues across pages.
9. PDF with two-column or wrapped descriptions.
10. Scanned PDF with rotated/skewed pages (only if OCR is supported).
11. Invalid extension, corrupted file and encrypted file.
12. Addendum with changed quantity/description.

For each fixture, define expected item count, section hierarchy, raw and normalized values, source positions, formulas/cached totals, warning codes and export output.

## Acceptance threshold

Do not use one global accuracy score. Track field-level exact match for item code, unit, quantity, rate and amount; row precision/recall; hierarchy preservation; subtotal reconciliation; and false-positive/false-negative warnings separately. Numeric fields need stricter checking than descriptive prose. Define release thresholds from observed baseline on the golden set before enabling automated priced workbook generation.
