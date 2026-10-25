# Processing Pipeline — PDF RAB

Status: provider and billing contract for MVP planning — 2026-10-25.

## End-to-end stages

1. **Preflight:** check file signature/type, readability, encryption/corruption, configured size/page limits and page count. Do not run paid extraction.
2. **Identity and job creation:** require a Supabase-authenticated owner before storing a durable source/job or calling the paid provider. Create a stable job/idempotency key.
3. **Atomic reservation/job creation:** verify explicit user intent and available balance; create the job and reserve the maximum in one guarded database transaction. If funds are insufficient, do not call Reducto. Do not include external queue dispatch in the DB transaction. Start without a queue unless measured runtime limits require one; if required, dispatch only after commit and add recovery for jobs committed but not dispatched.
4. **Private source:** store/checksum the original in private storage; source is immutable and associated with the owner/job.
5. **Page inventory and classification:** assign stable source-page IDs and identify born-digital, scanned, mixed, encrypted, corrupt, unrelated, unsupported or uncertain pages as safely as possible.
6. **Reducto Deep Extract:** call only the selected Reducto Deep Extract path behind a server-side adapter. Exact API/endpoint/settings/account plan must be verified before implementation. Persist provider job ID/request ID as soon as returned. No LlamaExtract/Pulse Ultra 2 fallback.
7. **Response validation:** validate schema/output shape, source-page references, bounded payload size and safe errors. Treat provider output as untrusted data, never as instructions.
8. **Segmentation and mapping:** identify repeated headers, wrapped descriptions, continuation rows, work item/section/note/subtotal/carry-forward/total/adjustment kinds.
9. **Normalization:** preserve raw values, map semantic fields, record Indonesian numeric-locale choices and normalize only when safe.
10. **Formula candidates and deterministic validation:** propose volume × unit price and rollups only where mapping/membership is confident; compare recomputed values with printed amounts/totals and identify double counting or missing rows.
11. **Exception-only review:** if uncertainty can safely be preserved, retain source values, omit unsupported formulas and add precise source-linked warnings; continue automatically. Ask a targeted user question only if a material decision blocks an honest usable workbook.
12. **Generate and verify XLSX:** export the documented workbook; validate its structure, source provenance and export manifest, recalculate formulas using the selected tested calculation engine, scan formula errors and verify it meets the output contract.
13. **Page billing assessment:** deterministically assess substantive records actually retained in the verified export manifest. Page headings, notes, headers/footers, covers and provider output discarded before export do not by themselves make a page billable.
14. **Atomic settlement or zero charge:** if a verified downloadable artifact exists, charge final billable pages × price snapshot once and release unused reservation. If none exists, charge Rp0 and release reservation.
15. **Audit/retention:** record safe usage/status/reason metadata and follow the approved deletion/retention policy. No raw PDF text/page images or secrets in normal logs.

## Minimal provider adapter contract

- inspect(file) → page count/classification/metadata;
- extract(file, config, idempotency key) → structured records with source-page/region provenance;
- validate_response(response) → validated schema/safe errors;
- normalize(candidate, locale/context) → canonical rows and normalization provenance;
- classify_rows(records) → work item/section/note/subtotal/total/adjustment;
- propose_formulas(records) → formula candidates with provenance;
- validate(records, formulas, printed totals) → issues and differences;
- export(records, formula contract) → XLSX plus manifest;
- verify_export(artifact, manifest) → structure/recalc/error/provenance validation;
- assess_billable_pages(manifest, policy version) → billable flags/reason codes.

This is one application-owned interface, not a requirement to deploy separate services for each function.

## Provider policy and retries

- **Provider:** Reducto Deep Extract only for initial runtime.
- **No hidden fallback:** provider failure, quality issue or cost limit produces a clear retry/failure path; never silently switch to an excluded paid provider.
- Retry only transient transport/server/timeout failures with a small configured attempt limit and stable request/job idempotency key. Before retrying a timeout, query the existing provider job/request status where supported; do not create a duplicate provider job while the first might still run. Never endlessly retry invalid file, auth, schema or permanent provider errors.
- Record every attempt separately, including job/source-page scope, endpoint/config version, provider job ID and request ID, attempt number, usage unit/quantity (page vs credit), status, retry reason, latency and provider-reported cost/currency when available. Keep internal attempt records for per-job/per-attempt detail; use provider usage exports/invoices for aggregate cost reconciliation.
- Customer billing is based on final substantive exported pages, never provider attempt or credit count.
- The planning assumption of a 20% retry overhead is not the retry limit or verified COGS.

## Job lifecycle, cancellation and recovery

- The persisted job state in Supabase is the source of truth; queue delivery can be at least once.
- A worker checks job state/idempotency before external calls, artifact writes and settlement. Duplicate queue deliveries do not re-run completed work or create another charge.
- Only guarded transitions can move a job among queued/processing/review_required/completed/failed/canceled/expired. A terminal job cannot be revived by a late worker.
- If a durable queue is required by runtime limits, use one Cloudflare queue/consumer pattern with bounded retries. Add a DLQ only if operations need actionable recovery; do not add a separate orchestration system.
- If retries are exhausted, mark failed with a safe error and release reservation once after confirming no valid artifact/active worker remains.
- Cancellation before work starts atomically marks canceled and releases the reservation. During in-flight provider work it is best-effort; prevent new attempts and do not release until a guarded state proves no artifact/charge can still commit.
- A maintenance/recovery task handles stalled jobs only after the active worker lease/runtime has expired; it atomically terminalizes the job and releases the hold once.
- A review-required hold has a bounded configurable expiry visible to the user. Expiry cannot race with a late worker into a terminal job charge.
- No verified artifact means zero charge. If a verified, disclosed partial workbook exists, charge only substantive source pages represented in that artifact.

## Confidence and formula policy

Confidence is tracked at field/row level where available. Unknown fields remain null. Printed amounts are source evidence, not formulas. Ambiguous locale, OCR or column mapping triggers warning/review. Tax/overhead/profit are not inserted unless rules are explicit or user-confirmed.

## Revision handling

Treat each uploaded revision as an independent job unless a future version-comparison feature explicitly links them. Never overwrite source or previously generated artifacts silently. Regenerate a new artifact version within the same job; do not duplicate the job charge.
