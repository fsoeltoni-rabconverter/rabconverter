import assert from "node:assert/strict";
import test from "node:test";

import {
  MAX_FILE_SIZE_BYTES,
  MAX_PDF_PAGES,
  classifyRabDocument,
  validatePdfFile,
} from "../src/lib/preflight.js";

function fileFromBytes(bytes, name = "sample.pdf", type = "application/pdf") {
  return new File([bytes], name, { type });
}

test("limits stay aligned with the v1 preflight contract", () => {
  assert.equal(MAX_FILE_SIZE_BYTES, 30 * 1024 * 1024);
  assert.equal(MAX_PDF_PAGES, 200);
});

test("rejects an empty file", async () => {
  const result = await validatePdfFile(fileFromBytes(""));
  assert.equal(result.ok, false);
  assert.equal(result.code, "FILE_EMPTY");
});

test("rejects a file without a PDF header even if its name and MIME say PDF", async () => {
  const result = await validatePdfFile(fileFromBytes("<html>not a PDF</html>"));
  assert.equal(result.ok, false);
  assert.equal(result.code, "NOT_A_PDF");
});

test("accepts a PDF header in the first 1,024 bytes", async () => {
  const prefix = " ".repeat(100) + "%PDF-1.7\n";
  const result = await validatePdfFile(fileFromBytes(prefix + "synthetic test bytes"));
  assert.equal(result.ok, true);
  assert.equal(result.code, "PDF_HEADER_OK");
});

test("rejects files above the size limit without reading file bytes", async () => {
  const tooLarge = {
    size: MAX_FILE_SIZE_BYTES + 1,
    slice() {
      throw new Error("slice must not be called for oversized files");
    },
  };
  const result = await validatePdfFile(tooLarge);
  assert.equal(result.ok, false);
  assert.equal(result.code, "FILE_TOO_LARGE");
});

test("requests OCR when no text layer is available yet", () => {
  assert.equal(classifyRabDocument("").status, "NEEDS_OCR");
});

test("reports unreadable after OCR was attempted but yielded no text", () => {
  assert.equal(classifyRabDocument("", { ocrAttempted: true }).status, "UNREADABLE_PDF");
});

test("classifies a text-based RAB with repeated cost rows as likely RAB", () => {
  const text = [
    "RENCANA ANGGARAN BIAYA",
    "Uraian Pekerjaan | Volume | Satuan | Harga Satuan | Jumlah Harga",
    "Pekerjaan beton | 10 | m3 | 500000 | 5000000",
    "Pekerjaan pasir | 2 | m3 | 300000 | 600000",
    "Subtotal | 5600000",
  ].join("\n");
  const result = classifyRabDocument(text);
  assert.equal(result.status, "LIKELY_RAB");
  assert.ok(result.signals.includes("rab_title"));
  assert.ok(result.signals.includes("repeated_item_rows"));
});

test("does not automatically accept a RAB title without cost-structure evidence", () => {
  const result = classifyRabDocument("RENCANA ANGGARAN BIAYA");
  assert.equal(result.status, "NEEDS_CONFIRMATION");
});

test("classifies unrelated text with no RAB evidence as not RAB", () => {
  const result = classifyRabDocument("Laporan rapat mingguan. Daftar peserta dan agenda rapat.");
  assert.equal(result.status, "NOT_RAB");
});
