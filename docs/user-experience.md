# User Experience Specification — PDF RAB to Excel

## Reference model

Use remove.bg as an interaction simplicity reference: one primary upload action, understandable processing state and a clear downloadable result. Do not copy its brand or assets.

## Main flow

1. **Landing:** one clear message: “Ubah PDF RAB menjadi Excel dengan rumus yang bisa diedit.” Explain that formulas are reconstructed, not recovered exactly from PDF.
2. **Upload:** drag/drop and browse. State PDF-only scope for the first release, limits and a short private-file note.
3. **Classify:** show whether the PDF is text-based, scanned or mixed when detected.
4. **Process:** real staged progress (validating → reading pages → detecting tables → mapping RAB columns → rebuilding formulas → checking totals). Do not fake percentage progress.
5. **Preview:** show extracted table with fields and row types. Keep sections and totals visible; highlight low-confidence cells and formula candidates.
6. **Review exceptions:** list ambiguous amounts, OCR uncertainty, total mismatches, unclear tax/overhead logic and missing fields. Each warning links to the source page and affected row.
7. **Download:** primary action is Download Excel (.xlsx). Show that formulas were reconstructed and report how many rows/formulas need review. CSV/values-only output is secondary, not the main product promise.
8. **History:** later/optional; if provided, show recent jobs, status and download links. Allow deleting source and derived artifacts according to retention policy.

## Visual priorities

- Upload-first, clean and premium, desktop editing efficiency with responsive mobile upload.
- Result should be the star: readable table and a prominent download action.
- Dense tables must be scannable; numeric columns align right and descriptions wrap.
- Clearly distinguish extracted source values vs calculated formula values.
- Use simple status labels and real progress; no fake percentages.
- Review only exceptions when possible, but never hide uncertainty to make the output look successful.
- Keyboard navigation, accessible labels/focus, sufficient contrast and reduced-motion support.

## Key states

- Empty upload screen.
- File selected / validation.
- Unsupported or damaged PDF.
- Scanned/mixed PDF detected.
- Processing.
- Partial extraction / review required.
- Formula candidates available.
- Formula vs printed amount mismatch.
- Completed with warnings.
- Completed, no detected discrepancies.
- XLSX generated / download ready.
- Processing failed / retry.
- Delete job / expired source or export.

## UX anti-patterns

- “100% accurate” promise.
- Claiming original formulas were recovered.
- Fake progress or unexplained long processing.
- Treating every PDF as equally readable.
- Applying an assumed tax rate or market price.
- Turning every printed row into a work item.
- Exporting only values while advertising an Excel “with formulas.”
- Requiring a complex dashboard before the first conversion.
