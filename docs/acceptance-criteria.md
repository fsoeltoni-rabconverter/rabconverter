# Acceptance Criteria

Status: draft; to be finalized after choosing exact file/parser stack.

## Upload and job

- A signed-in user can create a job by uploading a supported source document.
- Unsupported, corrupt, encrypted or oversized files fail with clear and actionable errors.
- Original file is stored unchanged and can be associated with the job.
- Re-upload/retry does not duplicate a job's processing run unexpectedly.
- A user cannot list or download another user's job or artifacts.

## Extraction

- On every golden fixture, expected item rows, section hierarchy, ordering, values and source references are tested.
- Description, item code, unit, quantity, rate and amount are captured separately when present.
- Blank values stay blank; parser does not invent price/quantity/unit.
- Subtotal and total rows are differentiated from regular line items.
- Localized numeric strings are either parsed using confirmed context or flagged as ambiguous.
- Each row maps to a source sheet/row or PDF page/location when technically available.
- The job is marked review-required if a blocking ambiguity remains.

## Review

- User can edit a field and see save state.
- User can inspect the source context for a row/field.
- Issues can be resolved or explicitly ignored with state retained.
- A failure or reload must not silently discard accepted edits.

## Export

- XLSX opens as a valid workbook in common spreadsheet software.
- Export preserves expected line-item ordering and section hierarchy.
- Null prices remain blank; recalculated amounts are clearly distinguished from source values.
- Export contains an exceptions summary when unresolved warnings exist.
- Re-importing an export yields consistent line-item values for tested fields.

## Cloud delivery

- Every pull request runs deterministic lint/type/test/build steps in GitHub Actions.
- Pull request preview is available from Cloudflare after CI succeeds.
- Production deployment only occurs from the explicitly configured production branch or approved release trigger.
- No credentials or raw tender documents are written to repository artifacts or public logs.
- Supabase schema changes are versioned in the repository and applied deliberately.
- Deployment output includes the exact commit SHA and preview URL.

## Quality gate

Do not call MVP ready until the selected golden test suite passes, the extraction UI can review exceptions, export round-trip checks pass, and the cloud preview has been manually inspected at desktop and mobile sizes.
