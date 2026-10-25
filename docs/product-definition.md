# Product Definition

Status: Draft for review  
Product: RabConverter

## One-sentence promise

Turn a contractor's received tender documents into reviewable, traceable RAB/BOQ spreadsheet data without manually retyping every line.

## Target user

Indonesian small and mid-sized contractors, specialist subcontractors, estimators and administrative staff who receive tender packages from owners, consultants, general contractors or procurement portals. The first use case assumes a contractor already has source documents and needs to prepare or adapt a spreadsheet, not necessarily measure a building from drawings.

## Primary job to be done

“When a project offer arrives, help me reuse the information already present in the client's documents so I can prepare my own priced RAB/BOQ and supporting spreadsheet with less clerical work and fewer transcription mistakes.”

## Success outcome

A user can upload a source file, quickly review its extracted line items, correct only exceptions, and download a usable workbook with source order and section structure preserved.

## Product principles

- **Upload first:** the central experience starts with files, not a complex project-management dashboard.
- **No silent invention:** unknown quantities, units, rates, codes or rules stay unknown until confirmed.
- **Review before trust:** show extracted candidate data and flag low-confidence content.
- **Preserve source:** original files remain immutable; every normalized row has provenance.
- **Spreadsheet-compatible:** Excel is a first-class deliverable because users and clients exchange working templates.
- **Template-aware:** preserve a client's format where feasible; do not assume every tender uses one universal layout.
- **Cloud-only development and operation:** GitHub is the code source, GitHub Actions validates/builds, Cloudflare hosts previews and the web app, and Supabase supplies relevant data/storage services.
- **User control:** make processing state, failures, retry, retention and deletion understandable.

## MVP scope

1. File upload and job creation.
2. Supported file detection and validation.
3. Parsing of common BOQ/RAB tables and project details from selected supported formats.
4. Editable extraction review table.
5. Numeric and structural reconciliation warnings.
6. XLSX and CSV export.
7. Job history for the signed-in user's own uploads.
8. Clear errors when a source cannot be parsed safely.

## Non-goals for MVP

- Automated takeoff measurements from drawings as a substitute for quantity surveying.
- A promise to interpret all scanned/handwritten/poor-quality pages.
- Automatic or authoritative market pricing.
- A universal AHSP/AHS engine across all years, regions and project types.
- Tender submission, digital signing or guaranteed procurement compliance.
- Full accounting, procurement, scheduling, project management or cost control.

## Product boundary and language

The application extracts and organizes evidence. It is not the authority for the bid. The contractor checks quantities, units, rates, formulas, exclusions, contract terms and final submission.

## How we will know it works

Measure: successful imports by format; proportion of line items accepted without correction; correction types; exports that reopen as valid spreadsheets; duplicate/missing-row detection; processing failures; and time to first reviewed export. Do not claim a percentage productivity gain until measured in representative use.
