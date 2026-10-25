# Research and Sources — Indonesia PDF RAB to Formula-bearing Excel

Research updated: 2026-10-25  
Goal: find the contractor workflow, sources of manual re-entry, pain/expectations expressed publicly, and the technical boundary between PDF table conversion and formula reconstruction.

## Research approach

Search paths included:
1. Indonesian contractor/RAB Excel workflows and formulas.
2. Public Facebook-group snippets and YouTube/tutorial pages.
3. Generic PDF-to-Excel competitors and their stated limits.
4. Indonesian RAB software/services and the way they position editability/formulas.
5. Indonesian government/open data for BOQ/AHSP examples and regional guidance.
6. International construction estimating workflow sources used only as corroboration, not as Indonesian regulations.

This is a source-grounded qualitative synthesis. Search-index snippets are not treated as full posts when the linked page could not be read. Product marketing is not relabelled as user testimony.

## High-signal sources

### 1. RunConvert — PDF to Excel FAQ
https://www.runconvert.com/id/pdf-to-excel

Important technical statement: the FAQ says PDF files do not contain active formulas; conversion yields displayed values rather than the original formulas. This is the core technical constraint. RabConverter cannot recover exact formula cells/references from a PDF alone. It must build new formulas from the recognized RAB structure and explicitly label those formulas as reconstructed.

### 2. Adobe Acrobat Indonesia — PDF to Excel
https://www.adobe.com/id_id/acrobat/how-to/pdf-to-excel-xlsx-converter.html

Describes editable XLS/XLSX export, layout/column preservation and OCR for scanned PDFs. This establishes a baseline set of expectations for generic conversion. It does not specifically promise construction/RAB-aware formula reconstruction.

### 3. PDF4me Indonesia — PDF to Excel
https://pdf4me.com/id/pdf-ke-excel/

Positions its converter around extracting PDF tables into editable rows and columns, reducing manual re-entry and using OCR when the source is a scan. This demonstrates generic converters already cover the simple “make a spreadsheet” claim. RabConverter must differentiate on RAB row classification, generated formulas, subtotal reconciliation, source traceability and warnings.

### 4. Indonesian tutorial — HiTekno, “Cara Mudah Membuat RAB di Excel”
https://www.hitekno.com/internet/2025/11/02/122303/cara-mudah-membuat-rab-di-excel-cocok-untuk-proyek-bangunan-hingga-acara

Published 2025-11-02. Describes common columns: description, quantity, unit, unit price and total. Gives formula examples for row amounts (quantity × unit price), grand total (SUM), category subtotal (SUMIF) and dynamic lookup/validation functions. This is a how-to article, not an estimator complaint survey.

### 5. Public Facebook group result — request for free/easy RAB software
https://www.facebook.com/groups/SKETCHUPNUSANTARA/posts/1886173278717196/

Search indexing surfaced the title/snippet: “Saran dong, aplikasi RAB yg free dan mudah di pelajari/ di gunakan..” (“Any suggestions for a free RAB app that is easy to learn/use?”). The page could not be fully independently retrieved through the current web reader, so this is a weak qualitative signal only. It suggests low setup friction and price sensitivity matter to at least one public poster; it does not prove market-wide preference.

### 6. Public Indonesian RAB product reference — Denahku
https://denahku.com/untuk-kontraktor

The product page emphasizes editing line items, using the contractor's own price book, formula-bearing Excel exports, auditing changes, and draft/final version comparison. Treat this as provider-stated value positioning, not independent customer testimony. It is useful for identifying the category's feature language and likely expectations.

### 7. Public Indonesian RAB service reference — Bangun.com
https://bangun.com/

The provider states that its service returns professional PDF RAB with editable Excel, detailed quantities and prices, and a professional review step. This is not a direct conversion competitor in every workflow; it is evidence that editable Excel and reviewability are used as part of the value promise in the Indonesian market. Claims about turnaround, totals served or standards are provider claims, not independently audited here.

### 8. Satu Data Sumbar — BOQ Bina Marga / AHSP workbook metadata
https://data.sumbarprov.go.id/mn_MN/dataset/data-bill-of-quantity-bid-bina-marga-dinas-pupr-kota-sawahlunto/resource/2bc73802-bfd8-4c67-a332-213bfc2299e2

Public dataset metadata describes a construction BOQ workbook containing price recapitulation, Daftar Kuantitas dan Harga, and Analisa Harga Satuan Pekerjaan (AHSP) for Bina Marga. This is a strong example of related but distinct workbook layers (recap, BOQ and unit-price analysis). Metadata indicates the resource is labelled XLS and the dataset has not supplied a license; do not assume reuse rights for a copied dataset or fixture without checking applicable terms.

Dataset landing page:
https://data.sumbarprov.go.id/mn_MN/dataset/data-bill-of-quantity-bid-bina-marga-dinas-pupr-kota-sawahlunto

### 9. Jateng regional government — AHSP BMCK 2024 guidance PDF
https://data.jatengprov.go.id/dataset/cc7de1cd-d469-4cd8-b890-b76c015a60da/resource/da42b1d8-5f38-4d92-9c01-ad8ff6803f4c/download/pedoman-ahsp-bmck-2024-sign.pdf

The document's disclaimer says the guide is not universally representative of field requirements across Indonesia and costs should be adjusted to technical specifications, applicable provisions, engineering judgment and local market prices. This is important for product scope: formula reconstruction should not silently insert a generic AHSP price or assume one standard applies everywhere.

### 10. S-RAB — source-document conversion into a spreadsheet library
https://www.sekowahyu.id/s-rab/

The site states that a reference database is provided as editable Google Sheets and was converted from official Bina Konstruksi PDF documents. This is adjacent evidence that users/practitioners transform PDF technical data into editable sheet-based databases. The page is provider/author content, not a user complaint.

### 11. Bluebeam — Takeoffs and Estimation
https://www.bluebeam.com/workflows/takeoffs-and-estimation/

International vendor source says manual transfer between digital takeoff and estimate spreadsheets creates duplicated data entry and can lead to stale quantities. It is useful background but relates more to drawing takeoff than PDF RAB table conversion; do not let it broaden the MVP.

### 12. US-Estimation — From Bid Package to Submitted Bid
https://usestimation.com/process

Workflow source describes receiving drawings, specs, addenda, forms and scope; quantities/takeoff; pricing; quotes; clarifications; addendum checks; quality review and submission. It corroborates general workflow order but is not Indonesian procurement authority.

### 13. Estimation QS — Tender Preparation and Documentation
https://estimationqs.com/tender-preparation-and-documentation-3/

Describes tender forms, unpriced BOQ, drawings, specifications, editable Excel pricing, proofreading and transferring final amounts into official forms. This illustrates format-transfer work but uses jurisdiction-specific procedures; do not apply its rules as Indonesian legal requirements.

## What the evidence supports

1. Generic PDF-to-Excel products already support table extraction and editable XLSX; “we convert PDF” alone is not enough differentiation.
2. A PDF does not ordinarily retain the active Excel formula graph. Formula-bearing output is a reconstruction, not faithful formula recovery.
3. Common RAB structure includes description, quantity/volume, unit, unit rate and amount/total, with section and project-level totals. Actual templates vary.
4. Formula output has meaningful value only when the workbook recalculates correctly after edits and the generated formula can be inspected.
5. User trust depends on comparing formula results with printed source amounts and visibly flagging mismatches instead of silently “fixing” the RAB.
6. Evidence of an explicit free/easy software request exists in public social search results, but the accessible social-media evidence is too sparse to quantify how widespread the pain is.
7. Prices and AHSP/AHS depend on context/source; the conversion product should not silently provide official/market rates.

## Public social evidence and its limits

- Facebook group snippet: one request for a free, easy-to-learn RAB app (source 5); full page not retrievable in this run.
- Facebook posts surfaced for RAB calculators and Excel RAB template promotion, but those were primarily promotional and therefore excluded as proof of user complaints.
- YouTube search surfaced multiple RAB/Excel tutorials and a tutorial about AHSP formulas. These establish that formula-driven RAB is a known workflow topic, but view count or marketing copy would not establish user dissatisfaction.
- Reddit/Kaskus queries did not return robust, clearly attributable Indonesian contractor discussions in the current indexed results.
- No representative sample size, sentiment prevalence, willingness-to-pay estimate or time-saved metric is asserted.

## Product implication

Own a sharply defined category: PDF RAB → formula-bearing Excel.
1. Recover table cells and row types.
2. Preserve PDF values as source evidence.
3. Generate standard formulas only for confidently mapped columns.
4. Compare generated outputs to printed amounts/subtotals/grand total.
5. Mark reconstructed formulas explicitly.
6. Keep unresolved rows and ambiguous tax/recap logic in a warning sheet.
7. Offer a fast and simple upload/download flow, with review needed only when confidence is low.

## Remaining research gaps

- Obtain legal-to-use sample PDFs from multiple Indonesian contexts (private residential, private commercial, public works, renovation).
- Inspect at least 10–20 golden PDFs with different layouts and scan quality before setting accuracy targets.
- Add deeper social research only when source pages, comments or transcripts can be accessed and attributed reliably.
- Validate whether customers prefer a normalized workbook or a visual approximation of the original PDF layout.
- Determine the target free-tier/page limit after measuring real processing cost.
