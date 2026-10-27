import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { createWorker } from "tesseract.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export const MAX_OCR_PAGES_PER_RUN = 5;
const MAX_RENDER_PIXELS = 4_000_000;
const MAX_RENDER_DIMENSION = 3_000;
const MAX_OCR_TEXT_CHARS = 20_000;
const TESSERACT_WORKER_URL =
  "https://cdn.jsdelivr.net/npm/tesseract.js@7.0.0/dist/worker.min.js";

export type LocalOcrProgress = {
  phase: "loading-pdf" | "loading-engine" | "rendering" | "recognizing";
  pageNumber?: number;
  completed: number;
  total: number;
  progress?: number;
};

export type LocalOcrPageResult = {
  pageNumber: number;
  text: string;
};

type LocalOcrOptions = {
  signal?: AbortSignal;
  onProgress?: (progress: LocalOcrProgress) => void;
};

/**
 * OCR only the requested scan-only pages in the browser. PDF bytes and OCR
 * results remain in this tab; no page image or recognized text is uploaded.
 */
export async function ocrPdfPages(
  file: File,
  requestedPageNumbers: number[],
  options: LocalOcrOptions = {},
): Promise<LocalOcrPageResult[]> {
  const pageNumbers = [...new Set(requestedPageNumbers)]
    .filter((pageNumber) => Number.isInteger(pageNumber) && pageNumber > 0)
    .sort((left, right) => left - right);

  if (pageNumbers.length === 0) return [];
  if (pageNumbers.length > MAX_OCR_PAGES_PER_RUN) {
    throw new Error(`OCR dibatasi maksimal ${MAX_OCR_PAGES_PER_RUN} halaman per proses.`);
  }

  const signal = options.signal;
  const report = (progress: LocalOcrProgress) => options.onProgress?.(progress);
  const assertNotAborted = () => {
    if (signal?.aborted) throw new DOMException("OCR dibatalkan.", "AbortError");
  };

  report({ phase: "loading-pdf", completed: 0, total: pageNumbers.length });
  assertNotAborted();

  const bytes = new Uint8Array(await file.arrayBuffer());
  assertNotAborted();
  const loadingTask = pdfjsLib.getDocument({
    data: bytes,
    isEvalSupported: false,
    useWorkerFetch: false,
  });

  let worker: Awaited<ReturnType<typeof createWorker>> | null = null;
  let workerTerminated = false;
  const terminateWorker = async () => {
    if (!worker || workerTerminated) return;
    workerTerminated = true;
    await worker.terminate();
  };
  const abortWorker = () => {
    void terminateWorker().catch(() => undefined);
  };
  signal?.addEventListener("abort", abortWorker, { once: true });

  try {
    const pdf = await loadingTask.promise;
    if (pdf.numPages < 1 || pdf.numPages > 200) {
      throw new Error("PDF harus memiliki 1–200 halaman untuk OCR lokal.");
    }
    if (pageNumbers.some((pageNumber) => pageNumber > pdf.numPages)) {
      throw new Error("Ada halaman OCR yang tidak tersedia pada PDF ini.");
    }

    assertNotAborted();
    report({ phase: "loading-engine", completed: 0, total: pageNumbers.length });
    let activePageNumber: number | undefined;
    worker = await createWorker("ind+eng", 1, {
      workerPath: TESSERACT_WORKER_URL,
      logger: (event) => {
        const progress = typeof event.progress === "number" ? event.progress : undefined;
        const isRecognizing = String(event.status ?? "").toLowerCase().includes("recogniz");
        report({
          phase: isRecognizing ? "recognizing" : "loading-engine",
          pageNumber: activePageNumber,
          completed: 0,
          total: pageNumbers.length,
          ...(progress === undefined ? {} : { progress }),
        });
      },
    });
    assertNotAborted();

    const results: LocalOcrPageResult[] = [];
    for (const [index, pageNumber] of pageNumbers.entries()) {
      assertNotAborted();
      activePageNumber = pageNumber;
      report({
        phase: "rendering",
        pageNumber,
        completed: index,
        total: pageNumbers.length,
      });

      const page = await pdf.getPage(pageNumber);
      const canvas = document.createElement("canvas");
      try {
        const baseViewport = page.getViewport({ scale: 1 });
        const largestDimension = Math.max(baseViewport.width, baseViewport.height);
        const pixelScale = Math.sqrt(
          MAX_RENDER_PIXELS / (baseViewport.width * baseViewport.height),
        );
        const scale = Math.min(2, pixelScale, MAX_RENDER_DIMENSION / largestDimension);
        if (!Number.isFinite(scale) || scale < 0.35) {
          throw new Error("Ukuran halaman terlalu besar untuk OCR lokal yang aman.");
        }

        const viewport = page.getViewport({ scale });
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext("2d", { alpha: false, willReadFrequently: true });
        if (!context) throw new Error("Browser tidak dapat menyiapkan kanvas OCR.");

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({
          canvasContext: context,
          viewport,
          background: "#ffffff",
        }).promise;
        assertNotAborted();

        report({
          phase: "recognizing",
          pageNumber,
          completed: index,
          total: pageNumbers.length,
        });
        const recognized = await worker.recognize(canvas);
        assertNotAborted();
        results.push({
          pageNumber,
          text: String(recognized.data.text ?? "").slice(0, MAX_OCR_TEXT_CHARS).trim(),
        });
      } finally {
        page.cleanup();
        canvas.width = 0;
        canvas.height = 0;
      }

      report({
        phase: "recognizing",
        pageNumber,
        completed: index + 1,
        total: pageNumbers.length,
        progress: 1,
      });
    }

    return results;
  } finally {
    signal?.removeEventListener("abort", abortWorker);
    await terminateWorker().catch(() => undefined);
    await loadingTask.destroy().catch(() => undefined);
  }
}
