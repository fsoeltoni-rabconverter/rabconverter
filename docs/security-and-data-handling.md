# Security and Data Handling — RAB PDF Conversion

## Data classification

PDF RAB/BOQ uploads and extracted data can disclose confidential client information, tender prices, margins, project locations, drawings, contract terms and supplier rates. Treat source PDFs and derived workbooks as private customer data.

## Minimum requirements

- Require an authenticated owner for job listing and access to source/output artifacts if accounts are enabled.
- Use private storage by default; never make tender PDFs publicly readable.
- Use authorized downloads or short-lived signed URLs.
- Apply Supabase RLS to user-owned job metadata and storage policies tied to file/job ownership.
- Keep service-role credentials out of browsers, source control and public logs.
- Keep secrets only in GitHub Actions secrets and cloud secret stores.
- Validate file signatures, media type, size, page count, encryption state and parser resource limits.
- Treat extracted content as untrusted text; escape it when rendered.
- Never execute PDF scripts, spreadsheet macros or other embedded active content.
- Do not log raw PDF text, page images, pricing data, session tokens or full signed URLs.
- Record stable error codes and redact diagnostics.
- Define retention, deletion, backup and recovery policy before production.
- A delete action should remove job metadata and source/output artifacts according to the published retention policy.
- Use checksum deduplication without exposing whether another customer has uploaded the same file.

## Formula and source-value integrity

- Preserve the displayed PDF amount as source evidence separately from the reconstructed formula/result.
- Never claim a formula recovered from PDF is the original source formula.
- Formula-vs-source discrepancies must be visible, not silently overwritten.
- Do not silently insert rates, taxes, overhead, profit or quantities.
- Keep formula provenance and parser version in export metadata/warnings.

## Third-party processing

Before sending documents to any external parser/OCR/AI provider, record:
- File data transmitted and processing location.
- Retention/training terms and any relevant DPA.
- Page/size limits and timeouts.
- Cost per page/document and retry behavior.
- Whether user consent/notice is needed.
- Deletion and provider fallback behavior.

## Incident response

If a credential is exposed, rotate it rather than relying only on deletion from source history. If a document is accidentally public, revoke access, identify affected objects/logs, contain exposure and record the incident before resuming changes.
