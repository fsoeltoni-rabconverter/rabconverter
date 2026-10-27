import assert from "node:assert/strict";
import test from "node:test";
import * as XLSX from "xlsx";

import { buildAiRabWorkbook } from "../src/lib/ai-workbook.ts";

test("AI workbook preserves source strings, numeric values, review flags, and source pages", () => {
  const output = buildAiRabWorkbook({
    ok: true,
    status: "AI_EXTRACTION_COMPLETE",
    provider: "google-gemini",
    model: "gemini-4-argon",
    document: {
      title: "DAFTAR KUANTITAS DAN HARGA",
      projectName: "Pemeliharaan gedung kantor",
      year: "2024",
      currency: "IDR",
      pageCount: 2,
    },
    rows: [{
      rowIndex: 1,
      sourcePage: 2,
      rowType: "item",
      itemNumber: "3.1",
      code: "",
      description: "Wallpaper Ruang PST",
      quantityText: "162,84",
      unit: "m2",
      unitPriceText: "172.625,20",
      amountText: "28.110.287,57",
      rawLine: "3.1 Wallpaper Ruang PST m2 162,84 172.625,20 28.110.287,57",
      confidence: "high",
      needsReview: true,
      reviewReason: "Perlu tinjau manual",
      quantityValue: 162.84,
      unitPriceValue: 172625.2,
      amountValue: 28110287.57,
      lineMathCheck: "MATCH",
    }],
    pageSummaries: [{ sourcePage: 2, tableDetected: true, notes: "Tabel berlanjut." }],
    quality: {
      rowCount: 1,
      itemCount: 1,
      reviewCount: 1,
      mismatchCount: 0,
      lowConfidenceCount: 0,
      pagesWithoutTable: [],
      warnings: ["Periksa dokumen asli."],
    },
    usage: { model: "gemini-4-argon", inputTokens: 2000, outputTokens: 900, calls: 1, retries: 0, splitRetries: 0 },
    processing: {
      mode: "ai-first-native-pdf-understanding",
      pagesPerBatch: 5,
      persistentStorage: false,
      pdfSentToAiProvider: true,
      providerOcr: "native multimodal document understanding",
      valuesRecomputedOrOverwritten: false,
    },
    message: "Review.",
  }, "benchmark.pdf");

  assert.equal(output.fileName, "benchmark.xlsx");
  const workbook = XLSX.read(output.bytes, { type: "array" });
  assert.deepEqual(workbook.SheetNames, ["RAB Terstruktur", "Bukti AI", "Ringkasan", "Cakupan Halaman"]);
  const structured = XLSX.utils.sheet_to_json(workbook.Sheets["RAB Terstruktur"], { header: 1, defval: "" });
  const evidence = XLSX.utils.sheet_to_json(workbook.Sheets["Bukti AI"], { header: 1, defval: "" });
  const summary = XLSX.utils.sheet_to_json(workbook.Sheets["Ringkasan"], { header: 1, defval: "" });

  assert.equal(structured[1][2], "Wallpaper Ruang PST");
  assert.equal(structured[1][3], 162.84);
  assert.equal(structured[1][5], 172625.2);
  assert.equal(structured[1][6], 28110287.57);
  assert.equal(structured[1][8], 2);
  assert.equal(structured[1][11], "YA");
  assert.equal(evidence[1][6], "162,84");
  assert.equal(evidence[1][8], "172.625,20");
  assert.equal(evidence[1][9], "28.110.287,57");
  assert.match(String(summary[9][1]), /1/);
  assert.match(String(summary[20][1]), /Gemini API/);
});
