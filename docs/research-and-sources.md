# Research and Sources — PDF RAB to Formula-bearing Excel

Research snapshot: 2026-10-25  
Purpose: document qualitative workflow evidence, technical constraints, provider cost assumptions and research gaps. This is not a statistically representative survey or guaranteed pricing quote.

## Research scope and evidence quality

Research reviewed Indonesian RAB/Excel workflows, public tutorials and vendors, generic PDF-to-Excel services, BOQ/AHSP examples, wider estimating workflows and Reducto’s public pricing/documentation. Vendor claims are not relabelled as independent customer testimony. Search snippets are treated as weak when their full source could not be independently inspected.

## Public workflow and market sources

1. **RunConvert — PDF to Excel FAQ** — https://www.runconvert.com/id/pdf-to-excel  
   Describes the difference between values printed in PDF and active Excel formulas. Supports formula reconstruction rather than formula recovery.

2. **Adobe Acrobat Indonesia — PDF to Excel** — https://www.adobe.com/id_id/acrobat/how-to/pdf-to-excel-xlsx-converter.html  
   Describes editable spreadsheet export/layout preservation and OCR for scans. A generic converter baseline, not RAB-aware formula reconstruction.

3. **PDF4me Indonesia — PDF to Excel** — https://pdf4me.com/id/pdf-ke-excel/  
   Markets table extraction to editable rows/columns and OCR. Generic conversion alone is not the product differentiation.

4. **HiTekno — Cara Mudah Membuat RAB di Excel** — https://www.hitekno.com/internet/2025/11/02/122303/cara-mudah-membuat-rab-di-excel-cocok-untuk-proyek-bangunan-hingga-acara  
   Published 2025-11-02; describes common columns and formulas. Tutorial evidence, not a complaint or demand survey.

5. **Public Facebook group result — easy/free RAB app request** — https://www.facebook.com/groups/SKETCHUPNUSANTARA/posts/1886173278717196/  
   Indexed snippet asks for a free, easy-to-learn RAB app; full post could not be independently retrieved. Treat as a weak signal only.

6. **Denahku for contractors** — https://denahku.com/untuk-kontraktor  
   Vendor positioning includes editable line items, company price book, Excel export and audit/version features.

7. **Bangun.com** — https://bangun.com/  
   Vendor positioning includes editable Excel and RAB review.

8. **Satu Data Sumbar — BOQ Bina Marga/AHSP workbook metadata** — https://data.sumbarprov.go.id/mn_MN/dataset/data-bill-of-quantity-bid-bina-marga-dinas-pupr-kota-sawahlunto/resource/2bc73802-bfd8-4c67-a332-213bfc2299e2  
   Example of separate recap, BOQ and AHSP layers. Verify licensing before reusing data/fixtures.

9. **Jateng regional government — AHSP BMCK 2024 guidance** — https://data.jatengprov.go.id/dataset/cc7de1cd-d469-4cd8-b890-b76c015a60da/resource/da42b1d8-5f38-4d92-9c01-ad8ff6803f4c/download/pedoman-ahsp-bmck-2024-sign.pdf  
   Values may need technical/local adjustment. Do not assume universal rates or calculation logic.

10. **S-RAB** — https://www.sekowahyu.id/s-rab/  
    Adjacent vendor/author evidence of converting technical PDF data to editable sheets.

11. **Bluebeam — Takeoffs and Estimation** — https://www.bluebeam.com/workflows/takeoffs-and-estimation/  
    International context on manual takeoff workflows; drawing takeoff remains out of MVP.

12. **US-Estimation — From Bid Package to Submitted Bid** — https://usestimation.com/process  
    General workflow context, not Indonesian legal guidance.

13. **Estimation QS — Tender Preparation and Documentation** — https://estimationqs.com/tender-preparation-and-documentation-3/  
    General workflow context from another jurisdiction; do not apply jurisdiction-specific practices as Indonesian rules.

## Reducto cost, metering and privacy

14. **Reducto official pricing** — https://reducto.ai/pricing  
    The public Standard list price currently lists Deep Extract at US$40 per 1,000 pages (US$0.04/page). The page also identifies a possible per-field surcharge for extraction above 100 fields/page, and says free usage/credits are introductory rather than recurring unit economics. This is a public list price, not a quote for the RabConverter account.

15. **Reducto official credit usage** — https://docs.reducto.ai/reference/credit-usage  
    Verify the unit billed for the selected endpoint/account (pages vs credits and any endpoint-specific multiplier); do not infer units from the price-card label alone.

16. **Reducto Usage Export API** — https://docs.reducto.ai/reference/usage-export-api  
    Use provider usage exports/invoices to reconcile aggregate usage and spend; do not assume the export provides per-job or per-attempt attribution. RabConverter's own redacted attempt records must provide job/page, endpoint/config, provider job/request ID, attempt, usage unit/quantity, status, retry cause and latency. Verify exact API fields and granularity during implementation.

17. **Reducto Extract overview** — https://docs.reducto.ai/extract/overview  
    Schema-based extraction API overview. Pin and test the exact API/settings used by RabConverter at implementation time.

18. **Reducto extraction best practices** — https://docs.reducto.ai/extraction/best-practices-extract  
    Guidance for schema/evaluation design; not a substitute for tests on representative Indonesian PDFs.

The Reducto public pricing page presents zero-data-retention agreement and EU/AU residency as higher-tier features. Do not assume the Standard account has these terms. Verify the actual account plan, endpoint, privacy/retention/DPA and usage contract before sending customer documents.

### COGS planning calculation — not measured COGS

At an illustrative planning FX rate of Rp18.050/USD, US$0.04/page is approximately Rp722 per provider-processed page. A provisional 20% retry factor gives approximately Rp866/page; use Rp900–Rp1.000 as a planning reserve only until actual account usage/invoices validate the distribution.

This does not account for any per-field surcharge, account-specific pricing, non-billable page spend, hosting/storage/compute, gateway fees, taxes, operations or refunds. Treat Rp900–Rp1.000 only as a provisional provider-cost reserve, not a measured cost, contribution, margin or profit. Do not publish a per-page contribution estimate from these assumptions. Never use free credits as recurring COGS reduction.

Record for every provider attempt: job/page, endpoint/config, usage unit and quantity, request ID, status/retry cause, latency, reported cost/currency when available, customer billable outcome and artifact reference. Provider spend on non-billable pages remains company COGS.

## Provider alternatives evaluated but not selected

LlamaExtract Agentic Plus and Pulse Ultra 2 were evaluated as alternatives and are excluded from initial runtime/fallback. Evaluation history does not make them dependencies. Future provider change requires measured accuracy/cost/privacy comparison, a decision-log entry and updated acceptance tests.

## What the evidence supports

- Generic PDF-to-Excel services already market editable table conversion; conversion alone is not sufficient differentiation.
- PDF normally does not retain the active Excel formula graph.
- Common RAB uses description, quantity, unit, unit price and amount, but layouts vary.
- Formula usefulness depends on recalculation and traceable source-vs-calculated comparison.
- RAB/AHSP prices, taxes and calculation logic vary by source/context.
- Public social evidence is too sparse to quantify prevalence, willingness to pay or time saved.
- Reducto list pricing provides a planning starting point, not account-measured COGS.

## Commercial implication

Initial planned customer price is Rp2.500 per substantive billable page, minimum top-up Rp50.000. A page must contribute an actual, identifiable RAB/BOQ record retained in the verified XLSX; a title/section heading, note, header or footer alone is non-billable. The full contract is in [pricing-and-billing.md](pricing-and-billing.md).

## Remaining gaps

- Collect 10–20 or more legally usable golden PDFs across contractor RAB, public BOQ, renovation and private project layouts.
- Measure born-digital vs scanned distributions and field-level accuracy.
- Benchmark Reducto using representative permitted files; record formula/reconciliation and page-billability outcomes.
- Verify account-specific Reducto plan, privacy/retention/region/DPA, exact usage unit, endpoint, surcharge and usage export.
- Select a payment gateway after evaluating QRIS support, fees, webhook verification, reconciliation, refunds and reliability.
- Measure full variable cost per provider-submitted page and billable page before claiming profit or adding usage limits.
- Validate whether users need normalized workbook or template-matched output after core loop works.
