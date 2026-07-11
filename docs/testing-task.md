# TASK: End-to-End UAT — Provillo Management System

**Tanggal:** 2026-07-11  
**Tester:** _______________  
**Server:** `php artisan serve` → http://localhost:8000  
**Browser:** Chrome (dengan DevTools terbuka)  
**Status:** 🔲 Belum Dimulai

---

## Cara Menggunakan Dokumen Ini

1. Jalankan server: `cd provillo-app && php artisan serve`
2. Buka Chrome → http://localhost:8000
3. Buka DevTools (F12) → Tab Console + Network (rekam semua)
4. Kerjakan setiap task secara berurutan
5. Tandai status setiap task: ✅ PASS | ❌ FAIL | ⚠️ WARNING
6. Catat temuan di bagian **Bug Log** di bawah
7. Screenshot setiap langkah penting

---

## PERSIAPAN

- [ ] Server berjalan: `php artisan serve`
- [ ] Database fresh dengan seed: `php artisan migrate:fresh --seed`
- [ ] Browser Chrome terbuka di http://localhost:8000
- [ ] DevTools terbuka — Console + Network aktif merekam
- [ ] Login: `admin@provillo.com` / `password`

---

## MODUL 1 — Authentication

**URL:** http://localhost:8000

### Tasks

| # | Langkah | Expected | Status | Catatan |
|---|---------|----------|--------|---------|
| 1.1 | Buka `/` tanpa login | Redirect ke halaman login | | |
| 1.2 | Login email benar + password benar | Redirect ke `/dashboard` | | |
| 1.3 | Login email salah | Pesan error "Email atau Password salah" | | |
| 1.4 | Login password salah | Pesan error tampil | | |
| 1.5 | Submit form kosong | Validasi "wajib diisi" tampil | | |
| 1.6 | Klik Logout | Redirect ke login, session bersih | | |

### DevTools Check
- [ ] Console: tidak ada error/warning
- [ ] Network: tidak ada request 4xx/5xx
- [ ] Storage: session tersimpan dengan benar, tidak ada data sensitif di localStorage

---

## MODUL 2 — Dashboard

**URL:** http://localhost:8000/dashboard

### Tasks

| # | Langkah | Expected | Status | Catatan |
|---|---------|----------|--------|---------|
| 2.1 | Buka `/dashboard` | Halaman tampil tanpa error | | |
| 2.2 | Periksa stat cards | Tampil (nilai bisa 0) tanpa error | | |
| 2.3 | Klik semua menu sidebar | Semua link bisa diklik, tidak ada broken link | | |
| 2.4 | Resize ke lebar 1280px | Layout tidak rusak | | |

### DevTools Check
- [ ] Console: tidak ada error/warning
- [ ] Network: semua asset loaded 200

---

## MODUL 3 — Master Data Bahan Baku

**URL:** http://localhost:8000/bahan-baku

### Tasks — Index
| # | Langkah | Expected | Status | Catatan |
|---|---------|----------|--------|---------|
| 3.1 | Buka `/bahan-baku` | Tabel data tampil | | |
| 3.2 | Search "kulit" | Hasil terfilter | | |
| 3.3 | Filter satuan "meter" | Hanya satuan meter tampil | | |
| 3.4 | Klik reset filter | Semua data kembali | | |
| 3.5 | Klik header kolom "Nama" | Sort berubah | | |
| 3.6 | Navigasi pagination (jika > 15) | Halaman berubah | | |

### Tasks — Create
| # | Langkah | Expected | Status | Catatan |
|---|---------|----------|--------|---------|
| 3.7 | Klik "Tambah Bahan Baku" | Form tampil | | |
| 3.8 | Submit form kosong | Validasi muncul | | |
| 3.9 | Input kode yang sudah ada | Error "kode sudah digunakan" | | |
| 3.10 | Input semua field valid, submit | Data tersimpan, flash success | | |
| 3.11 | Cek di tabel — data baru muncul | Data ada di index | | |

### Tasks — Edit
| # | Langkah | Expected | Status | Catatan |
|---|---------|----------|--------|---------|
| 3.12 | Klik Edit pada bahan baku | Form terisi data yang benar | | |
| 3.13 | Cek field stok | Field stok readonly + info card tampil | | |
| 3.14 | Update nama bahan, submit | Data terupdate, flash success | | |

### Tasks — Detail & Hapus
| # | Langkah | Expected | Status | Catatan |
|---|---------|----------|--------|---------|
| 3.15 | Klik ikon mata / Detail | Halaman show tampil, tidak ada stok info di master | | |
| 3.16 | Klik Hapus pada bahan yang ada di BOM | Ditolak dengan pesan error | | |
| 3.17 | Klik Hapus pada bahan yang tidak ada di BOM | Dialog konfirmasi → hapus berhasil | | |

### DevTools Check
- [ ] Console: tidak ada error
- [ ] Network: semua request 200

---

## MODUL 4 — Master Data Produk

**URL:** http://localhost:8000/produk

### Tasks — Index
| # | Langkah | Expected | Status | Catatan |
|---|---------|----------|--------|---------|
| 4.1 | Buka `/produk` | Tabel tampil, kolom stok TIDAK ada | | |
| 4.2 | Filter BOM "ada" | Hanya produk dengan BOM tampil | | |
| 4.3 | Filter BOM "tidak ada" | Hanya produk tanpa BOM tampil | | |

### Tasks — Create & Edit
| # | Langkah | Expected | Status | Catatan |
|---|---------|----------|--------|---------|
| 4.4 | Create produk baru dengan stok awal | Tersimpan dengan stok | | |
| 4.5 | Edit produk — cek field stok | Readonly + information card "Lihat Stok" | | |
| 4.6 | Klik "Lihat Stok" di edit page | Mengarah ke `/stok-produk-jadi` | | |

### Tasks — Detail
| # | Langkah | Expected | Status | Catatan |
|---|---------|----------|--------|---------|
| 4.7 | Buka detail produk yang punya BOM | Section BOM tampil dengan tabel bahan | | |
| 4.8 | Buka detail produk tanpa BOM | Pesan "belum memiliki BOM" tampil | | |
| 4.9 | Buka detail produk yang punya riwayat stok | Tabel riwayat stok tampil | | |

### Tasks — Hapus
| # | Langkah | Expected | Status | Catatan |
|---|---------|----------|--------|---------|
| 4.10 | Hapus produk yang ada di detail_pesanan | Ditolak dengan pesan error | | |
| 4.11 | Hapus produk yang tidak ada di pesanan | Berhasil | | |

---

## MODUL 5 — Bill of Materials (BOM)

**URL:** http://localhost:8000/bom-categorie

### Tasks
| # | Langkah | Expected | Status | Catatan |
|---|---------|----------|--------|---------|
| 5.1 | Buka index BOM | Tabel tampil | | |
| 5.2 | Create BOM baru | Tersimpan | | |
| 5.3 | Buka detail BOM | Tabel detail bahan tampil | | |
| 5.4 | Tambah bahan ke BOM | Baris baru muncul | | |
| 5.5 | Edit qty per pasang bahan | Tersimpan benar | | |
| 5.6 | Hapus bahan dari BOM | Baris terhapus | | |
| 5.7 | Hapus BOM yang dipakai produk | Ditolak | | |
| 5.8 | Hapus BOM yang tidak dipakai | Berhasil | | |

---

## MODUL 6 — Master Data Karyawan

**URL:** http://localhost:8000/karyawan

### Tasks
| # | Langkah | Expected | Status | Catatan |
|---|---------|----------|--------|---------|
| 6.1 | Index — filter status aktif/nonaktif | Hasil terfilter | | |
| 6.2 | Create karyawan baru | Tersimpan | | |
| 6.3 | Edit karyawan — ubah status | Tersimpan benar | | |
| 6.4 | Hapus karyawan yang terlibat produksi aktif | Ditolak dengan pesan error | | |
| 6.5 | Hapus karyawan yang tidak terlibat produksi | Berhasil | | |

---

## MODUL 7 — Master Data Customer

**URL:** http://localhost:8000/customer

### Tasks
| # | Langkah | Expected | Status | Catatan |
|---|---------|----------|--------|---------|
| 7.1 | Index — badge B2B biru, B2C hijau | Badge warna benar | | |
| 7.2 | Filter jenis B2B | Hanya B2B tampil | | |
| 7.3 | Create customer — nomor HP duplikat | Error validasi | | |
| 7.4 | Create customer valid | Tersimpan | | |
| 7.5 | Detail customer — riwayat pesanan tampil | Dinamis dari DB | | |
| 7.6 | Klik "Detail" pada pesanan di halaman customer | Mengarah ke detail pesanan | | |
| 7.7 | Hapus customer yang punya pesanan | Ditolak | | |
| 7.8 | Hapus customer tanpa pesanan | Berhasil | | |

---

## MODUL 8 — Pesanan + Invoice

**URL:** http://localhost:8000/pesanan

### Tasks — Create
| # | Langkah | Expected | Status | Catatan |
|---|---------|----------|--------|---------|
| 8.1 | Buka form create pesanan | Form tampil | | |
| 8.2 | Pilih produk dari dropdown | Dropdown tetap menampilkan produk yang dipilih (bukan reset) | | |
| 8.3 | Cek harga auto-fill setelah pilih produk | Harga terisi dari harga jual | | |
| 8.4 | Cek subtotal per item otomatis | Subtotal = qty × harga | | |
| 8.5 | Toggle diskon persen → input 10 | Preview "nilai diskon: Rp X" tampil | | |
| 8.6 | Toggle diskon nominal → input 50000 | Preview berubah sesuai | | |
| 8.7 | Pilih jenis pembayaran "DP" | Tersimpan | | |
| 8.8 | Submit form valid | Redirect ke show, nomor pesanan auto PSN-YYYYMMDD-XXXX | | |

### Tasks — Detail
| # | Langkah | Expected | Status | Catatan |
|---|---------|----------|--------|---------|
| 8.9 | Buka detail pesanan yang baru dibuat | Jenis pembayaran tampil "DP (Down Payment)", bukan strip | | |
| 8.10 | Cek dropdown "Ubah Status" | Opsi sesuai status saat ini (pending → proses/dibatalkan) | | |
| 8.11 | Ubah status ke "Proses" | Status berubah, badge biru | | |
| 8.12 | Ubah status ke "Selesai" | Status berubah, badge hijau | | |
| 8.13 | Coba edit pesanan selesai | Tombol edit tidak tampil | | |

### Tasks — Invoice PDF
| # | Langkah | Expected | Status | Catatan |
|---|---------|----------|--------|---------|
| 8.14 | Klik "Cetak Invoice" di detail pesanan | PDF terbuka di tab baru | | |
| 8.15 | Cek isi PDF | Header Provillo, nomor INV-xxx, info customer, tabel produk, total | | |

### Tasks — Hapus
| # | Langkah | Expected | Status | Catatan |
|---|---------|----------|--------|---------|
| 8.16 | Hapus pesanan pending | Dialog → berhasil | | |
| 8.17 | Hapus pesanan selesai | Ditolak | | |

### DevTools Check
| Aspek | Expected | Status |
|-------|----------|--------|
| Console | Tidak ada error | |
| Network PDF request | Status 200, content-type application/pdf | |
| Network POST pesanan | Status 302 redirect ke show | |

---

## MODUL 9 — Stok Bahan Baku

**URL:** http://localhost:8000/stok-bahan-baku

### Tasks — Index & Filter
| # | Langkah | Expected | Status | Catatan |
|---|---------|----------|--------|---------|
| 9.1 | Buka index riwayat | Tabel tampil | | |
| 9.2 | Filter jenis transaksi "restock" | Hanya restock tampil | | |
| 9.3 | Filter rentang tanggal | Hasil terfilter | | |
| 9.4 | Filter bahan baku dari dropdown | Hanya bahan tersebut tampil | | |

### Tasks — Transaksi Restock
| # | Langkah | Expected | Status | Catatan |
|---|---------|----------|--------|---------|
| 9.5 | Buka form create | Form tampil | | |
| 9.6 | Pilih bahan baku | Info stok saat ini tampil | | |
| 9.7 | Pilih jenis "Restock", qty 10 | Preview stok sesudah tampil hijau | | |
| 9.8 | Submit | Flash success, stok bertambah 10, log tercatat jenis=restock | | |

### Tasks — Transaksi Penyesuaian
| # | Langkah | Expected | Status | Catatan |
|---|---------|----------|--------|---------|
| 9.9 | Pilih jenis "Penyesuaian" | Helper text berubah | | |
| 9.10 | Input qty positif +5, tanpa keterangan | Error "keterangan wajib untuk penyesuaian" | | |
| 9.11 | Input qty positif +5, isi keterangan | Preview hijau, submit berhasil | | |
| 9.12 | Input qty negatif -3, isi keterangan | Preview stok berkurang (merah jika negatif) | | |
| 9.13 | Input qty 0 | Error validasi | | |

---

## MODUL 10 — Stok Produk Jadi

**URL:** http://localhost:8000/stok-produk-jadi

### Tasks
| # | Langkah | Expected | Status | Catatan |
|---|---------|----------|--------|---------|
| 10.1 | Index — filter jenis "produksi" | Log dari produksi tampil | | |
| 10.2 | Buat transaksi pengiriman | Stok berkurang, jenis=pengiriman | | |
| 10.3 | Pengiriman melebihi stok | Error "stok tidak mencukupi" | | |
| 10.4 | Penyesuaian tanpa keterangan | Error keterangan wajib | | |
| 10.5 | Detail transaksi | Qty dengan tanda +/− sesuai jenis | | |
| 10.6 | Klik kode produk di show | Mengarah ke detail produk | | |

---

## MODUL 11 — Produksi

**URL:** http://localhost:8000/produksi

### Tasks — Index & Summary Cards
| # | Langkah | Expected | Status | Catatan |
|---|---------|----------|--------|---------|
| 11.1 | Buka index produksi | Tabel + 3 summary cards tampil | | |
| 11.2 | Card 1 "Produksi Hari Ini" | Nilai dari DB (bukan hardcode) | | |
| 11.3 | Card 2 "Karyawan Paling Produktif" | Nama karyawan atau "Belum ada data" | | |
| 11.4 | Card 3 "Efisiensi Produksi" | Persentase dari produksi aktif | | |

### Tasks — Create (Produksi Pesanan)
| # | Langkah | Expected | Status | Catatan |
|---|---------|----------|--------|---------|
| 11.5 | Pilih jenis "Produksi untuk Pesanan" | Step pesanan tampil | | |
| 11.6 | Pilih pesanan dari dropdown | **Dropdown tetap menampilkan pesanan yang dipilih** | | |
| 11.7 | Cek detail pesanan | Daftar produk + qty tampil di bawah dropdown | | |
| 11.8 | Cek preview kebutuhan bahan | Tabel bahan baku + status cukup/tidak | | |
| 11.9 | Tambah karyawan via dropdown | Baris karyawan muncul | | |
| 11.10 | Tambah karyawan kedua | Dropdown karyawan 2 tidak menampilkan karyawan 1 | | |
| 11.11 | Submit | Produksi tersimpan, status=draft | | |

### Tasks — Create (Produksi Restok)
| # | Langkah | Expected | Status | Catatan |
|---|---------|----------|--------|---------|
| 11.12 | Pilih jenis "Produksi untuk Restok" | Form produk manual tampil | | |
| 11.13 | Tambah produk + qty target | Baris muncul | | |
| 11.14 | Submit | Produksi tersimpan, pesanan_id=null | | |

### Tasks — Detail Produksi
| # | Langkah | Expected | Status | Catatan |
|---|---------|----------|--------|---------|
| 11.15 | Buka detail produksi draft | Tabel target produk tampil | | |
| 11.16 | Cek kebutuhan bahan baku | Tampil dari produksi_item | | |
| 11.17 | Cek daftar karyawan | Tim karyawan tampil | | |
| 11.18 | Progress Bar 1 | Produksi progress tampil | | |
| 11.19 | Progress Bar 2 | QC progress tampil | | |

### Tasks — Mulai Produksi
| # | Langkah | Expected | Status | Catatan |
|---|---------|----------|--------|---------|
| 11.20 | Klik "Mulai Produksi" | Dialog konfirmasi muncul | | |
| 11.21 | Konfirmasi | Status = proses, stok bahan berkurang | | |
| 11.22 | Cek `/stok-bahan-baku` | Log jenis=produksi, keterangan="Produksi PSN-xxx" | | |
| 11.23 | Produksi stok tidak cukup | Tombol disable, warning tampil | | |

### Tasks — Input Progress
| # | Langkah | Expected | Status | Catatan |
|---|---------|----------|--------|---------|
| 11.24 | Section input progress tampil saat proses | Form tampil | | |
| 11.25 | Dropdown produk | Hanya produk yang sisa target > 0 tampil | | |
| 11.26 | Pilih produk | Info sisa target per produk tampil | | |
| 11.27 | Submit QC Lolos qty=5 | Histori bertambah, stok produk jadi +5, qty_selesai bertambah | | |
| 11.28 | Submit QC Tidak Lolos qty=2 | Histori bertambah (merah), stok tidak berubah, qty_selesai tidak berubah | | |
| 11.29 | Input qty melebihi sisa target | Error validasi | | |
| 11.30 | Cek `/stok-produk-jadi` | Log jenis=produksi dari progress lolos QC | | |
| 11.31 | Produk yang sudah 100% lolos QC | Tidak muncul di dropdown produk lagi | | |

### Tasks — Selesaikan & Batalkan
| # | Langkah | Expected | Status | Catatan |
|---|---------|----------|--------|---------|
| 11.32 | Tombol selesai muncul saat qty_selesai==qty_target | Tombol tampil | | |
| 11.33 | Klik "Selesaikan Produksi" | Dialog → status=selesai, stok tidak berubah lagi | | |
| 11.34 | Setelah selesai — semua tombol aksi hilang | Tidak ada Mulai/Batalkan/Progress | | |
| 11.35 | Batalkan dari draft | Status=dibatalkan, stok bahan tidak berubah | | |
| 11.36 | Batalkan dari proses | Status=dibatalkan, stok bahan dikembalikan | | |
| 11.37 | Cek `/stok-bahan-baku` setelah rollback | Log jenis=rollback, keterangan="Rollback Produksi PSN-xxx" | | |

---

## REGRESSION TESTING

### Integrasi Stok
| # | Skenario | Expected | Status |
|---|---------|----------|--------|
| R.1 | Mulai produksi → cek stok bahan di `/stok-bahan-baku` | Stok berkurang, ada log | |
| R.2 | Progress lolos QC → cek stok produk di `/stok-produk-jadi` | Stok bertambah, ada log | |
| R.3 | Batalkan produksi proses → cek stok bahan | Stok kembali, ada log rollback | |
| R.4 | Kirim produk → cek stok produk jadi | Stok berkurang | |

### Integrasi Master Data
| # | Skenario | Expected | Status |
|---|---------|----------|--------|
| R.5 | Detail produk → BOM tampil dari DB | Dinamis | |
| R.6 | Detail produk → riwayat stok tampil | Dinamis | |
| R.7 | Detail customer → riwayat pesanan tampil | Dinamis | |

### Guard Hapus
| # | Skenario | Expected | Status |
|---|---------|----------|--------|
| R.8 | Hapus bahan baku yang ada di BOM | Ditolak | |
| R.9 | Hapus produk yang ada di pesanan | Ditolak | |
| R.10 | Hapus customer yang punya pesanan | Ditolak | |
| R.11 | Hapus karyawan yang terlibat produksi aktif | Ditolak | |

---

## BROWSER DEVTOOLS SUMMARY

Setelah semua modul selesai, isi tabel ini:

### Console Errors
| Modul | Error/Warning | Severity |
|-------|--------------|----------|
| | | |

### Network Issues
| Modul | URL | Status | Keterangan |
|-------|-----|--------|------------|
| | | | |

### Performance Notes
| Modul | Catatan |
|-------|---------|
| | |

---

## BUG LOG

Catat semua bug yang ditemukan di sini. **Jangan perbaiki dulu.**

### Bug #1
- **Modul:** 
- **Langkah Reproduksi:** 
- **Expected:** 
- **Actual:** 
- **Severity:** Critical / High / Medium / Low
- **Screenshot:** 
- **Dugaan Penyebab:** 
- **File Terkait:** 

### Bug #2
- **Modul:** 
- **Langkah Reproduksi:** 
- **Expected:** 
- **Actual:** 
- **Severity:** 
- **Screenshot:** 
- **Dugaan Penyebab:** 
- **File Terkait:** 

*(tambah section Bug #N sesuai kebutuhan)*

---

## RINGKASAN AKHIR

Isi setelah semua modul selesai diuji:

| Metrik | Jumlah |
|--------|--------|
| Modul diuji | / 11 |
| Total test case | |
| PASS | |
| FAIL | |
| WARNING | |
| Bug Critical | |
| Bug High | |
| Bug Medium | |
| Bug Low | |

### Daftar Bug Berdasarkan Prioritas

**Critical (harus diperbaiki sebelum lanjut):**
1. 

**High (harus diperbaiki segera):**
1. 

**Medium (bisa dijadwalkan):**
1. 

**Low (nice to have):**
1. 

### Rekomendasi
- 

---

*Dokumen ini adalah task board aktif untuk UAT Provillo.*  
*Update status setiap task setelah pengujian selesai.*
