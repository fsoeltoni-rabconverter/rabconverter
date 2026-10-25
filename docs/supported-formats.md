# Supported Formats and Golden Test Matrix

Status: proposed; compatibility promises must follow measured tests.

## Initial input priority

| Format | First release position | Notes |
|---|---|---|
| Text-based PDF RAB/BOQ | Primary golden path | Extract text and table layout; reconstruct safe formulas |
| Scanned PDF RAB/BOQ | Limited/experimental until tested | OCR required; numeric fields need confidence and review |
| Mixed text/scanned PDF | Limited until tested | Page-level classification and warnings |
| XLSX/XLS source | Later companion input | If original workbook exists, native formulas are more authoritative than reconstruction from PDF |
| CSV | Later/secondary interchange | Not the core PDF-to-XLSX user experience |
| DOCX, email, ZIP | Later | Separate parsing and safety criteria |
| CAD/DWG/DXF drawings | Out of MVP | Requires quantity takeoff semantics, not PDF RAB conversion |

## Golden test suite

Use samples with permission/licensing appropriate for testing:
1. Clean text-based PDF RAB with Uraian/Volume/Satuan/Harga Satuan/Jumlah.
2. PDF BOQ with blank rates.
3. RAB with section headings and subtotals.
4. PDF with separate recap page and printed total.
5. PDF table continued across pages, repeating the header.
6. Wrapped/multiline descriptions and continuation rows.
7. Localized values with Indonesian thousands and decimal separators.
8. Rows with zero/dash/blank amounts or missing unit prices.
9. Tax/overhead/profit/contingency rows where calculation order matters.
10. Scanned PDF, skewed/rotated pages and poor OCR quality.
11. Multiple columns/pages or section subtotal carried forward.
12. Corrupt, encrypted, mixed-content and unsupported PDF.
13. Source with an intentional printed arithmetic mismatch.
14. PDF that visually resembles an Excel sheet but has no embedded formula logic.

For each fixture, define expected values, row count/kind, row order, source page, formulas that are safe to reconstruct, printed totals, expected warning codes and resulting workbook formulas/values.

## File validation

- Check file signature/content, not extension alone.
- Restrict size, page count, runtime and memory budget.
- Identify encryption/corruption/empty documents.
- Treat OCR or parser input as untrusted.
- Do not execute embedded scripts/macros.
- Preserve original privately and use checksum for deduplication.

## Acceptance metrics

Use separate metrics for item code, description, unit, quantity, rate, printed amount, row-kind classification, table row precision/recall, formula correctness, subtotal/grand-total reconciliation and warning precision/recall. Numeric fields need stricter thresholds than prose. Set release targets after a baseline on a representative golden set; don't use one global “accuracy” number.
