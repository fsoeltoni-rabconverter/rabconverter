# Contractor Workflow and Manual Re-entry Inventory — Indonesia

Status: public-source qualitative synthesis, reviewed 2026-10-25. This is not a representative survey or quantitative demand study.
Primary market: Indonesian contractors, subcontractors, estimators and project administration staff.

## Product anchor

Receive PDF RAB/BOQ → upload → automatic extraction/validation → exception-only decision if needed → download verified XLSX. RabConverter is not initially a tender CRM, drawing takeoff engine, price database or submission portal.

## Workflow from source to editable workbook

### A. Receive project documents

Documents may arrive via email, WhatsApp, procurement portals, shared drives, clients, consultants, QS teams or general contractors. PDFs may contain project identity, package/reference number, revision/addendum, work scope, BOQ/RAB lines, recap, tax/overhead assumptions or supporting specifications/drawings.

Capture project facts only as optional metadata. Do not expand MVP into opportunity tracking.

### B. Classify PDF

1. Born-digital PDF: selectable text/layout coordinates may be recoverable.
2. Scanned/image PDF: OCR and visual table interpretation are required.
3. Mixed PDF: individual pages may differ in extraction method.
4. Flattened spreadsheet printout: visible rows/columns may be clear, but the original workbook formulas, references, hidden sheets and named ranges are normally absent.

Explain expected fidelity. Scans/mixed PDFs remain limited until golden tests support an honest promise.

### C. Identify table semantics

Common fields are item code/number, work description, unit, quantity/volume, unit price, printed amount, section, subtotal/carry-forward, grand total, adjustment/recap fields and source page/region.

Common failure modes include wrapped descriptions, repeated headers/footers, page continuations, merged cells, Indonesian numeric formats, missing rates, ambiguous tax/overhead, OCR confusion and poor scan quality.

### D. Recreate a usable workbook

Manual work often includes retyping items, aligning columns, recreating headings/subtotals, rebuilding formulas, checking printed totals and copying data into client templates. A visually similar sheet is insufficient if values are images or formulas do not recalculate.

A useful output preserves source values, provides editable cells, reconstructs only supported arithmetic and makes uncertainty visible. The normal workflow should not force users to inspect every extracted row; review is targeted to exceptions that prevent a safe result.

### E. Use the result

Users may change quantities/rates, apply their own prices, split/remove items, recalculate totals or share the workbook with a QS/estimator/client. Template mapping, version comparison, price books, supplier quotations and AHSP analysis are later workflows.

## Verification checklist for contractors

- Printed item rows appear in source order.
- Codes, descriptions, units and numeric fields map to correct columns.
- Wrapped text does not shift into adjacent rows.
- Blank rates remain blank, not zero.
- Formulas recalculate when supported quantity/rates change.
- Printed amount, calculated amount, subtotal and total differences are visible.
- Carry-forward totals are not double-counted.
- Section headings, notes, exclusions, alternates and provisional sums remain distinguishable.
- Export is editable XLSX and passes the formula recalculation/error scan.
- Billable page count and charge reconcile with substantive records in the export.

## Evidence strength and product implications

| Observed signal | Strength / caveat | Product response |
|---|---|---|
| Generic converters market PDF-to-Excel around reducing manual re-entry. | Vendor marketing supports the job-to-be-done, not independent user testimony. | Upload-first extraction and editable cells. |
| PDF conversion behavior distinguishes printed values from active Excel formulas. | Strong technical constraint. | Reconstruct formulas, never claim formula recovery. |
| Indonesian RAB tutorials show quantity × unit price and SUM-style formulas. | Common workflow, not proof every RAB follows identical rules. | Only reconstruct when columns/section membership are clear. |
| A public Facebook search snippet asked for free/easy RAB software. | Weak signal; full post not accessible. | Minimize setup; do not infer market-wide willingness to pay. |
| Indonesian vendors promote editable Excel, price books and RAB review. | Provider positioning, not independently audited outcomes. | Usable workbook, provenance and mismatch warnings. |
| Government dataset metadata separates BOQ, recap and AHSP layers. | Example only; license must be checked before fixture reuse. | Treat related structures distinctly. |
| Regional AHSP guidance warns values may need local/technical adjustment. | Jurisdiction-specific, not universal. | Do not automatically apply rates/tax/overhead. |
| Drawing takeoff vendors describe professional measurement workflows. | Adjacent context outside MVP. | Do not imply drawing-based quantity takeoff. |

## Re-entry inventory

| Priority | Information | Required behavior |
|---|---|---|
| P0 | Code, description, unit, quantity | Preserve source order/raw value; normalize only when safe |
| P0 | Unit price and printed amount | Extract independently; missing rate stays null |
| P0 | Section/subtotal/total | Preserve hierarchy and avoid double counting |
| P0 | Quantity × rate formula | Generate only with clear mapping; label reconstructed |
| P0 | Source page/region and confidence | Trace rows/fields and expose uncertainty |
| P0 | Billable pages | Charge only substantive records retained in verified downloadable XLSX |
| P1 | Tax/overhead/profit/contingency | Preserve printed value; formula only with explicit logic |
| P1 | Local numeric convention | Record locale and warn when ambiguous |
| P1 | Document revision/identity | Preserve metadata; do not silently merge revisions |
| P2 | Client template mapping/AHSP analysis | Future features with separate tests/provenance |
| P3 | Tender portal submission | Out of MVP |

## Research limitations

Public posts are unevenly indexed, login-gated and prone to vendor promotion. Evidence is qualitative and sparse; it does not establish pain prevalence, market size, willingness to pay, accuracy or time saved.

## Pricing consequence

The commercial baseline is Rp2.500 per substantive billable page, with minimum top-up Rp50.000 (not a minimum job fee). The user sees the maximum estimate before processing and the actual per-page outcome after output. Full rules live in [pricing-and-billing.md](pricing-and-billing.md).
