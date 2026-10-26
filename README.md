# RabConverter

**Ubah PDF RAB menjadi Excel yang bisa diedit, lengkap dengan rumus perhitungan.**

Versi pertama fokus pada satu tugas: konversi yang akurat dari upload sampai download.

## Alur utama

1. User upload PDF RAB.
2. Sistem menghitung halaman, mengecek kuota, dan menunjukkan estimasi biaya.
3. Jika kuota cukup, sistem memproses PDF menjadi file Excel (.xlsx).
4. Sistem memeriksa data dan rumus dasar.
5. Jika konversi berhasil, kuota dikurangi satu kali sesuai halaman RAB yang berhasil dikonversi.
6. User mengunduh Excel.

Jika konversi gagal atau file Excel yang layak tidak berhasil dibuat, kuota tidak dipotong.

## Harga awal

- Tarif: **Rp2.500 per halaman yang ditagihkan**.
- Minimum top-up: **Rp50.000**.
- Estimasi sebelum proses memakai jumlah halaman PDF sebagai batas maksimal; pemotongan akhir mengikuti halaman berisi data RAB yang berhasil masuk ke Excel.

## Prinsip akurasi

- Data, satuan, volume, harga satuan, subtotal, dan total tidak boleh ditebak.
- Rumus Excel adalah rumus hasil rekonstruksi, bukan formula asli yang bisa dipulihkan dari PDF.
- Nilai yang tidak terbaca dibiarkan kosong atau ditandai untuk diperiksa.
- Hasil rumus dibandingkan dengan angka tercetak jika datanya memungkinkan.

## Dokumentasi

- [Spesifikasi v1](docs/v1.md)
- [Aturan akurasi dan pengujian](docs/accuracy.md)
- [PDF uji sintetis](fixtures/golden/README.md)

## Status repo

Repository ini belum memiliki aplikasi konversi yang dapat dijalankan yang sudah diverifikasi. Dokumen lama diringkas dan ditulis ulang agar implementasi berikutnya fokus pada alur inti dan akurasi, bukan arsitektur yang belum dibutuhkan.
