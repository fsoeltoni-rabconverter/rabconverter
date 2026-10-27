# Preflight v3 — selective browser-local OCR

Status: selective OCR implementation contract.

## Goal

Recover text from scanned pages identified by the Stage 2 server-side text extraction, without sending page images or OCR output to an OCR service. OCR is a screening aid; it does not reconstruct a reliable table or create an Excel workbook.

## Flow

1. The server-side preflight inspects at most five pages per request and returns page numbers plus flags indicating whether selectable text was found. It does not return extracted text.
2. The browser offers **OCR Lokal** only for reviewed pages that have no text layer and have not already had an OCR attempt.
3. The browser uses PDF.js to render only those page numbers, sequentially, to a bounded-size canvas.
4. Tesseract.js recognizes the rendered canvas with Indonesian and English language data. The raw result stays in tab memory only long enough to classify it; the UI stores only the character count, whether text was found, OCR-attempted flag, and deterministic classifier result.
5. The canvas is cleared and the worker/PDF.js document is terminated when the operation finishes. Removing/replacing the file aborts the current OCR run.
6. Up to five pages are processed in one OCR run. Further pages require another explicit click. Pages that remain unreadable after an attempt are labelled separately and are not offered for OCR repeatedly.

## Resource guardrails

| Guardrail | Current behavior |
|---|---|
| Input PDF | Existing preflight cap: 30 MiB, at most 200 pages |
| OCR page selection | Only reviewed pages with no extractable text |
| Pages per OCR run | Maximum 5, sequential |
| Render dimensions | Maximum 3,000 pixels on the longest side |
| Render canvas | Maximum target of 4 million pixels |
| OCR text retained for classification | Maximum 20,000 characters per page |
| OCR destination | Browser tab only; no PDF/image/text upload from the OCR stage |
| Persistence | No database, Storage, logs, or local-file write for OCR content |

Tesseract's worker code and language model are downloaded from a pinned public CDN on demand. That download contains the OCR software/model, not the user's document. The PDF is parsed and rendered on the user's device for this OCR step; network access is required the first time the OCR assets are fetched unless the browser has cached them.

## Accuracy and conversion scope

- Indonesian and English OCR is used because RAB/BoQ documents often combine Indonesian descriptions with English units and labels.
- OCR confidence is not treated as proof that amounts, quantities, or table columns are correct.
- The classifier consumes recognized text only for a coarse RAB/BoQ screening decision. It does not recover row/column coordinates, formulas, merged cells, totals, or spreadsheet formatting.
- An empty result after OCR becomes `UNREADABLE_PDF`; it is not silently classified as `NOT_RAB`.
- A PDF may contain both selectable-text pages and scanned pages. Strong text evidence from one page is not overwritten by a failed OCR attempt on another page.
- Browser memory and speed vary. Large or unusual page dimensions are rejected by the OCR renderer; users can still continue without OCR or choose another PDF.

## Not included

- Server-side/cloud OCR, external OCR API calls, or a server-side OCR queue.
- Automatic OCR of all 200 pages.
- Excel conversion, table reconstruction, formula generation, pricing, or charging.
- A claim of OCR accuracy on real-world RAB documents; synthetic text fixtures are not a representative OCR benchmark.
