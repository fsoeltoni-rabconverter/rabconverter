# RabConverter

**RabConverter helps Indonesian contractors stop retyping construction tender documents into RAB (Rencana Anggaran Biaya) spreadsheets.**

The initial product is a web application inspired by the focused upload → process → result experience of remove.bg. The reference is an interaction model, not a direction to copy its branding or visual identity.

## Product outcome

A contractor uploads the tender package they received. RabConverter extracts candidate BOQ/RAB line items and relevant project information, lets the contractor review and correct the extracted data, then exports a spreadsheet that is usable in the contractor's workflow.

The product must preserve source traceability and must never silently invent a quantity, price, unit, formula, or contractual requirement.

## Primary workflow

1. **Receive a job opportunity** — capture the client/project, tender reference, due date, submission channel and contact.
2. **Collect the package** — tender invitation, scope of work, drawings, specifications, addenda/revisions, unpriced BOQ/Daftar Kuantitas dan Harga, official pricing forms, contract conditions and supporting forms.
3. **Register and identify the documents** — classify files, preserve original files, record issue/revision, detect obvious duplicates and flag likely missing or superseded documents.
4. **Extract known structure** — obtain project facts and structured line items from machine-readable Excel/CSV/PDF first; OCR/layout parsing is a fallback for scanned or image-based sources.
5. **Normalize the BOQ/RAB** — map rows into canonical fields while retaining original text, order, section hierarchy, units, source file/sheet/page/coordinates and extraction confidence.
6. **Review exceptions** — contractor confirms uncertain fields, missing values, merged cells, subtotals, repeated headers, handwritten content, formulas and ambiguities.
7. **Price separately from extraction** — allow the contractor to enter/import their own unit rates or cost library. Do not fabricate current prices or treat an extracted amount as verified market price.
8. **Reconcile** — check quantity × unit price, row totals, subtotal/recap, taxes/overhead/profit where relevant, duplicate items, missing items and document revision mismatch. Show warnings; never silently alter source values.
9. **Export** — produce editable XLSX and optionally CSV, and support returning values into the client's original template when technically feasible.
10. **Submit externally** — contractor remains responsible for signing, upload/submission, commercial approval and meeting the deadline.

## Scope for the first release

- Upload supported tender documents.
- Extract tables and common project / BOQ fields.
- Provide a review-and-correct step.
- Export structured line items to XLSX/CSV.
- Preserve source-to-output traceability and confidence/warnings.
- Keep original and derived files associated with the processing job.
- Provide clear processing, failure, retry and deletion states.

Not in the first release: a full takeoff measurement engine from drawings, authoritative automatic AHSP interpretation, live material price promises, tender portal submission, bid/no-bid recommendations, procurement award or project execution management. These may be considered after extraction and export reliability is demonstrated.

## Canonical line-item fields (draft)

Required/primary: section code, item code, description, unit, quantity, unit price (nullable), amount (nullable), source document, source location, original row/order.

Optional context: project identifier, discipline/trade, scope/remarks, formula/text representation, tax/overhead/profit components, alternate/provisional status, inclusion/exclusion, extraction method, confidence, reviewer status and correction history.

Never conflate:
- **BOQ/Daftar Kuantitas dan Harga**: structured work items, unit, quantity and often rate/amount columns.
- **AHSP/AHS**: analysis/breakdown used to form a unit price from resources/coefficient rates under a chosen standard/context.
- **RAB**: cost plan/estimate derived from work quantities and unit prices, with applicable indirect costs and recapitulation.
- **RAP**: contractor's internal implementation budget; related but not the same as the tenderer's submitted BOQ/RAB.

Terminology and exact form structure vary by project, client, procurement regime and template. The uploaded source document remains the authority for the particular job.

## Initial architecture direction

- Web-first, hosted entirely in cloud; no required local development workflow.
- Source code and specs live in GitHub.
- GitHub Actions handles deterministic validation/tests and deployment orchestration.
- Cloudflare hosts the web experience and preview deployments.
- Supabase provides authentication, Postgres metadata and private storage where appropriate.
- Document processing must be selected after testing representative Indonesian files. Keep parsing behind a provider-independent interface and do not commit to an OCR/AI provider before measuring cost, fidelity, data handling and supported formats.
- Secrets belong only in GitHub Actions secrets or cloud secret stores, never in source control or client bundles.
- Use immutable originals, processing job IDs, idempotent retries and explicit retention/deletion behavior.

## Quality principles

1. Source fidelity is more important than a plausible-looking output.
2. Every extracted line should be traceable to the source.
3. Confidence and unresolved issues must be visible to users.
4. Original files are never overwritten by normalized data.
5. Recalculate formulas with validated logic; do not trust spreadsheet display text alone.
6. A valid export must preserve item ordering, section/subtotal structure and numeric precision.
7. Validate on real-world samples across XLSX, XLS, CSV, text PDFs and scanned PDFs.
8. Do not describe the app as “automatic” for fields that still require contractor review.

## Documentation sequence

See `docs/README.md` for the normative documentation index and approval order. Do not begin product implementation until the workflow, supported formats, canonical schema, failure cases and acceptance criteria are agreed.
