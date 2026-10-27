import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeAiBatch,
  parseLocalizedNumber,
  summarizeAiResult,
} from "../supabase/functions/rab-ai-convert/ai-core.js";

test("parses Indonesian RAB number conventions without losing decimals", () => {
  assert.equal(parseLocalizedNumber("1.000.000,00"), 1000000);
  assert.equal(parseLocalizedNumber("249.730,58"), 249730.58);
  assert.equal(parseLocalizedNumber("11,38"), 11.38);
  assert.equal(parseLocalizedNumber("17.10"), 17.1);
  assert.equal(parseLocalizedNumber("-1.200,50"), -1200.5);
  assert.equal(parseLocalizedNumber("—"), null);
});

test("keeps source amount unchanged and flags arithmetic mismatch instead of overwriting it", () => {
  const result = normalizeAiBatch({
    documentTitle: "DAFTAR KUANTITAS DAN HARGA",
    projectName: "Pemeliharaan gedung kantor",
    year: "2024",
    currency: "IDR",
    rows: [{
      batchPageIndex: 1,
      rowType: "item",
      itemNumber: "1.1",
      code: "",
      description: "Pekerjaan Pembersihan Lapangan",
      quantityText: "1,00",
      unit: "LS",
      unitPriceText: "1.000.000,00",
      amountText: "900.000,00",
      rawLine: "1.1 Pekerjaan Pembersihan Lapangan LS 1,00 1.000.000,00 900.000,00",
      confidence: "high",
      needsReview: false,
      reviewReason: "",
    }],
    pageSummaries: [{ batchPageIndex: 1, tableDetected: true, notes: "" }],
    warnings: [],
  }, { startPage: 11, pageCount: 1 });

  assert.equal(result.rows[0].sourcePage, 11);
  assert.equal(result.rows[0].amountText, "900.000,00");
  assert.equal(result.rows[0].amountValue, 900000);
  assert.equal(result.rows[0].lineMathCheck, "MISMATCH");
  assert.equal(result.rows[0].needsReview, true);
  assert.match(result.rows[0].reviewReason, /berbeda dari jumlah sumber/i);
});

test("passes a representative BPS RAB row with correct quantity x unit price", () => {
  const result = normalizeAiBatch({
    documentTitle: "DAFTAR KUANTITAS DAN HARGA",
    projectName: "Pemeliharaan Gedung Kantor BPS Provinsi Kalimantan Timur",
    year: "2024",
    currency: "IDR",
    rows: [{
      batchPageIndex: 1,
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
      needsReview: false,
      reviewReason: "",
    }],
    pageSummaries: [{ batchPageIndex: 1, tableDetected: true, notes: "" }],
    warnings: [],
  }, { startPage: 1, pageCount: 1 });

  assert.equal(result.rows[0].quantityValue, 162.84);
  assert.equal(result.rows[0].unitPriceValue, 172625.2);
  assert.equal(result.rows[0].amountValue, 28110287.57);
  assert.equal(result.rows[0].lineMathCheck, "MATCH");
  assert.equal(result.rows[0].needsReview, false);
});

test("adds page offsets from an AI page-batch into source PDF page numbers", () => {
  const result = normalizeAiBatch({
    documentTitle: "Sample",
    projectName: "",
    year: "",
    currency: "IDR",
    rows: [{
      batchPageIndex: 2,
      rowType: "section",
      itemNumber: "",
      code: "",
      description: "PEKERJAAN DINDING",
      quantityText: "",
      unit: "",
      unitPriceText: "",
      amountText: "",
      rawLine: "PEKERJAAN DINDING",
      confidence: "medium",
      needsReview: false,
      reviewReason: "",
    }],
    pageSummaries: [{ batchPageIndex: 1, tableDetected: false, notes: "" }, { batchPageIndex: 2, tableDetected: true, notes: "" }],
    warnings: [],
  }, { startPage: 6, pageCount: 2 });

  assert.equal(result.rows[0].sourcePage, 7);
  assert.deepEqual(result.pageSummaries.map((page) => page.sourcePage), [6, 7]);
});

test("summary counts review flags and arithmetic mismatches", () => {
  const result = normalizeAiBatch({
    documentTitle: "",
    projectName: "",
    year: "",
    currency: "IDR",
    rows: [
      { batchPageIndex: 1, rowType: "item", itemNumber: "", code: "", description: "", quantityText: "1", unit: "ls", unitPriceText: "100", amountText: "80", rawLine: "", confidence: "low", needsReview: false, reviewReason: "" },
    ],
    pageSummaries: [{ batchPageIndex: 1, tableDetected: true, notes: "" }],
    warnings: ["Perlu cek scan."],
  }, { startPage: 1, pageCount: 1 });
  const summary = summarizeAiResult(result.rows, result.pageSummaries, result.warnings);

  assert.equal(summary.itemCount, 1);
  assert.equal(summary.reviewCount, 1);
  assert.equal(summary.mismatchCount, 1);
  assert.ok(summary.warnings.some((warning) => /perlu ditinjau/i.test(warning)));
});
