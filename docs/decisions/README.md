# Decision Log

Record decisions that affect product behavior, document contracts or infrastructure. Accepted decisions are concise and dated; proposals remain clearly marked.

## DEC-001: Start with conversion of provided BOQ/RAB documents

- Status: Proposed
- Date: 2026-10-25
- Context: Drawing-based takeoff is substantially different from extracting an existing bill/estimate and is harder to validate.
- Decision: MVP focuses on extracting structured rows from a provided BOQ/RAB, review/correction, validation warnings and spreadsheet export.
- Consequence: Do not advertise “generate an accurate RAB from any drawing” in the initial release.
- Evidence: `contractor-workflow.md`, `research-and-sources.md`.

## DEC-002: Use remove.bg as interaction simplicity reference only

- Status: Proposed
- Date: 2026-10-25
- Context: The requested benchmark is remove.bg.
- Decision: Adopt the clear upload → processing → result/review shape, not visual assets or exact branding.
- Consequence: Make extraction/review/export the central loop; defer complex dashboards.

## DEC-003: Cloud-only development workflow

- Status: Proposed
- Date: 2026-10-25
- Context: All development and preview must happen in cloud services; there is no local development workflow.
- Decision: GitHub is the source of truth, GitHub Actions runs checks/deploys, Cloudflare hosts preview/app, Supabase provides data/auth/storage as needed.
- Consequence: Cloud credentials and service access must be verified before enabling deploy automation; every PR must produce a reviewable preview.

## How to add a decision

Create a new numbered file (e.g. `DEC-004-private-storage.md`) containing status, date, context, decision, alternatives, consequences, and evidence. Link it from this index. Do not silently rewrite an accepted decision without recording a superseding decision.
