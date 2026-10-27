import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { classifyRabDocument, summarizeRabPageClassifications, validatePdfFile, type RabPageTextResult } from "./lib/preflight.js";
import { MAX_OCR_PAGES_PER_RUN, ocrPdfPages, type LocalOcrProgress } from "./lib/local-ocr.js";
import { AiConversionError, requestAiRabConversion } from "./lib/ai-conversion.js";
import { downloadAiWorkbook } from "./lib/ai-workbook.js";

const PREFLIGHT_ENDPOINT = import.meta.env.VITE_PREFLIGHT_URL?.trim()
  || "https://zkcziucjogprfzhjuaex.supabase.co/functions/v1/preflight-rab";

type ServerPreflightResult = {
  pageCount: number;
  sizeBytes: number;
  pagesReviewed: {
    start: number;
    end: number;
    count: number;
    total: number;
    complete: boolean;
  };
  nextStartPage: number | null;
  pageResults: RabPageTextResult[];
};

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileIcon() {
  return (
    <svg viewBox="0 0 32 36" aria-hidden="true">
      <path d="M5 1.5h14l8 8V32a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 3 32V4a2.5 2.5 0 0 1 2-2.5Z" fill="#fff" stroke="currentColor" strokeWidth="1.5" />
      <path d="M19 1.5v8h8" fill="#eef5f0" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 19h13M8 23.5h13M8 28h9" stroke="#638574" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11M10 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState("");
  const pickerOpenRef = useRef(false);
  const validationRunRef = useRef(0);
  const preflightRunRef = useRef(0);
  const preflightAbortRef = useRef<AbortController | null>(null);
  const [preflightBusy, setPreflightBusy] = useState(false);
  const [preflightResult, setPreflightResult] = useState<ServerPreflightResult | null>(null);
  const [pageReports, setPageReports] = useState<RabPageTextResult[]>([]);
  const [reviewStartPage, setReviewStartPage] = useState(1);
  const [ocrBusy, setOcrBusy] = useState(false);
  const [ocrProgressText, setOcrProgressText] = useState("");
  const [ocrNotice, setOcrNotice] = useState("");
  const [conversionBusy, setConversionBusy] = useState(false);
  const [conversionProgressText, setConversionProgressText] = useState("");
  const [conversionNotice, setConversionNotice] = useState("");
  const ocrAbortRef = useRef<AbortController | null>(null);
  const ocrRunRef = useRef(0);
  const conversionAbortRef = useRef<AbortController | null>(null);
  const conversionRunRef = useRef(0);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleCancel = () => {
      // Native file-picker cancellation should only release the open guard.
      pickerOpenRef.current = false;
    };

    input.addEventListener("cancel", handleCancel);
    return () => input.removeEventListener("cancel", handleCancel);
  }, []);

  async function validateAndSetFile(file?: File) {
    if (!file) return;

    const validationRun = ++validationRunRef.current;
    preflightRunRef.current += 1;
    preflightAbortRef.current?.abort();
    preflightAbortRef.current = null;
    ocrRunRef.current += 1;
    ocrAbortRef.current?.abort();
    ocrAbortRef.current = null;
    conversionRunRef.current += 1;
    conversionAbortRef.current?.abort();
    conversionAbortRef.current = null;
    setPreflightBusy(false);
    setOcrBusy(false);
    setOcrProgressText("");
    setOcrNotice("");
    setConversionBusy(false);
    setConversionProgressText("");
    setConversionNotice("");
    setPreflightResult(null);
    setPageReports([]);
    setReviewStartPage(1);
    setMessage("");

    const validation = await validatePdfFile(file);
    if (validationRun !== validationRunRef.current) return;

    if (!validation.ok) {
      setSelectedFile(null);
      setMessage(validation.message);
      return;
    }

    setSelectedFile(file);
  }

  function removeSelectedFile() {
    validationRunRef.current += 1;
    preflightRunRef.current += 1;
    preflightAbortRef.current?.abort();
    preflightAbortRef.current = null;
    ocrRunRef.current += 1;
    ocrAbortRef.current?.abort();
    ocrAbortRef.current = null;
    conversionRunRef.current += 1;
    conversionAbortRef.current?.abort();
    conversionAbortRef.current = null;
    setSelectedFile(null);
    setPreflightBusy(false);
    setOcrBusy(false);
    setOcrProgressText("");
    setOcrNotice("");
    setOcrPages({});
    setConversionBusy(false);
    setConversionProgressText("");
    setConversionNotice("");
    setPreflightResult(null);
    setPageReports([]);
    setReviewStartPage(1);
    setMessage("");
  }

  async function runPreflight() {
    if (!selectedFile || preflightBusy || ocrBusy || conversionBusy) return;

    const restartingReview = preflightResult !== null && preflightResult.nextStartPage === null;
    const startPage = restartingReview ? 1 : (preflightResult?.nextStartPage ?? 1);
    if (restartingReview) {
      setPreflightResult(null);
      setPageReports([]);
      setOcrNotice("");
      setOcrProgressText("");
    }

    const runId = ++preflightRunRef.current;
    const controller = new AbortController();
    preflightAbortRef.current = controller;
    setReviewStartPage(startPage);
    setPreflightBusy(true);
    setMessage("");

    try {
      const response = await fetch(PREFLIGHT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/pdf",
          "x-preflight-start-page": String(startPage),
        },
        body: selectedFile,
        signal: controller.signal,
      });

      const payload = await response.json().catch(() => null) as
        | {
            ok?: boolean;
            pageCount?: number;
            sizeBytes?: number;
            pagesReviewed?: ServerPreflightResult["pagesReviewed"];
            nextStartPage?: number | null;
            pageResults?: RabPageTextResult[];
            code?: string;
            message?: string;
          }
        | null;

      if (runId !== preflightRunRef.current) return;
      if (
        !response.ok ||
        !payload?.ok ||
        typeof payload.pageCount !== "number" ||
        !payload.pagesReviewed ||
        !Array.isArray(payload.pageResults) ||
        !(payload.nextStartPage === null || typeof payload.nextStartPage === "number")
      ) {
        setMessage(payload?.message || "Pemeriksaan PDF gagal. Coba lagi dengan file yang berbeda.");
        return;
      }

      setPreflightResult({
        pageCount: payload.pageCount,
        sizeBytes: typeof payload.sizeBytes === "number" ? payload.sizeBytes : selectedFile.size,
        pagesReviewed: payload.pagesReviewed,
        nextStartPage: payload.nextStartPage,
        pageResults: payload.pageResults,
      });
      setPageReports((previous) => {
        const reports = new Map(previous.map((page) => [page.pageNumber, page]));
        for (const page of payload.pageResults ?? []) reports.set(page.pageNumber, page);
        return [...reports.values()].sort((left, right) => left.pageNumber - right.pageNumber);
      });
    } catch (error) {
      if (runId !== preflightRunRef.current || (error instanceof Error && error.name === "AbortError")) return;
      setMessage("Tidak dapat menghubungi layanan pemeriksaan. Periksa koneksi lalu coba lagi.");
    } finally {
      if (runId === preflightRunRef.current) {
        setPreflightBusy(false);
        preflightAbortRef.current = null;
      }
    }
  }

  async function runLocalOcr() {
    if (!selectedFile || ocrBusy || preflightBusy || conversionBusy || !classificationSummary?.pagesNeedingOcr.length) return;

    const pagesToOcr = classificationSummary.pagesNeedingOcr.slice(0, MAX_OCR_PAGES_PER_RUN);
    const runId = ++ocrRunRef.current;
    const controller = new AbortController();
    ocrAbortRef.current = controller;
    setOcrBusy(true);
    setOcrProgressText("Menyiapkan OCR lokal…");
    setOcrNotice("");
    setMessage("");

    const describeProgress = (progress: LocalOcrProgress) => {
      const pageLabel = progress.pageNumber ? `halaman ${progress.pageNumber}` : "";
      if (progress.phase === "loading-pdf") {
        setOcrProgressText("Membuka PDF di perangkat…");
      } else if (progress.phase === "loading-engine") {
        setOcrProgressText("Menyiapkan mesin OCR Bahasa Indonesia + Inggris…");
      } else if (progress.phase === "rendering") {
        setOcrProgressText(`Merender ${pageLabel} untuk OCR lokal…`);
      } else {
        const percent = typeof progress.progress === "number" && progress.progress < 1
          ? ` ${Math.round(progress.progress * 100)}%`
          : "";
        setOcrProgressText(`Mengenali teks ${pageLabel}…${percent}`);
      }
    };

    try {
      const results = await ocrPdfPages(selectedFile, pagesToOcr, {
        signal: controller.signal,
        onProgress: describeProgress,
      });
      if (runId !== ocrRunRef.current || controller.signal.aborted) return;

      const recognizedPages = new Map(results.map((result) => [result.pageNumber, result]));
      setPageReports((previous) => previous.map((page) => {
        const result = recognizedPages.get(page.pageNumber);
        if (!result) return page;
        const text = result.text.trim();
        return {
          ...page,
          textChars: text.length,
          textFound: text.length > 0,
          truncated: page.truncated || result.truncated,
          ocrAttempted: true,
          classification: classifyRabDocument(text, { ocrAttempted: true }),
        };
      }));
      setOcrNotice(
        results.length
          ? `OCR lokal selesai untuk halaman ${results.map((result) => result.pageNumber).join(", ")}. Teks hanya dipakai untuk klasifikasi di perangkat; tidak dikirim ke server.`
          : "Tidak ada halaman yang dapat diproses dengan OCR lokal.",
      );
      setOcrProgressText("");
    } catch (error) {
      if (runId !== ocrRunRef.current || controller.signal.aborted || (error instanceof Error && error.name === "AbortError")) return;
      setMessage(error instanceof Error
        ? `OCR lokal gagal: ${error.message}`
        : "OCR lokal gagal. Coba lagi atau gunakan PDF yang lebih jelas.");
      setOcrProgressText("");
    } finally {
      if (runId === ocrRunRef.current) {
        setOcrBusy(false);
        ocrAbortRef.current = null;
      }
    }
  }

  async function runConversion() {
    if (!selectedFile || preflightBusy || ocrBusy || conversionBusy) return;

    const runId = ++conversionRunRef.current;
    const controller = new AbortController();
    conversionAbortRef.current = controller;
    setConversionBusy(true);
    setConversionProgressText("Menyiapkan AI multimodal untuk membaca tabel RAB…");
    setConversionNotice("");
    setMessage("");

    try {
      const result = await requestAiRabConversion(selectedFile, {
        signal: controller.signal,
        onProgress: (progress) => {
          if (runId === conversionRunRef.current) setConversionProgressText(progress);
        },
      });
      if (runId !== conversionRunRef.current || controller.signal.aborted) return;

      setConversionProgressText("Membuat workbook Excel dengan sheet bukti dan validasi…");
      const downloaded = downloadAiWorkbook(result, selectedFile.name);
      setConversionNotice(
        `Excel AI berhasil dibuat: ${downloaded.fileName}. ${result.document.pageCount} halaman · ${result.quality.rowCount} baris diekstrak · ${result.quality.reviewCount} perlu review · ${result.quality.mismatchCount} mismatch hitungan. Periksa sheet Bukti AI dan Ringkasan sebelum menggunakan angka.`,
      );
      setConversionProgressText("");
    } catch (error) {
      if (
        runId !== conversionRunRef.current ||
        controller.signal.aborted ||
        (error instanceof Error && error.name === "AbortError")
      ) return;

      setMessage(error instanceof AiConversionError || error instanceof Error
        ? error.message
        : "Konversi AI gagal. File tidak dibuat; coba lagi nanti.");
      setConversionProgressText("");
    } finally {
      if (runId === conversionRunRef.current) {
        setConversionBusy(false);
        conversionAbortRef.current = null;
      }
    }
  }

  function openFilePicker() {
    const input = inputRef.current;
    if (!input || pickerOpenRef.current) return;

    // Guard against duplicate click events opening the native dialog twice.
    pickerOpenRef.current = true;
    input.click();
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    pickerOpenRef.current = false;
    validateAndSetFile(event.target.files?.[0]);
    // Allow the same PDF to be picked again after removing or replacing it.
    event.target.value = "";
  }


  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    validateAndSetFile(event.dataTransfer.files?.[0]);
  }

  const reviewComplete = Boolean(
    preflightResult?.pagesReviewed.complete &&
    preflightResult.pageCount === pageReports.length,
  );
  const classificationSummary = pageReports.length > 0
    ? summarizeRabPageClassifications(pageReports, { complete: reviewComplete })
    : null;
  const classificationLabel = (() => {
    if (!classificationSummary) return "";
    switch (classificationSummary.status) {
      case "LIKELY_RAB":
        return reviewComplete ? "Kemungkinan besar RAB/BoQ" : "Sementara terlihat seperti RAB/BoQ";
      case "NEEDS_CONFIRMATION":
        return "Belum pasti RAB/BoQ — perlu konfirmasi";
      case "NOT_RAB":
        return "Tidak ditemukan cukup ciri RAB/BoQ";
      case "NEEDS_OCR":
        return "Ada halaman yang memerlukan OCR";
      case "UNREADABLE_PDF":
        return "Teks PDF belum dapat dibaca";
      default:
        return "Bukti belum cukup — periksa halaman berikutnya";
    }
  })();

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="RabConverter beranda">
          <span className="brand-mark" aria-hidden="true"><span className="brand-letter">R</span><span className="brand-dot">.</span></span>
          <span className="brand-name">rabconverter</span>
        </a>
        <div className="topbar-right">
          <span className="price-chip"><span className="chip-dot" /> Rp2.500 <span className="chip-muted">/ halaman</span></span>
          <span className="beta-label">VERSI AWAL</span>
        </div>
      </header>

      <main className="main-content">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> PDF RAB MENJADI EXCEL</div>
          <h1>RAB PDF ke Excel.<br /><span>Tanpa Ketik Ulang.</span></h1>
          <p className="hero-description">
            Ubah tabel RAB atau BoQ PDF menjadi Excel yang bisa diedit.
          </p>
        </div>

        <section
          className={`upload-card ${dragging ? "is-dragging" : ""} ${selectedFile ? "has-file" : ""}`}
          onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={(event) => { event.preventDefault(); setDragging(false); }}
          onDrop={handleDrop}
          aria-label="Area upload PDF RAB"
        >
          {!selectedFile ? (
            <div className="empty-state">
              <div className="upload-illustration">
                <div className="orbit orbit-one" />
                <div className="orbit orbit-two" />
                <div className="file-icon"><FileIcon /></div>
                <div className="float-tag tag-pdf">PDF</div>
                <div className="float-tag tag-xlsx">XLSX <span>↗</span></div>
              </div>
              <h2>Mulai dari PDF RAB atau BoQ kamu</h2>
              <p className="upload-hint">Tarik file ke sini, atau pilih PDF RAB/BoQ dari perangkat.</p>
              <button className="primary-button" type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); openFilePicker(); }}>
                <span>Pilih PDF RAB</span><ArrowIcon />
              </button>
              <p className="file-limit">PDF saja · Maks. 30 MiB</p>
            </div>
          ) : (
            <div className="selected-state">
              <div className="selected-file-icon"><FileIcon /></div>
              <div className="selected-copy">
                <span className="selected-kicker">PDF DIPILIH</span>
                <strong title={selectedFile.name}>{selectedFile.name}</strong>
                <span>{formatBytes(selectedFile.size)} · PDF</span>
              </div>
              <button className="remove-file" type="button" onClick={removeSelectedFile} aria-label="Hapus pilihan file">×</button>
              <div className={`preflight-panel ${classificationSummary?.status === "LIKELY_RAB" ? "is-success" : ""}`} aria-live="polite">
                <span className="notice-dot" />
                {preflightBusy
                  ? `Membaca teks halaman ${reviewStartPage}–${Math.min(reviewStartPage + 4, preflightResult?.pageCount ?? 200)}…`
                  : classificationSummary
                    ? classificationLabel
                    : "Periksa struktur dan teks PDF untuk melihat apakah isinya menyerupai RAB/BoQ."}
                {classificationSummary && (
                  <span className="preflight-detail">
                    {pageReports.length} dari {preflightResult?.pageCount ?? "?"} halaman diperiksa
                    {classificationSummary.complete ? " · pemeriksaan seluruh halaman selesai" : " · pemeriksaan bertahap"}
                    {classificationSummary.pagesNeedingOcr.length > 0
                      ? ` · ${classificationSummary.pagesNeedingOcr.length} halaman scan siap untuk OCR lokal`
                      : ""}
                    {classificationSummary.pagesUnreadableAfterOcr.length > 0
                      ? ` · OCR belum menemukan teks pada ${classificationSummary.pagesUnreadableAfterOcr.length} halaman`
                      : ""}
                    {classificationSummary.truncatedPages.length > 0
                      ? ` · teks pada ${classificationSummary.truncatedPages.length} halaman dibatasi untuk menjaga penggunaan memori`
                      : ""}
                    {" "}File tidak disimpan permanen; ekstraksi server hanya mengirim ringkasan, sedangkan OCR memakai hasil sementara di perangkat.
                  </span>
                )}
                {ocrBusy && <span className="preflight-detail" role="status">{ocrProgressText}</span>}
                {ocrNotice && <span className="preflight-detail">{ocrNotice}</span>}
                {conversionBusy && <span className="preflight-detail" role="status">{conversionProgressText}</span>}
                {conversionNotice && <span className="preflight-detail">{conversionNotice}</span>}
              </div>
              <button
                className="export-button"
                type="button"
                onClick={runConversion}
                disabled={preflightBusy || ocrBusy || conversionBusy}
              >
                {conversionBusy ? "AI sedang menyusun Excel…" : "Konversi dengan AI & Unduh Excel"}
              </button>
              <p className="preflight-detail">
                PDF dikirim ke Google Gemini API untuk pemahaman dokumen multimodal. RabConverter tidak menyimpan PDF atau hasil ekstraksi secara permanen; kebijakan pemrosesan penyedia AI tetap berlaku.
              </p>
              <button
                className="secondary-button"
                type="button"
                onClick={runPreflight}
                disabled={preflightBusy || ocrBusy || conversionBusy}
              >
                {preflightBusy
                  ? "Memeriksa struktur PDF…"
                  : preflightResult?.nextStartPage !== null && preflightResult
                    ? "Periksa Halaman Berikutnya (opsional)"
                    : preflightResult
                      ? "Ulangi Pemeriksaan Struktur (opsional)"
                      : "Periksa Struktur PDF (opsional)"}
              </button>
              {classificationSummary && classificationSummary.pagesNeedingOcr.length > 0 && (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={runLocalOcr}
                  disabled={preflightBusy || ocrBusy}
                >
                  {ocrBusy
                    ? "Menjalankan OCR lokal…"
                    : `OCR Lokal · Halaman ${classificationSummary.pagesNeedingOcr.slice(0, MAX_OCR_PAGES_PER_RUN).join(", ")}`}
                </button>
              )}

              <p className="file-limit">
                {preflightBusy
                  ? "Mengekstrak maksimal 5 halaman teks"
                  : ocrBusy
                    ? "OCR berjalan di perangkat · halaman scan saja · tanpa unggah gambar"
                    : conversionBusy
                      ? conversionProgressText || "AI membaca dokumen dan menyiapkan file Excel…"
                      : "Konversi AI membaca PDF secara multimodal; hasil sumber dan validasi disertakan di workbook."}
              </p>
            </div>
          )}
          <input ref={inputRef} className="visually-hidden" type="file" accept="application/pdf,.pdf" onChange={handleInputChange} aria-label="Pilih dokumen PDF RAB" />
          {message && <p className="error-message" role="alert">{message}</p>}
        </section>

        <div className="reassurance-row" aria-label="Ringkasan fitur">
          <div className="reassurance-item"><span className="reassurance-check">✓</span><span>PDF RAB / BoQ</span></div>
          <span className="reassurance-separator" />
          <div className="reassurance-item"><span className="reassurance-check">✓</span><span>File Excel editable</span></div>
        </div>

      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} RabConverter</span>
        <span className="footer-note">Dibuat untuk pekerjaan RAB yang lebih praktis.</span>
      </footer>
    </div>
  );
}
