# Contoh uji akurasi

Folder ini berisi empat PDF RAB sintetis yang dibuat untuk menguji konversi. Dokumen ini bukan dokumen pelanggan.

| PDF | Kasus |
|---|---|
| `basic-text-rab.pdf` | RAB teks sederhana, perkalian volume dan harga, subtotal |
| `wrapped-and-indonesian-numbers.pdf` | Uraian terbungkus dan format angka Indonesia |
| `multi-page-continuation.pdf` | Tabel berlanjut ke halaman berikutnya, subtotal, grand total |
| `ambiguous-and-nonbillable.pdf` | Nilai harga sengaja tidak tersedia dan tidak boleh ditebak |

File acuan tiap PDF ada di `expected/*.json`. Gunakan contoh ini untuk membandingkan hasil ekstraksi, rumus, dan angka. Jangan menganggap akurasi provider sudah terbukti sebelum hasil konversi benar-benar dibandingkan dengan file acuan.

Jangan masukkan PDF RAB milik pelanggan ke folder ini.
