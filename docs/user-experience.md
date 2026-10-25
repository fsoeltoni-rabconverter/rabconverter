# User Experience Specification — PDF RAB to Excel

## Design reference and product loop

Use remove.bg only as an interaction-simplicity reference: one main upload action, understandable processing state, useful result and clear download. Do not copy brand assets or claim affiliation. Conversion—not a complex dashboard—is the core loop.

## Main flow

1. **Landing:** “Ubah PDF RAB menjadi Excel dengan rumus yang bisa diedit.” State clearly that formulas are reconstructed, not recovered exactly from PDF.
2. **Upload:** drag/drop and browse; say PDF RAB/BOQ only for initial release, show limits and private-data notice.
3. **Estimate:** after basic PDF validation, show detected page count, price Rp2.500/page, estimated maximum (page count × price), current balance, minimum top-up Rp50.000 when relevant, and that final billing depends on usable RAB/BOQ pages. Do not present the estimate as guaranteed final charge.
4. **Balance gate:** if balance cannot cover the reservation/estimate, explain the shortfall before paid provider processing. Show top-up state retrieved from the server; never fake added balance from redirect parameters.
5. **Classify:** show text-based, scanned, mixed, unsupported or uncertain classification when detected.
6. **Process:** show real staged progress: validating → reading pages → extracting tables → mapping RAB columns → reconstructing formulas → checking totals → preparing workbook. Do not fake percentages or claim stages finished before they finish.
7. **Preview:** show rows/fields, section hierarchy and row type. Highlight low-confidence cells and formula candidates.
8. **Review exceptions:** ambiguous numeric format, OCR uncertainty, missing field, formula mismatch, unclear tax/overhead logic. Each warning points to source page/row.
9. **Download:** primary action “Download Excel (.xlsx)”. Show export status, warning/formula counts, final billable pages, page price, actual charge and resulting balance. Provide receipt/transaction reference.
10. **History:** optional first-release feature; list jobs and transaction status separately. Allow deletion according to the published retention policy.

## Pricing UI contract

Before processing:
- Show price Rp2.500 per page.
- Show source page count and estimated maximum, current available balance, and whether a reserve is being held.
- Explain that blank/cover-only/unrelated/failed pages with no usable RAB/BOQ data are not charged; pages that contribute usable data to a successful XLSX may be charged even if they carry a review warning.
- Show that retries do not add customer charges.
- User confirms paid processing before the provider is called.

After processing:
- Report total source pages, billable pages, non-billable pages and reason categories.
- Show the calculation: billable pages × Rp2.500 = final charge.
- Show amount charged, reservation released, remaining balance and job/ledger reference.
- If no XLSX is produced, show zero charge and reservation release.
- If an XLSX is produced with warnings, make warnings and billable-page count visible before download.
- Provide a way to report a duplicated charge or dispute a page assessment.

Top-up:
- Minimum Rp50.000. Provider not yet chosen.
- Display pending/paid/failed/canceled/expired status from persisted server state.
- Never claim paid based on browser redirect or uploaded payment proof alone.
- QRIS is a preferred local payment option to evaluate; do not show it as available until an integration is implemented and verified.

## Visual and accessibility priorities

- Upload-first, clean, premium and low-friction.
- Desktop table needs strong scanning hierarchy; mobile must still allow upload, status and warning review.
- Numeric values align right and descriptions wrap.
- Source values and calculated values are visibly different.
- Status labels and progress reflect actual backend state.
- Keyboard navigation, accessible labels/focus, sufficient contrast and reduced-motion support.

## Required states

- Empty upload; file selected; validation failure.
- Unsupported/damaged/encrypted/too-large PDF.
- Text/scan/mixed classification.
- Estimate shown, insufficient balance, reservation confirmed.
- Top-up created/pending/paid/failed/canceled/expired.
- Processing, retrying, partial extraction, review required.
- Completed with warnings; complete without detected mismatch.
- XLSX generated and download ready.
- No usable records/zero billable pages.
- Processing or export failure/no charge/reservation released.
- Charge settled; balance transaction history.
- Duplicate callback safely ignored; payment requires reconciliation.
- User deletion and expired artifacts.

## UX anti-patterns

- “100% accurate” or recovery of original formulas claim.
- Fake progress, hidden provider waits, or ambiguous charges.
- Showing all submitted pages as billable without page-level assessment.
- Charging before an XLSX exists.
- Treating provider usage as customer billable pages.
- Assuming tax/rate/overhead rules.
- Exporting only values while advertising formulas.
- Showing QRIS/payment success before backend verification.
- Hiding warnings or requiring a complex dashboard before first conversion.
