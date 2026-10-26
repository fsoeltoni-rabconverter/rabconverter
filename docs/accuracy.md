# Akurasi PDF ke Excel

Akurasi hasil konversi adalah prioritas utama RabConverter v1.

## Data yang perlu dipertahankan

Untuk setiap baris yang relevan, ambil data yang benar-benar tersedia di PDF, seperti:

- kode dan uraian pekerjaan
- satuan
- volume/kuantitas
- harga satuan
- jumlah harga tercetak
- kelompok pekerjaan, subtotal, dan grand total

Pertahankan urutan baris dan hubungan antarbagiannya sejauh didukung dokumen sumber.

## Aturan rumus

- PDF biasanya berisi angka hasil perhitungan, bukan rumus Excel asli.
- Buat rumus baru hanya jika hubungan datanya jelas, misalnya volume × harga satuan.
- Bandingkan hasil rumus dengan jumlah harga yang tercetak.
- Jika nilai sumber hilang atau hubungan perhitungannya ambigu, jangan menebak dan jangan membuat rumus yang seolah-olah pasti benar.
- Jika hasil hitung berbeda dari angka sumber, pertahankan bukti angka sumber dan tunjukkan peringatannya.

## Pemeriksaan hasil

Sebelum menawarkan download, periksa bahwa:

1. File XLSX berhasil dibuat dan dapat dibuka.
2. Baris RAB tidak hilang atau terduplikasi tanpa alasan.
3. Angka, satuan, dan urutan utama sesuai dengan PDF.
4. Rumus yang dibuat menghasilkan angka yang masuk akal.
5. Selisih dengan subtotal/total tercetak tidak disembunyikan.
6. Nilai yang tidak diketahui tetap kosong atau diberi peringatan; tidak pernah ditebak.

## Cara menguji

Gunakan contoh PDF sintetis di [fixtures/golden](../fixtures/golden/README.md). Bandingkan hasil aktual dengan file JSON yang menjadi hasil acuan untuk setiap contoh.

Mulai dari empat kasus: RAB teks sederhana, uraian yang terbungkus dan format angka Indonesia, tabel yang berlanjut ke halaman lain, serta nilai yang sengaja tidak tersedia.

Tidak perlu menentukan target akurasi yang dibuat-buat sebelum hasil uji pertama tersedia. Catat kesalahan ekstraksi dan perbaiki berdasarkan kasus nyata yang gagal.
