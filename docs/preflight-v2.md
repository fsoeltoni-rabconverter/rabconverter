# Preflight v2 — progressive text extraction and RAB/BoQ screening

Status: implementation contract for the second upload slice.

## Goal

Read enough real PDF text to screen whether a document resembles a RAB/BoQ, while keeping each server request small and predictable. This is a screening result, not an XLSX conversion and not a guarantee that every row is correct.

## Processing flow

1. Browser validates file size and a tolerant PDF header before enabling the check.
2. The user chooses **Periksa PDF**. The file is sent directly to the Supabase Edge Function, held in request memory, and not persisted.
3. The server validates the PDF envelope, parses the document, counts pages, and rejects password-protected/corrupt files or documents above 200 pages.
4. The server extracts text sequentially from at most five pages per request. The next batch is requested only when the user chooses to continue; it re-uploads the selected in-memory browser file and asks for the next starting page.
5. Each page is classified with the existing deterministic RAB/BoQ signals. A merged summary uses the union of the signal groups so repeated headers on every page do not multiply the score.
6. The UI reports whether the document looks likely to be RAB/BoQ, needs confirmation, has insufficient evidence so far, does not look like RAB/BoQ, or contains pages that have no extractable text.
7. No OCR is attempted in this phase. Pages without a useful text layer are explicitly identified for the next OCR phase. They are not silently treated as non-RAB pages.

## Resource guardrails

| Guardrail | Current setting |
|---|---:|
| PDF size | Maximum 30 MiB |
| PDF page count | Maximum 200 |
| Pages extracted per request | 5 |
| Text items processed per page | Maximum 12,000 |
| Text characters retained per page | Maximum 40,000 |
| Anonymous request budget | Maximum 10 requests per 15 minutes per keyed client fingerprint |
| Aggregate uploaded bytes in the rate-limit window | Maximum 300 MiB per keyed client fingerprint |

Text extraction is sequential. Do not use an all-pages helper that fans out page extraction concurrently. Do not render a page to an image merely to detect whether text exists. The parser may inspect the PDF structure, but no OCR or image rendering is done here.

The original PDF and extracted text are not written to a database, Storage bucket, log, or response body. The browser receives only page numbers, character counts, truncation flags, classifier signals, and reason codes.

## Classifier outcomes

- `LIKELY_RAB`: multiple signal groups and cost-structure evidence were found. This is a screening result; it does not authorize conversion or billing by itself.
- `NEEDS_CONFIRMATION`: there is some RAB/BoQ evidence but not enough for automatic confidence.
- `NEEDS_MORE_PAGES`: the reviewed pages do not provide enough evidence and more pages remain.
- `NEEDS_OCR`: one or more relevant pages have no extractable text after the reviewed batch is complete. OCR is not run in v2.
- `NOT_RAB`: all pages were reviewed, text was available, and the classifier found insufficient RAB/BoQ evidence.
- `UNREADABLE_PDF`: reserved for a later post-OCR outcome; v2 does not claim this based only on an empty text layer.

Page-level results are retained in browser memory while the user reviews batches. The server sends page classification and signal summaries, never the extracted text itself.

## Not included

- OCR or scan recognition.
- Detailed table reconstruction, row/column coordinates, formula reconstruction, or XLSX writing.
- Credit pre-check, charging, or payments.
- Conversion success claims.
- A classifier accuracy claim. The four synthetic golden PDFs are regression fixtures, not a representative accuracy dataset.
