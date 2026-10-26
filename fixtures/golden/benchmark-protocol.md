# Golden Fixture Benchmark Protocol

Status: P0 baseline, 2026-10-26.

## Purpose

Provide a repeatable benchmark contract for RabConverter. This protocol separates deterministic fixture correctness from provider performance/cost measurements.

## Fixture set

1. `basic-text-rab.pdf` — 1 page; plain text rows and subtotal.
2. `wrapped-and-indonesian-numbers.pdf` — 1 page; wrapped description and Indonesian numeric notation.
3. `multi-page-continuation.pdf` — 2 pages; continuation, page total, section subtotal and grand total.
4. `ambiguous-and-nonbillable.pdf` — 1 page; intentionally missing price/amount values.

Fixture SHA-256:

| Fixture | SHA-256 |
|---|---|
| `basic-text-rab.pdf` | `05a09d90b619b6726bc6623076f6933f4919bb8e67612726627cbd9d8b577a2c` |
| `wrapped-and-indonesian-numbers.pdf` | `ae0c91bc8935c02416f7b58fc8e98c6bd05fdbaf008a9502b41dc98d0b7264ba` |
| `multi-page-continuation.pdf` | `c5f7b0ea8a7f9279632a2f0066cbc13c9e0edffcce533b17cc71690bc7eebe81` |
| `ambiguous-and-nonbillable.pdf` | `aaf464dc37b755ff92763eda0335c768ed3f93821cf85dff00a6026c819993fc` |

## Deterministic correctness checks

For each fixture, the test harness must:

1. Count pages and compare with the fixture manifest.
2. Extract/normalize expected rows from `expected/*.json`.
3. Preserve source page provenance.
4. Keep unknown values null; never infer missing price/amount values.
5. Compare arithmetic against printed subtotal/total where a comparison is defined.
6. Validate formula candidates only where the expected oracle defines a safe formula.
7. Validate expected billable-page classification.
8. Fail on unexpected row loss, duplicate substantive rows, silent numeric changes, or provenance loss.

## Provider benchmark fields

When a real Reducto benchmark is authorized, record at minimum:

- fixture ID and SHA-256
- provider endpoint and pinned model/configuration where applicable
- request ID / file ID / job ID
- page count and extracted field count
- provider credits and usage fields returned by the API
- start/end timestamps and elapsed time
- HTTP status and terminal job status
- retry count and reason
- output checksum
- extraction correctness against the deterministic oracle
- notes on OCR/layout/citation behavior

Never put provider API keys, customer PDFs, or private account exports in Git.

## Runtime benchmark fields

For the XLSX/conversion-worker benchmark in P1, additionally record:

- runtime/worker platform and plan
- Node/runtime version
- package versions
- input PDF bytes and pages
- output XLSX bytes
- wall-clock time
- CPU time where available
- peak memory where available
- concurrency level
- failure/timeout behavior
- recalculation engine and version, if used
- formula-error scan result

Production thresholds must be chosen after baseline measurements, not invented in advance.
