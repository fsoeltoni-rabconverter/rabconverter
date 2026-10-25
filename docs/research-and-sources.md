# Research and Sources

Research started: 2026-10-25  
Goal: understand the contractor workflow from receiving an opportunity through producing a priced RAB/BOQ, identify information retyped between documents, and define RabConverter's narrow first product.

## Sources reviewed

### 1. Bluebeam — Takeoffs and Estimation
https://www.bluebeam.com/workflows/takeoffs-and-estimation/

Primary vendor workflow source. Describes PDF plan measurement, custom metadata columns, Excel export, live-linked quantity updates, avoiding manual data entry and stale quantities. It supports the broad claim that moving quantities manually between takeoff and estimate sheets is a recognized workflow pain. Its product benefit claims are vendor claims, not independent benchmarks.

### 2. US-Estimation — From Bid Package to Submitted Bid
https://usestimation.com/process

Describes a 15-step sequence: receive bid package (drawings/specs/addenda/forms/scope), organize and compare revisions, prepare scope checklist, take off quantities, cross-check specs, price materials/labour/equipment/subcontractors, apply indirect cost/margin, obtain quotes, clarify exclusions, review addenda, internal QA and submit via portal/email/spreadsheet. This is a service-provider description and not a universal standard.

### 3. Estimation QS — Tender Preparation and Documentation
https://estimationqs.com/tender-preparation-and-documentation-3/

Describes tender forms, unpriced BOQ, drawings, specification schedules and contract/preambles; recommends using an editable Excel BOQ to price, check/proofread and then transfer prices to official tender forms. This directly supports a repeated-entry/format-transfer use case. It also discusses company data and prior project experience in tender forms. Terminology and legal details in the example are jurisdiction-specific and should not be assumed to describe Indonesian procurement rules.

### 4. ConstructConnect — Tracking Multiple Construction Bids
https://www.constructconnect.com/blog/how-to-track-multiple-construction-bids-without-losing-your-mind

Published 2026-04-24. Describes bid opportunities, scattered emails/shared drives/spreadsheets, document revision and addenda tracking, deadlines, ownership and communication history. Useful for project metadata/document-control design, but RabConverter should not expand into full bid management in the MVP.

### 5. Rencanakan.id — RAB Online
https://rencanakan.id/

Indonesian market reference. The public site describes creating projects, customizing RAB/AHS templates, and exporting RAB to Excel; it states the templates are aligned with PUPR standards. Its public marketing claims (including productivity metrics) are not independently verified. It demonstrates adjacent competition in RAB authoring/export, so RabConverter should differentiate through conversion of the *documents contractors already receive*, traceable extraction, revision handling and source-template reuse rather than only offering a blank RAB calculator.

### 6. Supabase — Storage Access Control
https://supabase.com/docs/guides/storage/security/access-control

Official documentation states that Storage access is controlled through PostgreSQL RLS policies and that uploads are denied by default without policies. Relevant to private tender files. This is an implementation reference, not a statement about the current project's configured policies.

### 7. Cloudflare — GitHub Integration / Preview Deployments
https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/
https://developers.cloudflare.com/pages/configuration/preview-deployments/
https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/

Official documentation describes push-triggered deployments, PR preview URLs and GitHub Actions via Wrangler for Pages uploads. RabConverter will choose one deployment mechanism and avoid overlapping deployment triggers.

## Synthesis

The first high-confidence automation target is a provided BOQ/Daftar Kuantitas dan Harga in XLSX/PDF. These files already hold the structure the user needs to reproduce. The product should extract, normalize, check and export without requiring the contractor to manually retype every item. Drawing-based takeoff is a separate capability and should not be implied by document parsing alone.

## Limitations / evidence gaps

- This is public-web workflow research, not a measured time-and-motion study.
- The international workflow pages are illustrative and not authoritative Indonesian procurement guidance.
- No public universal Indonesian template was found that fits all agencies, private owners, project classes and years.
- The next research pass should inspect representative public Indonesian tender documents and actual non-confidential BOQ samples, including PDFs and spreadsheets, before locking the golden test suite.
- Product claims about expected time savings must wait for measured results.
