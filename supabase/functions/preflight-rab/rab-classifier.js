/**
 * Deterministic RAB/BoQ classifier shared by browser feedback and the server preflight.
 * It consumes extracted text only; it never reads PDF bytes or performs OCR.
 */

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

const SIGNAL_SCORES = new Map(SIGNALS.map((signal) => [signal.key, signal.score]));

function hasRepeatedItemLikeRows(text) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  let qualifyingLines = 0;

  for (const line of lines) {
    const hasDescriptionLikeText = /[A-Za-zÀ-ÖØ-öø-ÿ]{3,}/.test(line);
    const numbers = line.match(/(?:\d{1,3}(?:[.,]\d{3})+(?:[.,]\d+)?|\d+(?:[.,]\d+)?)/g) ?? [];
    if (hasDescriptionLikeText && numbers.length >= 2) qualifyingLines += 1;
    if (qualifyingLines >= 2) return true;
  }

  return false;
}

/**
 * Classify a text slice. No text is not a rejection: OCR may be required.
 * @param {string} extractedText
 * @param {{ ocrAttempted?: boolean }} [options]
 */
export function classifyRabDocument(extractedText, options = {}) {
  const text = typeof extractedText === "string" ? extractedText.trim() : "";

  if (!text) {
    return {
      status: options.ocrAttempted ? "UNREADABLE_PDF" : "NEEDS_OCR",
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

  if (hasRepeatedItemLikeRows(text)) {
    signals.push("repeated_item_rows");
    score += 2;
  }

  const hasDescription = signals.includes("item_description");
  const hasQuantityOrUnit = signals.includes("quantity_or_unit");
  const hasPrice = signals.includes("price_or_amount");
  const hasTotals = signals.includes("totals");
  const structuralCostEvidence =
    signals.includes("repeated_item_rows") ||
    (hasDescription && hasQuantityOrUnit && hasPrice) ||
    (hasDescription && hasPrice && hasTotals);

  if (score >= 6 && signals.length >= 2 && structuralCostEvidence) {
    return { status: "LIKELY_RAB", score, signals, reasons: ["rab_signals_and_cost_structure_detected"] };
  }

  if (score >= 3) {
    return {
      status: "NEEDS_CONFIRMATION",
      score,
      signals,
      reasons: [structuralCostEvidence ? "classification_score_needs_confirmation" : "cost_structure_not_strong_enough_for_auto_accept"],
    };
  }

  return { status: "NOT_RAB", score, signals, reasons: ["insufficient_rab_boq_evidence"] };
}

/**
 * Merge page-level signals without double-counting the same document-level signal.
 * The summary is never decisive while uninspected pages remain, unless strong positive
 * evidence is already present. Any page without text remains visible as an OCR need.
 *
 * @param {Array<{pageNumber:number,textChars:number,textFound:boolean,truncated?:boolean,classification:{status:string,score:number,signals:string[],reasons:string[]}}>} pages
 * @param {{complete?:boolean}} [options]
 */
export function summarizeRabPageClassifications(pages, options = {}) {
  const complete = options.complete === true;
  const signals = [...new Set(pages.flatMap((page) => page.classification?.signals ?? []))];
  const score = signals.reduce((sum, key) => sum + (SIGNAL_SCORES.get(key) ?? (key === "repeated_item_rows" ? 2 : 0)), 0);
  const pagesNeedingOcr = pages
    .filter((page) => page.ocrAttempted !== true && (page.textFound === false || page.textChars === 0))
    .map((page) => page.pageNumber);
  const pagesUnreadableAfterOcr = pages
    .filter((page) => page.ocrAttempted === true && (page.textFound === false || page.textChars === 0))
    .map((page) => page.pageNumber);
  const truncatedPages = pages.filter((page) => page.truncated).map((page) => page.pageNumber);
  const hasDescription = signals.includes("item_description");
  const hasQuantityOrUnit = signals.includes("quantity_or_unit");
  const hasPrice = signals.includes("price_or_amount");
  const hasTotals = signals.includes("totals");
  const structuralCostEvidence =
    signals.includes("repeated_item_rows") ||
    (hasDescription && hasQuantityOrUnit && hasPrice) ||
    (hasDescription && hasPrice && hasTotals);

  let status;
  let reasons;
  if (score >= 6 && signals.length >= 2 && structuralCostEvidence) {
    status = "LIKELY_RAB";
    reasons = ["rab_signals_and_cost_structure_detected"];
  } else if (score >= 3) {
    status = "NEEDS_CONFIRMATION";
    reasons = [structuralCostEvidence ? "classification_score_needs_confirmation" : "cost_structure_not_strong_enough_for_auto_accept"];
  } else if (pagesNeedingOcr.length > 0 && complete) {
    status = "NEEDS_OCR";
    reasons = ["one_or_more_pages_have_no_extractable_text"];
  } else if (pagesUnreadableAfterOcr.length > 0 && complete) {
    status = "UNREADABLE_PDF";
    reasons = ["one_or_more_pages_have_no_text_after_local_ocr"];
  } else if (!complete) {
    status = "NEEDS_MORE_PAGES";
    reasons = ["insufficient_evidence_in_pages_reviewed_so_far"];
  } else {
    status = "NOT_RAB";
    reasons = ["insufficient_rab_boq_evidence"];
  }

  return {
    status,
    score,
    signals,
    reasons,
    complete,
    pagesReviewed: pages.length,
    pagesNeedingOcr,
    pagesUnreadableAfterOcr,
    truncatedPages,
    structuralCostEvidence,
  };
}
