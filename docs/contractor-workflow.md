# Contractor Workflow and Manual Re-entry Inventory — Indonesia

Status: public-source qualitative synthesis, reviewed 2026-10-25. This is not a representative survey or quantitative demand study.  
Primary market: Indonesian contractors, subcontractors, estimators and project administration staff.

## Product anchor

Receive PDF RAB/BOQ → upload → extract/classify rows → inspect exceptions → rebuild safe formulas → download XLSX. RabConverter is not initially a tender CRM, drawing takeoff engine, price database or submission portal.

## Workflow from source to editable workbook

### A. Receive project documents

Documents may arrive through email, WhatsApp, procurement portals, shared drives, clients, consultants, QS teams or general contractors. The PDF may contain project identity, package/reference number, revision/addendum, work scope, BOQ/RAB lines, recap, tax/overhead assumptions, or supporting specifications/drawings.

Capture project facts only as optional metadata. Do not expand the MVP into opportunity tracking.

### B. Classify the PDF

1. Born-digital PDF: selectable text and layout coordinates may be recoverable.
2. Scanned/image PDF: OCR and visual table interpretation are required.
3. Mixed PDF: individual pages may differ in extraction method.
4. Flattened spreadsheet printout: rows/columns may appear clear, but the original workbook's formulas, references, hidden sheets and named ranges are normally absent.

Explain expected fidelity. Scans/mixed content stay experimental until golden tests support a reliable promise.

### C. Identify table semantics

Common fields are item code/number, work description, unit, quantity/volume, unit price, printed amount, section, subtotal/carry-forward, grand total, adjustment/re-cap fields and source page/region.

Common failure modes include wrapped descriptions, repeated headers/footers, page continuations, merged cells, Indonesian numeric formats, missing rates, ambiguous tax/overhead, OCR confusion and poor scan quality.

### D. Recreate a usable workbook

Manual work commonly includes retyping each item, aligning columns, recreating headings/subtotals, building formulas, checking printed totals, and copying data into client templates. A visually similar sheet is not sufficient if values are images or formulas never recalculate.

A good result preserves source values, gives users editable cells, rebuilds only supported arithmetic, and makes uncertainty visible.

### E. Use the result

Users may modify quantities or rates, apply their own prices, split or remove items, recalculate totals, or share the file with a QS/estimator/client. Template mapping, version comparison, price books, supplier quotations and AHSP analysis are later workflows, not first-release promises.

## Verification checklist for contractors

- Printed item rows are present and in source order.
- Codes, descriptions, units and numeric fields map to the correct columns.
- Wrapped text has not shifted into another row.
- Blank rates remain blank, rather than becoming zero.
- Formula recalculation works when quantity/rate changes.
- Printed amount, calculated amount, subtotal and total differences are visible.
- Repeated carry-forward totals are not double-counted.
- Section headings, notes, exclusions, alternates and provisional sums remain distinguishable.
- Export opens and remains editable in common spreadsheet software.
- Billable page count and charge reconcile with pages represented in the export.

## Evidence strength and product implications

| Observed signal | Strength / caveat | Product response |
|---|---|---|
| Generic converters market PDF-to-Excel around reducing manual re-entry. | Vendor marketing supports the job-to-be-done, not independent user testimony. | Upload-first table extraction and editable cells. |
| PDF conversion FAQ and technical behavior distinguish printed values from active Excel formulas. | Strong technical constraint. | Formula reconstruction, never claim formula recovery. |
| Indonesian Excel/RAB tutorials show quantity × unit price and SUM-style formulas. | Common workflow, not proof every RAB follows identical rules. | Reconstruct only when structure and section membership are clear. |
| A public Facebook search result asked for free, easy-to-learn RAB software. | Weak signal; the full post was not independently accessible. | Minimize setup; do not infer market-wide willingness to pay. |
| Indonesian RAB vendors promote editable Excel, per-item calculations and reviewability. | Provider positioning, not independently audited outcomes. | Working XLSX, provenance and visible mismatch warnings. |
| Government dataset metadata describes BOQ, price recap and AHSP layers. | Useful example; license must be checked before fixture reuse. | Treat BOQ/recap/AHSP as related but distinct structures. |
| Regional AHSP guidance warns values may need local/technical adjustment. | Jurisdiction-specific source, not a universal standard. | Do not automatically apply AHSP, rates, tax or overhead. |
| Drawing takeoff vendors describe professional measurement workflows. | Mostly vendor statements and outside core scope. | Do not imply drawing-based quantity takeoff. |

## Re-entry inventory

| Priority | Information | Required behavior |
|---|---|---|
| P0 | Code, description, unit, quantity | Preserve raw text/order; normalize only when safe |
| P0 | Unit price and printed amount | Extract independently; missing rate stays null |
| P0 | Section, subtotal, grand total | Classify, preserve hierarchy and avoid double counting |
| P0 | Quantity × rate formula | Generate only with confident mapping; mark reconstructed |
| P0 | Source page/region and confidence | Trace each field/row and show uncertainties |
| P0 | Billable source pages | Charge only pages that contribute retained usable RAB/BOQ data to a generated XLSX |
| P1 | Tax/overhead/profit/contingency | Preserve printed value; formula only with explicit logic |
| P1 | Local numeric convention | Record locale decision and warn when ambiguous |
| P1 | Document revision and identity | Preserve metadata; do not silently merge revisions |
| P2 | Client template mapping, AHSP analysis | Future features with separate tests and source provenance |
| P3 | Tender portal submission | Out of MVP |

## Research limitations

Public posts are unevenly indexed, login-gated and prone to vendor promotion. Available evidence is qualitative and sparse; it does not establish pain prevalence, market size, willingness to pay, accuracy levels or time saved.

## Pricing consequence

Price should be easy to predict and audit: Rp2.500 per billable page, minimum top-up Rp50.000. Users should see the page-count estimate before processing and the actual page-by-page billable outcome after the XLSX is available. The complete rules live in [pricing-and-billing.md](pricing-and-billing.md).
