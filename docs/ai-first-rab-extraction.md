# RabConverter — AI-first RAB/BoQ extraction

## Why this replaces the old conversion path

The browser-only heuristic parser failed on the benchmark PDF `F7_Daftar_Kuantitas_dan_Harga_1729241733.pdf`: its generated workbook kept only 18 rows and produced Rp13,565,442.30 against the PDF's stated total of Rp161,588,354.90. The AI path is now the primary conversion path; local parsing/OCR is no longer the source of truth for the workbook.

## Processing architecture

1. The browser sends the selected PDF to the RabConverter `rab-ai-convert` Edge Function.
2. The function validates the PDF envelope, size (30 MiB), page count (maximum 50), and anonymous conversion budget before invoking the model.
3. The function splits the in-memory PDF into five-page chunks and sends each chunk directly to Google's Gemini API using native PDF multimodal input. If a chunk is truncated or the response is structurally invalid, it retries that chunk as smaller page ranges. No local Tesseract text is required.
4. Gemini returns a strict JSON schema with every row type (section, item, subtotal, tax, total, note, header, unknown), literal source strings, source-page offsets, confidence, and review reasons.
5. Server validation maps batch page indices to original page numbers, parses numbers conservatively, and checks item-row quantity × unit price against the source amount. The checker marks a mismatch but never rewrites the extracted amount.
6. The browser creates an editable workbook containing:
   - **RAB Terstruktur** — normalized row data plus source page, confidence, and arithmetic review flags.
   - **Bukti AI** — verbatim-ish field strings returned by the model and the row transcription, to compare with the source.
   - **Ringkasan** — document metadata, warnings, quality counts, model, and provider-reported token usage.
   - **Cakupan Halaman** — per-page table detection and notes.
7. The workbook is downloaded directly from the browser. The application does not write the PDF or extraction result to Supabase Storage/database.

## Provider and model

- Provider: Google Gemini API.
- Default model: `gemini-4-argon`, the current high-capability multimodal model.
- Model can be overridden with the server secret `RAB_AI_MODEL`; thinking level can be changed with `RAB_AI_THINKING_LEVEL`.
- API key is stored only as the Supabase Edge Function secret `GEMINI_API_KEY`; it is never sent to the browser.
- Current published standard pricing for Gemini 4 Argon is $2 / 1M input tokens and $10 / 1M output tokens through **November 30, 2026**. The published rates change to $4 / 1M input tokens and $20 / 1M output tokens from **December 1, 2026**. PDF page/image tokens and reasoning/output are billable. Actual cost must be measured from provider usage metadata; this implementation reports tokens and call count, not a guaranteed dollar quote.
- Official references:
  - https://ai.google.dev/gemini-api/docs/document-processing
  - https://ai.google.dev/gemini-api/docs/generate-content/structured-output
  - https://ai.google.dev/gemini-api/docs/pricing
  - https://ai.google.dev/gemini-api/docs/latest-model

## Public-preview abuse budget

The endpoint is currently anonymous and uses an HMAC-derived IP fingerprint. The database migration `20261028010000_rab_ai_conversion_limits.sql` adds a dedicated atomic limiter with:
- at most 2 conversions per 15-minute window;
- at most 100 total pages per 15-minute window;
- at most 4 conversions per UTC day;
- at most 200 pages per UTC day.

The limiter stores no raw IP. It fails closed if the database limiter cannot run. These are preview limits, not a complete per-user commercial quota system; user accounts/paid plans require a separate identity and billing design.

## Secrets and activation

The deployment environment must set these Edge Function secrets in the Supabase project:

- `GEMINI_API_KEY` — required, generated in Google AI Studio / Gemini API.
- `RAB_AI_MODEL` — optional; defaults to `gemini-4-argon`.
- `RAB_AI_THINKING_LEVEL` — optional; defaults to `high`.

Set them in the Supabase Dashboard's Edge Function secrets or with the Supabase CLI; do not put them in `.env` files committed to GitHub or in `VITE_*` variables. Until `GEMINI_API_KEY` is set and the model is permitted for the Google project, the endpoint returns `AI_NOT_CONFIGURED` and no paid AI request is made.

For example with the Supabase CLI:
```sh
supabase secrets set --project-ref zkcziucjogprfzhjuaex GEMINI_API_KEY=YOUR_KEY
supabase secrets set --project-ref zkcziucjogprfzhjuaex RAB_AI_MODEL=gemini-4-argon
supabase secrets set --project-ref zkcziucjogprfzhjuaex RAB_AI_THINKING_LEVEL=high
```
Run these locally in a trusted terminal. Do not paste the actual API key into chat or repository files.

## Quality contract

- Original source number strings are preserved on the **Bukti AI** sheet.
- Parsed numeric cells are a convenience; if a string is ambiguous it stays as text rather than being guessed.
- Model confidence is not a correctness guarantee.
- Arithmetic mismatches flag rows for review; they do not replace model transcription with computed values.
- Subtotals, taxes and totals are not automatically recalculated or overwritten.
- No workbook is returned if a full batch cannot be extracted after bounded retries.
- Production accuracy is not claimed until the user-provided BPS benchmark and additional text/scanned/mixed RAB PDFs have been measured against the PDF totals and row coverage.
