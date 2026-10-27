# PDF-to-XLSX v1 — local RAB extraction

Status: first end-to-end conversion slice.

## User-visible behavior

After the user selects a PDF, the existing server preflight checks its structure and scans for a text layer in five-page batches. After every page has been reviewed, the user can select **Konversi & Unduh Excel**.

The conversion itself runs in the browser. It reads positioned text from pages that have a text layer, reuses completed local OCR for scan pages when available, and performs local OCR only for scan pages that have not already been recognized. It then downloads a workbook directly to the user's device.

## Workbook contents

- **Tabel RAB** — a best-effort mapping to common RAB/BoQ columns: item number, work description, volume, unit, unit price, and total. Missing line totals are formula-derived when volume and unit price can be parsed. A total formula is added for the generated table.
- **Teks Sumber** — page-by-page extracted lines to let the user compare the reconstruction with the PDF.
- **Ringkasan** — file name, processed page count, scanned-page count, detected row count, and a review warning.

## Limits and privacy

- PDF input remains limited to 30 MiB.
- This beta conversion accepts at most 50 pages per file. The preflight screening limit remains 200 pages.
- PDF parsing, scan rendering, OCR, table heuristics, and XLSX creation run in the browser.
- The PDF, page images, and extracted/OCR text are not uploaded by the conversion action or saved to Supabase.
- The XLSX library is loaded on demand; first use needs internet access.

## Accuracy warning

PDFs do not share a universal table layout. Page coordinates, merged cells, wrapped descriptions, stamps, scans, and inconsistent separators can make automatic column inference imperfect. The generated workbook is an editable draft, not a verified accounting document. Users must compare quantities, units, prices, amounts, tax, and totals against the original PDF before relying on it.

## Out of scope

- Guaranteed table reconstruction across arbitrary templates.
- Keeping the original spreadsheet formulas or formatting.
- Detecting/repairing all OCR errors.
- Charging, checkout, or any claim that generated figures are authoritative.
