# RabConverter

**Upload PDF RAB. Dapatkan Excel yang bisa diedit dengan rumus perhitungan.**

Versi pertama fokus pada satu alur: **upload → cek kuota → konversi → potong kuota jika berhasil → download**.

## Stack

- React + TypeScript + Vite — web app.
- Cloudflare Pages — hosting UI dan preview deployment.
- Supabase Auth + PostgreSQL — login dan kuota.
- Satu Supabase Edge Function — endpoint konversi awal.
- Reducto Extract / Deep Extract — ekstraksi dokumen.
- SheetJS Community Edition — membuat XLSX dan menulis formula.
- GitHub Actions — typecheck dan production build setiap push ke `main` dan pull request.

## UX

Terinspirasi oleh kesederhanaan alur remove.bg: pilih file, proses otomatis, hasilnya jelas, lalu unduh. Ini adalah referensi pola interaksi, bukan salinan desain atau merek.

## Harga awal

- Rp2.500 per halaman tertagih.
- Minimum top-up direncanakan Rp50.000.
- Kuota hanya dipotong satu kali setelah XLSX berhasil dibuat dan lolos pemeriksaan dasar.

## Akurasi

Formula yang dibuat adalah formula hasil rekonstruksi, bukan formula asli yang bisa dipulihkan dari PDF. Data yang tidak terbaca tidak boleh ditebak.

- [Spesifikasi v1, stack, dan UX](docs/v1.md)
- [Aturan akurasi dan pengujian](docs/accuracy.md)
- [PDF uji sintetis](fixtures/golden/README.md)

## Status setup

Fondasi frontend dan CI sedang disiapkan. Preview pertama adalah **preview UI**: pemilihan file berfungsi, tetapi file tidak dikirim ke server dan kuota/konversi belum aktif sampai langkah backend berikutnya selesai.
