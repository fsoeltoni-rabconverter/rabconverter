# RabConverter

**RabConverter membantu kontraktor Indonesia mengubah PDF RAB/BOQ menjadi file Excel yang bisa diedit dan memiliki rumus perhitungan aktif—tanpa mengetik ulang setiap baris secara manual.**

UX terinspirasi oleh alur sederhana remove.bg: upload → proses → review seperlunya → download. Kita merujuk pada kesederhanaan interaksi, bukan meniru identitas visual atau aset merek.

## Hasil produk yang dijanjikan

Pengguna mengunggah PDF RAB/BOQ, RabConverter mengekstrak tabel, memetakan uraian/satuan/volume/harga/jumlah, merekonstruksi rumus yang aman, menunjukkan selisih terhadap nilai yang tercetak, lalu menghasilkan XLSX.

**Batas teknis:** PDF umumnya tidak menyimpan formula Excel asli. Formula yang dibuat RabConverter adalah formula hasil rekonstruksi, bukan pemulihan formula asli. Formula hanya dibuat ketika struktur dan maknanya cukup jelas; angka yang ambigu harus ditandai untuk ditinjau.

## Workflow MVP

1. Upload PDF RAB/BOQ.
2. Deteksi PDF berbasis teks, hasil scan, campuran atau tidak didukung.
3. Ekstrak tabel, kode item, uraian, satuan, volume, harga satuan, nilai tercetak, bagian/subtotal/total.
4. Tinjau dan koreksi field yang belum pasti.
5. Buat formula volume × harga satuan dan subtotal/total bila aman.
6. Bandingkan hasil formula dengan angka tercetak dan tampilkan warning untuk perbedaan.
7. Download XLSX dengan formula aktif, rekap, metadata sumber dan sheet peringatan.

## Ruang lingkup awal

- PDF RAB/BOQ adalah jalur input pertama.
- Prioritas pertama: PDF berbasis teks. PDF scan/OCR dibatasi sampai golden tests membuktikan hasilnya dapat diandalkan.
- Tidak mengarang harga pasar, satuan, volume, pajak, overhead atau keuntungan.
- Tidak menjanjikan pengukuran volume dari gambar teknik.
- Tidak mengklaim memulihkan rumus asli dari PDF.
- File sumber dan hasil tetap dapat ditelusuri ke pekerjaan dan halaman sumber.

## Dokumen normative

Mulai dari [docs/README.md](docs/README.md), lalu baca definisi produk, workflow kontraktor Indonesia, taksonomi dokumen, model data, dukungan format, UX, pipeline, spesifikasi ekspor dan acceptance criteria. Dokumentasi ini adalah acuan sebelum implementasi.

## Arsitektur cloud

Pengembangan dilakukan seluruhnya di cloud:
- GitHub adalah source of truth.
- GitHub Actions menjalankan validasi, test dan build.
- Cloudflare menjadi host web dan preview.
- Supabase menyediakan auth, metadata pekerjaan dan private storage sesuai kebutuhan.

Jangan mengklaim aplikasi telah berjalan/deploy sampai workflow CI dan URL preview benar-benar tersedia.
