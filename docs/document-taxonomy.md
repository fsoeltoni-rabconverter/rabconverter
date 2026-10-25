# Tender Document Taxonomy

Status: Draft

## Document classes

| Class | Examples | Main extraction targets | Typical caution |
|---|---|---|---|
| Opportunity / invitation | Email, tender notice, RFQ, portal export | Project, client, reference, due dates, submission instructions | Email threads contain old dates and quoted replies |
| BOQ / price schedule | XLSX, XLS, CSV, text PDF | Item code, description, unit, quantity, rates, amount, section totals | Merged cells, repeated headers, formulas and hidden rows |
| RAB / estimate | XLSX/PDF | Work breakdown, volume, unit rate, amount, recap | May already be priced; formulas and style carry meaning |
| AHSP/AHS | XLSX/PDF | Work-item analysis, material/labour/equipment resources, coefficients, rates | Context/edition/region matter; don't assume universal rates |
| Drawings | PDF/images, CAD exports | Sheet number/title/revision, schedules and references | Geometry takeoff requires separate measurement logic |
| Technical specifications | PDF/DOCX | Materials, work method, standards, approvals, testing and warranty requirements | Interpretation requires professional review |
| Addendum/clarification | PDF/DOCX/email | Revision ID/date, changed clauses/items, replacement pages | Must link to affected source revision |
| Supplier/subcontractor quote | PDF/email/XLSX | Vendor, validity, scope, exclusions, rates, tax/delivery | Quote scope often differs; don't compare totals blindly |
| Bid forms / proposal | DOCX/XLSX/PDF | Bidder identity, price, tax, validity, declaration fields | Exact required format and signatures are client-specific |
| Qualification documents | Company archive and tender forms | Company profile, licenses, tax, experience, insurance/bonds | Sensitive business data; only process when needed |
| Internal RAP / procurement schedules | XLSX/PDF | Cost baseline, procurement, labour/equipment needs | Downstream internal budget is not the same as submitted BOQ/RAB |

## Hierarchy of parsing strategies

1. Native workbook structure: preserve sheets, rows, formulas, merged cells, hidden rows/columns, named ranges and number formats.
2. CSV/table files: parse delimiters, locale-specific decimals and thousands separators.
3. Text-based PDF: extract words and table coordinates; maintain page and geometry references.
4. Scanned PDF/images: OCR plus layout/table interpretation, with stronger confidence warnings.
5. DOCX/email: parse text, tables and metadata.
6. CAD or drawing measurement: future, dedicated path. The initial product should register these files and preserve links without claiming measured quantities.

## Initial support decision

Do not declare final file support until an implementation is tested against golden files. Proposed initial target: XLSX and text-based PDF BOQ, with CSV as an interchange format. PDF scanned/image-only and XLS are either experimental or limited until verified. Reject unsupported or encrypted files with a useful explanation instead of pretending conversion succeeded.

## Confidence and exceptions

Flag:
- Missing unit or quantity.
- Ambiguous number parsing.
- Formula cell without safely evaluated result.
- Total row mistaken for a normal item.
- Similar/duplicate rows without strong evidence.
- Repeated page headers/footer mixed into rows.
- Conflicting document revisions.
- Cells containing multiple distinct values or multiline descriptions.
- Unknown unit, currency, locale or tax treatment.
- A subtotal mismatch after normalization.

Every warning should include a source location and a suggested user action.
