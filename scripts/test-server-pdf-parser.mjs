import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { PDFDocument } from "pdf-lib";

const fixtures = [
  "basic-text-rab",
  "wrapped-and-indonesian-numbers",
  "multi-page-continuation",
  "ambiguous-and-nonbillable",
];

for (const fixtureId of fixtures) {
  test(`pdf-lib parses fixture: ${fixtureId}`, async () => {
    const pdfBytes = await readFile(new URL(`../fixtures/golden/${fixtureId}.pdf`, import.meta.url));
    const expected = JSON.parse(
      await readFile(new URL(`../fixtures/golden/expected/${fixtureId}.json`, import.meta.url), "utf8"),
    );
    const document = await PDFDocument.load(pdfBytes, { updateMetadata: false });
    assert.equal(document.getPageCount(), expected.pages);
  });
}

test("parser rejects content that only imitates a PDF header", async () => {
  const fakePdf = new TextEncoder().encode("%PDF-1.7\nthis is not a structurally valid PDF");
  await assert.rejects(PDFDocument.load(fakePdf, { updateMetadata: false }));
});

test("page-count guardrail distinguishes 201 pages from the 200-page limit", async () => {
  const generated = await PDFDocument.create();
  for (let page = 0; page < 201; page += 1) generated.addPage([200, 300]);
  const saved = await generated.save({ updateFieldAppearances: false });
  const parsed = await PDFDocument.load(saved, { updateMetadata: false });
  assert.equal(parsed.getPageCount(), 201);
  assert.ok(parsed.getPageCount() > 200);
});
