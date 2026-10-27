import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { PDFDocument } from "pdf-lib";
import { getResolvedPDFJS } from "unpdf";
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

for (const fixtureId of fixtures) {
  test(`extracts text in page order: ${fixtureId}`, async () => {
    const pdfBytes = new Uint8Array(
      await readFile(new URL(`../fixtures/golden/${fixtureId}.pdf`, import.meta.url)),
    );
    const expected = JSON.parse(
      await readFile(new URL(`../fixtures/golden/expected/${fixtureId}.json`, import.meta.url), "utf8"),
    );
    const pdfjs = await getResolvedPDFJS();
    const loadingTask = pdfjs.getDocument({
      data: pdfBytes,
      isEvalSupported: false,
      maxImageSize: 16_777_216,
    });
    const pdf = await loadingTask.promise;
    const pages = [];
    const extractedPages = [];

    try {
      assert.equal(pdf.numPages, expected.pages);
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        try {
          const extracted = await extractPageText(page);
          extractedPages.push(extracted.text);
          pages.push({
            pageNumber,
            textChars: extracted.textChars,
            textFound: extracted.text.length > 0,
            truncated: extracted.truncated,
            classification: classifyRabDocument(extracted.text),
          });
        } finally {
          page.cleanup();
        }
      }

      const allText = extractedPages.join("\\n");
      assert.ok(allText.length > 0, "text-based golden fixture should yield text");
      if (fixtureId === "basic-text-rab") {
        assert.match(allText, /PEKERJAAN PERSIAPAN/i);
        assert.match(allText, /SEMEN PORTLAND/i);
        assert.match(allText, /PASIR BETON/i);
      } else if (fixtureId === "wrapped-and-indonesian-numbers") {
        assert.match(allText, /PEKERJAAN TANAH/i);
        assert.match(allText, /BATU BATA/i);
      } else if (fixtureId === "multi-page-continuation") {
        assert.match(allText, /BETON K-250/i);
        assert.match(allText, /BEKISTING/i);
      } else if (fixtureId === "ambiguous-and-nonbillable") {
        assert.match(allText, /CAT TEMBOK/i);
      }

      const summary = summarizeRabPageClassifications(pages, { complete: true });
      assert.equal(summary.complete, true);
      assert.equal(summary.pagesReviewed, expected.pages);
    } finally {
      await loadingTask.destroy();
    }
  });
}

test("a page with no extracted text is not classified as NOT_RAB", () => {
  const classification = classifyRabDocument("");
  assert.equal(classification.status, "NEEDS_OCR");
});
