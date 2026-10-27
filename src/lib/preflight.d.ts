export declare const MAX_FILE_SIZE_BYTES: number;
export declare const MAX_PDF_PAGES: number;

export type PdfValidationResult =
  | { ok: true; code: "PDF_HEADER_OK"; message: null }
  | {
      ok: false;
      code: "FILE_EMPTY" | "FILE_TOO_LARGE" | "NOT_A_PDF" | "PDF_READ_FAILED";
      message: string;
    };

export type RabClassificationStatus =
  | "NEEDS_OCR"
  | "UNREADABLE_PDF"
  | "LIKELY_RAB"
  | "NEEDS_CONFIRMATION"
  | "NOT_RAB"
  | "NEEDS_MORE_PAGES";

export interface RabClassificationResult {
  status: RabClassificationStatus;
  score: number;
  signals: string[];
  reasons: string[];
}

/**
 * Early client-side check; not a replacement for complete server-side PDF parsing.
 */
export declare function validatePdfFile(file: File): Promise<PdfValidationResult>;

/**
 * Classifies extracted text; no PDF parsing or OCR is performed by this function.
 */
export declare function classifyRabDocument(
  extractedText: string,
  options?: { ocrAttempted?: boolean },
): RabClassificationResult;

export interface RabPageTextResult {
  pageNumber: number;
  textChars: number;
  textFound: boolean;
  truncated: boolean;
  /** True once browser-local OCR has been attempted for this page. */
  ocrAttempted?: boolean;
  classification: RabClassificationResult;
}

export interface RabDocumentSummary extends RabClassificationResult {
  complete: boolean;
  pagesReviewed: number;
  pagesNeedingOcr: number[];
  pagesUnreadableAfterOcr: number[];
  truncatedPages: number[];
  structuralCostEvidence: boolean;
}

export declare function summarizeRabPageClassifications(
  pages: RabPageTextResult[],
  options?: { complete?: boolean },
): RabDocumentSummary;
