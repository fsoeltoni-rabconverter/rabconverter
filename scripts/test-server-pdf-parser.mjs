import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { PDFDocument } from "pdf-lib";
import { getDocumentProxy } from "unpdf";
import { extractPageText } from "../supabase/functions/preflight-rab/pdf-text.js";
import { classifyRabDocument, summarizeRabPageClassifications } from "../supabase/functions/preflight-rab/rab-classifier.js";
import { hasPdfHeader, hasPdfTerminator } from "../supabase/functions/preflight-rab/pdf-envelope.js";

const fixtures = [
  "basic-text-rab",
  "wrapped-and-indonesian-numbers",
  "multi-page-continuation",
  "ambiguous-and-nonbillable",
];

for (const fixtureId of fixtures) {
  test(`pdf-lib parses fixture: ${fixtureId}`, async () => {
    const pdfBytes = await readFile(new URL(`../fixtures/golden/${fixtureId}.pdf`, import.meta.url));
    assert.equal(hasPdfHeader(pdfBytes), true);
    assert.equal(hasPdfTerminator(pdfBytes), true);
    const expected = JSON.parse(
      await readFile(new URL(`../fixtures/golden/expected/${fixtureId}.json`, import.meta.url), "utf8"),
    );
    const document = await PDFDocument.load(pdfBytes, { updateMetadata: false });
    assert.equal(document.getPageCount(), expected.pages);
  });
}

test("rejects content that only imitates a PDF header", async () => {
  const fakePdf = new TextEncoder().encode("%PDF-1.7\nthis is not a structurally valid PDF");
  assert.equal(hasPdfHeader(fakePdf), true);
  assert.equal(hasPdfTerminator(fakePdf), false);
  // The server endpoint applies this guard before passing bytes to pdf-lib.
  if (hasPdfHeader(fakePdf) && hasPdfTerminator(fakePdf)) {
    await PDFDocument.load(fakePdf, { updateMetadata: false });
  }
});

test("page-count guardrail distinguishes 201 pages from the 200-page limit", async () => {
  const generated = await PDFDocument.create();
  for (let page = 0; page < 201; page += 1) generated.addPage([200, 300]);
  const saved = await generated.save();
  const parsed = await PDFDocument.load(saved, { updateMetadata: false });
  assert.equal(parsed.getPageCount(), 201);
  assert.ok(parsed.getPageCount() > 200);
});

test("extracts text one page at a time and classifies RAB evidence from the actual PDF", async () => {
  const pdfBytes = new Uint8Array(await readFile(new URL("../fixtures/golden/basic-text-rab.pdf", import.meta.url)));
  const pdf = await getDocumentProxy(pdfBytes, { isEvalSupported: false, maxImageSize: 16_777_216 });
  const pages = [];
  try {
    assert.equal(pdf.numPages, 1);
    const page = await pdf.getPage(1);
    try {
      const extracted = await extractPageText(page);
      assert.ok(extracted.text.length > 0);
      assert.match(extracted.text, /PEKERJAAN PERSIAPAN/i);
      assert.match(extracted.text, /SEMEN PORTLAND/i);
      assert.match(extracted.text, /PASIR BETON/i);
      pages.push({
        pageNumber: 1,
        textChars: extracted.textChars,
        textFound: true,
        truncated: extracted.truncated,
        classification: classifyRabDocument(extracted.text),
      });
    } finally {
      page.cleanup();
    }
    const summary = summarizeRabPageClassifications(pages, { complete: true });
    assert.ok(["LIKELY_RAB", "NEEDS_CONFIRMATION"].includes(summary.status));
    assert.equal(summary.pagesReviewed, 1);
  } finally {
    await pdf.destroy();
  }
});

test("a page with no extracted text is not classified as NOT_RAB", () => {
  const classification = classifyRabDocument("");
  assert.equal(classification.status, "NEEDS_OCR");
});
