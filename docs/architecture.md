# Architecture and Cloud Delivery — PDF RAB MVP

Status: target architecture, not implementation evidence. Last infrastructure inspection: 2026-10-25.

## Operating constraint

RabConverter development and delivery are cloud-only. GitHub is source of truth; GitHub Actions runs CI; Cloudflare is the intended web host/preview; Supabase is the intended auth, metadata, ledger and private-storage platform. A target architecture is not proof any component is already deployed.

## MVP runtime path

Browser upload and price estimate → authenticated API/job creation → private source storage → page inventory/classification → Reducto Deep Extract adapter → canonical RAB rows → deterministic formula/reconciliation code → user review → XLSX generation and verification → page-level billability → atomic wallet settlement → authenticated download.

## Components

- **Frontend:** upload-first flow, page/price estimate, balance status, real processing status, extracted-row preview, warnings and download.
- **Cloudflare:** host web app and API routes/workers only after runtime choice is validated. Use durable/background processing where job duration or size exceeds request limits.
- **GitHub:** source of truth for code, documentation, tests, migrations and deployment configuration.
- **GitHub Actions:** lint/type/test/build and gated deployment; tests mock paid provider and payment gateway calls.
- **Supabase Auth:** identity, if sign-in is enabled.
- **Supabase Postgres:** jobs, pages, provider usage, normalized rows, issues, export metadata, wallet, immutable ledger, top-ups, payment events and charge assessments.
- **Supabase Storage:** private originals/exports with owner-gated access.
- **Reducto Deep Extract:** sole initial external PDF extraction provider, through a server-side adapter. LlamaExtract and Pulse Ultra 2 are excluded.
- **Payment gateway:** not selected. Must support a suitable local payment method (QRIS preferred for evaluation), authenticated callbacks, settlement state, idempotency and reconciliation.
- **XLSX generator:** produces editable formula-bearing workbook; does not pretend PDF-only values are recovered original Excel formulas.
- **Billing service:** application-owned deterministic page classifier, price snapshot, reservation, final charge and immutable ledger entries; provider usage is separately metered.

## Runtime and financial invariants

- Never expose provider/payment credentials to the browser.
- Provider output proposes extracted records; deterministic application logic owns canonical validation, billable-page classification and monetary charge calculation.
- Charge only after a downloadable XLSX artifact exists.
- Final charge is final billable pages × price snapshot. No additional customer charge for retries.
- Failed/no-artifact job is zero charge and reservation is released.
- Top-up credit occurs only after a verified server-side payment event.
- Ledger/idempotency constraints prevent duplicate charge or credit.
- Provider cost for non-billable pages must still be recorded as RabConverter COGS.
- Use database transactions/locks for wallet reservation and settlement; no browser-based balance calculations are authoritative.

## Decisions needed before implementation

1. Maximum PDF bytes/pages, extraction timeout, concurrency and queue strategy.
2. Exact Reducto Deep Extract endpoint/schema/options and account-level price.
3. Reducto data retention, training/use, processing region, DPA and deletion semantics for the selected plan.
4. Workbook generation library and recalculation-validation strategy.
5. Payment gateway and exact QRIS/payment flow, fees, webhook security and refund/reconciliation.
6. Wallet transaction locking, page-charge idempotency and reversal schema.
7. Retention/deletion timeline and public privacy notice.
8. Legal/accounting handling of top-up balance, payments, fees, taxes and refunds.

## Implementation order

1. Finalize docs and licensing for golden fixtures.
2. Create a static UX shell using clearly labelled sample data.
3. Configure CI and Cloudflare preview.
4. Add Supabase migrations/RLS and private upload.
5. Integrate Reducto adapter with synthetic or permitted golden files.
6. Implement row mapping, formula candidates and deterministic reconciliation.
7. Implement review and XLSX generation/recalculation tests.
8. Implement page metering, wallet/ledger and settlement tests.
9. Select and integrate payment provider with callback verification.
10. Complete security/privacy gates and deploy a reviewable preview.
11. Run failure/retry/idempotency/load/financial-reconciliation tests before release.

## Cloud-only Git workflow

Feature branch and PR → automated validation → Cloudflare preview → inspect actual URL → merge only after review. Migrations are versioned, code-reviewed and applied deliberately. Do not change production schema as a side effect of a documentation change.

## Current infrastructure state (verified snapshot 2026-10-25)

- The GitHub repository fsoeltoni-rabconverter/rabconverter contains README and product/engineering documentation, but no application source tree has been verified.
- On the connected Cloudflare account, inspection found zero Worker scripts and zero Pages projects for RabConverter.
- Supabase project Rab Converter (ref zkcziucjogprfzhjuaex) is active, but the public schema contained zero tables at inspection time.
- No working application preview or production URL has been verified.

This is a dated snapshot limited to connected accounts/resources inspected. Recheck before future implementation/release claims; do not describe the repository as empty, and do not describe the app as live.
