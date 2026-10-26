# RabConverter Golden Fixtures

Status: P0 synthetic fixture baseline, 2026-10-26.

These PDFs are **synthetic, repository-owned test fixtures**. They contain no customer documents, real project data, or copied third-party material. They are intentionally small so they can be used in deterministic tests and benchmark development.

## Fixtures

| File | Pages | Purpose | Expected billable pages |
|---|---:|---|---:|
| `basic-text-rab.pdf` | 1 | Plain text RAB, Indonesian thousands separator, item arithmetic and subtotal | 1 |
| `wrapped-and-indonesian-numbers.pdf` | 1 | Wrapped description plus Indonesian decimal/thousands notation | 1 |
| `multi-page-continuation.pdf` | 2 | Section continuation, page total, subtotal and grand total | 2 |
| `ambiguous-and-nonbillable.pdf` | 1 | Unknown price/amount must remain unknown while substantive rows remain traceable | 1 |

## Expected-output contract

Expected extraction and reconciliation results live beside the fixtures in `expected/*.json`. They are the deterministic oracle for the fixture set; they are not claims about Reducto accuracy until an actual provider run is performed.

For each substantive row the expected data records source page, item/description, unit, quantity, unit price, printed amount, formula candidate (when safe), and expected warnings. Unknown values are represented as `null`, never guessed.

## Benchmark rules

- Do not send these fixtures to a paid provider from CI.
- A provider benchmark must record provider/model configuration, request/job ID, pages, fields, credits, latency, retries, HTTP status, and result checksum where available.
- Do not use the fixture results to set production accuracy thresholds before baseline measurements exist.
- Real customer documents must never be added to this directory.
