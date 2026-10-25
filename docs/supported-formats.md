# Supported Formats and Golden Test Matrix

Status: proposed compatibility contract; promises must follow measured golden-file results.

## Initial input priority

| Format | Release position | Notes |
|---|---|---|
| Text-based PDF RAB/BOQ | Primary golden path | Extract text/layout; reconstruct safe formulas |
| Scanned PDF RAB/BOQ | Limited/experimental | OCR and numeric confidence/review required |
| Mixed text/scanned PDF | Limited until tested | Per-page method/warnings |
| XLSX/XLS source | Later companion input | Native formulas are more authoritative than PDF reconstruction |
| CSV | Later/secondary | Not the primary workflow |
| DOCX, email, ZIP | Later | Needs separate parsing/safety rules |
| CAD/DWG/DXF drawings | Out of MVP | Drawing takeoff is a different capability |
| PDF unrelated to RAB/BOQ | Unsupported for conversion billing | Return a clear unsupported/no-usable-data result |

## Golden fixture suite

Use only examples that have reuse permission, public license confirmation or are intentionally synthetic:
1. Clean text-based PDF with No/Uraian/Volume/Satuan/Harga Satuan/Jumlah.
2. Unpriced BOQ with blank rates.
3. RAB with section headings and subtotals.
4. Separate recap page with printed grand total.
5. Table continued across pages with repeated headers.
6. Wrapped descriptions and continuation rows.
7. Indonesian thousands separators/decimal commas.
8. Zero/dash/blank values and missing rates.
9. Tax/overhead/profit/contingency lines where order matters.
10. Scanned, skewed/rotated and poor OCR pages.
11. Carried-forward subtotal across pages.
12. Corrupt, encrypted, empty, mixed and unsupported PDF.
13. Intentional arithmetic mismatch in printed source.
14. Flattened spreadsheet-looking PDF with no native formula graph.
15. Cover, blank, appendix and drawing-only pages that must not be charged unless usable RAB/BOQ content is retained.
16. Page with repeated header plus real RAB rows, which should remain billable.
17. Page with a recap record that contributes to the XLSX.
18. Page whose provider output is discarded and not used in the final export, which must not be billed.
19. Retry, repeated request and rerun cases that must not duplicate a charge.

Each fixture defines expected extracted values, row types/order, source page, formula candidates, warning codes, billable-page assessment, expected customer charge and simulated provider usage.

## Validation and limits

- Check MIME/file signatures, not extension alone.
- Limit bytes, pages, runtime and resource consumption.
- Identify empty, encrypted, corrupt or unreadable documents.
- Treat parser/OCR content as untrusted.
- Never execute embedded scripts/macros.
- Store source privately and use checksums for deduplication without exposing cross-customer file presence.
- Set hard limits before launch; do not rely on provider's advertised page limits as an application safety boundary.

## Accuracy and commercial metrics

Report separate metrics for item code, description, unit, quantity, rate, printed amount, row-kind classification, row precision/recall, formula correctness, total reconciliation and warning precision/recall. Billing metrics separately report provider-submitted pages and cost/credits; customer billable pages; non-billable reasons; billable/non-billable ratio; COGS per provider page and customer billable page; and charges reconciled with the ledger.

Numeric fields need stricter targets than prose. Establish target thresholds after measuring representative goldens; never substitute one vague accuracy number for field-level results.
