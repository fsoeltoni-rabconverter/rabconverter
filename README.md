# RabConverter

**RabConverter mengubah PDF RAB/BOQ menjadi workbook Excel editable, dengan formula hasil rekonstruksi yang aktif saat struktur sumbernya cukup jelas.** Produk pertama ditujukan untuk kontraktor, estimator, dan staf administrasi proyek di Indonesia.

## Pengalaman utama

**Unggah PDF → konversi otomatis → unduh Excel.**

remove.bg hanya menjadi benchmark kesederhanaan pengalaman pengguna: satu aksi utama, pemrosesan otomatis, hasil jelas, dan unduhan yang mudah. RabConverter tidak meniru teknologi, aset merek, atau model bisnisnya.

Pengguna tidak wajib memeriksa seluruh tabel pada kasus normal. Sistem memvalidasi hasil otomatis, menampilkan warning untuk ketidakpastian yang dapat dipertahankan dengan aman, dan meminta keputusan pengguna hanya saat ambigu yang material benar-benar menghalangi keluaran yang aman.

## Batas kejujuran produk

PDF umumnya menyimpan hasil perhitungan yang tercetak, bukan formula dan referensi sel Excel asli. Formula yang dihasilkan RabConverter adalah **formula hasil rekonstruksi**, bukan formula asli yang dipulihkan. Nilai yang tidak jelas tidak boleh ditebak atau diam-diam diubah.

## Workflow MVP

1. Unggah PDF RAB/BOQ; validasi file dan hitung halaman sebelum proses berbayar.
2. Tampilkan halaman, harga Rp2.500 per halaman tertagih sebagai estimasi maksimum, saldo, dan kekurangan saldo bila ada.
3. Setelah pengguna memilih **Konversi PDF**, validasi intent, identitas pemilik, dan reservasi saldo secara atomik.
4. Ekstrak menggunakan **Reducto Deep Extract sebagai satu-satunya provider awal**.
5. Petakan kode item, uraian, satuan, volume, harga satuan, jumlah tercetak, section, subtotal dan total; simpan asal halaman dan nilai mentah.
6. Rekonstruksi hanya rumus yang didukung struktur sumber, lalu bandingkan dengan angka tercetak.
7. Bangun serta verifikasi workbook XLSX; review pengguna hanya jika dibutuhkan untuk keputusan material.
8. Nilai halaman tertagih dari record RAB/BOQ substantif yang benar-benar tersimpan di workbook yang dapat diunduh; selesaikan satu tagihan idempotent atau nol jika tidak ada artefak.

## Aturan harga awal

- **Harga pengguna:** Rp2.500 per halaman tertagih.
- **Top-up minimum:** Rp50.000. Ini minimum transaksi top-up, bukan biaya minimum per pekerjaan.
- Halaman kosong, cover/judul saja, header/footer, catatan saja, halaman tidak relevan, gambar teknik saja, duplikat tanpa data baru, atau halaman gagal tanpa record RAB/BOQ substantif tidak ditagih.
- Halaman yang memiliki baris RAB atau record subtotal/rekap substantif yang dipertahankan dalam hasil dapat ditagih, termasuk saat ada warning.
- Tidak ada charge pelanggan jika XLSX yang bisa diunduh tidak dihasilkan. Reservasi harus dilepas pada semua akhir gagal atau kedaluwarsa.
- Retry provider tidak menambah tagihan pelanggan. COGS provider tetap dicatat terpisah, termasuk untuk halaman yang tidak dapat ditagih.
- Aturan kanonis ada di [docs/pricing-and-billing.md](docs/pricing-and-billing.md).

## Batas teknologi dan ruang lingkup

- PDF RAB/BOQ adalah input MVP; PDF berbasis teks menjadi golden path awal. Scan/campuran tetap terbatas hingga lulus golden tests.
- **LlamaExtract dan Pulse Ultra 2 tidak dipakai** sebagai runtime provider, fallback otomatis, atau dependency.
- RabConverter tidak mengarang harga pasar, AHSP, volume, pajak, overhead, keuntungan, ataupun aturan pembulatan.
- Pengukuran volume dari gambar teknik, tender CRM, portal submission dan reproduksi template yang sempurna bukan MVP.
- Nilai sumber dan hasil kalkulasi disimpan terpisah serta ditelusuri ke sumber.

## Dokumentasi acuan

Mulai dari [docs/README.md](docs/README.md). [Application flow](docs/application-flow.md) mengatur perilaku end-to-end; [pricing and billing](docs/pricing-and-billing.md) menjadi satu-satunya sumber kebenaran untuk harga, billability, wallet, top-up, charge, reversal dan COGS.

## Infrastruktur saat ini

Pengembangan direncanakan secara cloud-only: GitHub sebagai source of truth, GitHub Actions untuk pemeriksaan, Cloudflare untuk hosting/pekerjaan latar bila diperlukan, serta Supabase untuk identitas, metadata, akses data dan private storage.

**Status diperiksa 2026-10-25:** repository berisi dokumentasi, belum ada aplikasi RabConverter yang dapat dijalankan yang terverifikasi. Pada akun Cloudflare yang tersambung tidak ditemukan Worker script maupun Pages project untuk RabConverter. Proyek Supabase Rab Converter aktif, tetapi belum memiliki tabel pada schema public. Belum ada preview aplikasi yang dapat diverifikasi. Jangan menyebut aplikasi, provider, billing, atau pembayaran live sebelum kode, integrasi, workflow, dan deployment benar-benar diperiksa.
