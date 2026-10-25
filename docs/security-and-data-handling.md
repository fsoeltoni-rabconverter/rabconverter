# Security and Data Handling — RabConverter

## Data classification

PDF RAB/BOQ, extracted text, rate/price information, client/project identities, supplier rates, locations, tender conditions and derived XLSX can be commercially confidential. Treat originals, extracted data, warnings, exports, wallet records and payment references as private customer data.

## App and storage requirements

- Enforce authenticated ownership for jobs, source pages, extraction runs, exports, wallet and ledger.
- Use private storage; never publish public URLs for tender PDFs or XLSX artifacts.
- Use short-lived signed downloads or authenticated proxy delivery.
- Apply Supabase RLS to every customer-owned record and storage object. Test cross-user access explicitly.
- Keep service-role/database credentials and provider/payment keys out of browser bundles, source control, logs, workflow artifacts and test snapshots.
- Keep secrets in cloud secret management/GitHub Actions secrets. Only intended public/publishable keys may reach browser; RLS and least privilege remain mandatory.
- Validate file signature, MIME, page count, bytes, encryption/corruption and runtime/resource limits.
- Treat imported content/provider responses as untrusted data; escape/render safely and validate schema.
- Never execute PDF JavaScript, spreadsheet macros or embedded active content.
- Do not log raw PDF/page text, page images, unit prices, full signed URLs, tokens, wallet-sensitive details or secrets.
- Keep stable error codes and redacted bounded diagnostics.
- Use checksum deduplication without disclosing whether another customer uploaded the same document.

## Reducto provider privacy gate

Reducto Deep Extract is the only initial provider, but selecting it does not automatically approve sending customer documents. Before real customer data is sent, record and review the exact account/plan terms for:
- data retained, duration and deletion method;
- whether inputs/outputs can be used for model training or service improvement;
- processing/storage region and subprocessor/data transfer details;
- applicable DPA/contract terms and user notice/consent;
- retention of request logs, page images, outputs and backups;
- API endpoint/configuration, file/page limits, request timeout and retry behavior;
- current pricing, usage metering and export/retention behavior.

The public Reducto pricing page advertises zero-data-retention agreement and EU/AU residency as higher-tier features; do not assume the Standard account automatically has those terms. Verify the actual plan and contract. Until the privacy gate is signed off, use synthetic or legally approved fixtures only. Do not add LlamaExtract or Pulse Ultra 2 as a fallback.

## Billing, wallet and payment security

- Monetary computation and billable-page assessment run server-side; the browser cannot choose page count, amount, paid state or balance.
- Keep IDR as integer rupiah and perform wallet changes transactionally.
- Enforce unique idempotency keys for top-up credit, provider payment events, page charge and reversal.
- Verify webhook signature/authenticity, event identity, amount, currency and merchant/order references before crediting wallet.
- Do not accept redirect parameters, screenshots or client-side events as proof of payment.
- Prevent replay, duplicate callback, amount mismatch and concurrent spend.
- Ledger entries are immutable; corrections use linked compensating entries with actor/reason.
- Use least-privilege database functions and test for negative balance, race conditions, RLS bypass and cross-user access.
- Do not store unnecessary payment card/QRIS credentials or raw sensitive callback payloads.

## Formula and source integrity

- Store printed source amounts separately from reconstructed calculation/result.
- Label formula provenance; do not claim formula recovery from PDF.
- Show mismatch; never silently overwrite printed values or insert market prices/taxes/overhead/profit.
- Keep parser/provider/pipeline version and page provenance in metadata/export warnings.

## Retention, deletion and recovery

Before production, define retention for source PDFs, extracted data, exports, provider-side data, payment events and security logs. Deleting a job must remove metadata and artifacts according to the published policy and provider capabilities, with any controlled recovery window documented. Financial ledger and payment reconciliation records may require retention distinct from source documents; do not promise complete account deletion until legal/accounting obligations are reviewed.

## Incident response

If a key is exposed, rotate/revoke it and inspect logs/history rather than relying only on deleting source history. If a document becomes public, revoke access, identify affected objects/URLs/logs, contain exposure, notify the owner as required and record the incident before resuming deployment.

## Release gates

Do not send real customer PDFs to Reducto, collect real payments or enable production wallet charges until privacy/retention terms, secret handling, RLS, webhook verification, idempotency, ledger reconciliation and deletion behavior are tested and approved.
