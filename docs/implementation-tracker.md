# RabConverter Implementation Tracker

Last reviewed: 2026-10-26  
Overall status: **P0 partially complete; implementation work is still not verified beyond the documented fixture/gate work.**  
Source of detail: the linked GitHub Issues. This file is the project-level snapshot, not a claim that a task is complete.

## Status definitions

- **Not started** — no implementation/evidence work has been verified.
- **In progress** — someone has begun the work; issue and PR should be linked.
- **Blocked** — a named dependency or decision prevents progress; record the blocker and required action.
- **Done** — acceptance criteria passed and evidence is linked. A merged PR alone is not enough.
- **Deferred** — consciously moved out of MVP scope, with rationale recorded.

Update this file when a work package changes state, its dependency changes, or its exit evidence is accepted. Keep detailed discussion, checklists, reviews, and PR links in the associated issue.

## Project snapshot

| Area | State | Evidence / note |
|---|---|---|
| Product and architecture specifications | Documented | Existing product, flow, billing, data-model, processing, export, security, and acceptance docs are the authority for their domains. |
| Repository application code | Not verified / baseline documentation-only | No application tree was verified in the 2026-10-25 repository review. |
| CI and preview deployment | Not verified | Must be demonstrated with a clean checkout, successful CI, a real preview URL, and commit SHA. |
| Supabase implementation | Not verified | Prior baseline said no tables existed in the inspected public schema. Recheck before implementation/migrations. |
| Golden PDF fixture corpus | Done | Four synthetic PDFs, four expected-output oracles, fixture README, and benchmark protocol added; PDFs validated locally with `pdfinfo`. Issue #4 closed as completed. |
| Reducto account/privacy/cost gate | Blocked | Public evidence researched; account-specific plan, retention, residency, DPA/contract, data-use and API/webhook settings still require verification. No customer PDFs may be sent. |
| XLSX calculation engine and worker placement | Not started | Cloudflare Worker vs container must be selected through benchmark evidence. |
| Wallet, billing, and payment | Not started | Payment vendor remains unselected; QRIS is the preferred method to evaluate. |

## Work-package tracker

| ID | Phase | Work package | State | Issue | Dependencies / exit evidence |
|---|---|---|---|---|---|
| RC-01 | P0 | Legal golden PDFs and benchmark protocol | **Done** | [#4](https://github.com/fsoeltoni-rabconverter/rabconverter/issues/4) | Synthetic repository-owned fixtures, versioned expected results, hashes, deterministic benchmark protocol, no customer documents. |
| RC-02 | P0 | Reducto account, privacy, usage and cost gate | **Blocked** | [#5](https://github.com/fsoeltoni-rabconverter/rabconverter/issues/5) | Public gate evidence recorded; account-specific terms/settings and an authorized account test remain required for Go. |
| RC-03 | P1 | App skeleton, deterministic CI and Cloudflare preview | Not started | [#6](https://github.com/fsoeltoni-rabconverter/rabconverter/issues/6) | Clean install/lint/typecheck/test/build, PR CI, verifiable preview URL + commit SHA. |
| RC-04 | P1 | XLSX engine and conversion-worker benchmark | Not started | [#7](https://github.com/fsoeltoni-rabconverter/rabconverter/issues/7) | Measured runtime/CPU/memory/size/failure behavior; evidence-based Worker-only vs container choice; queue decision. |
| RC-05 | P2 | Supabase auth, owner-scoped jobs, private files | Not started | [#8](https://github.com/fsoeltoni-rabconverter/rabconverter/issues/8) | Reviewed migrations, RLS/least privilege, idempotent jobs, private storage and cross-user tests. |
| RC-06 | P3 | Reducto adapter and recoverable processing lifecycle | Not started | [#9](https://github.com/fsoeltoni-rabconverter/rabconverter/issues/9) | Server-only adapter, persisted provider IDs, status-before-retry, attempt-level usage records, deterministic tests. |
| RC-07 | P4 | Normalization, provenance and safe formula reconstruction | Not started | [#10](https://github.com/fsoeltoni-rabconverter/rabconverter/issues/10) | Golden tests; source values separated from reconstructed formulas; unknowns are not invented. |
| RC-08 | P4 | XLSX generation, recalculation and artifact verification | Not started | [#11](https://github.com/fsoeltoni-rabconverter/rabconverter/issues/11) | Formula/error/total/provenance checks; immutable export versions; only verified artifacts are download-ready. |
| RC-09 | P5 | Wallet ledger, page assessment and idempotent settlement | Not started | [#12](https://github.com/fsoeltoni-rabconverter/rabconverter/issues/12) | Atomic reservation/charge/release, one job charge maximum, no verified artifact = Rp0, ledger evidence. |
| RC-10 | P5 | Payment gateway selection and QRIS integration | Not started | [#13](https://github.com/fsoeltoni-rabconverter/rabconverter/issues/13) | Vendor decision and webhook/settlement/refund/reconciliation evidence; verified payment credit exactly once. |
| RC-11 | P6 | End-to-end reliability, privacy and release gate | Not started | [#14](https://github.com/fsoeltoni-rabconverter/rabconverter/issues/14) | Golden + fault tests, runtime/usage reconciliation, release evidence and rollback path. |

## Current blockers / open decisions

1. **Application baseline is absent or unverified.** Build the smallest runnable app and CI before implementing the full pipeline.
2. **Worker placement is not locked.** Benchmark first. Cloudflare stays the preferred web/API entry point; the conversion stage can move behind the worker contract to a container if calculation engine, memory, or runtime requirements justify it.
3. **Queue is not selected.** Start without one; if one is justified, require database commit before dispatch, recovery for undispatched jobs, at-least-once/idempotent consumer behavior, and no second source of truth.
4. **Reducto gate is blocked on account-specific evidence.** Public docs are insufficient to approve real customer documents. Verify the actual plan, retention, residency, DPA/contract, data-use terms, API keys, webhook signing and usage reconciliation.
5. **Payment vendor is not selected.** Evaluate QRIS and settlement/webhook/refund behavior before implementation.

## Next actions

- Resolve the account-specific Reducto gate in RC-02 when account access/evidence is available.
- Build the minimal runnable foundation through RC-03; then use the new permitted golden fixtures to complete the RC-04 runtime/XLSX benchmark.
- Do not declare a phase complete without links to the tests, benchmark, PR, decision record, or preview that prove its exit criteria.
- Keep the core job lifecycle singular: explicit conversion request → reserve → extract → normalize/reconstruct → build/recalculate/verify XLSX → page assessment → settle/release → authorized download.
