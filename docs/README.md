# RabConverter Documentation Index

These documents are the product and engineering source of truth. When documents disagree, use the precedence below and record the decision in the decision log. Code must follow approved documentation, not define product behavior accidentally.

## Normative order

1. product-definition.md — product promise, scope and formula-reconstruction boundary.
2. contractor-workflow.md — Indonesian contractor process, pain signals and manual re-entry inventory.
3. document-taxonomy.md — PDF classes, RAB row types and extraction targets.
4. canonical-data-model.md — normalized data, formula provenance and source traceability.
5. supported-formats.md — initial PDF scope and golden test matrix.
6. user-experience.md — remove.bg-inspired upload/review/download flow.
7. processing-pipeline.md — extraction, formula reconstruction, validation and failure handling.
8. export-specification.md — formula-bearing XLSX contract and reconciliation.
9. acceptance-criteria.md — testable definition of done.
10. architecture.md — cloud-only architecture and deployment.
11. security-and-data-handling.md — private files, retention and secrets.
12. research-and-sources.md — evidence log, source quality and research limits.
13. decisions/README.md — product/architecture decision log.

## Required gates before feature implementation

- [ ] PDF RAB/BOQ is the explicit first input path.
- [ ] Formula reconstruction is clearly distinguished from original formula recovery.
- [ ] Supported layouts/formats and ambiguous cases are agreed.
- [ ] Golden PDFs with reuse permission are identified and expected outputs written down.
- [ ] Canonical fields, row types, source locations and formula provenance are approved.
- [ ] XLSX export contract and source-vs-calculated reconciliation are agreed.
- [ ] Cloud-only CI, preview and deployment workflow is configured.
- [ ] Processing provider is selected only after benchmark, privacy, cost and runtime review.

## Change process

Behavior-changing proposals must update relevant normative docs and acceptance tests in the same pull request. Keep changes small and reviewable. Do not add database schema, paid processors, billing, or production routes as a side effect of documentation changes.
