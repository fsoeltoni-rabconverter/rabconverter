# RabConverter Documentation Index

Dokumen ini adalah source of truth untuk produk, perilaku, data dan implementasi RabConverter. Jika dokumen bertentangan, ikuti urutan otoritas di bawah dan catat penyelesaiannya di decision log. Dokumen bukan bukti implementasi. Perubahan perilaku harus menyinkronkan semua dokumen otoritas serta acceptance criteria dalam satu perubahan yang dapat ditinjau.

## Urutan otoritas dokumen

1. [product-definition.md](product-definition.md) — promise, scope dan batas formula reconstruction.
2. [application-flow.md](application-flow.md) — pengalaman end-to-end, state transitions, exception path, expiry dan recovery.
3. [pricing-and-billing.md](pricing-and-billing.md) — satu-satunya sumber kebenaran harga, halaman tertagih, reservation, wallet, top-up, settlement, reversal dan COGS.
4. [document-taxonomy.md](document-taxonomy.md) — klasifikasi dokumen/halaman/baris dan kriteria billable page.
5. [canonical-data-model.md](canonical-data-model.md) — status job, provenance, usage metering dan ledger.
6. [supported-formats.md](supported-formats.md) — input scope dan golden test matrix.
7. [user-experience.md](user-experience.md) — screen-level UX, accessibility dan hierarchy.
8. [processing-pipeline.md](processing-pipeline.md) — provider, extraction, formula, validation, export, retries.
9. [export-specification.md](export-specification.md) — workbook contract dan formula verification.
10. [acceptance-criteria.md](acceptance-criteria.md) — testable definition of done.
11. [architecture.md](architecture.md) — target architecture dan delivery.
12. [security-and-data-handling.md](security-and-data-handling.md) — ownership, RLS, private files, secrets, provider privacy.
13. [contractor-workflow.md](contractor-workflow.md) — target workflow and qualitative evidence.
14. [research-and-sources.md](research-and-sources.md) — sourced facts and assumptions.
15. [decisions/README.md](decisions/README.md) — approved and pending decisions.

## Baseline keputusan yang berlaku

- Pengalaman utama: upload PDF → pemrosesan otomatis → unduh XLSX; tidak ada dashboard wajib sebelum konversi pertama.
- Harga pelanggan Rp2.500 per halaman tertagih; top-up minimum Rp50.000, bukan biaya minimum per pekerjaan.
- Halaman hanya tertagih jika menyumbang record RAB/BOQ substantif dan dapat ditelusuri, yang benar-benar dipertahankan dalam XLSX yang bisa diunduh.
- Judul section saja, header/footer, catatan tanpa data, cover, blank, unrelated, drawing-only, unreadable/failed, dan duplicate-with-no-new-record tidak tertagih.
- Tidak ada XLSX yang dapat diunduh berarti charge Rp0 dan reservation dilepas; job timeout/cancelled/failure tidak boleh menyisakan hold tanpa batas.
- Reducto Deep Extract adalah satu-satunya provider ekstraksi MVP; LlamaExtract dan Pulse Ultra 2 tidak runtime/fallback.
- Status pembayaran `paid` tidak otomatis berarti saldo telah ditambah. Proses konversi kembali tersedia setelah event diverifikasi, ledger credit diterapkan tepat sekali, dan saldo terbarui.
- Default identity contract: user dapat melihat preflight sebelum login; sebelum proses berbayar, identitas Supabase Auth harus tersedia. MVP tidak menyediakan saldo/top-up untuk guest.
- remove.bg hanya benchmark UX, bukan teknologi/brand/model bisnis.
- COGS, provider terms, payment vendor, dan infrastruktur harus disebut belum diverifikasi sampai evidence ada.
- Koreksi/re-export pada job yang sama menghasilkan versi artefak baru yang immutable, bukan charge pelanggan kedua; penyesuaian setelah settlement hanya lewat compensating ledger entry yang diaudit.
- Queue tidak ditambahkan sebelum batas runtime membuktikannya perlu. Jika dipakai, job dan reservasi database harus commit sebelum dispatch, dengan recovery untuk job yang belum ter-dispatch.
- Timeout Reducto harus memeriksa ID/status pekerjaan provider yang sudah ada sebelum retry agar tidak membuat pekerjaan provider ganda.
- Pembayaran terverifikasi yang datang setelah order lokal kedaluwarsa masuk `reconciliation_required`; setelah verifikasi provider, lakukan credit tepat sekali atau jalur refund/reversal eksplisit, tanpa auto-start konversi.
- Catat setiap percobaan provider secara internal; usage export/invoice provider dipakai untuk rekonsiliasi agregat. Rp900–Rp1.000/halaman hanya reserve COGS sementara, bukan kontribusi, margin, atau profit terukur.
- Current repository state: documentation-only; no verified app preview or production flow.

## Implementation gates

Jangan mulai integrasi berbayar/produksi sebelum:
- [ ] Main flow dan semua terminal/error transitions di application-flow.md diikuti oleh UX, data model, pipeline dan acceptance criteria.
- [ ] Formula ambiguity ditangani exception-first; normal case tidak wajib full-table review.
- [ ] Billable-page criteria mengecualikan title-only/header-only/notes-only; golden fixtures mencakup tiap kategori.
- [ ] Status job dan status finansial terpisah; payment `paid` dan wallet `credited` eksplisit; duplicate/out-of-order events idempotent.
- [ ] Reservation punya expiry/recovery dan tidak ada held balance yang dapat tertahan tanpa batas.
- [ ] User ownership, RLS, private storage, signed downloads, secure database function grants dan auth sebelum paid processing ditinjau/tested.
- [ ] Golden PDFs memiliki reuse permission dan expected values/formulas/warnings/billability.
- [ ] Reducto privacy/retention/region/contract/API/usage metering untuk akun dikonfirmasi; customer documents tidak dikirim sebelum approval.
- [ ] Payment vendor dipilih setelah QRIS support, webhook verification, idempotency, refund/reconciliation dan biaya diverifikasi.
- [ ] XLSX formulas diuji recalculate dan error scan; hasil tidak dianggap valid hanya karena file dapat dibuka.
- [ ] Deterministic CI dibuat dan berhasil dijalankan; paid API calls tidak masuk CI.
- [ ] Cloudflare preview nyata diperiksa pada desktop/mobile; deployment evidence menyebut commit SHA dan URL.

## Change and release policy

Setiap perubahan perilaku harus memperbarui dokumen otoritas serta acceptance criteria yang relevan dalam commit yang sama. Kirim isi dokumen secara lengkap; jangan menambahkan patch-fragments yang memecah source of truth. Jangan melakukan perubahan schema produksi sebagai efek samping perubahan dokumentasi.

Gunakan synthetic/permitted fixtures sampai gate privacy Reducto lulus. Jangan melakukan live paid API calls atau transaksi nyata hanya untuk memvalidasi dokumentasi.
