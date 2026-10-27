# Preflight v1.0 — PDF RAB/BoQ

Status: implementation contract for the first upload-validation slice.

## Purpose

Preflight decides whether an uploaded file is eligible to enter conversion. It is not the conversion engine and must not claim that a PDF has been fully parsed or that a document is a RAB solely from its filename or browser MIME type.

The preview uploads a selected PDF directly to the preflight Edge Function only after the user starts a check. The server holds it in request memory and does not write it to persistent storage. Client checks are early feedback only; server checks remain authoritative.

## Limits

| Rule | v1 policy | Notes |
|---|---|---|
| File type | PDF only | Check PDF header bytes, then parse the file server-side. Extension and MIME are hints, never proof. |
| File size | 1 byte–30 MiB inclusive | 30 MiB = 31,457,280 bytes; existing UI limit retained. |
| Page count | 1–200 pages inclusive | Provisional guardrail. Must be benchmarked with the selected parser/provider before production. Enforce after parsing; browser file validation cannot enforce it. |
| Encryption | Password-protected PDFs unsupported in v1 | Return a dedicated error. Do not request or log passwords. |
| Corruption | Must be parseable as a PDF | A header check alone cannot prove structural integrity. |
| Scan/OCR | Scanned PDFs are allowed when OCR produces usable content | Image-only is not automatically NOT_RAB. OCR capability and quality must be confirmed by the configured extraction provider. |
| Mixed PDF | Supported when RAB pages can be identified | Classify at page level. |
| Handwriting | Best effort, not guaranteed | If OCR/parse quality is insufficient, stop without guessing values. |

A PDF header may appear within the first 1,024 bytes for compatibility. This early browser check is deliberately tolerant. It is not a security boundary: a server parser must validate the complete file.

## Document classification

Classification input is extracted text, preferably with page boundaries and layout/table evidence preserved. Apply OCR to pages that yield no useful text before deciding that they are unreadable. The first implementation uses deterministic signals, not an LLM score, and reports reasons for its decision.

### Signals and weights

| Signal | Score | Evidence |
|---|---:|---|
| RAB / Rencana Anggaran Biaya / BoQ / Bill of Quantities / Daftar Kuantitas dan Harga title or context | +3 | Matching title/context phrase |
| Work-item description column or repeated work descriptions | +2 | Uraian, pekerjaan, description, item pekerjaan, deskripsi pekerjaan |
| Quantity/volume and unit evidence | +2 | Volume, kuantitas, qty, quantity and/or satuan/unit |
| Unit price, amount, total-price or cost evidence | +2 | Harga satuan, unit price, jumlah harga, amount, total biaya/harga |
| Repeated item-like lines with at least two numeric values | +2 | At least two distinct lines with description-like text and multiple numeric values |
| Construction domain terms | +1 | Material, upah, beton, pondasi, AHSP, HSPK, etc. |
| Subtotal, grand total, cost recap or relevant tax row | +1 | Subtotal, total, rekapitulasi, pajak |

Normalize case and whitespace; accept Indonesian and English column variants. A phrase match is evidence, not a requirement that the source use a specific template.

### Decision rules

1. NEEDS_OCR: extracted text is empty and OCR has not yet been attempted.
2. UNREADABLE_PDF: extracted text remains empty after OCR, or extraction output is unusable.
3. LIKELY_RAB: score >= 6, evidence exists in at least two signal groups, and structural-cost evidence is present. Structural-cost evidence means repeated item-like numeric rows, or description + quantity/unit + price signals, or description + price + totals signals.
4. NEEDS_CONFIRMATION: score 3–5, or score >= 6 but structural-cost evidence is insufficient. Do not automatically start conversion.
5. NOT_RAB: score < 3 after text/OCR is available, with no RAB/BoQ evidence adequate for confirmation.

A title alone is never enough for LIKELY_RAB. A PDF that contains only a scan must go through OCR before NOT_RAB can be returned. These are deterministic v1 thresholds to test and tune on the golden corpus, not a claimed accuracy rate.

### Page classification

Each page may be assigned RAB_CONTENT, COVER_METADATA, SUPPORTING_ATTACHMENT, BLANK, or UNKNOWN. A page whose table continues from a previous page remains RAB content even when the column header is not repeated. Use UNKNOWN when evidence is insufficient; do not silently discard uncertain rows.

Only substantive RAB pages that are retained successfully in the final workbook are billable under the current product policy. Total PDF pages are used only for the conservative preflight maximum-cost estimate. A page must not be billed just because it was uploaded.

## Error codes

| Code | User-facing meaning | Retry? |
|---|---|---|
| FILE_EMPTY | File is empty. Choose another PDF. | Yes |
| FILE_TOO_LARGE | File exceeds the 30 MiB limit. | After reducing size |
| NOT_A_PDF | The selected file does not look like a PDF. | With a valid PDF |
| PDF_READ_FAILED | Browser could not read this file. | Yes |
| PDF_CORRUPT | PDF is damaged or truncated. | With a new/exported PDF |
| TOO_MANY_PAGES | PDF exceeds the 200-page limit for this version. | Split the PDF |
| PDF_PASSWORD_PROTECTED | Password-protected PDFs are not supported in this version. | Upload an unlocked copy |
| PDF_PARSE_FAILED | PDF structure could not be processed. | Sometimes |
| INSUFFICIENT_CREDITS | Balance is insufficient for the estimated maximum cost. | After top-up |
| NEEDS_OCR | Text layer was not found; OCR is required. | Continue only if OCR is available |
| UNREADABLE_PDF | Text/table could not be read reliably. | Try a clearer PDF |
| NOT_RAB_BOQ | This document does not appear to be an RAB/BoQ. | Choose the correct document |
| RAB_CLASSIFICATION_UNCERTAIN | It is not yet clear whether this document is an RAB/BoQ. | User confirmation |
| PREFLIGHT_TEMPORARY_FAILURE | Document checks temporarily failed. | Yes |

The classifier's statuses are typed results, while error codes represent validation or processing failures. Insufficient credits is a billing gate, not a document-rejection reason.

## Processing order

1. Browser checks basic size and PDF-header bytes for fast feedback.
2. Server repeats file-size/type validation and parses the complete PDF, counts pages, and detects encryption/corruption.
3. Check available credits using page count as the conservative maximum-cost estimate. Do not call a paid extraction provider when credits are insufficient.
4. Extract text/layout; use OCR when needed and supported. Reuse provider output for classification and conversion where possible instead of making duplicate paid calls.
5. Classify the document and relevant pages.
6. For NEEDS_CONFIRMATION, wait for explicit user confirmation. Do not silently proceed.
7. For accepted documents, convert and validate the XLSX. Debit credits once only after a usable result passes the basic result checks.
8. Any failed preflight or conversion leaves the credit balance unchanged.

## Acceptance test matrix

| Case | Expected result |
|---|---|
| Genuine PDF with valid header | Passes browser header check |
| PNG/HTML renamed to .pdf | Fails PDF-header check |
| Empty file | FILE_EMPTY |
| File > 30 MiB | FILE_TOO_LARGE |
| Header-like bytes but malformed PDF | Browser may pass; authoritative server parser must reject as PDF_CORRUPT or PDF_PARSE_FAILED |
| 200-page PDF | Within page limit, subject to parser success |
| 201-page PDF | TOO_MANY_PAGES |
| RAB with text and item rows | LIKELY_RAB |
| Title says RAB but no structural cost evidence | NEEDS_CONFIRMATION, never auto-accept |
| Ordinary article/invoice with no RAB evidence | NOT_RAB |
| Image-only scan before OCR | NEEDS_OCR |
| Scan with useful OCR result and cost-table evidence | Classification from OCR text |
| Scan still unreadable after OCR | UNREADABLE_PDF |
| RAB table continues on next page without repeated headers | Continued page kept as RAB content when layout/context supports it |
| Mixed RAB and supporting appendices | Per-page classification |
| Any preflight failure | No credit debit |
| Credits insufficient | No paid provider call |
| Accepted preflight | Can proceed to conversion; does not by itself mean XLSX is successful |

## Scope boundaries

Stage 1 implements browser header/size validation and server-side PDF structure/page-count checks. Stage 2 adds progressive text extraction and deterministic RAB/BoQ classification in batches of at most five pages. Both stages avoid persistent PDF storage and do not render pages or run OCR. The anonymous preview endpoint has exact-origin CORS and a database-backed per-client request/byte budget; CORS is not treated as authentication. OCR, credit checks, XLSX generation, and conversion remain out of scope.
