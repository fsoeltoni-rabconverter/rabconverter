# Research and Sources — PDF RAB to Formula-bearing Excel

Research snapshot: 2026-10-25  
Purpose: document market/workflow evidence, technical constraints, provider price assumptions and research gaps. This is qualitative synthesis, not a statistically representative survey.

## Research scope

Research reviewed Indonesian RAB/Excel workflows, public tutorials and vendor pages, PDF-to-Excel converters, public BOQ/AHSP examples, wider estimating workflows and the public Reducto pricing material. Product claims are not relabelled as independent customer testimony. Search snippets are noted as weak when the full page could not be independently retrieved.

## Public workflow and market sources

1. **RunConvert — PDF to Excel FAQ** — https://www.runconvert.com/id/pdf-to-excel  
   States that PDF does not preserve active formulas in the same manner as an Excel workbook and conversion yields displayed values. Supports the formula-reconstruction boundary.

2. **Adobe Acrobat Indonesia — PDF to Excel** — https://www.adobe.com/id_id/acrobat/how-to/pdf-to-excel-xlsx-converter.html  
   Describes editable spreadsheet export/layout preservation and OCR for scans. Generic converter baseline, not specifically RAB-aware formula reconstruction.

3. **PDF4me Indonesia — PDF to Excel** — https://pdf4me.com/id/pdf-ke-excel/  
   Markets extraction of PDF tables into editable rows/columns and OCR. Generic conversion is not sufficient differentiation by itself.

4. **HiTekno — Cara Mudah Membuat RAB di Excel** — https://www.hitekno.com/internet/2025/11/02/122303/cara-mudah-membuat-rab-di-excel-cocok-untuk-proyek-bangunan-hingga-acara  
   Published 2025-11-02; describes common columns and formulas such as line amount and totals. Tutorial evidence, not a complaint survey.

5. **Public Facebook group result — easy/free RAB app request** — https://www.facebook.com/groups/SKETCHUPNUSANTARA/posts/1886173278717196/  
   Indexed snippet asks for a free, easy-to-learn RAB app; full post could not be independently retrieved. Treat as a weak directional signal, not a market-wide preference.

6. **Denahku for contractors** — https://denahku.com/untuk-kontraktor  
   Provider-stated positioning includes editable line items, company price book, Excel export and audit/version features.

7. **Bangun.com** — https://bangun.com/  
   Provider-stated service positions editable Excel and RAB review as part of its value proposition.

8. **Satu Data Sumbar — BOQ Bina Marga/AHSP workbook metadata** — https://data.sumbarprov.go.id/mn_MN/dataset/data-bill-of-quantity-bid-bina-marga-dinas-pupr-kota-sawahlunto/resource/2bc73802-bfd8-4c67-a332-213bfc2299e2  
   Example of distinct recap, BOQ and AHSP layers. Check license and reuse rights before using its data or file as a fixture.

9. **Jateng regional government — AHSP BMCK 2024 guidance** — https://data.jatengprov.go.id/dataset/cc7de1cd-d469-4cd8-b890-b76c015a60da/resource/da42b1d8-5f38-4d92-9c01-ad8ff6803f4c/download/pedoman-ahsp-bmck-2024-sign.pdf  
   Guidance cautions that applicability and cost should be adjusted to technical/local context. Do not assume a universal AHSP rate/logic.

10. **S-RAB** — https://www.sekowahyu.id/s-rab/  
    Provider/author describes spreadsheet-based data derived from official construction PDFs. Adjacent evidence of converting technical PDF data to editable sheets.

11. **Bluebeam — Takeoffs and Estimation** — https://www.bluebeam.com/workflows/takeoffs-and-estimation/  
    International vendor context on transfer errors/manual takeoff. Useful background only; drawing takeoff remains out of the MVP.

12. **US-Estimation — From Bid Package to Submitted Bid** — https://usestimation.com/process  
    General tender workflow context, not Indonesian legal guidance.

13. **Estimation QS — Tender Preparation and Documentation** — https://estimationqs.com/tender-preparation-and-documentation-3/  
    Describes editable Excel BOQ and tender prep practices in another context; do not apply jurisdiction-specific process as Indonesian regulation.

## Reducto cost source and selection

14. **Reducto official pricing** — https://reducto.ai/pricing  
    Public price card lists Deep Extract at **US$40 per 1,000 pages** for Standard list pricing, equivalent to US$0.04/page before retries, extra services or account-specific changes. Introductory/free usage is temporary and is not recurring unit economics. Do not assume a parsing batch discount applies to Deep Extract without confirmation for the exact endpoint and plan.

15. **Reducto Extract overview** — https://docs.reducto.ai/extract/overview  
    Official API overview for schema-based document extraction. The exact API and settings used by RabConverter must be verified at implementation time and pinned/tested.

16. **Reducto best practices** — https://docs.reducto.ai/extraction/best-practices-extract  
    Official extraction guidance to consult while defining schema and evaluation fixtures. Guidance is not a substitute for testing actual Indonesian PDFs.

### COGS planning calculation

At an illustrative planning FX rate of Rp18.050/USD, US$0.04/page is approximately Rp722/page. A provisional 20% retry cost factor gives approximately Rp866 per provider-submitted page; planning reserve is rounded to Rp900–Rp1.000 until actual logs are available. This FX rate and retry factor are assumptions, not live rates or measured performance. Free provider credits are excluded from recurring COGS. Non-billable pages, hosting, storage, gateway fees, taxes, operations and refunds are not included in this basic provider-cost estimate.

## Provider alternatives evaluated but not selected

LlamaExtract Agentic Plus and Pulse Ultra 2 were reviewed as higher-cost alternatives and are explicitly excluded from the initial runtime. They must not be added as automatic fallback providers. Keeping their evaluation here is research history only, not an implementation dependency. Any future provider change requires measured accuracy/cost/privacy comparison, a decision-log entry and updated acceptance tests.

## What the evidence supports

- Generic PDF-to-Excel providers already offer editable table conversion; conversion alone is not enough to differentiate.
- A PDF generally does not retain the active Excel formula graph.
- Common RABs use fields such as description, quantity, unit, unit price and amount; actual layouts vary.
- Formula value depends on correct recalculation and traceable source-vs-calculated comparison.
- RAB/AHSP prices, taxes and calculation logic vary by source and context.
- Available social evidence is too sparse to quantify prevalence, willingness-to-pay or time saved.
- Reducto list pricing provides a starting estimate, not RabConverter's measured COGS.

## Commercial implication

Initial planned customer price is Rp2.500 per billable page, with minimum top-up Rp50.000. A billable page is a distinct source page contributing usable RAB/BOQ content to a successfully generated XLSX, not every provider-submitted page. Full rules and limitations are in [pricing-and-billing.md](pricing-and-billing.md).

## Remaining gaps

- Collect 10–20 or more legally usable golden PDFs across contractor RAB, public BOQ, renovation and private project formats.
- Measure born-digital versus scanned distributions and field-level accuracy.
- Benchmark Reducto Deep Extract with representative layouts using permitted test data.
- Verify account-specific plan, privacy, retention, regions, DPA, exact usage metering and rate card.
- Select payment gateway after comparing QRIS support, fees, callbacks, reconciliation, refunds and operational reliability.
- Measure full variable cost per provider page and billable page before claiming margin or setting free limits.
- Validate customer expectations around workbook layout and whether a normalized workbook is sufficient.
