import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";
import * as XLSX from "xlsx";
import { ocrPdfPages, type LocalOcrPageResult, type LocalOcrProgress } from "./local-ocr.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export const MAX_CONVERSION_PAGES = 50;

export type ConversionProgress = {
  phase: "opening" | "extracting-text" | "ocr" | "writing-xlsx";
  completed: number;
  total: number;
  pageNumber?: number;
  detail: string;
};

export type PdfConversionResult = {
  bytes: Uint8Array;
  fileName: string;
  pagesProcessed: number;
  scannedPages: number;
  structuredRows: number;
  sourceLines: number;
};

type ConversionOptions = {
  signal?: AbortSignal;
  cachedOcrPages?: Record<number, LocalOcrPageResult>;
  onProgress?: (progress: ConversionProgress) => void;
};

type PositionedText = {
  text: string;
  x0: number;
  y: number;
  x1: number;
  height: number;
};

type SourceRow = {
  pageNumber: number;
  lineNumber: number;
  cells: string[];
};

type StandardRow = {
  number: string | number;
  description: string;
  volume: string | number;
  unit: string;
  unitPrice: string | number;
  amount: string | number;
  formulaAmount: boolean;
};

function abortIfNeeded(signal?: AbortSignal) {
  if (signal?.aborted) throw new DOMException("Konversi dibatalkan.", "AbortError");
}

function normalizedText(value: string) {
  return value.toLocaleLowerCase("id-ID").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

function parseIndonesianNumber(value: string): number | null {
  let text = value.trim().replace(/^(?:rp|idr)\s*/i, "").replace(/\s/g, "");
  const negative = text.startsWith("(") && text.endsWith(")");
  text = text.replace(/[()]/g, "");
  if (!/^[+-]?\d+(?:[.,]\d+)*$/.test(text)) return null;
  text = text.replace(/\+/g, "");
  const dotCount = (text.match(/\./g) ?? []).length;
  const commaCount = (text.match(/,/g) ?? []).length;

  if (dotCount > 0 && commaCount > 0) {
    if (text.lastIndexOf(",") > text.lastIndexOf(".")) {
      text = text.replace(/\./g, "").replace(",", ".");
    } else {
      text = text.replace(/,/g, "");
    }
  } else if (commaCount > 0) {
    const parts = text.split(",");
    if (parts.length > 2 || parts.at(-1)?.length === 3) text = parts.join("");
    else text = parts.slice(0, -1).join("") + "." + parts.at(-1);
  } else if (dotCount > 0) {
    const parts = text.split(".");
    if (parts.length > 2 || parts.at(-1)?.length === 3) text = parts.join("");
  }

  const result = Number(text);
  if (!Number.isFinite(result)) return null;
  return negative ? -result : result;
}

function splitSpacedCells(text: string): string[] {
  const cells = text.split(/\s{2,}/).map((cell) => cell.trim()).filter(Boolean);
  return cells.length > 1 ? cells : [text.trim()].filter(Boolean);
}

function rowsFromPositionedText(items: PositionedText[]): string[][] {
  if (!items.length) return [];
  items.sort((left, right) => left.y - right.y || left.x0 - right.x0);
  const lines: Array<{ y: number; height: number; items: PositionedText[] }> = [];

  for (const item of items) {
    const current = lines.at(-1);
    const tolerance = Math.max(2.5, Math.min(7, item.height * 0.45));
    if (!current || Math.abs(current.y - item.y) > tolerance) {
      lines.push({ y: item.y, height: item.height, items: [item] });
    } else {
      const count = current.items.length;
      current.y = (current.y * count + item.y) / (count + 1);
      current.height = (current.height * count + item.height) / (count + 1);
      current.items.push(item);
    }
  }

  return lines.map((line) => {
    line.items.sort((left, right) => left.x0 - right.x0);
    const cells: string[] = [];
    let cell = "";
    let lastRight = 0;
    for (const item of line.items) {
      const gap = item.x0 - lastRight;
      const threshold = Math.max(8, line.height * 1.3);
      if (cell && gap > threshold) {
        cells.push(cell.trim());
        cell = "";
      }
      cell += (cell ? " " : "") + item.text;
      lastRight = Math.max(lastRight, item.x1);
    }
    if (cell.trim()) cells.push(cell.trim());
    const cleaned = cells.flatMap(splitSpacedCells).filter(Boolean);
    return cleaned.length ? cleaned : [];
  }).filter((row) => row.length > 0);
}

function sourceRowsFromPdfItems(items: Array<Record<string, unknown>>, pageHeight: number): string[][] {
  const positioned: PositionedText[] = [];
  for (const item of items) {
    const text = typeof item.str === "string" ? item.str.replace(/\u0000/g, "").trim() : "";
    const transform = Array.isArray(item.transform) ? item.transform as number[] : [];
    if (!text || transform.length < 6) continue;
    const x0 = Number(transform[4]);
    const baseline = Number(transform[5]);
    const height = Math.abs(Number(item.height) || Number(transform[3]) || 9);
    const width = Math.abs(Number(item.width) || Math.max(1, text.length * height * 0.45));
    if (!Number.isFinite(x0) || !Number.isFinite(baseline)) continue;
    positioned.push({ text, x0, y: pageHeight - baseline, x1: x0 + width, height });
  }
  return rowsFromPositionedText(positioned);
}

function rawTextFromCells(cells: string[]) {
  return cells.join(" | ");
}

function findHeaderMapping(cells: string[]): Map<keyof StandardRow, number> | null {
  const mapping = new Map<keyof StandardRow, number>();
  for (const [index, cell] of cells.entries()) {
    const value = normalizedText(cell);
    if (/^(no|nomor|no urut|item)$/.test(value)) mapping.set("number", index);
    else if (/uraian|deskripsi|description|jenis pekerjaan|nama pekerjaan/.test(value)) mapping.set("description", index);
    else if (/^(volume|qty|quantity|kuantitas)$/.test(value)) mapping.set("volume", index);
    else if (/^(satuan|unit|uom)$/.test(value)) mapping.set("unit", index);
    else if (/harga satuan|unit price|tarif satuan/.test(value)) mapping.set("unitPrice", index);
    else if (/jumlah harga|total harga|amount|total biaya|jumlah biaya/.test(value)) mapping.set("amount", index);
  }
  const recognized = [...mapping.keys()].filter((key) => key !== "number").length;
  return recognized >= 2 ? mapping : null;
}

function hasHeaderWords(cells: string[]) {
  return Boolean(findHeaderMapping(cells));
}

function mappedValue(cells: string[], mapping: Map<keyof StandardRow, number> | null, key: keyof StandardRow) {
  if (!mapping || !mapping.has(key)) return "";
  return (cells[mapping.get(key)!] ?? "").trim();
}

function looksLikeItemRow(cells: string[]) {
  const rowText = cells.join(" ");
  const hasWords = /[A-Za-zÀ-ÖØ-öø-ÿ]{3,}/.test(rowText);
  const numericCells = cells.filter((cell) => parseIndonesianNumber(cell) !== null).length;
  return hasWords && numericCells >= 1 && cells.length >= 3;
}

function standardizeRow(cells: string[], mapping: Map<keyof StandardRow, number> | null, fallbackIndex: number): StandardRow | null {
  if (hasHeaderWords(cells) || cells.length < 3 || !looksLikeItemRow(cells)) return null;

  let no = mappedValue(cells, mapping, "number");
  let description = mappedValue(cells, mapping, "description");
  let volume = mappedValue(cells, mapping, "volume");
  let unit = mappedValue(cells, mapping, "unit");
  let unitPrice = mappedValue(cells, mapping, "unitPrice");
  let amount = mappedValue(cells, mapping, "amount");

  if (!mapping) {
    const offset = cells.length >= 6 && /^\d{1,4}[.)]?$/.test(cells[0]) && /[A-Za-zÀ-ÖØ-öø-ÿ]{3,}/.test(cells[1]) ? 1 : 0;
    no = offset ? cells[0] : String(fallbackIndex);
    description = cells[offset] ?? "";
    volume = cells[offset + 1] ?? "";
    unit = cells[offset + 2] ?? "";
    unitPrice = cells[offset + 3] ?? "";
    amount = cells[offset + 4] ?? "";
  }

  if (!description) {
    const candidates = cells.filter((cell) => /[A-Za-zÀ-ÖØ-öø-ÿ]{3,}/.test(cell) && parseIndonesianNumber(cell) === null);
    description = candidates[0] ?? cells[0] ?? "";
  }
  if (!description.trim()) return null;

  const parsedVolume = parseIndonesianNumber(volume);
  const parsedPrice = parseIndonesianNumber(unitPrice);
  const parsedAmount = parseIndonesianNumber(amount);
  return {
    number: parseIndonesianNumber(no) ?? (no || fallbackIndex),
    description: description.trim(),
    volume: parsedVolume ?? volume,
    unit: unit.trim(),
    unitPrice: parsedPrice ?? unitPrice,
    amount: parsedAmount ?? amount,
    formulaAmount: !amount && parsedVolume !== null && parsedPrice !== null,
  };
}

function workbookCellRows(sourceRows: SourceRow[], fileName: string, pageCount: number, scannedPages: number) {
  const standardized: StandardRow[] = [];
  let headerMapping: Map<keyof StandardRow, number> | null = null;
  let itemIndex = 0;

  for (const row of sourceRows) {
    const foundHeader = findHeaderMapping(row.cells);
    if (foundHeader) {
      headerMapping = foundHeader;
      continue;
    }

    const text = normalizedText(row.cells.join(" "));
    if (/^(grand total|total keseluruhan|terbilang|dibuat oleh|disetujui oleh|tanggal|halaman)\b/.test(text)) continue;
    if (/^(subtotal|sub total|jumlah akhir|ppn|pajak|pembulatan|total biaya|total harga)\b/.test(text)) {
      const lastNumeric = [...row.cells].reverse().find((cell) => parseIndonesianNumber(cell) !== null);
      standardized.push({
        number: "",
        description: row.cells.find((cell) => /[A-Za-zÀ-ÖØ-öø-ÿ]{3,}/.test(cell)) ?? row.cells[0] ?? "Total",
        volume: "",
        unit: "",
        unitPrice: "",
        amount: lastNumeric ? (parseIndonesianNumber(lastNumeric) ?? lastNumeric) : "",
        formulaAmount: false,
      });
      continue;
    }

    itemIndex += 1;
    const mapped = standardizeRow(row.cells, headerMapping, itemIndex);
    if (mapped) standardized.push(mapped);
  }

  const rawAoA: (string | number)[][] = [
    ["Halaman", "Baris", "Teks sumber"],
    ...sourceRows.map((row) => [row.pageNumber, row.lineNumber, rawTextFromCells(row.cells)]),
  ];
  const standardAoA: (string | number | null)[][] = [
    ["No", "Uraian Pekerjaan", "Volume", "Satuan", "Harga Satuan (Rp)", "Jumlah Harga (Rp)"],
    ...standardized.map((row) => [
      row.number,
      row.description,
      row.volume,
      row.unit,
      row.unitPrice,
      row.amount,
    ]),
  ];

  const formulaRows: Array<{ rowNumber: number; value: number }> = [];
  standardized.forEach((row, index) => {
    if (!row.formulaAmount) return;
    const volume = parseIndonesianNumber(String(row.volume));
    const price = parseIndonesianNumber(String(row.unitPrice));
    if (volume === null || price === null) return;
    formulaRows.push({ rowNumber: index + 2, value: volume * price });
  });

  if (standardized.length > 0) {
    standardAoA.push(["", "TOTAL HASIL KONVERSI", "", "", "", null]);
    const totalRow = standardAoA.length;
    formulaRows.push({ rowNumber: totalRow, value: standardized.reduce((sum, row) => {
      const value = parseIndonesianNumber(String(row.amount));
      return sum + (value ?? (row.formulaAmount
        ? (parseIndonesianNumber(String(row.volume)) ?? 0) * (parseIndonesianNumber(String(row.unitPrice)) ?? 0)
        : 0));
    }, 0) });
  }

  const wsStandard = XLSX.utils.aoa_to_sheet(standardAoA);
  for (const formula of formulaRows) {
    const cellRef = `F${formula.rowNumber}`;
    const isTotal = standardAoA[formula.rowNumber - 1]?.[1] === "TOTAL HASIL KONVERSI";
    wsStandard[cellRef] = isTotal
      ? { t: "n", f: standardized.length > 0 ? `SUM(F2:F${standardized.length + 1})` : "0", v: formula.value }
      : { t: "n", f: `C${formula.rowNumber}*E${formula.rowNumber}`, v: formula.value };
  }

  wsStandard["!cols"] = [
    { wch: 7 }, { wch: 46 }, { wch: 13 }, { wch: 12 }, { wch: 20 }, { wch: 22 },
  ];
  const wsRaw = XLSX.utils.aoa_to_sheet(rawAoA);
  wsRaw["!cols"] = [{ wch: 10 }, { wch: 10 }, { wch: 120 }];

  const info = [
    ["RabConverter — Ringkasan Konversi"],
    ["Nama file", safeBaseName(fileName)],
    ["Halaman diproses", pageCount],
    ["Halaman yang memerlukan OCR", scannedPages],
    ["Baris tabel terdeteksi", standardized.filter((row) => normalizedText(row.description) !== "subtotal" && normalizedText(row.description) !== "total hasil konversi").length],
    ["Catatan", "Hasil rekonstruksi otomatis perlu ditinjau. Cocokkan kembali angka, pemisah ribuan, volume, harga, dan jumlah dengan PDF asli."],
  ];
  const wsInfo = XLSX.utils.aoa_to_sheet(info);
  wsInfo["!cols"] = [{ wch: 30 }, { wch: 110 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, wsStandard, "Tabel RAB");
  XLSX.utils.book_append_sheet(workbook, wsRaw, "Teks Sumber");
  XLSX.utils.book_append_sheet(workbook, wsInfo, "Ringkasan");
  return { workbook, standardizedCount: standardized.length, sourceCount: sourceRows.length };
}

function safeBaseName(name: string) {
  const withoutExtension = name.replace(/\.pdf$/i, "");
  const safe = withoutExtension.replace(/[^\p{L}\p{N}._ -]+/gu, "").trim().replace(/[ .]+$/g, "");
  return (safe || "rab-converted").slice(0, 100);
}

/**
 * Local-only conversion: read positioned PDF text first, run OCR only for pages
 * with no text layer, then save a reviewable XLSX with both normalized and raw rows.
 */
export async function convertPdfToXlsx(
  file: File,
  options: ConversionOptions = {},
): Promise<PdfConversionResult> {
  const { signal, cachedOcrPages = {}, onProgress } = options;
  const report = (progress: ConversionProgress) => onProgress?.(progress);
  abortIfNeeded(signal);

  if (file.size <= 0 || file.size > 30 * 1024 * 1024) {
    throw new Error("File harus berukuran lebih dari 0 byte dan maksimal 30 MiB.");
  }

  report({ phase: "opening", completed: 0, total: 1, detail: "Membuka PDF di perangkat…" });
  const bytes = new Uint8Array(await file.arrayBuffer());
  abortIfNeeded(signal);
  const loadingTask = pdfjsLib.getDocument({ data: bytes, useWorkerFetch: false });
  const sourceRows: SourceRow[] = [];
  const scanPageNumbers: number[] = [];
  let pageCount = 0;

  try {
    const pdf = await loadingTask.promise;
    pageCount = pdf.numPages;
    if (!Number.isInteger(pageCount) || pageCount < 1) throw new Error("PDF tidak memiliki halaman yang dapat diproses.");
    if (pageCount > MAX_CONVERSION_PAGES) {
      throw new Error(`Konversi beta dibatasi hingga ${MAX_CONVERSION_PAGES} halaman per file.`);
    }

    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      abortIfNeeded(signal);
      report({
        phase: "extracting-text",
        completed: pageNumber - 1,
        total: pageCount,
        pageNumber,
        detail: `Mengekstrak susunan teks halaman ${pageNumber} dari ${pageCount}…`,
      });
      const page = await pdf.getPage(pageNumber);
      try {
        const content = await page.getTextContent();
        const items = (content.items ?? []) as unknown as Array<Record<string, unknown>>;
        const hasText = items.some((item) => typeof item.str === "string" && item.str.trim().length > 0);
        if (hasText) {
          const viewport = page.getViewport({ scale: 1 });
          const rows = sourceRowsFromPdfItems(items, viewport.height);
          rows.forEach((cells, index) => sourceRows.push({ pageNumber, lineNumber: index + 1, cells }));
        } else {
          scanPageNumbers.push(pageNumber);
          const cached = cachedOcrPages[pageNumber];
          if (cached) {
            cached.rows.forEach((cells, index) => sourceRows.push({ pageNumber, lineNumber: index + 1, cells }));
          }
        }
      } finally {
        page.cleanup();
      }
    }

    const missingOcrPages = scanPageNumbers.filter((pageNumber) => !cachedOcrPages[pageNumber]);
    if (missingOcrPages.length > 0) {
      const ocrResults = await ocrPdfPages(file, missingOcrPages, {
        signal,
        maxPages: MAX_CONVERSION_PAGES,
        onProgress: (progress: LocalOcrProgress) => report({
          phase: "ocr",
          completed: progress.completed,
          total: progress.total,
          pageNumber: progress.pageNumber,
          detail: progress.phase === "loading-engine"
            ? "Menyiapkan mesin OCR lokal…"
            : progress.phase === "rendering"
              ? `Merender scan halaman ${progress.pageNumber ?? ""}…`
              : progress.phase === "recognizing"
                ? `Mengenali teks halaman scan ${progress.pageNumber ?? ""}…`
                : "Membuka PDF untuk OCR…",
        }),
      });
      for (const result of ocrResults) {
        result.rows.forEach((cells, index) => sourceRows.push({ pageNumber: result.pageNumber, lineNumber: index + 1, cells }));
      }
    }

    abortIfNeeded(signal);
    report({ phase: "writing-xlsx", completed: pageCount, total: pageCount, detail: "Menyusun workbook Excel…" });
    sourceRows.sort((left, right) => left.pageNumber - right.pageNumber || left.lineNumber - right.lineNumber);
    const built = workbookCellRows(sourceRows, file.name, pageCount, scanPageNumbers.length);
    const xlsxData = XLSX.write(built.workbook, { bookType: "xlsx", type: "array" });
    const resultBytes = xlsxData instanceof Uint8Array ? xlsxData : new Uint8Array(xlsxData);
    return {
      bytes: resultBytes,
      fileName: `${safeBaseName(file.name)}.xlsx`,
      pagesProcessed: pageCount,
      scannedPages: scanPageNumbers.length,
      structuredRows: built.standardizedCount,
      sourceLines: built.sourceCount,
    };
  } finally {
    await loadingTask.destroy().catch(() => undefined);
  }
}
