# Processing Pipeline — PDF RAB

Status: provider and billing contract for MVP planning — 2026-10-25.

## End-to-end stages

1. **Ingress:** authorize user, validate request/file, create idempotent job/source metadata, checksum and store original privately.
2. **Page inventory:** count PDF pages, enforce product caps and create source-page identity before extraction.
3. **Classification:** identify born-digital, scanned, mixed, encrypted, corrupt, unrelated or unsupported pages to the extent possible.
4. **Reducto Deep Extract:** call the selected Reducto Deep Extract path behind a server-side provider adapter. Validate exact API/endpoint/settings and plan before implementation. This is the only external extraction provider in the initial MVP.
5. **Response validation:** validate schema/output shape, source-page/citation references, bounded payload size and safe errors. Never treat model/provider output as instructions.
6. **Table segmentation and mapping:** identify rows, columns, repeated headers, wrapped descriptions, continuation rows, item/section/note/subtotal/carry-forward/total/adjustment types.
7. **Normalization:** preserve raw values, map semantic fields, record Indonesian number-locale choices and normalize only when safe.
8. **Formula candidates:** propose amount = quantity × rate and rollups only for confidently mapped rows/sections; mark each as reconstructed.
9. **Deterministic validation:** compare formula output against printed amount/subtotal/grand total; detect double counting, missing rows and ambiguous values.
10. **Human review:** display uncertain fields, source location, differences and correction path.
11. **Export:** generate a valid XLSX with formula-bearing RAB, eligible Rekap, Review_Warnings, Source_Info and optional Original_Values. Validate artifact existence and workbook contract.
12. **Page billing assessment:** classify each source page deterministically using retained usable RAB/BOQ records in the actual export. Store billable flag and reason. Do not use provider response alone to decide billing.
13. **Atomic settlement:** if a downloadable XLSX exists, finalize exactly one charge from final billable-page count and the job's price snapshot; release unused reservation. If no artifact exists, charge zero and release reservation.
14. **Audit/retention:** persist run and usage metadata without raw content in logs; follow approved deletion/retention behavior.

## Provider adapter contract

The application-owned interface should conceptually support:
- inspect(file) → page count/classification/metadata;
- extract(file, config, idempotency key) → structured records with source page/region references;
- validate_response(response) → validated schema and safe errors;
- normalize(candidate, locale/context) → canonical rows plus normalization provenance;
- classify_rows(records) → item/section/note/subtotal/total/adjustment;
- propose_formulas(records, confirmed mapping) → formula candidates with provenance;
- validate(records, formulas, printed totals) → issues and deltas;
- assess_billable_pages(records, export manifest) → billable flags/reason codes;
- export(approved records, formula contract) → XLSX artifact.

The interface is replaceable architecturally, but the initial deployment must not silently substitute providers.

## Provider policy and retries

- **Provider:** Reducto Deep Extract only.
- **Excluded:** LlamaExtract and Pulse Ultra 2 are not runtime dependencies and not fallback providers.
- **No hidden fallback:** if Reducto fails or its cost/quality limits are reached, fail clearly or ask for user action; do not switch provider automatically.
- **Retry:** bounded, only for classified transient network/server/timeout errors; use request/job idempotency; maximum retry policy is configurable and observable. Do not repeatedly retry invalid files, schema errors, authentication failures or permanent provider rejections.
- **Meter every attempt:** provider page/credit usage, endpoint, request ID, retries, status, latency and estimated/reported cost.
- **Customer charge:** based only on final billable source pages in a delivered XLSX, never number of provider calls or attempts.
- The assumed 20% retry overhead in planning is a modeling assumption to check against logs, not the prescribed retry count and not a guarantee.

## Reliability and errors

- Every job/run has durable IDs and versioned configuration.
- Idempotent retries must not duplicate exports or charges.
- A failed stage produces a stable error code and safe diagnostic summary.
- Partial results can be exported only if product marks the result as completed-with-warnings and discloses limitations; charge only pages represented by the usable delivered artifact.
- Export failure means no deliverable and zero customer page charge.
- File processing is resource-limited and uses durable background jobs where request duration/size demands it.
- Do not execute embedded content or expose untrusted content as trusted UI markup.

## Confidence and formula policy

Confidence is at field/row level. Unknown fields remain null. Printed amounts are source evidence, not formulas. Ambiguous locale, OCR or column mapping triggers review. Tax/overhead/profit are not inserted unless calculation structure is explicit/confirmed.

## Revision handling

Treat every uploaded revision as an independent source document/job unless a future version-comparison feature explicitly links them. Never overwrite previously confirmed data silently.
