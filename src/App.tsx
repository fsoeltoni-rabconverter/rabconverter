import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";

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
  const pickerOpenRef = useRef(false);

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
              <p className="file-limit">PDF saja · Maks. 30 MB</p>
            </div>
          ) : (
            <div className="selected-state">
              <div className="selected-file-icon"><FileIcon /></div>
              <div className="selected-copy">
                <span className="selected-kicker">PDF DIPILIH</span>
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
