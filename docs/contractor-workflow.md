# Contractor Workflow and Manual Re-entry Inventory

Status: Research synthesis / draft  
Primary market: Indonesia, with workflow patterns cross-checked against international construction estimating sources.

## End-to-end workflow

### A. Opportunity arrives
The contractor receives an invitation, referral, procurement notification, RFQ or tender link.

Facts captured or copied:
- Client/owner/general contractor and contact person.
- Project name, location, project/tender reference.
- Scope/trade/package and contract type.
- Date received, site visit/pre-bid meeting date, question deadline, bid deadline and timezone.
- Submission mechanism, required file formats, naming rules and copies/originals.
- Bid/no-bid status, estimator owner and internal due date.

These facts often live first in email/chat/portal, then in a bid tracker, calendar and job folder. RabConverter should extract a small subset into project metadata, but it is not initially a bid CRM.

### B. Package is collected
Likely files include:
- Invitation to bid / RFQ / tender notice.
- Unpriced BOQ / Daftar Kuantitas dan Harga / bill schedule, often XLSX or PDF.
- RAB or engineer's estimate where provided.
- Drawings (PDF, CAD exports or images).
- Technical specifications and general requirements.
- Addenda, revised drawings and clarification responses.
- Instructions to bidders, contract conditions, preambles and scope of work.
- Bid form, price schedule, proposal form and required declarations.
- Supplier/subcontractor quotations, wage/productivity assumptions, tax/insurance/bonding information.
- Qualification, company profile, past project, licensing, tax and other administrative attachments where required.

The exact package varies. Do not require every item as a prerequisite for parsing a simple BOQ.

### C. Register documents and establish revision
The user sorts files into folders or spreadsheet rows and confirms whether a new file supersedes an old one.

Data to record:
- Original filename, file type, size, upload time and checksum.
- Document title/type, issue date, revision/addendum number.
- Related project and source/version relation.
- Page/sheet count and parser status.
- Duplicate/similar file indicator.
- Potential conflict or missing file indicator.

Important risk: the estimator prices a superseded BOQ or misses an addendum. The app should flag rather than choose a conflicting version silently.

### D. Review scope and bid requirements
Estimator reads scope, drawings, specifications, finish/schedules, notes and bid instructions; identifies covered trades, exclusions, alternates, provisional sums, units, quality/installation requirements and compliance items.

Possible information currently retyped:
- Scope category / division / trade.
- Work item code and description.
- Specification references, drawing/sheet/detail.
- Included/excluded status, alternates/options, allowance/provisional status.
- Clarifications, assumptions and exceptions.
- Mandatory submission attachments and form fields.

The MVP can retain extracted text and source references; human review remains necessary for interpretation.

### E. Extract or measure quantities
There are two materially different paths:

**Path 1 — client provided BOQ/Daftar Kuantitas dan Harga**
The source already contains line items and sometimes quantities. This is the highest-value first path for eliminating retyping. Extract section structure, codes, descriptions, units, quantity, existing rates/amounts, formula information and row order. Keep blank cells blank.

**Path 2 — no usable BOQ; only drawings/specifications**
A quantity takeoff must be measured or reasoned from drawing geometry, schedules, details and construction rules. This is a separate and more difficult feature involving measurement calibration, geometry, assumptions and expert validation. Do not claim it is solved by extracting tables.

Potential manual work in either path:
- Copy descriptions and item codes from PDF or prior Excel.
- Type numbers/units into a preferred template.
- Split or combine rows to match the contractor's cost code structure.
- Repeat item data by floor, area, building, phase, type or material.
- Recalculate totals when quantities or drawings are revised.
- Trace every disputed quantity back to a drawing/specification.

### F. Apply rates and build up prices
For each BOQ item, the contractor applies company rates, AHSP/AHS breakdowns, supplier quotes, labour/productivity, equipment, waste and location/conditions.

Potential manual work:
- Map client item codes/descriptions to internal cost codes or an item library.
- Find/edit unit rates.
- Enter material, labour, equipment and subcontract cost components.
- Adjust transport/freight, tax, overhead, profit, contingency and risk as relevant.
- Copy supplier/subcontractor quotes into bid recaps.
- Separate base bid from alternate/options/provisional items.
- Maintain quote validity, supplier identity and inclusions/exclusions.

RabConverter's first release should not infer “correct market price” from description alone. Price suggestion/library integration is later scope; user-provided rates and explicit import are safer first.

### G. Reconcile, review and approve
Before submitting, estimator/manager checks:
- All sections/items present; no unintended omissions or duplicated rows.
- Codes, descriptions, units and quantities.
- Unit-price and amount calculations and rounding.
- Subtotals, carried totals and final recap.
- Tax, overhead, profit, allowances/provisional sums and alternates.
- Source revision/addenda and specification notes.
- Quote coverage, exclusions, clarifications, schedule assumptions and required attachments.
- Correct output template, project identity, due date and delivery channel.

RabConverter can automate mechanical checks and highlight differences, but must not approve a bid or alter an amount silently.

### H. Produce and submit the deliverable
Possible outputs:
- Priced BOQ/Daftar Kuantitas dan Harga.
- RAB with section totals and recap.
- Price proposal/quotation/letter of offer.
- Tender forms and supporting qualification attachments.
- Supplier/subcontractor quote recap (internal).
- An editable XLSX plus a PDF rendering when requested by the client.

Values may be copied from a working workbook into a client's “official” template or entered into a portal. The MVP should export clean spreadsheet data and, where feasible, map it back into a known template. Portal submission and legal signatures remain out of scope.

### I. Award, handoff and internal budget
If selected, the estimate may be handed to operations/procurement, converted into internal RAP, purchase schedules and cost control baselines. RAP is a related downstream artifact, not interchangeable with the tender BOQ or RAB. Defer this workflow until core import/export is reliable.

## Re-entry inventory, prioritized

| Priority | Data copied repeatedly | Typical origin | Typical destination | Candidate automation |
|---|---|---|---|---|
| P0 | Item code, description, unit, quantity | Client BOQ XLSX/PDF | Contractor RAB/estimate workbook | Parse, normalize and export |
| P0 | Unit rate, line amount, section subtotal | Existing cost sheet / priced BOQ | Contractor template | Preserve/import; validate arithmetic |
| P0 | Project name/reference/client/location/dates | Invitation, cover page, email | Job header, filename, output form | Candidate extraction + confirmation |
| P0 | Section hierarchy and line ordering | BOQ or tender template | Output workbook | Preserve hierarchy/order |
| P0 | Repeated header/footer and page breaks | PDF | Structured table | Detect and remove only with traceable rules |
| P1 | Addendum/revision and source-sheet/page | Tender package | Document register, QA report | Metadata comparison and warnings |
| P1 | Cost codes / AHSP codes / category | Client list or internal catalog | Estimate categories | Match candidates, require user confirmation |
| P1 | Alternates, provisional sums, inclusions/exclusions | Bid instructions/BOQ | Separate output sections and bid notes | Extract flags and source snippets |
| P1 | Formula and recap values | Spreadsheet | Recalculated workbook | Formula inspection, recalculation and reconciliation |
| P1 | Supplier/subcontract quotes | Emails/PDF/XLSX | Quote comparison spreadsheet | Later extraction flow; keep separate from BOQ MVP |
| P2 | Company profile, licenses, tax, project history | Company archive | Tender admin forms | Later reusable profile/fill workflow |
| P2 | Material/labour/equipment build-up | AHSP/AHS and internal rates | Unit-price analysis/RAB | Later cost library, versioned by source/context |
| P2 | Drawing quantities | Drawings/specifications/schedules | Takeoff and BOQ | Separate high-validation measurement product phase |
| P3 | Submission portal entry and signatures | Bid package | Client/portal | Out of MVP |

## Product wedge

The strongest first wedge is **document-to-spreadsheet conversion of a provided BOQ/RAB**, not an “AI that makes an accurate RAB from any plan.” It targets the exact repeated clerical task, is easier to validate, and can be demonstrated using source-vs-export comparisons.

## Open validation questions

1. Which source format should be the first golden path: Excel BOQ, text-based PDF BOQ, or both?
2. Which 1–3 common Indonesian template families need round-trip export first?
3. Do first users usually receive unpriced BOQ, a full PDF package, a screenshot/photo, or a mix?
4. Is preserving the client's original template more valuable than producing a clean normalized workbook?
5. Which AHSP edition/client-specific pricing fields frequently appear in the target workflow?

These questions can be resolved initially through public examples and document samples; no user interview is a prerequisite to writing down the workflow.
