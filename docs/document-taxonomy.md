# RAB Document Taxonomy and Extraction Targets

Status: Draft v2 — PDF RAB-first

## Product-specific document classes

| Class | Examples | Main extraction targets | Caution |
|---|---|---|---|
| PDF RAB | Contractor estimate, residential/commercial work breakdown | Code, description, unit, quantity, rate, amount, section and recap | Formula graph usually absent from PDF |
| PDF BOQ / Daftar Kuantitas dan Harga | Unpriced or priced tender schedule | Item code, description, unit, quantity, rate/amount when present | Blank rates must remain blank; client templates vary |
| PDF rekapitulasi RAB | Work-group summary and final total | Section subtotals, total, tax/overhead fields and printed labels | Row inclusion and tax order vary |
| PDF AHSP/AHS | Unit-price analysis | Work item, resource, unit, coefficient, base resource price and calculated unit price | Version, sector, region and standard matter |
| Supporting tender documents | Invitation, specifications, addenda, drawings | Project metadata, dates, reference and context | Full semantic interpretation not MVP |
| Spreadsheet source (XLS/XLSX) | Original workbook if also supplied | Native formulas, sheets, cell formats, hidden rows/sheets and formula caches | Treat native workbook as more authoritative for formula structure than a PDF printout |
| Scanned/image PDF | Photocopy, scan, phone scan | OCR text plus cell layout candidates | Higher numeric uncertainty; require review |
| PDF with drawn table lines/flattened spreadsheet | A spreadsheet printed to PDF | Cell/column geometry and row types | Visual grid is not a recovered workbook model |

## Native PDF vs scan

- Born-digital PDF: try text extraction and word/table geometry first.
- Scanned PDF: OCR is required and numeric values must carry OCR confidence.
- Mixed PDF: process page by page and preserve page-level method/warnings.
- Vector lines/no text order: infer layout from coordinates, not merely reading-order text.
- Rotated/low-resolution pages: warn or request a better source when safe row extraction is impossible.

## Common Indonesian RAB columns

Examples include No/Kode, Uraian Pekerjaan, Volume, Satuan, Harga Satuan, Jumlah/Total. These labels vary and may be ordered differently. The parser should map semantic aliases to canonical fields while retaining source header text.

## Row classes

Every parsed row should be classified as one of:
- document/project header;
- column header;
- section/group header;
- work item;
- continuation of a work-item description;
- note/assumption;
- subtotal;
- carried-forward subtotal;
- grand total;
- tax/overhead/profit/contingency adjustment;
- blank/decoration/page footer;
- unknown.

Do not emit every printed line as a regular BOQ item.

## Formula reconstruction rules

PDF values are source evidence; formulas are newly generated logic.
- Generate amount = quantity × unit price only when both fields and their semantics are confidently mapped.
- Generate subtotals only when the section boundary and included amount rows are clear.
- Generate a grand total only when the recap logic is clear.
- Tax/overhead/profit/contingency formula generation requires explicit recognition of calculation base, rates, order and inclusion/exclusion rules.
- Reconstructed formulas must be labelled; never claim they are the exact original workbook formulas.
- Compare calculated values with the printed amount. Record rounding tolerance and mismatches.
- If ambiguous, preserve the source display value, flag it and leave that formula unresolved until user review.

## Extraction order

1. Validate file and classify born-digital vs scan/mixed.
2. Extract words, coordinates, pages and table regions.
3. Detect rows, columns, headers, repeated headers and page continuations.
4. Normalize local numeric formats with a recorded locale decision.
5. Classify row type and map semantic columns.
6. Reconstruct only safe formulas.
7. Reconcile line amounts, subtotals and totals.
8. Surface warnings and generate XLSX.
