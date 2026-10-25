# Pricing and Billing Specification

Status: commercial baseline approved for MVP planning — 2026-10-25  
Currency: IDR (rupiah)

Dokumen ini satu-satunya sumber kebenaran untuk harga, halaman tertagih, saldo, top-up, charge pelanggan, payment lifecycle, reversal, dan asumsi COGS. Dokumen ini menetapkan perilaku yang harus dibangun; keberadaannya tidak berarti payment gateway atau billing telah diimplementasikan.

## 1. Price contract

| Item | Baseline |
|---|---:|
| Customer price | **Rp2.500 per billable page** |
| Minimum top-up | **Rp50.000 per successful top-up order** |
| Charge formula | Final billable pages × price snapshot per page |
| Currency | IDR, integer rupiah |
| User-facing unit | Pages that contribute usable RAB/BOQ data to a successfully generated XLSX |
| Provider | Reducto Deep Extract only for initial MVP; no automatic fallback |

Minimum top-up means a user cannot submit a top-up request below Rp50.000. It does not mean every job costs Rp50.000. A top-up creates balance; a job deducts the actual charge for billable pages. A remaining balance stays available to the user, subject to the published account and refund policy.

Price is a product decision, not a claim of proven willingness to pay. Keep the price snapshot on each job/charge so future price changes do not silently change an already booked job. New prices require a documented decision and clear communication before they take effect.

## 2. Billable-page definition

A **billable page** is a distinct source PDF page that contributes at least one meaningful, identifiable RAB/BOQ record to the XLSX artifact successfully generated for that job, with a source-page reference sufficient to trace the record back to the PDF.

A meaningful record may contain an identifiable item code, work description, unit, quantity, unit rate, printed amount, or recognizable section/recap record. A page can still be billable if it contains a warning or a value requiring human review, provided meaningful RAB/BOQ content was actually extracted and retained in the export. Billability is not an accuracy guarantee.

### Not billable

- Blank page or page with only a page number, footer, repeated column heading or decorative content.
- Cover or title page that contains no usable RAB/BOQ rows/recap record.
- Drawing-only page or unrelated appendix that does not contribute usable RAB/BOQ data to the exported workbook.
- Corrupt, unreadable, unsupported or failed page from which no meaningful RAB/BOQ record is retained.
- Duplicate/repeated page that contributes no new retained RAB/BOQ record.
- Page sent to the provider but whose result is discarded and does not appear as usable data in the XLSX.

A page containing a repeated header plus actual RAB rows is billable, because it contributed usable RAB/BOQ data. A recap/subtotal page is billable when it contributes an identifiable record retained in the XLSX. Warnings do not themselves make a page non-billable if meaningful row data was recovered.

### Operational rule

A user is charged only if an XLSX artifact is successfully generated and made available for download. If generation fails before a deliverable artifact exists, charge zero pages and release any reservation. If a valid partial workbook is deliberately made available as a completed-with-warnings result, charge only the pages that meet this definition and are represented in that artifact. This behavior must be explicit in the UI before processing.

Do not charge per provider call or per retry. Each source page is charged at most once per job. Re-running a completed job must not duplicate a page charge; a new user-requested conversion is a new job and must show its estimated price before it begins.

## 3. Estimate, reservation and final settlement

1. **Before processing:** determine source PDF page count, apply size/page limits and show the estimated maximum charge (page count × current price) plus current wallet balance. Where exact billable pages are not knowable until extraction, label the number as an estimate/max, not a promise of final count.
2. **Sufficient balance:** do not start paid processing unless available balance covers the declared pre-process estimate/maximum reservation, unless a separately approved product decision introduces a different cap flow. Reserve or earmark balance transactionally to avoid concurrent jobs spending the same funds.
3. **Process and classify:** record page-level provider usage separately from customer billable-page assessment.
4. **Generate deliverable:** create and verify the XLSX artifact before final customer charge.
5. **Settle once:** charge final billable pages × price snapshot per page; release unused reservation. Retries do not create additional customer charges.
6. **No usable deliverable:** if no XLSX is produced, final page charge is zero and the reservation is fully released.
7. **Zero billable pages:** if an XLSX contains no billable pages, do not charge; explain the outcome and offer clear next steps.
8. **Failure after settlement:** if an operational defect later invalidates the deliverable or duplicates a charge, issue a ledger reversal/refund. Never edit or delete the original settled ledger entry.

The billing transaction must be atomic enough that wallet balance, reservation release, charge entry and job billing status cannot diverge. Use database transactions and unique idempotency keys, not a sequence of non-atomic browser operations.

## 4. Wallet and ledger invariants

- Balance is an IDR integer; do not use floating-point currency arithmetic.
- The immutable ledger is the auditable source of truth. A wallet balance column is only a transactionally maintained projection/cache.
- Ledger entry types should include top-up credit, job charge, reservation/hold, hold release, refund/reversal and approved manual adjustment.
- Each entry records owner, amount, direction/type, related top-up/job, idempotency key, timestamp and safe metadata.
- Never allow available balance to become negative.
- Every top-up, page charge, release or refund is applied at most once, even if a webhook or client request is replayed.
- Customer-facing balance history and receipt must reconcile with the immutable ledger.
- Admin corrections require a reason and compensating entry; do not overwrite history.

## 5. Top-up and payment lifecycle

Payment gateway is **not yet selected**. The MVP must support an Indonesian payment path with QRIS preferred for evaluation; do not assume any vendor integration is available or choose a provider before terms, fees, settlement and callbacks are validated.

Expected top-up states: created → pending → paid/credited, or failed/canceled/expired. A provider callback is not proof of payment until its signature/authenticity and amount, currency, merchant/order reference, status and event uniqueness are verified.

Requirements:
- Generate a unique top-up order ID and server-side idempotency key.
- Create the pending order on the server, with an amount at or above Rp50.000.
- Verify provider callbacks server-side; do not trust browser redirect, screenshot or user-edited status.
- Verify exact amount/currency/order reference and reject mismatches for manual reconciliation.
- Credit the ledger once only after verified settlement.
- Persist provider event ID and unique key to prevent replay/double credit.
- Handle callback-before-redirect, duplicate callback, late callback, pending status, expired QRIS and provider timeout.
- Failed/canceled/expired orders do not credit the wallet.
- Payment confirmation page displays state from persisted server order, not URL parameters.
- Reconcile against provider settlement reports before production.

Gateway fee, payout timing, tax treatment, QRIS provider, dispute process and provider-specific refund behavior are not yet fixed; disclose and model them once the gateway is chosen.

## 6. Refunds and disputes

- Provider-side payment refund and wallet balance refund are distinct flows and must be represented distinctly.
- Never promise that a top-up is withdrawable or refundable until a published policy and provider mechanics are decided.
- For a valid job-level charge error, post a linked compensating ledger entry; preserve the original charge.
- If the user receives no usable XLSX due to platform failure, charge zero or reverse any incorrectly finalized charge.
- If extraction is imperfect but usable RAB/BOQ data is delivered, the page is not automatically non-billable; use the billable-page definition, show source warnings and provide a support/dispute mechanism.
- Manual credits/refunds require actor, reason, linked transaction and audit record.
- Fraudulent, duplicated or mismatched payment events remain pending investigation; never mark paid based only on a client claim.

## 7. Provider usage and COGS

Current public Reducto pricing lists Deep Extract at **US$40 per 1,000 pages** (US$0.04 per page) for Standard list pricing; the public rate card and the terms applied to the RabConverter account must be reconfirmed before launch. See [Reducto official pricing](https://reducto.ai/pricing). Introductory/free usage is temporary and is not recurring unit economics. Do not assume an advertised batch discount applies to Deep Extract; confirm any discount for the exact endpoint and plan.

Planning calculation only:
- FX planning assumption: Rp18.050 per US dollar (not a live FX quote and must be refreshed).
- Base provider list cost: US$0.04 × Rp18.050 ≈ **Rp722 per provider-processed page**.
- Add a provisional 20% retry overhead: Rp722 × 1.20 ≈ **Rp866 per provider-processed page**.
- Until usage logs validate the actual distribution, use **Rp900–Rp1.000 per page as a conservative planning reserve**, not measured COGS.

At Rp2.500 retail, contribution after a Rp900–Rp1.000 provider/retry reserve is approximately Rp1.600–Rp1.500 per billable page, or 64%–60%. This is **not net profit or verified gross margin**: payment processing, storage, compute, bandwidth, taxes, support, fraud/refunds and non-billable provider usage are not included. A page may cost RabConverter money at Reducto even when it is correctly non-billable to the user.

Record at least: job ID, source page, endpoint, provider request ID, attempt number, provider-reported page/credit usage, result status, retry reason, latency, error class, provider-reported charge when available, customer billable-page status/reason, price snapshot and final customer charge. Never infer provider cost from customer billable pages alone.

## 8. Unit economics gates

Before public launch, report from actual test/production-safe logs:
- mean, median and p95 provider COGS per submitted page and per billable page;
- retry rate and cost of retries;
- proportion of pages not billable to customers;
- provider failures/timeouts and fraction of jobs with no deliverable;
- payment gateway cost per successful top-up and per rupiah collected;
- average billable pages/job, charge distribution and balance/refund discrepancies;
- total variable cost after hosting/storage/payment/failure overhead.

If measured fully loaded variable cost makes Rp2.500 unsustainable, pause broad release and change model through a documented price decision; do not silently substitute LlamaExtract or Pulse Ultra 2.

## 9. Implementation boundary

This document defines desired behavior, not deployed infrastructure. As of 2026-10-25, RabConverter is still documentation-only; provider and payment execution are not confirmed in an application. No production wallet, ledger, payment route, migration or webhook should be claimed until implemented, reviewed and tested.
