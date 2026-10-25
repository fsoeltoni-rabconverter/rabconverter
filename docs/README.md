# RabConverter Documentation Index

These documents are the product and engineering source of truth. When documents disagree, use the precedence below and record the decision in the relevant decision log. Code must follow approved documentation, not define product behavior accidentally.

## Normative order

1. `product-definition.md` — product promise, target user, scope and non-goals.
2. `contractor-workflow.md` — end-to-end job/bid workflow and manual re-entry inventory.
3. `document-taxonomy.md` — tender file types, likely structures and extraction strategy.
4. `canonical-data-model.md` — normalized data contract and provenance.
5. `supported-formats.md` — format support and explicit limitations.
6. `user-experience.md` — remove.bg-inspired upload/review/export interaction.
7. `processing-pipeline.md` — classification, parsing, normalization, validation and failure handling.
8. `export-specification.md` — XLSX/CSV export contracts and reconciliation.
9. `acceptance-criteria.md` — testable definition of done.
10. `architecture.md` — cloud-only delivery and service boundaries.
11. `security-and-data-handling.md` — file privacy, retention, secrets and tenant boundaries.
12. `research-and-sources.md` — evidence log and source limitations.
13. `decisions/README.md` — architecture/product decision log.

## Required gates before feature implementation

- [ ] Product scope and the meaning of “no retyping” approved.
- [ ] Target user and first supported tender template family agreed.
- [ ] Representative examples for machine-readable spreadsheet and PDF inputs identified.
- [ ] Canonical item schema and source provenance approved.
- [ ] Import/export behavior documented, including unsupported/ambiguous cases.
- [ ] Cloud-only build, test, preview and deployment workflow agreed.
- [ ] Processing-provider decision documented only after a comparative test.

## Change process

A behavior-changing proposal must update the relevant normative docs and acceptance criteria in the same pull request. Keep changes small and reviewable. Do not create database tables, add paid processing providers, configure billing, or deploy a production route as a side effect of a documentation change.
