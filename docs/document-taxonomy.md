# RAB Document and Page Taxonomy

Status: specification v1.0 — 2026-10-25. Document classification and billing share stable source-page identities.

## Document classes

| Class | Examples | Extraction targets | Caution |
|---|---|---|---|
| PDF RAB | Contractor estimate, residential/commercial work breakdown | Code, description, unit, quantity, unit price, amount, section/recap | Formula graph normally absent |
| PDF BOQ / Daftar Kuantitas dan Harga | Priced or unpriced tender schedule | Item code, description, unit, quantity and rates/amounts when present | Blank rates remain blank |
| PDF RAB recap | Work-group recap and final total | Section totals, grand total and printed adjustments | Inclusion/order varies |
| PDF AHSP/AHS | Unit price analysis | Work item, resource, unit, coefficient and source prices | Version, region and sector matter |
| Supporting tender document | Invitation, specification, addendum, drawings | Project metadata/context only | Full semantic interpretation out of MVP |
| Scanned/image PDF | Scan, photocopy, phone capture | OCR text, layout candidates, confidence | Higher numeric uncertainty |
| Mixed PDF | Born-digital and scanned pages combined | Page-level extraction method | Method and warnings must be page-scoped |
| Flattened spreadsheet printout | PDF that resembles Excel | Visible grid, row/column structure | Not a native workbook or formula graph |

## Page classes for processing

Each source page has one primary page classification:
- **rab_boq_rows:** one or more work-item/line/recap records are visible.
- **recap_or_total:** identifiable subtotal/grand-total/adjustment record.
- **header_or_cover_only:** cover/title/header without usable RAB/BOQ content.
- **blank_or_decoration:** blank, page number, margin, decorative line or footer only.
- **unrelated_appendix:** content unrelated to RAB/BOQ extraction promise.
- **drawing_only:** drawing with no usable RAB/BOQ table/recap data.
- **unreadable_or_failed:** corrupt or unreadable page, or extraction produced no meaningful record.
- **unknown_needs_review:** insufficient evidence to classify.

Row classes include project/document header, column header, section/group heading, work item, continuation, note/assumption, subtotal, carried-forward subtotal, grand total, tax/overhead/profit/contingency adjustment, blank/footer and unknown.

## Common Indonesian column labels

Common aliases include No/Kode, Uraian Pekerjaan, Volume, Satuan, Harga Satuan and Jumlah/Total. Preserve original header labels while mapping to canonical fields. Column order is not fixed.

## Formula reconstruction

- Amount = quantity × unit price only when source columns and semantics are clear.
- Subtotal only when section boundaries and included amount rows are clear.
- Grand total only when recap inclusion/order is clear.
- Tax/overhead/profit/contingency formula only when base, rate, order and inclusion/exclusion rules are explicit or confirmed.
- Preserve printed source amount separately and compare with calculated result.
- Ambiguous cases stay unresolved and generate warnings; never silently substitute a calculated value.

## Billable-page classification

Billable assessment is deterministic product logic after extraction, not a provider-returned billing field and not an LLM decision.

A source page is billable only if it contributes at least one meaningful, identifiable RAB/BOQ record to an XLSX artifact successfully generated and made available to the user. The record must have source-page provenance and include substantive data such as code, description, unit, quantity, price, printed amount, section, subtotal or recap data.

Not billable: blank/decoration pages; cover/title page without RAB data; unrelated appendix; drawing-only page; failed/unreadable page with no usable record; duplicate page contributing no new retained record; provider output discarded before export.

A repeated header does not make a page non-billable if actual RAB rows are retained. A recap page can be billable when its subtotal/total record is represented in the XLSX. Warnings do not themselves make a page non-billable if meaningful row data was recovered. Billability is not an accuracy guarantee.

Each assessment records billable flag, reason code, usable-record count, source-page number, export-artifact ID and classifier version. Deduplicate by job/source-document/page. User charge is final billable-page count × the job's price snapshot; provider attempt count is never the billing unit.

## Processing sequence

1. Validate file and page count.
2. Identify page classes and unsupported content.
3. Extract page layout, words, coordinates and table candidates.
4. Segment rows, headers and page continuations.
5. Map semantic columns and preserve raw values.
6. Normalize numeric values with locale provenance.
7. Classify rows and source pages.
8. Reconstruct supported formula candidates.
9. Reconcile and create review warnings.
10. Create and verify XLSX.
11. Finalize page-level billability and one idempotent job charge only after a usable artifact exists.
