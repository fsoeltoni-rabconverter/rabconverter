import { createClient } from "npm:@supabase/supabase-js@2.118.0";
import { getResolvedPDFJS } from "npm:unpdf@1.9.1";
import { hasPdfHeader, hasPdfTerminator } from "./pdf-envelope.js";
import { extractPageText } from "./pdf-text.js";
import { classifyRabDocument, summarizeRabPageClassifications } from "./rab-classifier.js";

const MAX_FILE_SIZE_BYTES = 30 * 1024 * 1024;
const MAX_PDF_PAGES = 200;

const ALLOWED_ORIGINS = new Set([
  "https://rabconverter-preview.rabconverter-id.workers.dev",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

const encoder = new TextEncoder();

type ErrorCode =
  | "METHOD_NOT_ALLOWED"
  | "ORIGIN_NOT_ALLOWED"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "FILE_EMPTY"
  | "FILE_TOO_LARGE"
  | "NOT_A_PDF"
  | "PDF_READ_FAILED"
  | "PDF_PASSWORD_PROTECTED"
  | "PDF_CORRUPT"
  | "TOO_MANY_PAGES"
  | "PREFLIGHT_TEMPORARY_FAILURE"
  | "RATE_LIMITED"
  | "INVALID_PAGE_RANGE";

function getSecretKey(): string {
  const rawKeys = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (rawKeys) {
    try {
      const keys = JSON.parse(rawKeys) as Record<string, string>;
      const value = keys.default ?? keys.service_role ?? Object.values(keys).find(Boolean);
      if (value) return value;
    } catch {
      // Fall through to the legacy runtime variable.
    }
  }

  const legacyKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_KEY");
  if (legacyKey) return legacyKey;

  throw new Error("PRELIGHT_SERVICE_KEY_MISSING");
}

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  origin: string,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "access-control-allow-origin": origin,
      "access-control-allow-methods": "POST, GET, OPTIONS",
      "access-control-allow-headers": "content-type, x-preflight-start-page",
      "access-control-max-age": "600",
      "vary": "Origin",
    },
  });
}

function errorResponse(
  code: ErrorCode,
  message: string,
  status: number,
  origin: string,
  extras: Record<string, unknown> = {},
): Response {
  return jsonResponse({ ok: false, code, message, ...extras }, status, origin);
}

function getClientAddress(request: Request): string {
  const cfIp = request.headers.get("cf-connecting-ip")?.trim();
  if (cfIp) return cfIp;

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // Proxies append addresses to this list; use the last hop, not an arbitrary first
    // value a caller may have supplied in its own header.
    const addressChain = forwardedFor.split(",").map((value) => value.trim()).filter(Boolean);
    const lastAddress = addressChain.at(-1);
    if (lastAddress) return lastAddress;
  }

  // Fail closed into one shared bucket if the edge does not provide a client address.
  return "preflight-unknown-client";
}

async function makeFingerprint(address: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(address));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

class PayloadTooLargeError extends Error {
  constructor() {
    super("Payload exceeds the configured limit.");
    this.name = "PayloadTooLargeError";
  }
}

async function readBoundedBody(request: Request, maxBytes: number): Promise<Uint8Array> {
  if (!request.body) return new Uint8Array(0);

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;

      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel("PDF exceeds size limit.");
        throw new PayloadTooLargeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const combined = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return combined;
}

function isEncryptedPdfError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return error.name === "PasswordException" ||
    message.includes("encrypt") ||
    message.includes("password");
}

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("origin") ?? "";
  const publicHealthProbe = request.method === "GET" && origin === "";
  if (!ALLOWED_ORIGINS.has(origin) && !publicHealthProbe) {
    return new Response(JSON.stringify({
      ok: false,
      code: "ORIGIN_NOT_ALLOWED",
      message: "Origin ini tidak diizinkan untuk preflight preview.",
    }), {
      status: 403,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
        "x-content-type-options": "nosniff",
      },
    });
  }

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": origin,
        "access-control-allow-methods": "POST, GET, OPTIONS",
        "access-control-allow-headers": "content-type, x-preflight-start-page",
        "access-control-max-age": "600",
        "vary": "Origin",
      },
    });
  }

  if (request.method === "GET") {
    return jsonResponse({
      ok: true,
      service: "preflight-rab",
      mode: "progressive-text-extraction",
      maxFileSizeBytes: MAX_FILE_SIZE_BYTES,
      maxPages: MAX_PDF_PAGES,
      pagesPerRequest: 5,
      storesUploadedPdf: false,
      returnsExtractedText: false,
      performsOcr: false,
      performsRabClassification: true,
    }, 200, origin);
  }

  if (request.method !== "POST") {
    return errorResponse("METHOD_NOT_ALLOWED", "Metode permintaan tidak didukung.", 405, origin);
  }

  const contentType = (request.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  if (contentType !== "application/pdf") {
    return errorResponse("UNSUPPORTED_MEDIA_TYPE", "Kirim file dengan Content-Type application/pdf.", 415, origin);
  }

  const contentLengthHeader = request.headers.get("content-length");
  const declaredLength = contentLengthHeader && /^\d+$/.test(contentLengthHeader)
    ? Number(contentLengthHeader)
    : null;

  if (declaredLength === 0) {
    return errorResponse("FILE_EMPTY", "File kosong. Pilih PDF lain.", 400, origin);
  }
  if (declaredLength !== null && declaredLength > MAX_FILE_SIZE_BYTES) {
    return errorResponse("FILE_TOO_LARGE", "Ukuran file maksimum adalah 30 MiB.", 413, origin, {
      maxFileSizeBytes: MAX_FILE_SIZE_BYTES,
    });
  }

  const requestedStartHeader = request.headers.get("x-preflight-start-page");
  const requestedStartPage = requestedStartHeader === null ? 1 : Number(requestedStartHeader);
  if (
    !Number.isSafeInteger(requestedStartPage) ||
    requestedStartPage < 1 ||
    requestedStartPage > MAX_PDF_PAGES ||
    (requestedStartHeader !== null && !/^\d+$/.test(requestedStartHeader))
  ) {
    return errorResponse(
      "INVALID_PAGE_RANGE",
      "Nomor halaman pemeriksaan tidak valid. Mulai dari halaman 1 hingga 200.",
      400,
      origin,
    );
  }

  let serviceKey: string;
  let supabaseUrl: string;
  try {
    serviceKey = getSecretKey();
    supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    if (!supabaseUrl) throw new Error("SUPABASE_URL_MISSING");
  } catch {
    return errorResponse("PREFLIGHT_TEMPORARY_FAILURE", "Layanan pemeriksaan belum dikonfigurasi dengan benar.", 503, origin);
  }

  // Reserve at most the maximum file size before reading/parsing untrusted bytes.
  // Browser requests generally include Content-Length; unknown lengths reserve the full maximum.
  const reservedBytes = declaredLength === null
    ? MAX_FILE_SIZE_BYTES
    : Math.max(1, declaredLength);

  let pdfParsingStarted = false;
  let pdf: { numPages: number; getPage: (pageNumber: number) => Promise<{ cleanup: () => void }> } | null = null;
  let loadingTask: { promise: Promise<any>; destroy: () => Promise<void> } | null = null;
  try {
    const fingerprint = await makeFingerprint(getClientAddress(request), serviceKey);
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    });

    const { data: limitRows, error: limitError } = await supabase.rpc(
      "consume_preflight_rate_limit",
      { p_fingerprint: fingerprint, p_bytes: reservedBytes },
    );

    if (limitError) {
      // Fail closed: never parse an anonymous upload if the rate limiter is down.
      console.error("preflight limiter unavailable");
      return errorResponse("PREFLIGHT_TEMPORARY_FAILURE", "Pemeriksaan sedang tidak tersedia. Coba lagi nanti.", 503, origin);
    }

    const limit = Array.isArray(limitRows) ? limitRows[0] : null;
    if (!limit?.allowed) {
      const retryAfter = Math.max(1, Number(limit?.retry_after_seconds ?? 60));
      return errorResponse(
        "RATE_LIMITED",
        "Terlalu banyak pemeriksaan dari jaringan ini. Coba lagi setelah beberapa menit.",
        429,
        origin,
        { retryAfterSeconds: retryAfter },
      );
    }

    let bytes: Uint8Array;
    try {
      bytes = await readBoundedBody(request, MAX_FILE_SIZE_BYTES);
    } catch (error) {
      if (error instanceof PayloadTooLargeError) {
        return errorResponse("FILE_TOO_LARGE", "Ukuran file maksimum adalah 30 MiB.", 413, origin, {
          maxFileSizeBytes: MAX_FILE_SIZE_BYTES,
        });
      }
      return errorResponse("PDF_READ_FAILED", "File tidak berhasil dibaca. Coba pilih ulang.", 400, origin);
    }

    if (bytes.byteLength === 0) {
      return errorResponse("FILE_EMPTY", "File kosong. Pilih PDF lain.", 400, origin);
    }
    if (bytes.byteLength > MAX_FILE_SIZE_BYTES) {
      return errorResponse("FILE_TOO_LARGE", "Ukuran file maksimum adalah 30 MiB.", 413, origin, {
        maxFileSizeBytes: MAX_FILE_SIZE_BYTES,
      });
    }
    if (!hasPdfHeader(bytes)) {
      return errorResponse("NOT_A_PDF", "File tidak memiliki header PDF yang valid.", 415, origin);
    }
    if (!hasPdfTerminator(bytes)) {
      return errorResponse("PDF_CORRUPT", "PDF tidak memiliki penanda akhir dokumen yang valid.", 422, origin);
    }

    // Parse once, then extract only one small page batch. No page rendering, OCR,
    // or persistent file storage. Later batches re-upload the in-memory browser File.
    pdfParsingStarted = true;
    const pdfjs = await getResolvedPDFJS();
    loadingTask = pdfjs.getDocument({
      data: bytes,
      isEvalSupported: false,
      maxImageSize: 16_777_216,
    });
    pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;

    if (!Number.isSafeInteger(pageCount) || pageCount < 1) {
      return errorResponse("PDF_CORRUPT", "PDF tidak memiliki halaman yang dapat dibaca.", 422, origin);
    }
    if (pageCount > MAX_PDF_PAGES) {
      return errorResponse(
        "TOO_MANY_PAGES",
        "PDF melebihi batas 200 halaman untuk versi ini.",
        422,
        origin,
        { pageCount, maxPages: MAX_PDF_PAGES },
      );
    }
    if (requestedStartPage > pageCount) {
      return errorResponse(
        "INVALID_PAGE_RANGE",
        `Halaman ${requestedStartPage} tidak ada di PDF ini yang hanya memiliki ${pageCount} halaman.`,
        400,
        origin,
      );
    }

    const batchSize = 5;
    const endPage = Math.min(pageCount, requestedStartPage + batchSize - 1);
    const pageResults: Array<{
      pageNumber: number;
      textChars: number;
      textFound: boolean;
      truncated: boolean;
      classification: ReturnType<typeof classifyRabDocument>;
    }> = [];

    for (let pageNumber = requestedStartPage; pageNumber <= endPage; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      let extracted: Awaited<ReturnType<typeof extractPageText>>;
      try {
        extracted = await extractPageText(page);
      } finally {
        page.cleanup();
      }

      const pageClassification = classifyRabDocument(extracted.text);
      pageResults.push({
        pageNumber,
        textChars: extracted.textChars,
        textFound: extracted.text.length > 0,
        truncated: extracted.truncated,
        classification: pageClassification,
      });
    }

    const complete = endPage === pageCount;
    const classification = summarizeRabPageClassifications(pageResults, { complete });

    return jsonResponse({
      ok: true,
      status: "PDF_TEXT_REVIEWED",
      pageCount,
      sizeBytes: bytes.byteLength,
      pagesReviewed: {
        start: requestedStartPage,
        end: endPage,
        count: pageResults.length,
        total: pageCount,
        complete,
      },
      nextStartPage: complete ? null : endPage + 1,
      pageResults,
      classification,
      checks: {
        pdfHeader: "passed",
        pdfStructure: "passed",
        pageCount: "passed",
      },
      processing: {
        mode: "progressive-text-extraction",
        pagesPerRequest: batchSize,
        ocr: "not-run",
        persistentStorage: false,
        extractedTextReturnedToClient: false,
      },
      message: complete
        ? "Pemeriksaan teks seluruh halaman selesai. Dokumen yang berisi halaman scan tetap memerlukan OCR."
        : `Teks halaman ${requestedStartPage}–${endPage} sudah diperiksa. Lanjutkan untuk memeriksa halaman berikutnya.`,
    }, 200, origin);
  } catch (error) {
    if (error instanceof Error && error.name === "PayloadTooLargeError") {
      return errorResponse("FILE_TOO_LARGE", "Ukuran file maksimum adalah 30 MiB.", 413, origin, {
        maxFileSizeBytes: MAX_FILE_SIZE_BYTES,
      });
    }

    if (isEncryptedPdfError(error)) {
      return errorResponse(
        "PDF_PASSWORD_PROTECTED",
        "PDF ini terkunci password. Unggah salinan PDF yang tidak dilindungi password.",
        422,
        origin,
      );
    }

    if (!pdfParsingStarted) {
      console.error("preflight dependency failed");
      return errorResponse("PREFLIGHT_TEMPORARY_FAILURE", "Layanan pemeriksaan sedang bermasalah. Coba lagi nanti.", 503, origin);
    }

    // Do not return or log parser internals because they may include untrusted file details.
    console.error("preflight parse failed");
    return errorResponse(
      "PDF_CORRUPT",
      "PDF tidak dapat dibaca strukturnya atau berkasnya rusak.",
      422,
      origin,
    );
  } finally {
    if (loadingTask) {
      try {
        await loadingTask.destroy();
      } catch {
        // All per-page resources are already released; best-effort document teardown.
      }
    }
  }
});
