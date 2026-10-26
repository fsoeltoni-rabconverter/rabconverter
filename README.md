# RabConverter

**Upload PDF RAB. Dapatkan Excel yang bisa diedit dengan rumus perhitungan.**

RabConverter v1 fokus pada satu alur: **upload → cek kuota → konversi otomatis → potong kuota jika berhasil → download Excel.**

## Cara kerja

1. User memilih atau menarik PDF RAB ke area upload.
2. Sistem membaca jumlah halaman dan mengecek kuota.
3. Jika kuota cukup, proses konversi langsung dimulai. Jika tidak, user diberi tahu bahwa kuotanya kurang dan file tidak diproses.
4. Sistem mengekstrak baris RAB, menyusun workbook Excel, membuat rumus yang didukung data sumber, lalu memeriksa hasilnya.
5. Setelah XLSX berhasil dibuat dan lulus pemeriksaan dasar, kuota dipotong satu kali.
6. Tombol **Download Excel** muncul. Jika proses gagal, kuota tidak dipotong.

Harga awal: **Rp2.500 per halaman tertagih**. Minimum top-up yang direncanakan: **Rp50.000**. Sebelum upload, harga per halaman harus terlihat jelas.

## Stack v1

- **Frontend:** React + TypeScript + Vite, di-host di Cloudflare Pages.
- **Login dan kuota:** Supabase Auth + PostgreSQL.
- **Endpoint konversi:** satu Supabase Edge Function untuk memeriksa kuota, memanggil ekstraksi, menyusun XLSX, memvalidasi hasil, dan memotong kuota setelah berhasil.
- **Ekstraksi PDF:** Reducto Extract / Deep Extract sebagai satu-satunya provider awal.
- **Pembuatan Excel:** SheetJS Community Edition (paket npm xlsx) untuk menulis workbook dan formula.
- **Source control dan pemeriksaan build:** GitHub; CI dasar ditambahkan saat aplikasi mulai dibuat.

PDF diproses untuk menghasilkan output dan tidak disimpan sebagai riwayat permanen pada versi awal kecuali pengujian nyata menunjukkan penyimpanan sementara memang diperlukan. Tidak ada queue, Redis, ClickHouse, provider fallback, atau server konversi terpisah pada v1. Pembayaran/top-up otomatis dipilih dan dibuat setelah alur konversi serta akurasinya terbukti.

## Inspirasi UX: remove.bg

remove.bg menjadi referensi untuk **kesederhanaan alur**, bukan untuk meniru merek atau desain persis. Prinsip yang dipakai: pilih file, proses otomatis, hasil jelas, unduh tanpa langkah yang tidak perlu.

- Satu layar utama dengan area **Pilih PDF RAB** dan drag-and-drop.
- Setelah upload, cek kuota berjalan otomatis.
- Jika cukup, konversi langsung dimulai tanpa wizard atau pengaturan teknis.
- Tampilkan status proses yang jujur, lalu satu tombol utama **Download Excel**.
- Jika gagal atau kuota kurang, tampilkan alasan dan langkah berikutnya dengan jelas.

Referensi: [Cara kerja remove.bg](https://www.remove.bg/id/help/a/what-is-remove-bg/).

## Prioritas nomor satu: akurasi

Uraian, satuan, volume, harga satuan, subtotal, dan total tidak boleh ditebak. Rumus di Excel adalah rumus hasil rekonstruksi—bukan formula asli yang dipulihkan dari PDF. Hasil hitung harus dibandingkan dengan angka tercetak jika memungkinkan. Nilai yang tidak pasti dibiarkan kosong atau ditandai.

- [Spesifikasi v1, stack, dan UX](docs/v1.md)
- [Aturan akurasi dan pengujian](docs/accuracy.md)
- [PDF uji sintetis](fixtures/golden/README.md)

## Status

Dokumentasi dan empat PDF uji sintetis tersedia. **Aplikasi konversi belum dibuat atau diverifikasi berjalan.** Stack di atas adalah keputusan awal untuk memulai implementasi; uji pertama harus membuktikan bahwa satu PDF uji bisa melewati ekstraksi, pembuatan formula XLSX, pemeriksaan, pemotongan kuota, dan download.
