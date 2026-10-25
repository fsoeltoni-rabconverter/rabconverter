# Security and Data Handling

## Data classification

Tender documents may include commercially sensitive pricing, client/project details, drawings, contractual terms, and company qualification data. Treat uploads and extracted values as private customer data.

## Minimum rules

- Require authenticated ownership for job listings, source files, extraction results and exports.
- Use private storage by default; do not publish public URLs for tender sources.
- Use short-lived signed download URLs or authorized downloads as appropriate.
- Use Supabase RLS for all user-owned database records and storage policies tied to user/job ownership.
- Do not include file content, extracted tender text, access tokens, service role keys or credentials in logs, test snapshots, GitHub artifacts or analytics.
- Store secrets only in GitHub Actions secrets, Supabase/Cloudflare secret management; never in source files or browser environment variables.
- The Supabase publishable key may be client-facing by design, but only with correct RLS and least privilege. Service role credentials must never reach the browser.
- Validate file signature, media type, byte/page/sheet limits and parser runtime.
- Never execute spreadsheet macros or active embedded content.
- Limit ZIP decompression and prevent archive path traversal if archives are later supported.
- Escape imported text when rendered in the UI; uploaded content is untrusted data, not instructions to the application.
- Record only stable error codes and redacted diagnostics.
- Define retention, deletion, backup and recovery expectations before production use.
- Clear both metadata and object storage artifacts when deletion is requested, with a controlled recovery window only if policy requires it.

## Data-processing providers

Before sending source documents to any third-party parser/OCR/AI provider, document:
- What file content is transmitted.
- Region/retention/training terms and applicable DPA.
- Maximum file sizes and request timeouts.
- Pricing and expected cost per page/file.
- Failure handling and ability to process without the provider.
- How user consent and deletion apply.

## Incident response

If a secret is exposed, rotate it rather than deleting it only from history. If tender documents become publicly accessible, revoke access, identify affected objects/logs, contain the exposure and record the incident before resuming changes.
