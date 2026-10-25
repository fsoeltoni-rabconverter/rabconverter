# Product Definition

Status: Draft v2 — grounded in public-market and workflow research  
Product: RabConverter

## One-sentence promise

Upload a PDF RAB and download an editable Excel workbook whose extracted values are traceable to the PDF and whose reconstructed calculations use working Excel formulas where the source structure supports them.

## Target user

Indonesian small and mid-sized contractors, builders, specialist subcontractors, estimators and administrative staff who receive a PDF RAB/BOQ from a client, quantity surveyor, consultant or another contractor, then need to reuse the data in Excel for reviewing, modifying, repricing or preparing a tender/quotation.

## Core job to be done

“When I receive a RAB/BOQ as PDF, I do not want to manually type every row into Excel. I want an editable workbook with the line items, units, quantities, prices, subtotals and totals in the right columns, and I want the arithmetic to work when I change a quantity or rate.”

## Product outcome

The user uploads a PDF, gets a preview and extraction status, reviews fields that are uncertain, and downloads an XLSX with:
- editable cells (not images embedded in a sheet);
- working, inspectable formulas for reconstructed calculations;
- section/subtotal structure preserved when detected;
- original extracted values distinguished from formula-derived values;
- source page/row provenance and a clear warning sheet when issues remain.

## Important honesty boundary: formula reconstruction

A PDF generally preserves the displayed output of a calculation, not the original Excel formula or references. Therefore, RabConverter cannot claim to recover the exact original formula from a PDF unless formula logic is separately present in the document.

The product will reconstruct common formulas, not falsely claim recovery:
- line amount = quantity × unit price, where the columns and semantics are confidently identified;
- subtotal = sum of the appropriate line amounts within a section, where section boundaries are clear;
- grand total = sum of accepted section subtotals or included amounts;
- optional tax/overhead/profit formulas only when the applicable base, rates and inclusion logic are identifiable and explicitly approved.

Every generated formula must be labelled as reconstructed/generated. Printed PDF amounts remain source evidence; they are compared with calculated results. Where formula logic is ambiguous, output the extracted value, flag the issue, and leave the ambiguous formula blank or require user confirmation.

## Product principles

- **PDF-first wedge:** first optimize conversion of a supplied PDF RAB/BOQ to a formula-bearing XLSX.
- **No silent invention:** unknown quantities, units, prices, formulas or rules remain unresolved rather than guessed.
- **Editable, not just pretty:** a valid export has real cell values and formulas, not an image or values-only dump.
- **Review before trust:** highlight uncertain OCR, column mapping, number formats and arithmetic mismatches.
- **Traceable numbers:** every extracted row and important field refers back to source page/region when available.
- **Preserve order and hierarchy:** do not flatten sections, notes, subtotals or totals into indistinguishable work items.
- **Fast, simple UX:** one primary upload action, clear progress, review only where needed, then download.
- **Cloud-only:** GitHub source of truth, GitHub Actions for checks/deployment, Cloudflare for web/preview, Supabase for user/job metadata and private storage where appropriate.
- **No overclaiming:** no promises of perfect OCR or authoritative RAB validation.

## MVP scope

1. Upload a PDF RAB/BOQ.
2. Detect whether PDF is text-based, scanned, mixed or unsupported.
3. Extract tables with rows/columns, page references, text confidence and likely row type (section, item, note, subtotal, total).
4. Map common RAB columns such as item/code, description, unit, quantity/volume, unit price, amount.
5. Reconstruct and label safe, common formulas.
6. Compare formula results with printed amounts and section/grand totals.
7. Provide inline review/edit for uncertain fields and formula mapping.
8. Export XLSX with formula-bearing item rows, sections, recap and exceptions/warning sheet.
9. Offer a values-only or CSV export only as a secondary option, clearly distinguished from formula-bearing XLSX.
10. Explain failure and allow safe retry without losing review edits.

## Non-goals for MVP

- Exact recovery of original Excel formulas, hidden sheets, named ranges, macros or reference graph from a PDF alone.
- Generating a technically correct quantity takeoff from architectural/structural drawings.
- Authoritative AHSP/AHS matching or automatic market pricing.
- Assuming a fixed tax rate, overhead, profit, contingency or rounding rule for every RAB.
- Guaranteed acceptance by a procurement portal or exact reproduction of every agency template.
- Tender submission, signing, full procurement, scheduling or project management.

## Competitive positioning

General PDF-to-Excel converters already offer editable spreadsheet conversion. RabConverter should differentiate around the RAB-specific layer: Indonesian construction column understanding, row hierarchy, formula reconstruction, comparison against printed totals, safe ambiguity handling and an export a contractor can continue editing.

## Success measures

- Field-level exactness of description, unit, quantity, rate and printed amount on golden PDFs.
- Correct distinction between item rows, section headers, notes and subtotal/total rows.
- Percentage of eligible line amounts with valid formulas and correct calculation results.
- Count and magnitude of formula-vs-printed-total mismatches caught.
- XLSX opens without corruption; formulas recalculate correctly in tested spreadsheet apps.
- Time to reviewed download and percent of rows corrected by users.
- Parser/OCR cost and processing time by pages/document class.

Do not claim productivity savings or accuracy percentages until measured on a representative sample.
