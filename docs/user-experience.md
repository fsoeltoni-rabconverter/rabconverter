# User Experience Specification — PDF RAB to Excel

Status: target screen-level behavior, not implementation evidence.
The end-to-end path and state transitions are owned by [application-flow.md](application-flow.md). This document defines UI hierarchy, screen interactions and accessibility. If a screen-level detail adds friction to the normal path, follow the flow's simplicity rules without weakening output correctness or billing integrity.

## Design reference

Use remove.bg only as an interaction-simplicity benchmark: one primary upload action, understandable automatic processing, useful result and clear download. Do not copy its technology, assets or imply affiliation.

## Screen model

### 1. Conversion home

- Headline: “Ubah PDF RAB menjadi Excel dengan rumus yang bisa diedit.”
- One prominent drag/drop and browse area.
- State PDF RAB/BOQ scope, formula reconstruction (not original formula recovery), concise private-document notice and price cue Rp2.500 per billable page.
- Keep history, account, wallet detail and help secondary. No dashboard, tour or configuration wizard before first conversion.
- Basic preflight may precede sign-in; authenticated identity is required before durable owner-scoped upload/job, paid provider call, or wallet action. Never imply guest wallet is supported.

### 2. Estimate panel

After preflight, show together in one compact inline panel:
- detected source page count;
- Rp2.500/page and estimated maximum (accepted pages × price);
- current available wallet balance;
- exact shortfall and top-up action if insufficient;
- concise note that final billing is based on substantive RAB/BOQ records retained in a verified downloadable XLSX.

The estimate is a reservation ceiling, not the guaranteed final charge. Minimum top-up Rp50.000 is a minimum wallet funding transaction, not a minimum conversion fee. Show **Konversi PDF** only after identity, price estimate and balance state are available. Paid provider processing requires explicit click and successful atomic server-side reservation.

### 3. Processing state

Keep processing in the same conversion journey. Show only real backend milestones such as checking the PDF → reading pages → extracting tables → organizing RAB rows → checking formulas/totals → preparing Excel.

- Status/retry messaging comes from the actual persisted job state.
- Do not simulate percentages or promise a duration without evidence.
- Do not expose provider adapter, canonical model, queue, ledger function or settlement RPC jargon.
- Navigation away is safe only after durable background processing has actually been implemented.
- Errors and retry controls must not create duplicate jobs.

### 4. Result state

Once a verified workbook exists, **Download Excel (.xlsx)** is the dominant action. Keep the summary easy to scan:
- file name and download action;
- billable/non-billable page counts with concise reason categories;
- calculation: billable pages × Rp2.500 = final charge;
- amount charged, released reservation, remaining balance and receipt/job reference;
- warning summary and source-linked details where important.

Do not require a full preview or dashboard before download. Detail can be expanded when needed. No usable verified downloadable workbook means show a clear failure/no-result state, Rp0 charge and reservation release.

### 5. Exception-only review

- The system automatically validates rows, formulas, totals and source provenance.
- If uncertainty can safely be preserved, keep printed values, omit unsupported formulas, add a source-linked warning and offer the workbook when it meets export criteria.
- Ask a focused contextual question only when a material decision prevents an honest usable workbook.
- Never invent quantity, rates, taxes, overhead, profit or formula membership.
- A warning alone does not make a page non-billable. Billable criteria are owned by pricing-and-billing.md.

### 6. Top-up and recovery

Top-up continues the current conversion context; it is not a funnel that asks the user to re-upload without need.

Display persistent payment state and distinguish:
- **Pending:** awaiting verified payment; no wallet credit or conversion start.
- **Paid:** provider payment event verified; wallet ledger credit may still be pending.
- **Credited:** wallet credit committed exactly once, balance refreshed, conversion can be started.
- **Failed/canceled/expired:** no credit; explain next action.
- **Reconciliation required:** ambiguous gateway state, including a provider-verified payment discovered after local expiry; explain that provider confirmation is being reconciled and do not show funds as spendable until exactly-once wallet credit commits.

The UI must not return to a spend-ready state until credited. After credit, return to the current file/estimate and require explicit **Konversi PDF**. Never auto-start conversion from payment callback. QRIS is not displayed as available until a real vendor integration is verified.

## User-visible states

Every state has a concise label and next action where appropriate. Use inline panels when enough; do not add separate pages for backend stages.

- Empty upload, file selected, file checking.
- Unsupported, damaged, encrypted, empty or too-large PDF.
- Estimate ready, auth required, insufficient balance, reservation confirmed.
- Top-up created, pending, paid, credited, failed, canceled, expired, reconciliation required.
- Processing, bounded retry, partial extraction, focused review required.
- Completed, completed with warnings, XLSX verified and download ready.
- No substantive records/zero billable pages.
- Processing/export failure, no charge and reservation released.
- Charge settled, receipt and balance updated.
- Cancellation, expired hold or recovery state when relevant.
- Duplicate callback safely ignored; late worker cannot change a terminal job.

## Visual and accessibility priorities

- Clean, upload-first, premium and low-friction.
- One visually dominant action per state.
- Source values and calculated values must be visually distinct.
- Desktop/mobile support upload, start, status, warnings and download without desktop-only interactions.
- Desktop row/preview details have strong scanning hierarchy but are secondary to download when ready.
- Keyboard navigation, clear focus, accessible labels, sufficient contrast and reduced-motion support.
- Progress, warning and financial labels reflect backend state; never use fake progress.

## UX anti-patterns

- Mandatory dashboard/full-document review before first usable download without concrete reason.
- One wizard page per internal processing stage.
- “100% accurate” or original-formula recovery claims.
- Fake progress, hidden waits or surprise charges.
- Charging all submitted pages or per provider call/retry.
- Calling a payment credited before its ledger entry commits.
- Showing QRIS/payment success before gateway integration and callback verification.
- Hiding material warnings, inventing source values, or blocking a valid workbook without a specific correctness reason.
