# Decision Log

This log records decisions that affect product behavior, data contracts, cost and infrastructure. The status describes whether the decision is approved for the MVP baseline, not whether it has already been implemented.

## DEC-001 — Formula-bearing XLSX from PDF RAB is the MVP

- Status: Approved
- Date: 2026-10-25
- Decision: Focus the MVP on PDF RAB/BOQ extraction, row review, safe formula reconstruction, comparison to printed values and XLSX download.
- Constraint: A PDF normally does not preserve the original workbook formula graph. Generated formulas must be labelled reconstructed.
- Consequence: Drawing takeoff, authoritative market pricing, portal submission and exact workbook recovery are out of scope.
- References: product-definition.md, contractor-workflow.md, export-specification.md.

## DEC-002 — Use remove.bg only as an interaction-simplicity reference

- Status: Approved
- Date: 2026-10-25
- Decision: Use the focused upload → process → review as needed → download loop; do not copy brand assets or claim affiliation.
- Consequence: Conversion is the primary loop; complex dashboards are deferred.

## DEC-003 — Cloud-only development workflow

- Status: Approved
- Date: 2026-10-25
- Decision: GitHub is the source of truth, GitHub Actions runs CI, Cloudflare is the intended app/preview host, and Supabase is the intended data/auth/private-storage platform where needed.
- Consequence: Previews must be real and inspectable before release; this architecture is not evidence of an existing deployment.

## DEC-004 — Reconstructed formulas must be traceable

- Status: Approved
- Date: 2026-10-25
- Decision: Preserve printed amounts separately from formula/results, label provenance, and flag mismatches instead of silently replacing source values.
- Consequence: Formula correctness, recalculation and reconciliation are release-blocking tests.

## DEC-005 — Reducto Deep Extract is the sole initial extraction provider

- Status: Approved for MVP planning; production data gate remains open
- Date: 2026-10-25
- Decision: Use Reducto Deep Extract behind a server-side adapter as the only initial provider. Do not integrate LlamaExtract or Pulse Ultra 2 and do not use either as an automatic fallback.
- Context: Public list price is shown as US$40 per 1,000 pages. Provider quality, account-specific cost and privacy terms must still be verified before launch.
- Consequence: Provider failure produces a clear failure/retry path; no hidden switch to another paid provider. Record each provider attempt and actual usage/cost.
- Gate: Validate account endpoint/API settings, data retention/training, region, DPA, latency, retry and rate card before processing customer documents.
- References: processing-pipeline.md, security-and-data-handling.md, research-and-sources.md.

## DEC-006 — Initial retail price and minimum top-up

- Status: Approved commercial baseline for MVP planning
- Date: 2026-10-25
- Decision: Charge Rp2.500 per billable page; minimum top-up is Rp50.000; currency is IDR.
- Consequence: Estimate/max price appears before processing; final charge is based on page assessment after an XLSX is generated.
- Non-goal: Do not treat list COGS, free credits or a planning FX assumption as verified profit.
- References: pricing-and-billing.md, user-experience.md, acceptance-criteria.md.

## DEC-007 — Billable page and no-charge failure rule

- Status: Approved commercial baseline for MVP planning
- Date: 2026-10-25
- Decision: A page is billable only when it contributes meaningful identifiable RAB/BOQ content retained in a successfully generated XLSX. Blank, cover-only, unrelated, drawing-only, duplicate-with-no-new-content and failed/no-usable-data pages are not billable.
- Decision: If no XLSX deliverable is produced, charge zero and release any reservation. Retries do not create extra customer charges.
- Consequence: Provider usage and customer billable pages must be measured separately.
- References: pricing-and-billing.md, document-taxonomy.md, canonical-data-model.md.

## DEC-008 — Payment gateway remains unselected; QRIS preferred for evaluation

- Status: Pending provider selection
- Date: 2026-10-25
- Decision: Do not describe a gateway as integrated. Select one after checking QRIS support, transaction fees, verified webhooks/callbacks, idempotency, expiry, settlement, refund and reconciliation.
- Consequence: Payment integration and production top-ups are blocked until vendor/contract and callback behavior are verified.
- References: pricing-and-billing.md, security-and-data-handling.md, acceptance-criteria.md.

## DEC-009 — Documentation-only state must be reported accurately

- Status: Approved
- Date: 2026-10-25
- Decision: The repository contains documentation but no verified RabConverter application preview. The connected Cloudflare account had no Worker scripts/Pages projects, and the active Supabase project's public schema had no tables at inspection.
- Consequence: Do not state that app, provider, billing or payment API is live until code and deployment are inspected.
- References: architecture.md, root README.md.
