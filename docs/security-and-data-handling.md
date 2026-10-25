# Security and Data Handling — RabConverter

Status: security/operations requirements, not implementation evidence.

## Data classification

PDF RAB/BOQ, extracted rows, client/project identities, supplier rates, tender conditions and XLSX exports may be commercially confidential. Originals, extracted data, warnings, exports, wallet records and payment references are private customer data.

## Identity, access and storage

- Allow local/basic preflight before login only when this can be done without durable, publicly reachable server storage.
- Require Supabase Auth before creating a durable owner-scoped job/source, retaining an uploaded file in server storage, invoking paid Reducto processing, or using wallet/payment functions. The MVP does not support guest wallet/paid processing.
- If pre-login upload cannot be safely bound to the later identity, ask the user to reselect the file after sign-in; do not expose a public temporary URL.
- Enforce authenticated ownership for jobs, pages, extraction runs, exports, wallet, ledger and payment orders/events.
- Use private Supabase Storage buckets; never publish public tender-PDF/XLSX URLs. Download through an authenticated proxy or short-lived signed URL scoped to the owner.
- Enable RLS on every customer-owned table in an exposed schema and set least-privilege SQL grants as well as policies. Test both allowed and denied operations across users and roles.
- Keep Supabase service-role/database credentials and provider/payment keys outside browser bundles, source control, logs, CI artifacts and test snapshots. Keep secrets in server/cloud secret management only.
- Validate file signature, MIME, page count, bytes, encryption/corruption, configured timeouts and resource limits.
- Treat imported content/provider output as untrusted; validate schema and escape/render safely. Never execute embedded PDF JS, macros or active content.
- Do not log raw page text/images, unit rates, full signed URLs, tokens, secrets or sensitive payment payloads. Use bounded, redacted error diagnostics.
- Use checksum deduplication without revealing whether another user uploaded the same document.

## Privileged database operations

- Wallet reservation, charge, release and verified credit must execute in an atomic transaction/guarded database function; do not trust browser-calculated balances.
- Prefer SECURITY INVOKER functions. If SECURITY DEFINER is required, pin an empty/explicit search_path, fully qualify objects, validate owner/job/order inside the function and restrict execute privileges (revoke broad public/anon access and grant only required roles).
- Test concurrent reservation, no-negative-balance, duplicate idempotency key with same/different payload, terminal job update, RLS bypass and cross-user access.
- Keep job state and billing state distinct; a late worker cannot revive terminal states or settle after expiry.

## Reducto provider privacy gate

Reducto Deep Extract is the sole initial provider, but selecting it does not approve sending customer data. Before using real documents, record and review the exact account/plan terms for:
- retention duration and deletion method for inputs, page images, outputs, logs and backups;
- model training/service-improvement use of inputs/outputs;
- processing/storage region, subprocessors, data transfer and applicable DPA/terms;
- endpoint/configuration, limits, timeouts, retries and usage-metering unit;
- current account pricing and usage export availability.

The public pricing page advertises zero-data-retention and EU/AU data residency as higher-tier features; do not assume Standard includes them. Keep real customer documents blocked until this privacy gate is approved. Use synthetic or licensed fixtures.

## Payment and wallet security

- Payment gateway is not selected. QRIS is a preferred method to evaluate, not a live capability.
- Verify webhook signature/authenticity plus provider event ID, order ID, exact amount, currency and expected status before crediting.
- Expect duplicate, delayed and out-of-order callbacks; persist unique provider event IDs and make processing idempotent.
- Payment state paid means provider payment was verified; credited means the wallet ledger credit committed exactly once. UI exposes credited balance only after the ledger transaction completes.
- Redirect URLs, client events and screenshots cannot mark an order paid/credited.
- Keep ledger immutable. Corrections use linked compensating entries with actor/reason. Do not store unnecessary raw card/QRIS secrets or callback payloads.

## Formula and source integrity

- Store printed source values separately from normalized/reconstructed values and calculated results.
- Label formula provenance; never claim formula recovery from a PDF.
- Show mismatches rather than silently replacing printed values or inserting market prices, taxes, overhead or profit.
- Preserve parser/provider/pipeline version and page provenance in metadata and warnings.

## Retention, deletion and recovery

Before production, define retention/expiry for temporary preflight uploads, source PDFs, extracted rows, exports, provider-side data, payment events and security logs. A user deleting a job must remove source/derived files according to the published policy and provider contract; financial ledger and payment reconciliation records may require a separate lawful retention period. Do not promise complete account erasure until those obligations and provider deletion capabilities are reviewed.

Reservation expiry/worker recovery must be implemented before paid launch. Expired/canceled jobs release holds once; late workers cannot revive or charge them. Keep enough safe metadata to reconcile ambiguous financial states without logging confidential document content.

## Incident response and release gates

If a key is exposed, rotate/revoke it and inspect access logs. If a document becomes public, revoke access, identify affected objects/URLs/logs, contain exposure, notify the owner as required and record the incident before resuming deployment.

Do not send real customer PDFs to Reducto, collect payments, or enable production wallet charges until provider privacy/retention terms, auth/RLS/grants, secret handling, webhook verification, idempotency, expiry/recovery, ledger reconciliation and deletion behavior are tested and approved.
