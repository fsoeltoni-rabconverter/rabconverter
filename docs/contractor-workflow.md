# Contractor Workflow and Manual Re-entry Inventory — Indonesia

Status: Research synthesis v2 (evidence quality and product focus updated 2026-10-25)  
Primary market: Indonesian contractors and estimators. This is a public-source synthesis, not a statistically representative survey.

## Product anchor

The focused workflow for RabConverter is: receive PDF RAB → upload → extract and classify rows → inspect exceptions → reconstruct safe Excel formulas → download XLSX.

The full tender process provides context, but RabConverter is not initially a tender CRM, drawing takeoff engine, price database or submission portal.

## End-to-end workflow

### A. Opportunity and documents arrive

The contractor receives an offer, RFQ, invitation, RAB/BOQ, drawing package or tender notice from a client, project owner, consultant, government procurement portal or general contractor.

Common places the data appears:
- Email, WhatsApp, procurement portal or shared drive.
- PDF tender package or RAB attachment.
- A separately supplied Excel BOQ, sometimes without rates.
- Prior company RAB/price workbook used as a starting point.

Project facts that may be copied into the working file:
- Client, project name and project location.
- Tender/package number and work scope.
- Received date, bid deadline, clarification deadline and site visit.
- Source document issue date, revision and addendum number.
- Contact person and requested submission format.

These are useful metadata but the first MVP should not expand into a general opportunity tracker.

### B. Determine what kind of PDF was received

This matters to product behavior:
1. Born-digital/text PDF: text can be selected/copied; table geometry may be recoverable.
2. Scanned/image PDF: page is an image; OCR and layout interpretation are needed.
3. Mixed PDF: some pages contain digital text and others are scans.
4. PDF containing a flattened spreadsheet printout: visual cell grid may be clear, but original Excel formulas, cell links, hidden sheets and workbook structure are normally absent.

The UI should identify the document class and explain the expected fidelity rather than making all files appear equally easy.

### C. Extract the RAB/BOQ structure

Likely table fields:
- Item number/code.
- Work-item description.
- Unit (e.g. m, m², m³, kg, unit, ls; retain source spelling).
- Quantity/volume.
- Unit price.
- Amount/total.
- Section/work group.
- Subtotal and carried total.
- Recap/tax/overhead/profit/contingency fields if printed.
- Source page, table region and detected row type.

Common difficult content:
- Multi-line descriptions, indented subitems and work breakdown codes.
- Section headings with blank numeric columns.
- Repeated page headers, footers and page numbers.
- Tables continuing over page breaks.
- Merged cells and rules drawn as lines rather than cell borders.
- Indonesian numeric conventions, including thousands separators and decimal commas.
- Currency symbols, unit symbols, apostrophes and superscripts.
- Rows with quantities but no unit price; blank amounts; dash or “nihil”.
- Printed subtotals, total carried forward, recap pages, tax and overhead lines.
- OCR confusion between 0/O, 1/I, 5/S, comma/period, 8/3, and unit abbreviations.
- Low-resolution, rotated, skewed or photocopied pages.

### D. Recreate a usable Excel sheet

This is the principal repeated-entry pain:
- Manually retype every line item into Excel.
- Align item codes, descriptions, units and quantities with the correct columns.
- Recreate section headings, numbering, borders and subtotal rows.
- Re-enter rate and amount data.
- Rebuild formula relationships so a changed quantity or price updates the amount.
- Re-create subtotal and final total formulas.
- Recalculate and compare the workbook total with the printed PDF.
- Move figures from the working sheet into the customer's prescribed workbook/template if needed.

A visually similar output is not enough if every cell is plain text or totals never update. Conversely, a formula-bearing workbook must not invent the source's hidden calculation logic.

### E. Price, adjust and use the result

After conversion, users may:
- Change quantities or rates.
- Reuse their company rates.
- Compare the source RAB with their own cost structure.
- Add, remove or split work items.
- Recalculate section totals and final totals.
- Copy structured rows into a client template.
- Share a working XLSX with a QS, estimator, client or colleague.

Later product opportunities include template mapping, quote comparisons, version differences, an internal price book and AHSP/AHS analysis. They are not part of the first conversion promise.

### F. Verify before relying on it

Contractors should be able to check:
- All printed item rows are present and in original order.
- The value in each column matches the PDF.
- Description wraps have not moved into neighboring rows.
- Units and numeric formats have not been silently changed.
- Formula-derived line totals equal the printed amounts or are flagged.
- Subtotals/grand totals reconcile under an explicit rule.
- Blank prices remain blank and are not mistaken for zero.
- Sections, exclusions, alternates and provisional sums remain distinguishable.
- The export is editable and opens/recalculates in common spreadsheet software.

## Pain points, observed signals and evidence strength

| Pain / desired outcome | Public evidence observed | Strength / caveat | Product response |
|---|---|---|---|
| Avoid typing and formatting PDF data into a spreadsheet | Adobe Acrobat and PDF4me market their PDF-to-Excel flow around reducing manual entry and rebuilding editable tables. | Strong evidence of the general job-to-be-done; vendor claims, not independent contractor testimony. | Upload-first conversion, editable table output. |
| Need formulas, not just printed numbers | RunConvert's PDF-to-Excel FAQ explicitly says PDFs do not contain active formulas, so converted files contain displayed values, not source formulas. Indonesian RAB Excel tutorials describe quantity × unit price, SUM, SUMIF, IF and lookup formulas as useful. | Technical fact plus tutorial evidence; not proof all users insist on formulas, but it directly matches the stated product requirement. | Reconstruct and label formulas, compare outputs to printed values. |
| Fast/easy, not a complex tool | Public Facebook group search result explicitly asks for an RAB app that is “free and easy to learn/use.” | Search snippet for a public post; full post was not independently available through the web reader, so treat as a weak directional signal only. | Minimal upload → result flow, no setup-heavy dashboard. |
| Editable deliverable rather than a static PDF or image | Indonesian RAB products/service pages promote Excel that remains editable and formula-bearing, including export and price breakdown. | Evidence of market expectation as expressed by providers, not proof of purchase/retention. | Download real XLSX with cells and formulas, not image or values-only sheet as default. |
| Need totals to update after changing a quantity/rate | Indonesian RAB education materials and Excel product pages show formulas for amount and recap; RAB products advertise automatic recalculation. | Supported by established spreadsheet workflow; qualitative, not quantified as a complaint. | Formula generation plus recalculation tests. |
| Numbers should be auditable and trusted | RAB services/products emphasize per-item calculations, review, source assumptions, versioning and traceability. | Mostly vendor positioning. Plausible high-consequence requirement because errors affect bids, but impact magnitude not quantified here. | Provenance, warning sheet, source-vs-calculated comparison and no silent correction. |
| Price and accessibility may matter | Public social post requests free/easy RAB software; low-friction PDF converters also advertise no-account conversion. | One public request and vendor positioning cannot establish willingness to pay or a target price. | Remove unnecessary onboarding; evaluate a generous free tier after measuring processing cost. |
| Multiple local templates / AHSP contexts exist | Government/open data from Satu Data Sumbar describes a Bina Marga BOQ workbook containing price recap, Daftar Kuantitas dan Harga and AHSP; Jateng's 2024 AHSP guidance says values need adjustment to local market/technical context. | Public dataset metadata and regional guidance; not a full survey of template variation. | Template-aware handling; never impose one formula/price/tax logic universally. |
| Drawing takeoff is expensive and error-sensitive | Specialist services and takeoff vendors describe manual volume measurement as time-consuming and use professional review. | Mostly vendor statements. Relevant to wider workflow but outside the first PDF-RAB conversion scope. | Defer drawing measurement; don't imply a PDF table converter measures drawings. |

## Re-entry inventory, ranked for RabConverter

| Priority | Information to reconstruct | Source | Required behavior |
|---|---|---|---|
| P0 | Code/number, description, unit, quantity | PDF RAB/BOQ | Exact extraction where readable; preserve raw text and row order |
| P0 | Unit price and printed amount | PDF RAB/BOQ | Extract independently; do not assume amount can replace a missing rate |
| P0 | Section/group and subtotal/total rows | PDF layout/text | Classify row type and preserve hierarchy |
| P0 | Formula for amount | Interpreted quantity/rate columns | Generate only if column semantics are confidently mapped; label as reconstructed |
| P0 | Section subtotals and grand total | PDF recap | Generate only with clear membership rules; reconcile with printed values |
| P0 | Page reference and extraction confidence | PDF | Retain source location, warning and confidence where available |
| P1 | Tax/overhead/profit/contingency | PDF recap or explicit confirmed setting | Recreate only when base and rate/order are clear; otherwise keep as source values and flag |
| P1 | Indonesian decimal/thousands convention | PDF text/layout | Detect and confirm when ambiguous |
| P1 | Source document identity/date/revision | Cover page/file metadata | Capture as metadata and warn on conflicting versions |
| P1 | Table-to-client workbook mapping | PDF plus known template | Later feature; require explicit supported template map |
| P2 | AHSP breakdown/resource coefficients | AHSP pages/workbook | Later feature, with edition/source/location provenance |
| P2 | Supplier quotations | PDF/email/XLSX | Separate workflow; quote coverage and validity must remain explicit |
| P3 | Submission to tender portal | Portal | Out of MVP |

## Market research limitation

Social media is unevenly indexed and public posts may be login-gated. In this pass, search surfaced one clear request for an easy/free RAB application and several product/tutorial sources, but not enough accessible independent contractor posts to quantify prevalence or rank complaints statistically. We therefore treat social signals as qualitative leads, not as a representative survey or a reason to invent demand metrics.

## Product wedge

“PDF RAB in, editable Excel with working formulas out.” Unlike a generic PDF converter, RabConverter should understand common Indonesian RAB columns and row types, create safe derived formulas, flag mismatches against the printed PDF, and keep uncertain values visible.

## Open validation questions

1. What percentage of user PDFs are born-digital vs scanned?
2. Do users most often upload contractor RAB, public tender BOQ, or consultant cost estimates?
3. Which first layouts are most common: Uraian/Volume/Satuan/Harga Satuan/Jumlah or more complex schedules?
4. Which recap formulas vary most by client or sector?
5. Does a good first XLSX need to resemble the PDF visually, or is a clean normalized workbook sufficient?
6. What page volume and acceptable turnaround will users expect in a no-account first conversion?
