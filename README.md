# RabConverter

**RabConverter mengubah PDF RAB/BOQ menjadi workbook Excel yang bisa diedit, dengan formula hasil rekonstruksi yang aktif ketika struktur sumbernya cukup jelas.** Produk pertama ditujukan untuk kontraktor, estimator, dan staf administrasi proyek di Indonesia.

## Janji produk dan batas kejujuran

Pengguna mengunggah PDF, memeriksa hasil ekstraksi serta peringatan yang diperlukan, lalu mengunduh XLSX. Baris, urutan, nilai tercetak, sumber halaman, dan struktur subtotal dipertahankan sejauh dapat dikenali.

PDF umumnya menyimpan hasil perhitungan yang tercetak, bukan formula dan referensi sel Excel asli. Formula yang dihasilkan RabConverter adalah **formula hasil rekonstruksi**, bukan formula asli yang dipulihkan. Nilai yang tidak jelas tidak boleh ditebak atau diam-diam diubah.

## Workflow MVP

1. Validasi dan klasifikasi PDF: berbasis teks, scan, campuran, rusak, terenkripsi, atau tidak didukung.
2. Ekstrak struktur dengan **Reducto Deep Extract sebagai satu-satunya provider ekstraksi awal**.
3. Petakan kode item, uraian, satuan, volume, harga satuan, jumlah tercetak, section, subtotal dan total.
4. Simpan nilai mentah dan rujukan halaman; normalkan angka hanya ketika konvensinya dapat ditentukan.
5. Rekonstruksi formula aman seperti volume × harga satuan dan subtotal yang keanggotaannya jelas.
6. Bandingkan hasil formula dengan angka tercetak, lalu tandai mismatch atau ambiguitas.
7. Buat XLSX editable dengan sheet RAB, Rekap, Review_Warnings dan Source_Info.
8. Tetapkan tagihan berdasarkan halaman sumber yang benar-benar menyumbangkan data RAB/BOQ yang dapat digunakan ke hasil ekspor.

## Aturan harga awal

- **Harga pengguna:** Rp2.500 per halaman yang dapat ditagih.
- **Top-up minimum:** Rp50.000.
- Halaman kosong, cover saja, halaman tidak relevan, atau halaman gagal/tidak menghasilkan data RAB/BOQ yang dapat digunakan tidak ditagih.
- Retry tidak menambah tagihan pengguna. Halaman tidak ditagih bila tidak ada hasil XLSX yang berhasil dibuat untuk pekerjaan tersebut.
- Definisi lengkap halaman tertagih, saldo, top-up, charge dan reversal ada di [docs/pricing-and-billing.md](docs/pricing-and-billing.md).
- Harga ini tidak berarti seluruh halaman yang dikirim ke provider selalu dapat ditagih. Biaya provider untuk halaman yang akhirnya tidak tertagih merupakan risiko biaya RabConverter dan harus diukur terpisah.

## Batas teknologi dan ruang lingkup

- PDF RAB/BOQ adalah jalur input pertama; PDF berbasis teks menjadi jalur golden pertama.
- Scan dan PDF campuran tetap terbatas sampai lolos golden tests yang representatif.
- Reducto Deep Extract adalah provider awal. **LlamaExtract dan Pulse Ultra 2 tidak digunakan sebagai runtime provider, fallback otomatis, atau dependency.**
- RabConverter tidak mengarang harga pasar, AHSP, volume, pajak, overhead, keuntungan, ataupun aturan pembulatan.
- Pengukuran volume dari gambar teknik, tender CRM, portal submission dan exact reproduction semua template bukan bagian MVP.
- Nilai sumber dan hasil kalkulasi harus terpisah serta dapat ditelusuri ke sumber.

## Dokumentasi acuan

Mulai dari [docs/README.md](docs/README.md). Dokumen pricing/billing menjadi acuan tunggal untuk harga, definisi halaman yang ditagih, saldo, top-up, charge dan reversal. Decision log mencatat keputusan dan hal yang masih menunggu keputusan.

## Infrastruktur saat ini

Pengembangan direncanakan secara cloud-only: GitHub sebagai source of truth, GitHub Actions untuk pemeriksaan, Cloudflare untuk hosting, dan Supabase untuk auth, metadata dan private storage bila diperlukan.

**Status diperiksa 2026-10-25:** repository berisi dokumentasi, belum berisi aplikasi RabConverter yang dapat dijalankan. Pada akun Cloudflare yang tersambung tidak ditemukan Worker script maupun Pages project untuk RabConverter. Proyek Supabase Rab Converter aktif, tetapi belum memiliki tabel pada schema public. Belum ada preview aplikasi yang bisa diverifikasi. Jangan menyebut aplikasi live/deployed sampai ada kode aplikasi, workflow, deployment dan URL yang benar-benar diperiksa.
