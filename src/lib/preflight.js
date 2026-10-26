/**
 * Lightweight client-side checks and deterministic RAB/BoQ text classification.
 * Full PDF parsing and OCR belong to the server/extraction layer.
 */
export const MAX_FILE_SIZE_BYTES = 30 * 1024 * 1024;
export const MAX_PDF_PAGES = 200;

const PDF_HEADER_WINDOW_BYTES = 1024;

const ERROR_MESSAGES = {
  FILE_EMPTY: "File kosong. Coba pilih PDF yang lain.",
  FILE_TOO_LARGE: "Ukuran file maksimum untuk langkah awal ini adalah 30 MiB.",
  NOT_A_PDF: "File ini tidak terdeteksi sebagai PDF yang valid. Pilih file PDF asli.",
  PDF_READ_FAILED: "File tidak dapat dibaca oleh browser. Coba pilih ulang file tersebut.",
};

/**
 * Early client-side validation only. A server parser must verify the complete PDF.
 * @param {File} file
 * @returns {Promise<{ ok: true, code: "PDF_HEADER_OK", message: null } | { ok: false, code: "FILE_EMPTY" | "FILE_TOO_LARGE" | "NOT_A_PDF" | "PDF_READ_FAILED", message: string }>}
 */
export async function validatePdfFile(file) {
  if (!file || file.size === 0) {
    return { ok: false, code: "FILE_EMPTY", message: ERROR_MESSAGES.FILE_EMPTY };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { ok: false, code: "FILE_TOO_LARGE", message: ERROR_MESSAGES.FILE_TOO_LARGE };
  }

  try {
    const bytes = new Uint8Array(
      await file.slice(0, PDF_HEADER_WINDOW_BYTES).arrayBuffer(),
    );
    let header = "";
    for (let index = 0; index < bytes.length; index += 1) {
      header += String.fromCharCode(bytes[index]);
    }

    // The PDF header can appear within the first 1,024 bytes. This is not
    // a structural validation and deliberately must be repeated server-side.
    if (!header.includes("%PDF-")) {
      return { ok: false, code: "NOT_A_PDF", message: ERROR_MESSAGES.NOT_A_PDF };
    }

    return { ok: true, code: "PDF_HEADER_OK", message: null };
  } catch {
    return {
      ok: false,
      code: "PDF_READ_FAILED",
      message: ERROR_MESSAGES.PDF_READ_FAILED,
    };
  }
}

const SIGNALS = [
  {
    key: "rab_title",
    score: 3,
    pattern: /\b(?:RAB|RENCANA\s+ANGGARAN\s+BIAYA|BOQ|BILL\s+OF\s+QUANTITIES|DAFTAR\s+KUANTITAS(?:\s+DAN\s+HARGA)?|RENCANA\s+BIAYA)\b/i,
  },
  {
    key: "item_description",
    score: 2,
    pattern: /\b(?:uraian(?:\s+pekerjaan)?|pekerjaan|description|deskripsi(?:\s+pekerjaan)?|item\s+pekerjaan)\b/i,
  },
  {
    key: "quantity_or_unit",
    score: 2,
    pattern: /\b(?:volume|kuantitas|qty|quantity|satuan|unit|uom)\b/i,
  },
  {
    key: "price_or_amount",
    score: 2,
    pattern: /\b(?:harga\s+satuan|unit\s+price|jumlah\s+harga|amount|total\s+(?:biaya|harga)|biaya\s+total|nilai\s+biaya|anggaran)\b/i,
  },
  {
    key: "construction_terms",
    score: 1,
    pattern: /\b(?:material|upah|beton|pondasi|fondasi|ahsp|hspk|pasir|semen|pekerjaan\s+tanah|konstruksi)\b/i,
  },
  {
    key: "totals",
    score: 1,
    pattern: /\b(?:subtotal|sub\s+total|grand\s+total|jumlah\s+akhir|rekapitulasi|pajak|ppn)\b/i,
  },
];

function hasRepeatedItemLikeRows(text) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  let qualifyingLines = 0;

  for (const line of lines) {
    const hasDescriptionLikeText = /[A-Za-zÀ-ÖØ-öø-ÿ]{3,}/.test(line);
    const numbers = line.match(/(?:\d{1,3}(?:[.,]\d{3})+(?:[.,]\d+)?|\d+(?:[.,]\d+)?)/g) ?? [];
    if (hasDescriptionLikeText && numbers.length >= 2) {
      qualifyingLines += 1;
    }
    if (qualifyingLines >= 2) return true;
  }

  return false;
}

/**
 * Classify already-extracted text. Call again after OCR if OCR is available.
 * This function does not parse PDF bytes, perform OCR, or guarantee conversion success.
 * @param {string} extractedText
 * @param {{ ocrAttempted?: boolean }} [options]
 * @returns {{ status: "NEEDS_OCR" | "UNREADABLE_PDF" | "LIKELY_RAB" | "NEEDS_CONFIRMATION" | "NOT_RAB", score: number, signals: string[], reasons: string[] }}
 */
export function classifyRabDocument(extractedText, options = {}) {
  const text = typeof extractedText === "string" ? extractedText.trim() : "";

  if (!text) {
    const status = options.ocrAttempted ? "UNREADABLE_PDF" : "NEEDS_OCR";
    return {
      status,
      score: 0,
      signals: [],
      reasons: [options.ocrAttempted ? "text_unreadable_after_ocr" : "no_text_layer_ocr_needed"],
    };
  }

  const signals = [];
  let score = 0;

  for (const signal of SIGNALS) {
    if (signal.pattern.test(text)) {
      signals.push(signal.key);
      score += signal.score;
    }
  }

  const repeatedRows = hasRepeatedItemLikeRows(text);
  if (repeatedRows) {
    signals.push("repeated_item_rows");
    score += 2;
  }

  const hasDescription = signals.includes("item_description");
  const hasQuantityOrUnit = signals.includes("quantity_or_unit");
  const hasPrice = signals.includes("price_or_amount");
  const hasTotals = signals.includes("totals");

  const structuralCostEvidence =
    repeatedRows ||
    (hasDescription && hasQuantityOrUnit && hasPrice) ||
    (hasDescription && hasPrice && hasTotals);

  if (score >= 6 && signals.length >= 2 && structuralCostEvidence) {
    return {
      status: "LIKELY_RAB",
      score,
      signals,
      reasons: ["rab_signals_and_cost_structure_detected"],
    };
  }

  if (score >= 3) {
    return {
      status: "NEEDS_CONFIRMATION",
      score,
      signals,
      reasons: [
        structuralCostEvidence
          ? "classification_score_needs_confirmation"
          : "cost_structure_not_strong_enough_for_auto_accept",
      ],
    };
  }

  return {
    status: "NOT_RAB",
    score,
    signals,
    reasons: ["insufficient_rab_boq_evidence"],
  };
}
