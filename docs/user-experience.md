# User Experience Specification — PDF RAB to Excel

Status: screen-level target specification, not implementation evidence.

The end-to-end journey and transitions are owned by [application-flow.md](application-flow.md). This document defines the screen hierarchy, interaction details, accessibility and user-facing states. If a UI detail adds friction to the normal path, follow the application-flow simplicity rules without weakening billing integrity or output correctness.

## Design reference

Use remove.bg only as a benchmark for interaction simplicity: one main upload action, understandable processing status, a useful result and clear download. Do not copy its brand assets or suggest affiliation. Conversion—not a complex dashboard—is the core loop.

## Screen model

### 1. Conversion home

- Headline: “Ubah PDF RAB menjadi Excel dengan rumus yang bisa diedit.”
- One prominent upload area with drag/drop and browse.
- State the input scope (PDF RAB/BOQ for the initial release) and that formulas are reconstructed, not recovered exactly from the PDF.
- Show a concise price cue: Rp2.500 per billable page.
- Keep history, account, wallet details and help secondary to the upload action. Do not require a feature tour or dashboard before first conversion.

### 2. Estimate panel

After preflight, show these together in a compact panel rather than sending the user through a separate pricing wizard:

- Detected source page count.
- Price Rp2.500/page and estimated maximum (page count × price).
- Current available balance and whether a reservation can be covered.
- Exact shortfall and top-up action when the balance is insufficient.
- A concise note that the final charge depends on RAB/BOQ pages that contribute usable records to a successfully generated XLSX.

Show the **Konversi PDF** action only after the estimate and balance state are available. A user's explicit start confirms paid processing. Never call the paid extraction provider before the server confirms the user's intent and the reservation policy is satisfied.

### 3. Processing state

Keep the user in the same conversion journey where practical. Show real stage labels:

validating → reading pages → extracting tables → mapping RAB rows → reconstructing formulas → checking totals → preparing Excel.

- Status and retry messaging must come from actual job state.
- Do not invent completion percentages or estimate processing times without a dependable basis.
- Do not expose implementation jargon such as provider adapter, canonical model, ledger transaction or settlement RPC.
- Allow safe navigation away when the job can continue durably, but do not promise background completion until it is implemented and verified.

### 4. Result state

Once a valid workbook exists, **Download Excel (.xlsx)** is the dominant action. Keep the main result easy to scan:

- File name and download action.
- Billable pages, non-billable pages and concise reason categories.
- Calculation: billable pages × Rp2.500 = final charge.
- Actual amount charged, released reservation, remaining balance and job/receipt reference.
- Warning count or a concise important-warning summary when relevant.

Do not make a full preview or dashboard a mandatory gate before the download. Row previews, source context and detailed warnings can expand when needed. A ready workbook must not be hidden behind a tutorial or unrelated navigation.

### 5. Focused exception panel

Review is exception-driven, not mandatory for every job.

- Flag uncertain values, ambiguous number formats, low-confidence extraction, unclear row mapping, formula mismatch and missing fields with source page/row context.
- Ask only a focused question when a user decision is genuinely required to generate a safe output.
- Where uncertainty can be represented safely, preserve printed values, leave speculative formulas unresolved, include a warning, and offer the workbook when it meets the export contract.
- Never invent rates, quantities, taxes, overhead, profit, or calculation rules.
- Make the warning understandable without forcing the user to learn the extraction pipeline.

### 6. Top-up and recovery state

Top-up is a continuation of the current conversion, not a separate funnel. Preserve the selected-file/job context where safely possible. Display the persisted order status and return the user to the estimate after a verified payment. Do not start paid processing automatically after top-up; require the user to select **Konversi PDF**.

The payment provider is not yet chosen. QRIS is a preferred option to evaluate and must not appear as available until an actual integration is implemented and verified.

## Pricing and billing UI contract

### Before processing

- Price: Rp2.500 per page.
- Source page count and estimated maximum charge.
- Current balance, reservation requirement and any shortfall.
- Minimum top-up Rp50.000 when top-up is needed.
- Explain briefly that blank, cover-only, unrelated, drawing-only and failed pages with no usable RAB/BOQ data are not charged; pages contributing usable data to a successful XLSX may be charged even if the workbook carries a review warning.
- Explain that retries do not add customer charges.
- Obtain explicit user confirmation before paid processing.

### After processing

- Report total source pages, billable pages, non-billable pages and reason categories.
- Show the arithmetic for the final charge.
- Show amount charged, unused reservation released, remaining balance and job/ledger reference.
- If no usable XLSX is produced, show zero charge and reservation release.
- If a usable workbook is completed with warnings, keep the warning summary visible without automatically blocking the download.
- Provide a route to report a duplicate charge or dispute a page assessment.
- Customer billing is determined by [pricing-and-billing.md](pricing-and-billing.md), not provider call count or provider usage.

## Required states

All required states must have an understandable label, next action where relevant, and truthful financial status. Avoid separate pages when a clear inline state is sufficient.

- Empty upload; file selected; file checking.
- Unsupported, damaged, encrypted or too-large PDF.
- Text, scan, mixed, unrelated or uncertain classification where detected.
- Estimate ready; insufficient balance; reservation confirmed.
- Top-up created, pending, paid, failed, canceled, expired or requiring reconciliation.
- Processing, bounded retry, partial extraction and focused review required.
- Completed without material warnings; completed with warnings.
- XLSX generated and download ready.
- No usable records / zero billable pages.
- Processing or export failure, no charge and reservation released.
- Charge settled, receipt available and balance updated.
- Duplicate payment callback safely ignored.
- User deletion and expired artifacts according to the published retention policy.

## Visual and accessibility priorities

- Clean, upload-first, premium and low-friction.
- One visually dominant primary action per state.
- Desktop table and warning details need strong scanning hierarchy, but are secondary to download when the workbook is ready.
- Mobile must support upload, start, status, warning summary and download without desktop-only interactions.
- Numeric values align right; descriptions wrap naturally.
- Printed source values and calculated values are visibly different.
- Source-page provenance and formula reconstruction warnings are easy to discover.
- Status labels and progress reflect actual backend state.
- Keyboard navigation, accessible labels/focus, sufficient contrast and reduced-motion support.

## UX anti-patterns

- Requiring a complex dashboard or full-document review before first download without a concrete correctness reason.
- Making each backend stage a separate wizard page.
- “100% accurate” or original-formula recovery claims.
- Fake progress, hidden provider waits or ambiguous charges.
- Charging every submitted page without page-level assessment.
- Charging before a downloadable XLSX exists.
- Treating provider usage or retries as additional customer billable pages.
- Inventing missing values, taxes, rates, overhead or formula rules.
- Exporting only values while advertising formulas.
- Showing QRIS/payment success before backend verification.
- Hiding material warnings or preventing download of an otherwise valid workbook without a specific reason.
