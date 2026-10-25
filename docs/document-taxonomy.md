# RAB Document and Page Taxonomy

Status: specification v1.1 — 2026-10-25. Classification and billing use stable source-page identities.

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

Each source page has one primary classification:
- `rab_boq_rows`: one or more substantive work-item records.
- `recap_or_total`: a substantive subtotal/grand-total/adjustment record with usable value/context.
- `header_or_cover_only`: cover/title/header without usable RAB/BOQ record.
- `blank_or_decoration`: blank, page number, margin, decorative line or footer only.
- `notes_only`: supporting notes/specifications/assumptions without substantive RAB/BOQ data.
- `unrelated_appendix`: content unrelated to the RAB/BOQ extraction promise.
- `drawing_only`: drawing with no usable RAB/BOQ table/recap record.
- `unreadable_or_failed`: corrupt/unreadable page or extraction produced no meaningful record.
- `unknown_needs_review`: insufficient evidence to classify.

Row classes include document header, column header, section/group heading, work item, continuation, note/assumption, subtotal, carried-forward subtotal, grand total, tax/overhead/profit/contingency adjustment, blank/footer and unknown.

## Column labels and formula boundary

Common aliases include No/Kode, Uraian Pekerjaan, Volume, Satuan, Harga Satuan and Jumlah/Total. Preserve original header labels. Column order varies.

- Amount = quantity × unit price only when source columns/meaning are clear.
- Subtotal only with clear section boundaries and included amount rows.
- Grand total only with clear recap inclusion/order.
- Tax/overhead/profit/contingency formula only if base, rate, order and inclusion/exclusion are explicit or confirmed.
- Preserve printed amounts separately; unresolved cases warn rather than silently substitute.

## Canonical billable-page rule

Billing assessment is deterministic application logic after export—not a provider-returned field or an LLM decision.

A source page is billable only when it contributes at least one **substantive and identifiable RAB/BOQ record** that is retained in the verified downloadable XLSX and linked to its source page.

**Sufficient examples:** a meaningful actual work-item row (description/code and available quantity/unit/rate/printed amount fields), or a subtotal/recap record with an actual usable financial/quantity value and enough source context to identify what it represents.

**Not sufficient by itself:** section/title heading, column header, footer, page number, note, assumption or specification without substantive RAB/BOQ data. The page is also not billable if blank, unrelated, drawing-only, unreadable/failed, duplicate-with-no-new-record, or its provider output was discarded before export.

A repeated header plus real work-item rows is billable. A warning does not itself make a page non-billable. Billability is not a guarantee of full correctness.

Each assessment records billable flag, reason code, substantive-record count, source page, export-artifact ID, export-manifest reference and policy version. `JobPageBillingAssessment` is the canonical final decision; any convenience flag on `SourcePage` is only a projection. Deduplicate per job/source page/policy/artifact. Charge is final billable-page count × job price snapshot.

## Processing summary

1. Validate file and count pages.
2. Classify each page/document.
3. Extract tables/layout with provenance.
4. Segment rows and continuations.
5. Map fields and preserve source values.
6. Normalize numeric formats only when safe.
7. Reconstruct supported formulas, validate and flag discrepancies.
8. Export and verify XLSX.
9. Assess substantive billable pages against the actual export manifest.
10. Atomically settle once or charge zero and release the reservation.
