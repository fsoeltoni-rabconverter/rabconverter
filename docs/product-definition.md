# Product Definition

Status: baseline product v1.1 — 2026-10-25  
Product: RabConverter

## One-sentence promise

Upload a PDF RAB/BOQ and download an editable XLSX that preserves printed source values and includes safe, reconstructed formulas where the source structure supports them.

## Target user and job to be done

The initial market is Indonesian small/medium contractors, builders, subcontractors, estimators, quantity surveyors and project administration staff who receive PDF RAB/BOQ and need to reuse data for review, recalculating quantities/prices, building offers or transferring items to other templates.

When receiving RAB in PDF, the user does not want to retype every row. They want an editable Excel workbook with fields in the correct columns and formulas that work when supported quantities or rates change.

## Core experience

**Upload PDF → automatic processing → download XLSX.**

remove.bg is a reference for interaction simplicity only. The normal case should not require a full-document review, feature tour or dashboard. Automated validation and warnings run behind the scenes; the interface asks a focused question only if a material ambiguity prevents an honest usable result.

Basic preflight can happen before sign-in. Authentication is required before a durable owner-scoped source/job is stored or any paid provider call or wallet operation begins. The MVP has no guest wallet or guest paid processing.

## Product outcome

A verified output includes:
- truly editable cells, not a pasted image;
- working formulas for arithmetic that can be confidently reconstructed;
- source order and section hierarchy where detected;
- printed values separate from formula/recalculated results;
- source-page/region provenance, review status and actionable warnings;
- customer billing summary that matches final page assessments and ledger without exposing provider COGS.

## Formula reconstruction boundary

PDF usually preserves printed output, not the original Excel formula graph. Generated formulas must be called reconstructed/generated, never original recovered.

- Line amount = quantity × unit price only when field semantics are clear.
- Subtotal only when section membership is clear.
- Grand total only when recap inclusion/order is clear.
- Tax/overhead/profit/contingency only when base, rate, order and inclusion/exclusion rules are explicit or confirmed.
- If unclear, preserve printed source values, omit unsupported formulas and warn rather than guessing.

## Product principles

1. PDF-first: optimize PDF RAB/BOQ conversion before expanding input.
2. No silent invention: missing/ambiguous data remains unknown.
3. Editable result: workbook cells and formulas are real, not images/values-only when formulas are advertised.
4. Exception-driven review: normal cases continue automatically; ask only for a necessary material choice.
5. Traceable numbers: rows/fields link to source page/region when available.
6. Preserve structure: item, section, note, subtotal, total and continuation remain distinct.
7. Fast workflow: one main action, automatic work, clear result and download.
8. Commercial clarity: maximum estimate and balance before processing; actual billable pages and charge after output.
9. Safe financial state: atomic reservation/settlement, distinct job/payment states, idempotent callbacks/retries and bounded holds.
10. Cloud-only development: GitHub, GitHub Actions, Cloudflare and Supabase as needed.
11. Honest performance: no perfect-OCR, original-formula recovery or unverified COGS claims.

## MVP scope

1. Upload and preflight PDF RAB/BOQ.
2. Detect supported, text-based, scan, mixed, encrypted/corrupt and unrelated inputs within tested limits.
3. Extract tables/rows with source-page provenance.
4. Map common fields: code, description, unit, quantity/volume, unit price and printed amount.
5. Reconstruct safe formulas and label provenance.
6. Reconcile line amounts, subtotals and totals against printed values.
7. Show targeted warnings and request user decisions only where required.
8. Export and verify formula-bearing XLSX (RAB, Rekap when supported, Review_Warnings, Source_Info; optional Original_Values).
9. Assess substantive source pages retained in the verified export and charge only those pages.
10. Wallet top-up minimum Rp50.000; vendor remains unselected until evaluated.
11. Safe bounded retries, cancellation/timeout recovery, artifact versions and idempotent billing.

## Commercial baseline

- Retail price: Rp2.500 per billable page.
- Minimum top-up: Rp50.000, not a minimum job charge.
- Charge = final billable pages × job price snapshot.
- A page is billable only when a substantive, identifiable RAB/BOQ row or meaningful subtotal/recap record is retained in a verified downloadable XLSX with page provenance. Section heading only, note-only, header/footer-only, cover, blank, unrelated, drawing-only and discarded/failed output are non-billable.
- No verified downloadable XLSX means Rp0 and reservation release.
- Retries/provider calls are not customer charge units; provider COGS is measured separately.
- Pricing details live only in pricing-and-billing.md.

## Extraction provider boundary

Reducto Deep Extract is the single initial extraction provider. This does not mean the quality benchmark or customer-data privacy gate has passed. LlamaExtract and Pulse Ultra 2 are excluded from runtime/fallback. Before real customer documents: verify exact endpoint/settings, account pricing/usage unit, data retention/training, processing/storage region, DPA and deletion semantics.

## Non-goals

- Recover original workbook formulas, hidden sheets, named ranges, macros or formula graph from PDF.
- Quantity takeoff from architectural/structural drawings.
- Apply authoritative market prices/AHSP automatically.
- Invent taxes, overhead, profit, contingency or a universal rounding rule.
- Guarantee procurement-portal acceptance or pixel-perfect templates.
- Tender CRM, portal submission, signatures, PM, vendor quotes and template mapping in MVP.

## Success metrics

Measure with legally usable golden PDFs: field exactness, row-kind/order accuracy, formula correctness after recalculation, reconciliation error/warning precision, time to downloadable artifact, correction rate, provider usage per submitted page, retry rate, billable/non-billable ratio, actual COGS per billable page, job failures, payment failure/refund rates and ledger reconciliation.

Do not claim accuracy, time savings, willingness to pay or margin until measured.
