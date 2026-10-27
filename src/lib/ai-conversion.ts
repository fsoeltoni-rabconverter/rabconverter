export type AiRowType = "section" | "item" | "subtotal" | "tax" | "total" | "note" | "header" | "unknown";

export interface AiRabRow {
  rowIndex: number;
  sourcePage: number;
  rowType: AiRowType;
  itemNumber: string;
  code: string;
  description: string;
  quantityText: string;
  unit: string;
  unitPriceText: string;
  amountText: string;
  rawLine: string;
  confidence: "high" | "medium" | "low";
  needsReview: boolean;
  reviewReason: string;
  quantityValue: number | null;
  unitPriceValue: number | null;
  amountValue: number | null;
  lineMathCheck: "MATCH" | "MISMATCH" | "NOT_CHECKED";
}

export interface AiRabPageSummary {
  sourcePage: number;
  tableDetected: boolean;
  notes: string;
}

export interface AiRabConversionResult {
  ok: true;
  status: "AI_EXTRACTION_COMPLETE";
  provider: "google-gemini";
  model: string;
  document: {
    title: string;
    projectName: string;
    year: string;
    currency: string;
    pageCount: number;
  };
  rows: AiRabRow[];
  pageSummaries: AiRabPageSummary[];
  quality: {
    rowCount: number;
    itemCount: number;
    reviewCount: number;
    mismatchCount: number;
    lowConfidenceCount: number;
    pagesWithoutTable: number[];
    warnings: string[];
  };
  usage: {
    model: string;
    inputTokens: number;
    outputTokens: number;
    calls: number;
    retries: number;
    splitRetries: number;
  };
  processing: {
    mode: string;
    pagesPerBatch: number;
    persistentStorage: false;
    pdfSentToAiProvider: true;
    providerOcr: string;
    valuesRecomputedOrOverwritten: false;
  };
  message: string;
}

export class AiConversionError extends Error {
  code: string;
  status: number;
  retryAfterSeconds?: number;

  constructor(code: string, message: string, status = 500, retryAfterSeconds?: number) {
    super(message);
    this.name = "AiConversionError";
    this.code = code;
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

const DEFAULT_AI_ENDPOINT =
  "https://zkcziucjogprfzhjuaex.supabase.co/functions/v1/rab-ai-convert";

function getEndpoint() {
  return import.meta.env.VITE_RAB_AI_CONVERT_URL?.trim() || DEFAULT_AI_ENDPOINT;
}

export async function requestAiRabConversion(
  file: File,
  options: { signal?: AbortSignal; onProgress?: (message: string) => void } = {},
): Promise<AiRabConversionResult> {
  options.onProgress?.("Mengirim PDF ke AI untuk membaca teks dan struktur visual tabel…");
  let response: Response;

  try {
    response = await fetch(getEndpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/pdf" },
      body: file,
      signal: options.signal,
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;
    throw new AiConversionError(
      "NETWORK_ERROR",
      "Tidak dapat terhubung ke layanan AI. Periksa koneksi internet lalu coba lagi.",
      0,
    );
  }

  const payload = await response.json().catch(() => null) as Record<string, unknown> | null;
  if (!response.ok || !payload || payload.ok !== true) {
    const code = typeof payload?.code === "string" ? payload.code : "AI_UNKNOWN_ERROR";
    const message = typeof payload?.message === "string" ? payload.message : "Konversi AI gagal.";
    const retryAfter = typeof payload?.retryAfterSeconds === "number" ? payload.retryAfterSeconds : undefined;

    const friendlyMessage = code === "AI_NOT_CONFIGURED"
      ? "AI belum diaktifkan di server. Admin perlu memasang secret GEMINI_API_KEY di Supabase agar konversi tersedia."
      : code === "AI_RATE_LIMITED"
        ? `Batas konversi AI tercapai. Coba lagi dalam sekitar ${Math.ceil((retryAfter ?? 60) / 60)} menit.`
        : code === "AI_PROVIDER_AUTH_FAILED"
          ? "Kunci API AI tidak diterima. Admin perlu memeriksa secret GEMINI_API_KEY dan akses modelnya."
          : code === "AI_PROVIDER_RATE_LIMITED"
            ? "Penyedia AI sedang membatasi permintaan. Coba lagi setelah beberapa saat."
            : message;
    throw new AiConversionError(code, friendlyMessage, response.status, retryAfter);
  }

  const result = payload as unknown as AiRabConversionResult;
  if (
    result.status !== "AI_EXTRACTION_COMPLETE" ||
    !Array.isArray(result.rows) ||
    !result.document ||
    typeof result.document.pageCount !== "number" ||
    !Array.isArray(result.quality?.warnings)
  ) {
    throw new AiConversionError(
      "AI_INVALID_RESPONSE",
      "Respons AI tidak lengkap sehingga workbook tidak dibuat. Coba lagi atau kirim PDF lain.",
      502,
    );
  }

  options.onProgress?.("AI selesai membaca tabel. Menyusun workbook dan laporan validasi…");
  return result;
}
