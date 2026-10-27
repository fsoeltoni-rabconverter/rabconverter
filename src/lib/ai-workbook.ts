import * as XLSX from "xlsx";
import type { AiRabConversionResult, AiRabRow } from "./ai-conversion.js";

const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

function safeBaseName(name: string) {
  const stem = name.replace(/\.pdf$/i, "");
  const cleaned = stem.replace(/[^\p{L}\p{N}._ -]+/gu, "").trim().replace(/[ .]+$/g, "");
  return (cleaned || "rab-ai-converted").slice(0, 100);
}

function numericOrSource(value: number | null, raw: string): number | string {
  return value === null ? raw : value;
}

function rowIdentifier(row: AiRabRow) {
  return [row.itemNumber, row.code].filter(Boolean).join(" / ");
}

export function buildAiRabWorkbook(result: AiRabConversionResult, originalFileName: string) {
  const workbook = XLSX.utils.book_new();

  const structuredRows: (string | number | boolean | null)[][] = [
    [
      "No / Urutan",
      "Kode",
      "Uraian Pekerjaan",
      "Volume",
      "Satuan",
      "Harga Satuan (Rp)",
      "Jumlah Harga (Rp)",
      "Jenis Baris",
      "Halaman Sumber",
      "Keyakinan AI",
      "Validasi Volume × Harga",
      "Perlu Review",
      "Alasan Review",
    ],
    ...result.rows.map((row) => [
      row.itemNumber,
      row.code,
      row.description,
      numericOrSource(row.quantityValue, row.quantityText),
      row.unit,
      numericOrSource(row.unitPriceValue, row.unitPriceText),
      numericOrSource(row.amountValue, row.amountText),
      row.rowType,
      row.sourcePage,
      row.confidence,
      row.lineMathCheck,
      row.needsReview ? "YA" : "TIDAK",
      row.reviewReason,
    ]),
  ];
  const rabSheet = XLSX.utils.aoa_to_sheet(structuredRows);
  rabSheet["!cols"] = [
    { wch: 14 }, { wch: 18 }, { wch: 55 }, { wch: 14 }, { wch: 12 },
    { wch: 22 }, { wch: 22 }, { wch: 13 }, { wch: 14 }, { wch: 14 },
    { wch: 24 }, { wch: 14 }, { wch: 64 },
  ];
  if (result.rows.length) rabSheet["!autofilter"] = { ref: `A1:M${result.rows.length + 1}` };
  XLSX.utils.book_append_sheet(workbook, rabSheet, "RAB Terstruktur");

  const evidenceRows: (string | number | boolean)[][] = [
    [
      "Halaman",
      "Urutan Baris",
      "Tipe Baris",
      "No / Urutan Asli",
      "Kode Asli",
      "Uraian Asli dari AI",
      "Volume Asli",
      "Satuan Asli",
      "Harga Satuan Asli",
      "Jumlah Harga Asli",
      "Transkripsi Baris",
      "Keyakinan AI",
      "Perlu Review",
      "Validasi Hitungan",
      "Alasan Review",
    ],
    ...result.rows.map((row) => [
      row.sourcePage,
      row.rowIndex,
      row.rowType,
      row.itemNumber,
      row.code,
      row.description,
      row.quantityText,
      row.unit,
      row.unitPriceText,
      row.amountText,
      row.rawLine,
      row.confidence,
      row.needsReview ? "YA" : "TIDAK",
      row.lineMathCheck,
      row.reviewReason,
    ]),
  ];
  const evidenceSheet = XLSX.utils.aoa_to_sheet(evidenceRows);
  evidenceSheet["!cols"] = [
    { wch: 10 }, { wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 18 },
    { wch: 50 }, { wch: 16 }, { wch: 14 }, { wch: 22 }, { wch: 22 },
    { wch: 100 }, { wch: 14 }, { wch: 14 }, { wch: 22 }, { wch: 64 },
  ];
  if (result.rows.length) evidenceSheet["!autofilter"] = { ref: `A1:O${result.rows.length + 1}` };
  XLSX.utils.book_append_sheet(workbook, evidenceSheet, "Bukti AI");

  const summaryRows: (string | number)[][] = [
    ["RabConverter — Hasil Ekstraksi AI"],
    ["Nama File", originalFileName],
    ["Judul Dokumen", result.document.title],
    ["Nama Proyek", result.document.projectName],
    ["Tahun Anggaran", result.document.year],
    ["Mata Uang", result.document.currency],
    ["Jumlah Halaman", result.document.pageCount],
    ["Baris yang Diekstrak", result.quality.rowCount],
    ["Baris Item", result.quality.itemCount],
    ["Baris Perlu Review", result.quality.reviewCount],
    ["Mismatch Volume × Harga", result.quality.mismatchCount],
    ["Keyakinan Rendah", result.quality.lowConfidenceCount],
    ["Halaman Tanpa Tabel Terdeteksi", result.quality.pagesWithoutTable.join(", ") || "-"],
    ["Model AI", result.model],
    ["Token Input Dilaporkan", result.usage.inputTokens],
    ["Token Output Dilaporkan (termasuk reasoning bila dilaporkan)", result.usage.outputTokens],
    ["Panggilan Model", result.usage.calls],
    ["Retry Provider", result.usage.retries],
    ["Retry karena Output Terpotong / Tidak Valid", result.usage.splitRetries],
    ["Penyimpanan", "PDF dan hasil ekstraksi tidak disimpan permanen oleh RabConverter."],
    ["Pemrosesan AI", "PDF dikirim ke Google Gemini API untuk pemahaman dokumen multimodal; kebijakan provider berlaku."],
    ["Penting", "Nilai sumber tidak dihitung ulang atau ditimpa. Cocokkan angka, satuan, subtotal, pajak dan total terhadap PDF asli."],
    ["Peringatan"],
    ...result.quality.warnings.map((warning, index) => [`Warning ${index + 1}`, warning]),
  ];
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows);
  summarySheet["!cols"] = [{ wch: 48 }, { wch: 115 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Ringkasan");

  const pageRows: (string | number | boolean)[][] = [
    ["Halaman Sumber", "Tabel Terdeteksi", "Catatan AI"],
    ...result.pageSummaries.map((page) => [
      page.sourcePage,
      page.tableDetected ? "YA" : "TIDAK",
      page.notes,
    ]),
  ];
  const pageSheet = XLSX.utils.aoa_to_sheet(pageRows);
  pageSheet["!cols"] = [{ wch: 16 }, { wch: 18 }, { wch: 100 }];
  XLSX.utils.book_append_sheet(workbook, pageSheet, "Cakupan Halaman");

  const data = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  return {
    bytes: data instanceof Uint8Array ? data : new Uint8Array(data),
    fileName: `${safeBaseName(originalFileName)}.xlsx`,
    mimeType: XLSX_MIME,
  };
}

export function downloadAiWorkbook(result: AiRabConversionResult, originalFileName: string) {
  const workbook = buildAiRabWorkbook(result, originalFileName);
  const buffer = workbook.bytes.buffer.slice(
    workbook.bytes.byteOffset,
    workbook.bytes.byteOffset + workbook.bytes.byteLength,
  ) as ArrayBuffer;
  const blob = new Blob([buffer], { type: workbook.mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = workbook.fileName;
  anchor.style.display = "none";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
  return { fileName: workbook.fileName, byteLength: workbook.bytes.byteLength };
}
