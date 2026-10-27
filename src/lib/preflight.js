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

export { classifyRabDocument, summarizeRabPageClassifications } from "../../supabase/functions/preflight-rab/rab-classifier.js";
