export const AI_ROW_TYPES = ["section", "item", "subtotal", "tax", "total", "note", "header", "unknown"];

const CONFIDENCE = new Set(["high", "medium", "low"]);

function cleanText(value, maxLength = 4000) {
  if (typeof value !== "string") return "";
  return value.replace(/\u0000/g, "").trim().slice(0, maxLength);
}

/**
 * Parse Indonesian/English formatted numbers conservatively.
 * Ambiguous OCR strings remain unparsed and are kept as their original text.
 */
export function parseLocalizedNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  let text = cleanText(value, 100).replace(/^(?:rp\.?|idr)\s*/i, "").replace(/\s/g, "");
  if (!text || !/\d/.test(text)) return null;

  const negative = text.startsWith("(") && text.endsWith(")");
  text = text.replace(/[()]/g, "");
  text = text.replace(/^[+-]/, (sign) => sign === "-" ? "-" : "");
  if (!/^-?\d+(?:[.,]\d+)*$/.test(text)) return null;

  const dotCount = (text.match(/\./g) ?? []).length;
  const commaCount = (text.match(/,/g) ?? []).length;
  if (dotCount > 0 && commaCount > 0) {
    const decimalSeparator = text.lastIndexOf(",") > text.lastIndexOf(".") ? "," : ".";
    const groupingSeparator = decimalSeparator === "," ? "." : ",";
    const decimalIndex = text.lastIndexOf(decimalSeparator);
    const integerPart = text.slice(0, decimalIndex);
    const decimalPart = text.slice(decimalIndex + 1);
    if (!/^\d{1,3}(?:[.,]\d{3})*$/.test(integerPart.replace(/^-/, "")) || !/^\d{1,4}$/.test(decimalPart)) {
      return null;
    }
    text = integerPart.split(groupingSeparator).join("") .replace(decimalSeparator, ".") + "." + decimalPart;
  } else if (commaCount > 0 || dotCount > 0) {
    const separator = commaCount > 0 ? "," : ".";
    const parts = text.split(separator);
    if (parts.length > 2) {
      const groupsLookThousands = parts.slice(1).every((part) => part.length === 3);
      if (groupsLookThousands) text = parts.join("");
      else if (parts.at(-1)?.length === 2 && parts.slice(1, -1).every((part) => part.length === 3)) {
        text = parts.slice(0, -1).join("") + "." + parts.at(-1);
      } else return null;
    } else {
      const suffix = parts[1] ?? "";
      if (suffix.length === 3) {
        // With one separator and exactly three trailing digits, prefer the
        // Indonesian thousands convention. The original text is always retained.
        text = parts.join("");
      } else if (suffix.length >= 1 && suffix.length <= 2) {
        text = parts[0] + "." + suffix;
      } else {
        return null;
      }
    }
  }

  const number = Number(text);
  if (!Number.isFinite(number)) return null;
  return negative || text.startsWith("-") ? -Math.abs(number) : number;
}

function appendReason(existing, extra) {
  const current = cleanText(existing, 1200);
  if (!current) return extra;
  if (current.includes(extra)) return current;
  return `${current} · ${extra}`;
}

export function normalizeAiBatch(output, { startPage, pageCount }) {
  if (!output || typeof output !== "object" || !Array.isArray(output.rows)) {
    throw new Error("AI mengembalikan struktur tabel yang tidak valid.");
  }

  const rows = output.rows.map((inputRow, index) => {
    if (!inputRow || typeof inputRow !== "object") {
      throw new Error(`Baris hasil AI ke-${index + 1} tidak valid.`);
    }

    let localPage = Number(inputRow.batchPageIndex);
    const invalidPageIndex = !Number.isInteger(localPage) || localPage < 1 || localPage > pageCount;
    if (invalidPageIndex) localPage = 1;
    const invalidRowType = !AI_ROW_TYPES.includes(inputRow.rowType);
    const rowType = invalidRowType ? "unknown" : inputRow.rowType;
    const invalidConfidence = !CONFIDENCE.has(inputRow.confidence);
    const confidence = invalidConfidence ? "low" : inputRow.confidence;

    const item = {
      rowIndex: index + 1,
      sourcePage: startPage + localPage - 1,
      rowType,
      itemNumber: cleanText(inputRow.itemNumber, 100),
      code: cleanText(inputRow.code, 200),
      description: cleanText(inputRow.description, 2000),
      quantityText: cleanText(inputRow.quantityText, 100),
      unit: cleanText(inputRow.unit, 100),
      unitPriceText: cleanText(inputRow.unitPriceText, 100),
      amountText: cleanText(inputRow.amountText, 100),
      rawLine: cleanText(inputRow.rawLine, 4000),
      confidence,
      needsReview: Boolean(inputRow.needsReview) || confidence === "low" || invalidPageIndex || invalidRowType || invalidConfidence,
      reviewReason: cleanText(inputRow.reviewReason, 1200),
    };

    if (invalidPageIndex) item.reviewReason = appendReason(item.reviewReason, "Nomor halaman dari AI tidak valid; perlu verifikasi manual.");
    if (invalidRowType) item.reviewReason = appendReason(item.reviewReason, "Tipe baris AI tidak dikenali.");
    if (invalidConfidence) item.reviewReason = appendReason(item.reviewReason, "Keyakinan AI tidak valid; diturunkan ke low.");
    item.quantityValue = parseLocalizedNumber(item.quantityText);
    item.unitPriceValue = parseLocalizedNumber(item.unitPriceText);
    item.amountValue = parseLocalizedNumber(item.amountText);
    item.lineMathCheck = "NOT_CHECKED";

    if (rowType === "item") {
      if (!item.description) {
        item.needsReview = true;
        item.reviewReason = appendReason(item.reviewReason, "Uraian item tidak terbaca.");
      }
      if (
        item.quantityValue !== null &&
        item.unitPriceValue !== null &&
        item.amountValue !== null
      ) {
        const expected = item.quantityValue * item.unitPriceValue;
        const difference = item.amountValue - expected;
        const tolerance = Math.max(1, Math.abs(expected) * 0.005);
        if (Math.abs(difference) <= tolerance) {
          item.lineMathCheck = "MATCH";
        } else {
          item.lineMathCheck = "MISMATCH";
          item.needsReview = true;
          item.reviewReason = appendReason(
            item.reviewReason,
            `Volume × harga satuan berbeda dari jumlah sumber (selisih ${difference.toFixed(2)}).`,
          );
        }
      } else if (item.quantityText || item.unitPriceText || item.amountText) {
        item.lineMathCheck = "NOT_CHECKED";
        if (!item.quantityText || !item.unitPriceText || !item.amountText ||
            item.quantityValue === null || item.unitPriceValue === null || item.amountValue === null) {
          item.needsReview = true;
          item.reviewReason = appendReason(item.reviewReason, "Angka tidak lengkap atau format angka ambigu.");
        }
      }
    }

    return item;
  });

  const pageSummaries = Array.isArray(output.pageSummaries) ? output.pageSummaries : [];
  const normalizedSummaries = Array.from({ length: pageCount }, (_, offset) => {
    const batchPageIndex = offset + 1;
    const found = pageSummaries.find((item) => Number(item?.batchPageIndex) === batchPageIndex);
    return {
      sourcePage: startPage + offset,
      tableDetected: typeof found?.tableDetected === "boolean"
        ? found.tableDetected
        : rows.some((row) => row.sourcePage === startPage + offset && ["item", "section", "subtotal", "tax", "total"].includes(row.rowType)),
      notes: cleanText(found?.notes, 1200) || (found ? "" : "AI tidak mengembalikan catatan halaman; periksa tabel sumber."),
    };
  });

  return {
    documentTitle: cleanText(output.documentTitle, 500),
    projectName: cleanText(output.projectName, 1000),
    year: cleanText(output.year, 20),
    currency: cleanText(output.currency, 30) || "IDR",
    rows,
    pageSummaries: normalizedSummaries,
    warnings: Array.isArray(output.warnings)
      ? output.warnings.map((warning) => cleanText(warning, 1000)).filter(Boolean).slice(0, 100)
      : [],
  };
}

export function summarizeAiResult(rows, pageSummaries, warnings) {
  const mismatchCount = rows.filter((row) => row.lineMathCheck === "MISMATCH").length;
  const reviewCount = rows.filter((row) => row.needsReview).length;
  const emptyPages = pageSummaries.filter((page) => !page.tableDetected).map((page) => page.sourcePage);
  const allWarnings = [...warnings];
  if (mismatchCount) allWarnings.push(`${mismatchCount} baris memiliki selisih antara volume × harga satuan dan jumlah harga di sumber.`);
  if (reviewCount) allWarnings.push(`${reviewCount} baris ditandai perlu ditinjau.`);
  if (emptyPages.length) allWarnings.push(`Halaman ${emptyPages.join(", ")} tidak terdeteksi berisi tabel; periksa apakah halaman tersebut memang bukan tabel item.`);
  return {
    rowCount: rows.length,
    itemCount: rows.filter((row) => row.rowType === "item").length,
    reviewCount,
    mismatchCount,
    lowConfidenceCount: rows.filter((row) => row.confidence === "low").length,
    pagesWithoutTable: emptyPages,
    warnings: [...new Set(allWarnings)],
  };
}
