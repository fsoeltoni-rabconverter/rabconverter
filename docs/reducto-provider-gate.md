# Reducto Provider Gate

Status: **Partially verified; account-specific approval remains open.** Reviewed 2026-10-26.

## Scope

This document records the public evidence needed before RabConverter can send real customer PDFs to Reducto. Public documentation is not a substitute for verification of the actual RabConverter account, plan, contract, API key configuration, retention settings, or billing account.

## Public evidence verified

### Product and extraction behavior

Reducto's current Extract documentation supports schema-based typed JSON extraction, optional citations with page/bounding-box/source-text information, and `settings.deep_extract` for an agentic verification loop. The public API returns a `job_id` and usage information including pages and credits. The documentation also supports reusing a prior parse result through `jobid://`, which avoids re-parsing. See the official Extract documentation: https://docs.reducto.ai/extract/overview

### Async processing and recovery

Reducto's production-readiness guidance recommends asynchronous jobs for production workloads. It documents job IDs, status tracking/webhooks, signed Svix webhook delivery, and exponential retry behavior. It recommends retrying transient 5xx/timeouts while avoiding retries for client errors. This supports RabConverter's design of persisting provider identifiers and checking provider state before a retry rather than blindly creating a second provider operation. See: https://llms.reducto.ai/production-readiness-guide

### Rate limits

Current public reference documents a 1,000 requests/second sustained per API key for general endpoints and 200 requests/second for `GET /job/{job_id}`. The latter explicitly recommends webhooks instead of aggressive polling. The same reference says a synchronous request approaching the 15-minute timeout should switch to async. See: https://docs.reducto.ai/reference/rate-limits

### Usage and billing units

Current public credit documentation says Extract Standard consumes 2 credits/page, while Deep Extract is documented at 4 credits/page plus 0.1 credit per extracted field, with a minimum of 30 credits per document; the Deep Extract pricing is marked beta and subject to change. Passing a file directly to Extract also incurs Parse credits, while using a `jobid://` Parse result avoids that double charge. The API response includes `job_id`, `num_pages`, and `credits`. See: https://docs.reducto.ai/reference/credit-usage

The public pricing page currently lists Deep Extract at US$40 per 1,000 pages on Standard, with $150 of free usage shown on the page. It also states Growth adds features such as a Zero Data Retention Agreement, BAA, premium rate limits and EU/AU data-residency endpoints. Pricing should be reconciled against the actual account before financial modeling. See: https://reducto.ai/pricing/

### Usage reconciliation

Reducto documents a Usage Export API that returns aggregate credits and request counts grouped by product, feature, API key, or file type. The documentation distinguishes the Studio API key used for usage export from the document-processing API key. RabConverter should keep per-attempt internal records and use this export for aggregate reconciliation. See: https://docs.reducto.ai/reference/usage-export-api

### Security and privacy

Reducto's public Trust Center lists SOC 2 and HIPAA compliance resources and data-retention controls. The public pricing page lists Zero Data Retention Agreements on Growth/Enterprise. The public privacy policy says personal information is transferred to and processed in the United States and may be shared with affiliates/third parties in the US or other countries. Therefore RabConverter must not treat a generic security/compliance claim as sufficient approval for confidential Indonesian RAB documents; the actual plan, retention mode, processing region, DPA/contract terms, and data-use terms must be confirmed for the account. See: https://trust.reducto.ai/ and https://reducto.ai/privacy

## Account-specific gate — still required

The following cannot be verified from public documentation alone and therefore remain **OPEN**:

- actual RabConverter Reducto account/organization and plan
- actual enabled endpoint/model configuration for Deep Extract
- account-specific rate/volume discounts or contractual pricing
- exact retention setting for the account and whether a Zero Data Retention Agreement is active
- processing/data residency endpoint actually selected for the account
- DPA and any applicable data-processing/security addendum
- whether submitted documents or derived data are used for model training under the actual contract/settings
- API key ownership, rotation and production secret storage
- actual webhook configuration/signing secret and event payloads
- actual usage export access and reconciliation test
- actual account balance/free credits before paid benchmark runs

## Go/no-go rule

**NO-GO for real customer PDFs** until the account-specific items above are verified and recorded.

Permitted synthetic fixtures may be used for integration/benchmark work. If an account test is performed later, record only non-secret identifiers and aggregate usage evidence; never commit API keys or customer documents.

## Current cost interpretation

Do not use the previous provisional Rp900–Rp1,000/page provider-cost reserve as a measured COGS number. Public documentation now exposes credit-based usage details that can vary by operation/configuration. The actual account's plan and measured fixture runs must be used before contribution/margin claims are made.
