# Supported Formats and Golden Test Matrix

Status: proposed compatibility contract; promises must follow measured golden-file results.

## Initial input priority

| Format | Release position | Notes |
|---|---|---|
| Text-based PDF RAB/BOQ | Primary golden path | Extract text/layout; reconstruct safe formulas |
| Scanned PDF RAB/BOQ | Limited/experimental | OCR, numeric confidence and review warnings |
| Mixed text/scanned PDF | Limited until tested | Per-page method/warnings |
| XLSX/XLS source | Later companion input | Native formulas are more authoritative than PDF reconstruction |
| CSV | Later/secondary | Not primary workflow |
| DOCX, email, ZIP | Later | Separate parsing/safety rules required |
| CAD/DWG/DXF drawings | Out of MVP | Drawing takeoff is a different capability |
| PDF unrelated to RAB/BOQ | Unsupported | Clear unsupported/no-usable-data result; no charge |

## Golden fixture suite

Use only examples with reuse permission, confirmed public license or intentionally synthetic data:
1. Clean text PDF with No/Uraian/Volume/Satuan/Harga Satuan/Jumlah.
2. Unpriced BOQ with blank rates.
3. RAB with section headings and subtotals.
4. Recap page with a printed grand total.
5. Table continued across pages with repeated headers.
6. Wrapped descriptions and continuation rows.
7. Indonesian thousands separators/decimal commas.
8. Zero, dash, blank and missing rates.
9. Tax/overhead/profit/contingency lines where order matters.
10. Scanned, rotated/skewed and poor-OCR pages.
11. Carried-forward subtotal across pages.
12. Corrupt, encrypted, empty, mixed and unsupported PDF.
13. Intentional printed arithmetic mismatch.
14. Flattened spreadsheet-looking PDF without formula graph.
15. Cover/title-only, blank, unrelated appendix and drawing-only pages: non-billable unless substantive RAB/BOQ data is retained (for drawing-only, only if it actually contains such a record).
16. Section heading only: non-billable.
17. Header/footer/column header only: non-billable.
18. Notes/specification/assumption only: non-billable.
19. Repeated header plus actual RAB rows: billable.
20. Substantive recap/subtotal record with actual value and source context retained in XLSX: billable.
21. Duplicate page with no new retained record: non-billable.
22. Provider output discarded and not represented in final artifact: non-billable.
23. Warning-bearing but substantive retained row: billable if it meets the definition.
24. Retry, duplicate submit, cancellation, job timeout, review hold expiry and late worker attempt: no duplicate charge and no reservation leak.
25. Duplicate/out-of-order payment event, callback before redirect, verified payment before ledger credit, late verified payment after local expiry, and repeated credit attempt: wallet credits once only after reconciliation and conversion unlocks only after credited.
26. Export with formula error/recalc failure: not success/download-ready; charge zero if no verified deliverable.
27. Correction/re-export in the same job: new immutable artifact version, no second customer charge; if settled amount changes after a confirmed correction, append a compensating ledger entry.
28. Provider timeout with saved job/request ID: check current provider job status before any safe retry; record all provider attempts.
29. Optional queue dispatch failure after database commit: recover and dispatch the existing job/reservation without creating a duplicate.
30. Provider COGS measurement: internal per-attempt records reconcile to aggregate provider usage exports/invoices; no assumed one-to-one attribution unless evidence confirms it.

For every fixture, specify expected values, row kinds/order, source page, formulas, warnings, export-manifest records, page billability/reason, expected customer charge and simulated provider usage/cost.

## Validation and limits

- Check MIME/file signature, not extension alone.
- Set explicit configured limits for bytes, source pages, processing runtime/worker lease and provider timeout before launch.
- Identify empty, encrypted, corrupt and unreadable documents before any paid provider call.
- Treat parser/OCR content as untrusted; never execute embedded scripts/macros.
- Store sources privately; checksums must not disclose whether another customer uploaded identical content.
- Product limits must not rely solely on provider-advertised limits. Oversized/unsupported inputs are rejected without reservation or charge.

## Accuracy and commercial metrics

Report field-level item code, description, unit, quantity, rate and printed-amount metrics; row-kind precision/recall; formula correctness after recalculation; subtotal/total reconciliation; and warning precision/recall. Separately report provider-submitted pages/usage unit/cost, customer billable pages, non-billable reasons, COGS per provider page and billable page, and ledger reconciliation.

Numeric fields need stricter targets than prose. Establish thresholds after representative legal golden fixtures; never substitute one vague accuracy number for field-level results.
