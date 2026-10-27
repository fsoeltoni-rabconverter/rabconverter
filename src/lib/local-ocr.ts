import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";
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
  /** Best-effort OCR rows, grouped by vertical line and horizontal cell gaps. */
  rows: string[][];
  truncated: boolean;
};

type LocalOcrOptions = {
  signal?: AbortSignal;
  onProgress?: (progress: LocalOcrProgress) => void;
  /** Defaults to five pages for the explicit OCR button. Conversion may set a higher, bounded cap. */
  maxPages?: number;
};

type OcrWord = {
  text?: string;
  bbox?: { x0?: number; y0?: number; x1?: number; y1?: number };
};

function rowsFromOcrWords(words: OcrWord[], fallbackText: string): string[][] {
  const positioned = words
    .filter((word) => typeof word.text === "string" && word.text.trim() && word.bbox)
    .map((word) => ({
      text: String(word.text).trim(),
      x0: Number(word.bbox?.x0 ?? 0),
      y0: Number(word.bbox?.y0 ?? 0),
      x1: Number(word.bbox?.x1 ?? 0),
      y1: Number(word.bbox?.y1 ?? 0),
    }))
    .filter((word) => Number.isFinite(word.x0) && Number.isFinite(word.y0) && word.x1 >= word.x0);

  if (positioned.length === 0) {
    return fallbackText.split(/\\r?\\n/).map((line) => line.trim()).filter(Boolean).map((line) => [line]);
  }

  positioned.sort((left, right) => (left.y0 + left.y1) / 2 - (right.y0 + right.y1) / 2 || left.x0 - right.x0);
  const lines: Array<{ centerY: number; height: number; words: typeof positioned }> = [];

  for (const word of positioned) {
    const centerY = (word.y0 + word.y1) / 2;
    const height = Math.max(1, word.y1 - word.y0);
    const current = lines.at(-1);
    if (!current || Math.abs(centerY - current.centerY) > Math.max(5, Math.min(16, height * 0.55))) {
      lines.push({ centerY, height, words: [word] });
    } else {
      const count = current.words.length;
      current.centerY = (current.centerY * count + centerY) / (count + 1);
      current.height = (current.height * count + height) / (count + 1);
      current.words.push(word);
    }
  }

  return lines.map((line) => {
    line.words.sort((left, right) => left.x0 - right.x0);
    const cells: string[] = [];
    let currentCell = "";
    let lastRight = 0;
    for (const word of line.words) {
      const gap = word.x0 - lastRight;
      const threshold = Math.max(6, line.height * 0.3);
      if (currentCell && gap > threshold) {
        cells.push(currentCell.trim());
        currentCell = "";
      }
      currentCell += (currentCell ? " " : "") + word.text;
      lastRight = Math.max(lastRight, word.x1);
    }
    if (currentCell.trim()) cells.push(currentCell.trim());
    return cells;
  }).filter((row) => row.some(Boolean));
}

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
  const maxPages = Math.max(1, Math.min(options.maxPages ?? MAX_OCR_PAGES_PER_RUN, 200));
  if (pageNumbers.length > maxPages) {
    throw new Error(`OCR dibatasi maksimal ${maxPages} halaman per proses.`);
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
          canvas,
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
        const recognizedText = String(recognized.data.text ?? "").trim();
        const boundedText = recognizedText.slice(0, MAX_OCR_TEXT_CHARS);
        const recognizedData = recognized.data as unknown as { words?: OcrWord[] };
        results.push({
          pageNumber,
          text: boundedText,
          rows: rowsFromOcrWords(recognizedData.words ?? [], boundedText),
          truncated: recognizedText.length > MAX_OCR_TEXT_CHARS,
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
