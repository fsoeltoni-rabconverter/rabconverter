# Pricing and Billing Specification

Status: commercial baseline approved for MVP planning — 2026-10-25  
Currency: IDR (rupiah)

This is the sole source of truth for customer price, billable pages, reservations, wallet, top-up, settlement, reversal and provider COGS. It defines required behavior, not implementation evidence.

## 1. Price contract

| Item | Baseline |
|---|---:|
| Customer price | **Rp2.500 per billable page** |
| Minimum top-up | **Rp50.000 per successful top-up order** |
| Charge formula | Final billable pages × job price snapshot per page |
| Currency | IDR, integer rupiah |
| Billing unit | Distinct source pages contributing substantive RAB/BOQ records retained in a successfully generated downloadable XLSX |
| Initial extraction provider | Reducto Deep Extract only; no automatic fallback |

A minimum top-up is a minimum wallet funding transaction, not a minimum conversion fee. Remaining balance stays available subject to the published account/refund policy.

A job stores the price snapshot at booking. Future price changes must not silently reprice already-booked jobs. Any price change requires a recorded decision and user communication before it applies.

## 2. Billable-page definition

A **billable page** is a distinct source PDF page that contributes at least one substantive, identifiable RAB/BOQ record retained in the verified XLSX made available to the user. The record must have source-page provenance. Examples include an actual work-item row with meaningful description/code/quantity/unit/rate/printed amount, or a substantive subtotal/recap/total record retained as part of the RAB/BOQ result.

A page is not billable merely because the provider processed it, text was detected, or a row classification was emitted.

### Non-billable examples

- Blank/decorative page or page with only page number, header, footer or repeated column heading.
- Cover/title page or **section heading only**.
- Notes, assumptions, disclaimers or specification text with no substantive RAB/BOQ record.
- Drawing-only page or unrelated appendix.
- Unreadable, corrupt, unsupported or failed page with no substantive record retained.
- Duplicate/repeated page that contributes no new retained substantive record.
- Provider output discarded before the final export or not represented in the export manifest.

A page with a repeated header plus actual RAB/BOQ rows remains billable. A subtotal/recap page is billable only if it contains a substantive financial or quantity record that is retained in the XLSX; a label like “Subtotal” without a usable value/relationship is not sufficient. A warning does not itself make a page non-billable if substantive data is retained. Billability is not an accuracy guarantee.

The same source page can be assessed only once per job. A new user-requested conversion is a new job, with a displayed estimate before it starts; regeneration/correction of an already charged job does not create a second page charge.

## 3. Estimate, reservation and settlement

1. **Preflight:** validate file signature/type, readability, encryption/corruption, configured size/page limits, and source page count. Preflight is not a paid provider call.
2. **Estimate:** show all accepted source pages × Rp2.500 as the estimated maximum, current available wallet balance, and exact shortfall. Label it as a reservation ceiling—not a promise of final charge.
3. **Explicit start:** only an authenticated owner can start paid processing. Server checks intent, job idempotency and sufficient available funds.
4. **Atomic reservation:** create/lock the job and reserve the maximum in one database transaction. Concurrent jobs must not reserve more than the wallet can cover.
5. **Process/export:** record provider usage separately. Verify the XLSX artifact is valid, readable, complete enough to offer, and satisfies the export contract before charge calculation.
6. **Assess:** deterministically assess each source page using substantive records retained in the actual export manifest. Persist the classifier/policy version, reason code and artifact reference.
7. **Settle once:** final customer charge = billable page count × the job's price snapshot. Commit the charge and release the unused reservation atomically.
8. **No deliverable:** if no verified downloadable XLSX exists, charge Rp0 and release the reservation exactly once. An XLSX with zero billable pages also has a Rp0 charge and clear explanation.
9. **After settlement:** a later-discovered duplicate charge or defective deliverable is corrected using a compensating ledger entry. Never edit/delete the original settled entry.

The database transaction is authoritative. A sequence of browser operations is never sufficient to reserve, settle or release wallet funds.

## 4. Wallet, ledger and idempotency

- Use integer rupiah, never floating-point currency calculations.
- The immutable ledger is the financial audit source of truth. A cached/derived balance is a projection that must reconcile with ledger entries and active reservations.
- Record top-up credit, job charge, reservation, release, refund/reversal and approved manual adjustment with owner, related job/order, signed amount, timestamp, reason, and idempotency key.
- Reusing an idempotency key with the same payload returns the existing result without side effects; reusing it with a different payload is a conflict.
- Every job, final page assessment, customer charge, reservation transition, payment event and wallet credit has a stable key/unique constraint.
- Available balance must never become negative. Use a database transaction and row/appropriate lock for reservation, settlement and release.
- Release or settle an active reservation at most once. Terminal job/hold states are sticky; a late worker cannot change a terminal job to completed or create a new charge.
- Customer receipt, balance and ledger entries must reconcile.
- Admin adjustments require a reason, actor and compensating entry; settled history is immutable.

## 5. Top-up and payment lifecycle

The payment gateway is **not selected**. QRIS is the preferred method to evaluate, not a live integration. Do not show a real payment method until the vendor, credentials, callbacks and settlement behavior are implemented and tested.

### Canonical state

`created → pending → paid → credited`

Terminal/recovery states: `failed`, `canceled`, `expired`, `reconciliation_required`, and (where supported) `refunded`.

- **paid** means the server verified the gateway's payment event.
- **credited** means the associated wallet-ledger credit committed exactly once.
- Only **credited** makes the new funds spendable and unlocks the conversion flow.

### Requirements

- Create a unique top-up order and idempotency key before redirecting or showing payment instructions.
- Validate the minimum amount (Rp50.000), IDR currency, order reference and expected amount on the server.
- Verify callback authenticity/signature and provider-specific status. Persist provider event ID with a uniqueness constraint.
- Expect duplicate, delayed and out-of-order events. State transitions must be monotonic/guarded and financial side effects idempotent.
- Apply verified payment state and wallet credit transactionally where possible; if processing spans steps, persist a recoverable credit-pending state and never report credited until the ledger entry commits.
- Browser redirect, query parameter or user-uploaded payment screenshot is not proof of payment.
- Pending or ambiguous states remain visible and do not start conversion. Do not create a replacement order automatically.
- After **credited**, refresh the wallet and return to the same conversion context. Require the user to click **Konversi PDF**; do not auto-start paid work.
- Failed/canceled/expired orders never credit the wallet. Mismatched or ambiguous provider events require reconciliation.
- Reconcile the application ledger to the provider settlement report before production.

Gateway fee, payout timing, tax treatment, refund process and provider-specific failure semantics remain pending until a vendor is selected.

## 6. Reservation expiry, cancellation and recovery

- Each reservation has a finite expiry and state.
- Cancellation before work begins atomically marks the job canceled and releases the reservation.
- During an in-flight provider request, cancellation is best effort. Prevent new attempts and release funds only after a guarded transition proves no downloadable artifact will be committed.
- A stalled job is recovered only after its active worker lease/runtime has expired and an atomic compare-and-set/locked transition confirms no valid artifact was committed.
- A `review_required` job has a bounded, configurable expiry visible to the user. The precise duration is a launch configuration, not an undocumented default.
- At expiry, mark the job terminal and release reservation exactly once if there is no valid artifact. A late worker must not revive the job or settle it.
- Persist enough safe diagnostic metadata to reconcile a stuck/ambiguous financial state. Do not create a new charge to repair an internal state discrepancy.
- Every terminal path—failed, canceled, expired, no-data, export-failed—must reconcile job state, artifact state, assessment, reservation and ledger.

## 7. Refunds and disputes

- Provider-side payment refund and internal wallet refund/reversal are separate flows.
- Do not promise that top-up balance is withdrawable/refundable until a published policy and gateway mechanics are decided.
- For a wrong job charge, append a linked compensating ledger entry and keep the original charge immutable.
- If no usable XLSX was delivered, charge zero or reverse any incorrectly finalized charge.
- Imperfect extraction does not automatically make a page non-billable. Apply the substantive-record rule, show source-linked warnings, and provide a way to dispute a page assessment.
- Manual credit/refund requires actor, reason, linked transaction and audit record.
- Fraudulent/duplicated/mismatched events stay under reconciliation; do not mark paid/credited based on a client claim.

## 8. Provider usage and COGS

Public Reducto Standard list pricing currently lists Deep Extract at **US$40 per 1,000 pages (US$0.04/page)**; dense extraction over 100 fields per page may incur additional charges, and pricing/terms can vary by account. See [Reducto pricing](https://reducto.ai/pricing) and [official usage/pricing reference](https://docs.reducto.ai/reference/credit-usage). This is a planning input, not a verified quote for the RabConverter account. The provider's account contract and actual usage export take precedence.

Planning calculation only:
- FX planning assumption: Rp18.050 per USD (not a live quote).
- Base public-list cost: US$0.04 × Rp18.050 ≈ Rp722 per provider-processed page.
- Provisional 20% retry factor: approximately Rp866/page.
- Use Rp900–Rp1.000/page as a planning reserve only until account usage and invoices/logs validate the actual distribution.

At Rp2.500 retail, subtracting that reserve gives a **planning contribution estimate** of Rp1.500–Rp1.600 per billable page before all other costs; it is not net profit or measured margin. Payment processing, storage, compute, bandwidth, taxes, support, fraud/refunds and provider spend on non-billable pages are excluded.

Record job, source page, endpoint/config version, provider request ID, attempt, usage unit (pages vs credits), usage quantity, status, retry cause, latency, cost/currency when available, customer billable flag/reason, price snapshot, final customer charge and export artifact ID. Do not infer provider COGS from customer billable pages.

## 9. Unit-economics gates

Before public launch, report from actual account logs:
- mean, median and p95 COGS per provider page and per customer billable page;
- retry frequency and retry cost;
- share/reasons of non-billable pages;
- provider failures/timeouts and jobs without a deliverable;
- gateway fee per successful top-up and per rupiah collected;
- billable pages/job, charges, refunds and ledger differences;
- total variable cost after hosting, storage, gateway, support and failure overhead.

If measured fully loaded cost makes Rp2.500 unsustainable, pause broad release and change price via a recorded decision. Never silently switch to an excluded provider to hide cost/quality failures.

## 10. Implementation boundary

This defines desired behavior, not deployed infrastructure. As of 2026-10-25, RabConverter is documentation-only; provider, wallet, payment and job processing are not confirmed in a running app. No production ledger, migration, webhook or payment route may be claimed until implemented, reviewed and tested.
