# Canonical Data Model (Draft)

## Model rules

- Raw source and normalized interpretation are different layers.
- A normalized value may be null; a parser must not make up missing data.
- Preserve user-supplied text separately from normalized text.
- Amounts and quantities must use decimal-safe representation. Do not store currency values as floating-point numbers.
- Record locale/number parsing decisions and the parser version.
- Every row retains source provenance and review state.

## Core entities

### ProjectJob
- id: opaque stable ID
- owner_user_id: authenticated user ID
- project_name: nullable text
- client_name: nullable text
- tender_reference: nullable text
- project_location: nullable text
- received_at: timestamp
- bid_due_at: nullable timestamp plus original timezone/text
- status: uploaded | processing | review_required | ready | failed | deleted
- created_at, updated_at

### SourceDocument
- id, job_id
- original_filename, media_type, byte_size, checksum_sha256
- private_storage_path
- detected_document_type
- issue_date, revision_label, addendum_number (nullable)
- sheet_count, page_count (nullable)
- parser_name, parser_version
- status and structured error code
- uploaded_at, processed_at
- is_original: true; originals are immutable

### ExtractionRun
- id, job_id, source_document_id
- status: queued | running | needs_review | succeeded | failed | canceled
- run_number/idempotency_key
- pipeline_version and configuration version
- started_at, finished_at
- error_code, error_detail_safe
- summary JSON containing counts and warnings (not the full unbounded file payload)

### BoqSection
- id, job_id, source_document_id
- source_section_id nullable
- section_code_raw, section_title_raw
- normalized_title nullable
- display_order
- source_location

### BoqLineItem
- id, job_id, source_document_id, section_id nullable
- display_order, source_row_index, source_sheet_name, source_page_number
- source_cell_range/source_bbox nullable
- item_code_raw, item_code_normalized nullable
- description_raw, description_normalized nullable
- unit_raw, unit_normalized nullable
- quantity_raw nullable, quantity_decimal nullable
- unit_price_raw nullable, unit_price_decimal nullable
- amount_raw nullable, amount_decimal nullable
- currency_code nullable
- formula_raw nullable
- alternate/provisional flag nullable
- extraction_method, confidence_score nullable
- review_status: unreviewed | confirmed | corrected | rejected
- correction_note nullable
- created_at, updated_at

### ValidationIssue
- id, job_id, line_item_id nullable, source_document_id nullable
- code, severity: info | warning | blocking
- message_safe, source_location, suggested_action nullable
- status: open | resolved | ignored
- created_at, resolved_at nullable

### ExportArtifact
- id, job_id, export_format, export_version
- storage_path, created_at
- generated_from_extraction_run_id
- row_count, warnings_count, checksum_sha256

## Important separations

- Raw quantity text “1.250,50” and normalized decimal 1250.50 are separate fields.
- Amount extracted from source and amount recalculated by product are distinguishable.
- A formula string is not the same as its cached/displayed result.
- BOQ line items are not material purchase lines or AHSP resource rows.
- Section heading, item row, note, subtotal, grand total and continuation row must be distinct row kinds.
- User correction events should be auditable enough to make it clear what changed; avoid storing unnecessary copies of sensitive document text in logs.

## Before schema implementation

Confirm tenant ownership approach, retention/deletion behavior, maximum upload size, accepted MIME types, export immutability, and whether row-level edit history must support reverting changes. Use a versioned Supabase migration for all schema changes. Never make an ad-hoc production schema edit without recording its matching migration in Git.
