# RabConverter Documentation Index

Dokumen ini adalah source of truth untuk produk, perilaku, data dan implementasi RabConverter. Jika dokumen bertentangan, ikuti urutan otoritas di bawah dan catat penyelesaiannya di decision log. Semua dokumen yang terdampak harus diperbarui sebagai dokumen lengkap; jangan menempelkan fragmen perubahan yang membuat sumber kebenaran terpecah.

## Urutan otoritas dokumen

1. [product-definition.md](product-definition.md) — tujuan produk, batas MVP dan formula reconstruction.
2. [pricing-and-billing.md](pricing-and-billing.md) — harga, halaman tertagih, wallet, top-up, charge, reversal dan COGS.
3. [contractor-workflow.md](contractor-workflow.md) — workflow kontraktor dan evidence manual re-entry.
4. [document-taxonomy.md](document-taxonomy.md) — klasifikasi dokumen, halaman, baris RAB dan aturan halaman tertagih.
5. [canonical-data-model.md](canonical-data-model.md) — model data, provenance, ledger dan metering.
6. [supported-formats.md](supported-formats.md) — scope input dan golden test matrix.
7. [user-experience.md](user-experience.md) — upload, progress, review, estimasi biaya dan download.
8. [processing-pipeline.md](processing-pipeline.md) — Reducto, ekstraksi, formula, validasi, metering dan failure handling.
9. [export-specification.md](export-specification.md) — kontrak workbook XLSX dan rekonsiliasi.
10. [acceptance-criteria.md](acceptance-criteria.md) — definition of done yang bisa diuji.
11. [architecture.md](architecture.md) — arsitektur cloud dan deployment.
12. [security-and-data-handling.md](security-and-data-handling.md) — data privat, provider, payment callback dan secrets.
13. [research-and-sources.md](research-and-sources.md) — sumber penelitian dan asumsi yang belum terbukti.
14. [decisions/README.md](decisions/README.md) — keputusan disetujui dan keputusan yang masih pending.

## Baseline keputusan yang berlaku

- Input MVP adalah PDF RAB/BOQ; output utama adalah XLSX editable dengan formula yang aman direkonstruksi.
- Harga awal pengguna Rp2.500 per halaman tertagih; minimum top-up Rp50.000.
- Halaman tertagih adalah halaman yang menyumbangkan setidaknya satu record RAB/BOQ bermakna dan traceable ke hasil XLSX yang berhasil dibuat.
- Halaman kosong, tidak relevan dan halaman yang gagal menghasilkan data berguna tidak ditagih.
- Reducto Deep Extract adalah satu-satunya provider ekstraksi pada MVP awal. LlamaExtract dan Pulse Ultra 2 dikecualikan, termasuk dari fallback otomatis.
- COGS Reducto harus direkam dari usage aktual. Estimasi retry dan kurs hanya asumsi perencanaan, bukan biaya terukur atau jaminan margin.
- Provider pembayaran belum dipilih. Pembayaran harus memiliki callback terverifikasi, idempotensi dan status transaksi; QRIS merupakan metode lokal yang diutamakan untuk dievaluasi.
- Proyek saat ini dokumentasi-only. Tidak ada aplikasi RabConverter yang telah diverifikasi live.

## Implementation gates

Jangan mulai implementasi billing/production processing sebelum:
- [ ] Definisi billable page, no-charge failure, refund/reversal, charge idempotency dan top-up minimum ditetapkan.
- [ ] Daftar golden PDF yang memiliki hak penggunaan, expected rows dan expected formulas tersedia.
- [ ] Privasi, retensi, lokasi pemrosesan, penggunaan data, API plan dan ketentuan Reducto yang berlaku untuk akun sudah diperiksa.
- [ ] Provider pembayaran dipilih setelah diperiksa untuk QRIS, webhook signature, replay/idempotency, refund/reconciliation dan biaya.
- [ ] Model data/ledger dan migration plan ditinjau sebelum schema dibuat.
- [ ] Acceptance tests billing dan processing dapat dijalankan deterministik tanpa memanggil layanan berbayar saat CI.
- [ ] Kode aplikasi, cloud preview dan deployment dapat dibuktikan melalui commit, workflow dan URL nyata.

## Change and release policy

Setiap perubahan perilaku harus memperbarui dokumen otoritas dan acceptance criteria terkait dalam commit yang sama. Revisi dokumentasi harus mengirim isi dokumen lengkap, bukan instruksi patch atau fragmen lepas. Dokumen bukan bukti bahwa provider, billing, database schema, production route atau deployment sudah dibangun.

Gunakan data sintetis/golden fixture yang diizinkan untuk pengujian hingga gate provider privacy dan data handling dinyatakan lolos. Jangan menjalankan live Reducto API atau membuat transaksi pembayaran nyata untuk sekadar menguji dokumentasi.
