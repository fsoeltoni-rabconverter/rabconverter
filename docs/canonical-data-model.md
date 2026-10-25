# Canonical Data Model (Draft v2)

## Model rules

- Raw source and normalized interpretation are separate layers.
- A normalized value may be null; parser must not invent missing data.
- Preserve user-supplied text separately from normalized text.
- Amounts and quantities use decimal-safe representation, not floating-point storage.
- Record locale/number-parsing decisions and parser version.
- Every row retains source provenance and review state.
- A value printed in PDF and a newly reconstructed formula/result are distinct facts.

## Core entities

### ProjectJob
- id: stable opaque ID
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
- page_count (nullable)
- pdf_class: born_digital | scanned | mixed | unknown
- parser_name, parser_version
- status and structured error code
- uploaded_at, processed_at
- is_original: true; original is immutable

### ExtractionRun
- id, job_id, source_document_id
- status: queued | running | needs_review | succeeded | failed | canceled
- run_number/idempotency_key
- pipeline_version and configuration version
- started_at, finished_at
- error_code, safe error detail
- summary JSON containing counts and warnings (not unbounded file content)

### BoqSection
- id, job_id, source_document_id
- source_section_id nullable
- section_code_raw, section_title_raw
- normalized_title nullable
- display_order
- source_page_start, source_page_end nullable
- source_location

### BoqLineItem
- id, job_id, source_document_id, section_id nullable
- display_order, source_row_index nullable, source_page_number nullable
- source_cell_range/source_bbox nullable
- row_kind: section | item | note | subtotal | carried_forward | grand_total | adjustment | unknown
- item_code_raw, item_code_normalized nullable
- description_raw, description_normalized nullable
- unit_raw, unit_normalized nullable
- quantity_raw nullable, quantity_decimal nullable
- unit_price_raw nullable, unit_price_decimal nullable
- printed_amount_raw nullable, printed_amount_decimal nullable
- reconstructed_formula nullable
- reconstructed_amount_decimal nullable
- formula_provenance: not_applicable | reconstructed | user_confirmed | unresolved
- currency_code nullable
- extraction_method, field_confidence JSON/score nullable
- review_status: unreviewed | confirmed | corrected | rejected
- correction_note nullable
- created_at, updated_at

### ValidationIssue
- id, job_id, line_item_id nullable, source_document_id nullable
- code, severity: info | warning | blocking
- message_safe, source_location, suggested_action nullable
- source_printed_value nullable
- calculated_value nullable
- delta_value nullable
- status: open | resolved | ignored
- created_at, resolved_at nullable

### ExportArtifact
- id, job_id, export_format, export_version
- storage_path, created_at
- generated_from_extraction_run_id
- row_count, warnings_count, checksum_sha256
- contains_reconstructed_formulas boolean
- formula_contract_version nullable

## Important separations

- Raw quantity text 1.250,50 and normalized decimal 1250.50 are separate.
- Printed source amount and reconstructed calculated amount are separate.
- A formula string is not the same as a cached/displayed result.
- Generated formula provenance must never be represented as original formula recovery.
- BOQ line items are not material purchase lines or AHSP resource rows.
- Section heading, item row, note, subtotal, grand total and continuation row are distinct row kinds.
- User correction events should be auditable without unnecessarily copying sensitive document text into logs.

## Before schema implementation

Confirm tenant ownership, retention/deletion behavior, maximum upload size, supported MIME types, formula contract version, user correction history and whether raw pages/images need separate storage. Use versioned Supabase migrations for all schema changes; never make an ad-hoc production schema edit without its matching migration in Git.
