# Product Definition

Status: baseline produk v1.0 — 2026-10-25  
Product: RabConverter

## One-sentence promise

Unggah PDF RAB/BOQ dan unduh workbook Excel editable yang mempertahankan nilai sumber serta menggunakan formula hasil rekonstruksi yang dapat diperiksa saat struktur sumber mendukungnya.

## Target user and job to be done

Target awal adalah kontraktor kecil/menengah, builder, subkontraktor, estimator, quantity surveyor dan staf administrasi proyek Indonesia yang menerima PDF RAB/BOQ, kemudian perlu menyalin atau menggunakan ulang datanya untuk meninjau, mengubah volume/harga, menyusun penawaran atau meneruskan data ke template lain.

Job to be done: ketika menerima RAB/BOQ dalam PDF, pengguna tidak ingin mengetik ulang baris satu per satu. Mereka ingin Excel yang dapat diedit, berisi item dan angka di kolom yang benar, dengan rumus yang bekerja ketika angka yang relevan diubah.

## Product outcome

Pengguna mengunggah PDF, mendapat status pemrosesan dan preview, meninjau bagian yang tidak pasti, lalu memperoleh XLSX dengan:
- sel yang benar-benar dapat diedit, bukan screenshot yang ditempel di workbook;
- formula Excel aktif untuk perhitungan yang aman direkonstruksi;
- urutan dan hierarki section sejauh terdeteksi;
- nilai tercetak dari PDF terpisah dari formula dan hasil perhitungan;
- provenance halaman/region, status review dan warning yang bisa ditindaklanjuti;
- ringkasan tagihan yang cocok dengan ledger pekerjaan, tanpa mengekspos COGS internal provider.

## Formula reconstruction boundary

PDF biasanya menyimpan hasil yang tampil, bukan formula Excel dan graph referensi sel aslinya. Formula baru harus disebut reconstructed/generated, tidak pernah original recovered.

Formula yang dapat diusulkan:
- jumlah item = volume × harga satuan saat kolom dan makna angkanya teridentifikasi dengan yakin;
- subtotal = jumlah item yang termasuk dalam section yang batasnya jelas;
- grand total = agregasi subtotal/baris yang aturan masuknya jelas;
- pajak, overhead, keuntungan atau contingency hanya jika basis, rate, urutan, dan aturan inklusi/eksklusi tercetak atau dikonfirmasi pengguna.

Jika formula tidak jelas, pertahankan nilai PDF, tampilkan warning dan jangan membuat formula spekulatif.

## Product principles

1. **PDF-first:** optimalkan konversi PDF RAB/BOQ sebelum memperluas input.
2. **No silent invention:** data kosong/ambigu tidak diisi dengan tebakan.
3. **Editable result:** nilai dan formula ada pada sel Excel, bukan gambar atau dump nilai saja.
4. **Review exceptions:** tampilkan keraguan OCR, mapping kolom, format angka dan mismatch.
5. **Traceable numbers:** field dan row merujuk ke halaman/region sumber bila tersedia.
6. **Preserve structure:** section, note, subtotal, total dan continuation tidak disamakan sebagai item biasa.
7. **Fast workflow:** upload → proses → review seperlunya → download.
8. **Cloud-only development:** GitHub, GitHub Actions, Cloudflare dan Supabase sesuai kebutuhan.
9. **Commercial clarity:** biaya dijelaskan sebelum proses; pengguna melihat estimasi, saldo, halaman tertagih final dan histori transaksi.
10. **Honest performance:** tidak menjanjikan OCR sempurna atau validasi RAB yang otoritatif.

## MVP scope

1. Upload dan validasi PDF RAB/BOQ.
2. Deteksi apakah PDF berbasis teks, scan, campuran atau tidak didukung.
3. Ekstrak tabel/row dengan provenance halaman.
4. Mapping kolom umum: kode, uraian, satuan, volume, harga satuan dan jumlah.
5. Rekonstruksi formula aman dan label provenance.
6. Perbandingan line amount/subtotal/grand total dengan angka tercetak.
7. Review/edit field yang belum yakin.
8. Ekspor XLSX dengan formula-bearing item rows, section, recap dan exceptions/warning sheet.
9. Penagihan halaman yang memenuhi definisi billable page di pricing-and-billing.md.
10. Top-up saldo minimum Rp50.000; payment provider hanya setelah dipilih dan diverifikasi.
11. Retry pemrosesan yang aman dan idempotent.

## Commercial baseline

- Harga pelanggan: Rp2.500 per billable page.
- Minimum top-up: Rp50.000.
- Charge: final billable pages × Rp2.500, menggunakan snapshot harga yang berlaku ketika job dibooking.
- Tidak ada charge untuk job tanpa hasil XLSX berhasil, maupun halaman yang tidak menghasilkan data RAB/BOQ berguna.
- Retry, provider call dan biaya provider bukan unit tambahan tagihan pelanggan.
- Detail wallet, payment states, idempotency, reconciliation, refunds dan COGS hanya ditetapkan di pricing-and-billing.md.

## Extraction provider boundary

Reducto Deep Extract dipilih sebagai satu-satunya provider ekstraksi awal. Pilihan ini adalah keputusan runtime untuk MVP, bukan klaim bahwa benchmark lokal telah lulus. LlamaExtract dan Pulse Ultra 2 tidak termasuk integrasi atau fallback. Performa, biaya aktual, retensi data, region, plan, API contract dan terms Reducto harus divalidasi sebelum memproses dokumen pelanggan nyata.

## Non-goals

- Memulihkan formula, hidden sheet, named range, macro atau graph workbook asli dari PDF.
- Quantity takeoff dari drawing arsitektur/struktur.
- Harga pasar atau AHSP/AHS otomatis yang dianggap otoritatif.
- Pajak, overhead, profit, contingency atau metode pembulatan universal.
- Jaminan acceptance procurement portal atau replika sempurna seluruh template.
- Tender CRM, portal submission, tanda tangan, project management dan supplier quote workflow.

## Competitive positioning

Generic PDF-to-Excel converters already offer editable spreadsheet conversion. RabConverter differentiates through RAB-specific row understanding, reconstructed formulas, reconciliation with printed totals, visible ambiguity and a workbook a contractor can keep editing.

## Success metrics

Ukur pada golden PDFs: exactness field, klasifikasi row, formula correctness, valid recalculation, discrepancy detection, warning precision, waktu sampai file dapat diunduh, proporsi koreksi pengguna, processing time, provider usage per source page, retry rate, billable/non-billable page ratio, biaya aktual per billable page, payment failure dan refund rate.

Jangan mengklaim akurasi, penghematan waktu, willingness-to-pay, atau margin nyata sampai metriknya diukur.
