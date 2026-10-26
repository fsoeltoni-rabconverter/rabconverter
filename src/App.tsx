import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

const MAX_FILE_SIZE_BYTES = 30 * 1024 * 1024;

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

  function validateAndSetFile(file?: File) {
    setMessage("");
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setSelectedFile(null);
      setMessage("Pilih dokumen dengan format PDF.");
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setSelectedFile(null);
      setMessage("Ukuran file maksimum untuk langkah awal ini adalah 30 MB.");
      return;
    }
    if (file.size === 0) {
      setSelectedFile(null);
      setMessage("File kosong. Coba pilih PDF yang lain.");
      return;
    }

    setSelectedFile(file);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    validateAndSetFile(event.target.files?.[0]);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    validateAndSetFile(event.dataTransfer.files?.[0]);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="RabConverter beranda">
          <span className="brand-mark">R<span>.</span></span>
          <span className="brand-name">rabconverter</span>
        </a>
        <div className="topbar-right">
          <span className="price-chip"><span className="chip-dot" /> Rp2.500 <span className="chip-muted">/ halaman</span></span>
          <span className="beta-label">VERSI AWAL</span>
        </div>
      </header>

      <main className="main-content">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> DOKUMEN JADI DATA, LEBIH CEPAT</div>
          <h1>PDF RAB ke Excel.<br /><span>Tanpa input ulang.</span></h1>
          <p className="hero-description">
            Ubah Rencana Anggaran Biaya menjadi spreadsheet yang bisa diedit,
            lengkap dengan rumus perhitungan yang dapat diperiksa.
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
            <>
              <div className="upload-illustration">
                <div className="orbit orbit-one" />
                <div className="orbit orbit-two" />
                <div className="file-icon"><FileIcon /></div>
                <div className="float-tag tag-pdf">PDF</div>
                <div className="float-tag tag-xlsx">XLSX <span>↗</span></div>
              </div>
              <h2>Mulai dari PDF RAB kamu</h2>
              <p className="upload-hint">Tarik file ke sini, atau pilih dari perangkat.</p>
              <button className="primary-button" type="button" onClick={() => inputRef.current?.click()}>
                <span>Pilih PDF RAB</span><ArrowIcon />
              </button>
              <p className="file-limit">PDF saja · Maks. 30 MB</p>
            </>
          ) : (
            <div className="selected-state">
              <div className="selected-file-icon"><FileIcon /></div>
              <div className="selected-copy">
                <span className="selected-kicker">FILE DIPILIH</span>
                <strong title={selectedFile.name}>{selectedFile.name}</strong>
                <span>{formatBytes(selectedFile.size)} · PDF</span>
              </div>
              <button className="remove-file" type="button" onClick={() => { setSelectedFile(null); setMessage(""); }} aria-label="Hapus pilihan file">×</button>
              <div className="preview-notice">
                <span className="notice-dot" />
                Pratinjau awal — kuota dan konversi belum dihubungkan.
              </div>
              <button className="primary-button" type="button" disabled>
                <span>Konversi PDF</span><ArrowIcon />
              </button>
              <p className="file-limit">File belum dikirim ke server.</p>
            </div>
          )}
          <input ref={inputRef} className="visually-hidden" type="file" accept="application/pdf,.pdf" onChange={handleInputChange} aria-label="Pilih dokumen PDF RAB" />
          {message && <p className="error-message" role="alert">{message}</p>}
        </section>

        <div className="reassurance-row">
          <div className="reassurance-item"><span className="reassurance-icon">↗</span><span>Excel bisa diedit</span></div>
          <span className="reassurance-separator" />
          <div className="reassurance-item"><span className="reassurance-check">✓</span><span>Rumus perhitungan</span></div>
          <span className="reassurance-separator" />
          <div className="reassurance-item"><span className="reassurance-check">✓</span><span>Bayar saat berhasil</span></div>
        </div>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} RabConverter</span>
        <span className="footer-note">Dibuat untuk pekerjaan RAB yang lebih praktis.</span>
      </footer>
    </div>
  );
}
