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
          <div className="eyebrow"><span className="eyebrow-line" /> PDF RAB MENJADI EXCEL</div>
          <h1>RAB PDF ke Excel.<br /><span>Tanpa Ketik Ulang.</span></h1>
          <p className="hero-description">
            Ubah tabel RAB atau BoQ dari PDF menjadi file Excel yang bisa diedit.
            Kurangi pekerjaan salin-tempel uraian pekerjaan, volume, satuan, dan harga satuan secara manual.
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
              <button className="primary-button" type="button" onClick={() => inputRef.current?.click()}>
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

        <div className="reassurance-row">
          <div className="reassurance-item"><span className="reassurance-icon">↗</span><span>Excel bisa diedit</span></div>
          <span className="reassurance-separator" />
          <div className="reassurance-item"><span className="reassurance-check">✓</span><span>Kurangi input manual</span></div>
          <span className="reassurance-separator" />
          <div className="reassurance-item"><span className="reassurance-check">✓</span><span>Periksa hasil sebelum dipakai</span></div>
        </div>

        <section className="seo-content" aria-label="Panduan RAB PDF ke Excel">
          <nav className="content-nav" aria-label="Navigasi panduan">
            <a href="#tentang-rabconverter">Tentang RabConverter</a>
            <a href="#siapkan-pdf">Menyiapkan PDF</a>
            <a href="#periksa-hasil">Pemeriksaan hasil</a>
            <a href="#faq">FAQ</a>
          </nav>

          <section className="content-block" id="tentang-rabconverter">
            <p className="content-eyebrow">UNTUK PEKERJAAN KONSTRUKSI</p>
            <h2>Ubah tabel RAB PDF ke Excel tanpa mengetik ulang setiap baris</h2>
            <p>RAB atau Bill of Quantities (BoQ) sering dibagikan sebagai PDF, sementara uraian pekerjaan, volume, satuan, harga satuan, dan jumlahnya perlu diolah lagi di spreadsheet. Memindahkan tabel baris demi baris secara manual dapat menyita waktu dan membuka peluang salah ketik.</p>
            <p>RabConverter dirancang untuk membantu alur kerja dari dokumen RAB/BoQ PDF menuju spreadsheet yang bisa diperiksa dan diedit. Alat ini bukan pembuat RAB dari gambar kerja, bukan penyedia harga material atau AHSP, dan tidak menggantikan pemeriksaan estimator.</p>
            <ul className="content-list">
              <li><strong>Uraian pekerjaan:</strong> pastikan deskripsi dan kode item tidak tertukar antarbaris.</li>
              <li><strong>Volume dan satuan:</strong> periksa tanda desimal, satuan, serta angka yang terpotong di pergantian halaman.</li>
              <li><strong>Harga dan jumlah:</strong> cocokkan subtotal dan total dengan dokumen sumber sebelum memakai hasil untuk penawaran atau pekerjaan proyek.</li>
            </ul>
          </section>

          <section className="content-block" id="siapkan-pdf">
            <p className="content-eyebrow">PANDUAN PRAKTIS</p>
            <h2>Yang perlu disiapkan sebelum mengubah RAB PDF ke Excel</h2>
            <h3>1. Kenali jenis PDF yang digunakan</h3>
            <p>PDF yang teksnya bisa dipilih biasanya lebih mudah diekstrak menjadi tabel daripada PDF hasil pindai yang berisi gambar halaman. Dokumen hasil pindai umumnya membutuhkan OCR (pengenalan karakter optik); jangan menganggap hasil OCR akan selalu benar, terutama untuk angka, simbol satuan, dan tanda desimal.</p>
            <h3>2. Perhatikan struktur tabel dan pergantian halaman</h3>
            <p>RAB dapat memiliki baris judul bagian, sub-total, catatan, atau kolom yang menyambung ke halaman berikutnya. Jangan memeriksa hanya jumlah total: pastikan tiap item masih berada di kolom dan bagian pekerjaan yang tepat.</p>
            <h3>3. Simpan PDF sumber untuk pembanding</h3>
            <p>Gunakan PDF asli sebagai referensi saat mengecek uraian, volume, satuan, harga satuan, subtotal, pajak, dan grand total. Jika ada nilai yang tidak terbaca atau tidak cocok, periksa dokumen sumber alih-alih menebak angka.</p>
          </section>

          <section className="content-block" id="periksa-hasil">
            <p className="content-eyebrow">CHECKLIST ESTIMATOR</p>
            <h2>Periksa Excel hasil konversi sebelum dipakai</h2>
            <p>Spreadsheet yang dapat diedit belum tentu identik dengan dokumen sumber. Luangkan waktu untuk memeriksa kembali:</p>
            <ul className="content-list">
              <li>Jumlah item dan urutannya sesuai dokumen PDF.</li>
              <li>Angka volume, satuan, harga satuan, dan jumlah berada di kolom yang benar.</li>
              <li>Angka desimal, pemisah ribuan, tanda minus, dan angka nol tidak berubah.</li>
              <li>Baris subtotal, rekapitulasi, pajak, serta total akhir dapat ditelusuri ke PDF sumber.</li>
              <li>Setiap formula yang dibutuhkan sudah diuji; jangan berasumsi formula asli PDF otomatis dipulihkan.</li>
            </ul>
          </section>

          <section className="content-block faq-block" id="faq">
            <p className="content-eyebrow">PERTANYAAN UMUM</p>
            <h2>Pertanyaan tentang RAB PDF ke Excel</h2>
            <details>
              <summary>Apakah RabConverter sudah bisa menghasilkan file Excel?</summary>
              <p>Belum pada versi preview ini. Halaman saat ini baru mendemonstrasikan pemilihan file; pemrosesan PDF dan pembuatan XLSX belum diaktifkan. File yang dipilih tidak dikirim ke server.</p>
            </details>
            <details>
              <summary>Apakah PDF hasil scan atau foto dokumen bisa dikonversi?</summary>
              <p>Dukungan PDF hasil scan dan OCR belum tersedia untuk diverifikasi di versi preview ini. Kemampuan tersebut tidak dijanjikan sampai fungsi konversinya diuji dan diaktifkan.</p>
            </details>
            <details>
              <summary>Apakah RabConverter membuat RAB baru atau menentukan harga AHSP?</summary>
              <p>Tidak. Fokus produk adalah membantu pemindahan tabel RAB/BoQ yang sudah ada dari PDF ke spreadsheet. Penyusunan lingkup pekerjaan, perhitungan volume dari gambar kerja, dan penentuan harga satuan adalah pekerjaan yang berbeda.</p>
            </details>
            <details>
              <summary>Mengapa hasil konversi tetap harus diperiksa?</summary>
              <p>Tata letak PDF bervariasi dan tabel dapat terpotong, berpindah halaman, atau memakai format angka yang berbeda. Pengecekan terhadap dokumen sumber penting sebelum spreadsheet digunakan untuk pekerjaan atau penawaran.</p>
            </details>
          </section>
        </section>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} RabConverter</span>
        <span className="footer-note">Dibuat untuk pekerjaan RAB yang lebih praktis.</span>
      </footer>
    </div>
  );
}
