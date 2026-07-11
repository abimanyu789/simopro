# UAT Checklist — Provillo Management System

**Tanggal:** 2026-07-10  
**Versi:** Mencakup modul 1–11 (Auth sampai Produksi)  
**Tester:** Antigravity AI

**Legend:**
- `[ ]` Belum diuji
- `[x]` Lulus
- `[!]` Gagal — catat detail error di kolom Catatan

---

## 1. Authentication

### 1.1 Login
- [x] Buka `/` → redirect ke halaman login
- [x] Login dengan email & password yang benar → redirect ke `/dashboard`
- [x] Login dengan email salah → pesan error tampil
- [x] Login dengan password salah → pesan error tampil
- [x] Field kosong → validasi wajib diisi tampil
- [x] Logout → redirect ke halaman login, session bersih

---

## 2. Dashboard

### 2.1 Tampilan
- [x] Halaman `/dashboard` tampil tanpa error
- [x] Stat cards tampil (pesanan, produksi, stok, arus kas) — nilai 0 jika belum ada data tidak menyebabkan error
- [x] Navigasi sidebar tampil lengkap dan semua link bisa diklik

---

## 3. Master Data — Bahan Baku

### 3.1 Index
- [x] Halaman `/bahan-baku` tampil dengan tabel data
- [x] Search by kode bahan → hasil terfilter
- [x] Search by nama bahan → hasil terfilter
- [x] Filter satuan (meter/pasang/buah/kg/lembar) → hasil terfilter
- [x] Reset filter → semua data kembali
- [x] Sort kolom (kode, nama, satuan, minimum stok) → urutan berubah
- [x] Pagination berfungsi jika data > 15

### 3.2 Create
- [x] Klik "Tambah Bahan Baku" → form tampil
- [x] Submit form kosong → validasi muncul
- [x] Kode bahan duplikat → error "kode sudah digunakan"
- [x] Submit valid → data tersimpan, redirect ke index, flash success
- [x] Stok awal bisa diisi 0 atau lebih

### 3.3 Edit
- [x] Klik Edit → form terisi data yang benar
- [x] Field stok **readonly** (tidak bisa diubah) → information card tampil
- [x] Update data master (kode, nama, satuan, minimum stok) → tersimpan benar
- [x] Kode bahan unik tetap divalidasi saat edit

### 3.4 Detail
- [x] Halaman show tampil informasi master bahan baku
- [x] Kolom stok dan badge low stok **tidak tampil** (dipindah ke modul inventory)
- [x] Tombol Edit dan Hapus tampil

### 3.5 Hapus
- [x] Dialog konfirmasi muncul sebelum hapus
- [x] Hapus bahan baku yang tidak dipakai BOM → berhasil
- [x] Hapus bahan baku yang sudah dipakai BOM → ditolak dengan pesan error

---

## 4. Master Data — Produk

### 4.1 Index
- [x] Halaman `/produk` tampil dengan tabel data
- [x] Search by kode produk → hasil terfilter
- [x] Search by nama produk → hasil terfilter
- [x] Search by warna → hasil terfilter
- [x] Filter BOM (ada/tidak ada) → hasil terfilter
- [x] Sort kolom → urutan berubah
- [x] Kolom stok **tidak tampil** di tabel index

### 4.2 Create
- [x] Form create tampil dengan field: kode, nama, ukuran, warna, harga jual, stok awal, minimum stok, BOM
- [x] Kode produk duplikat → error validasi
- [x] Submit valid → data tersimpan

### 4.3 Edit
- [x] Field stok **readonly** + information card "Lihat Stok" → mengarah ke `/stok-produk-jadi`
- [x] Update data master (kode, nama, ukuran, warna, harga, BOM) → tersimpan benar

### 4.4 Detail
- [x] Informasi produk tampil (tanpa stok di section master)
- [x] **Section BOM** tampil dinamis — nama BOM + tabel bahan baku + qty/pasang
- [x] Jika produk belum punya BOM → pesan "Produk ini belum memiliki BOM"
- [x] **Section Riwayat Stok** tampil dinamis (5 transaksi terakhir dari stok_produk_jadi)
- [x] Jika belum ada riwayat → pesan kosong

### 4.5 Hapus
- [x] Hapus produk yang belum dipakai pesanan → berhasil
- [x] Hapus produk yang sudah ada di detail_pesanan → ditolak dengan pesan error

---

## 5. Bill of Materials (BOM)

### 5.1 Index
- [x] Halaman `/bom-categorie` tampil
- [x] Search by nama BOM → hasil terfilter
- [x] Sort kolom → urutan berubah

### 5.2 Create BOM
- [x] Form create BOM tampil
- [x] Nama BOM wajib diisi
- [x] Bisa menambah baris bahan baku + qty per pasang
- [x] Submit valid → BOM tersimpan

### 5.3 Detail BOM
- [x] Halaman show BOM tampil dengan daftar detail bahan
- [x] Tombol tambah bahan → baris baru muncul
- [x] Edit qty per pasang bahan → tersimpan benar
- [x] Hapus bahan dari BOM → baris terhapus

### 5.4 Edit BOM
- [x] Update nama BOM → tersimpan benar

### 5.5 Hapus BOM
- [x] Hapus BOM yang tidak dipakai produk → berhasil
- [x] Hapus BOM yang sudah dipakai produk → ditolak

---

## 6. Master Data — Karyawan

### 6.1 Index
- [x] Halaman `/karyawan` tampil
- [x] Search by nama → hasil terfilter
- [x] Filter status (aktif/nonaktif) → hasil terfilter

### 6.2 Create
- [x] Submit valid → karyawan tersimpan dengan status default
- [x] Status wajib dipilih (aktif/nonaktif)

### 6.3 Edit
- [x] Update data termasuk status → tersimpan benar

### 6.4 Hapus
- [x] Hapus karyawan yang tidak terlibat produksi aktif → berhasil
- [x] Hapus karyawan yang terlibat produksi aktif (draft/proses) → ditolak dengan pesan error

---

## 7. Master Data — Customer

### 7.1 Index
- [x] Halaman `/customer` tampil
- [x] Search by nama → hasil terfilter
- [x] Filter jenis (B2B/B2C) → hasil terfilter
- [x] Badge warna: B2B biru, B2C hijau

### 7.2 Create
- [x] Jenis customer wajib dipilih (B2B/B2C)
- [x] Nomor HP unik — duplikat ditolak
- [x] Submit valid → tersimpan

### 7.3 Edit
- [x] Update data termasuk jenis customer → tersimpan benar
- [x] Nomor HP unik tetap divalidasi (ignore self)

### 7.4 Detail
- [x] Informasi customer tampil
- [x] **Riwayat Pesanan** tampil dinamis (5 terbaru) dengan nomor, tanggal, status badge, total
- [x] Klik tombol "Detail" pada pesanan → mengarah ke halaman detail pesanan

### 7.5 Hapus
- [x] Hapus customer tanpa pesanan → berhasil
- [x] Hapus customer yang punya pesanan → ditolak dengan pesan error

---

## 8. Pesanan + Invoice

### 8.1 Index
- [x] Halaman `/pesanan` tampil dengan tabel
- [x] Search by nomor pesanan → hasil terfilter
- [x] Search by nama customer → hasil terfilter
- [x] Filter status (pending/proses/selesai/dibatalkan) → hasil terfilter
- [x] Badge status: kuning=pending, biru=proses, hijau=selesai, merah=dibatalkan

### 8.2 Create
- [x] Pilih customer dari dropdown
- [x] Pilih jenis pembayaran (DP/Lunas/Bertahap/COD/Termin) — opsional
- [x] Tambah produk minimal 1 item
- [x] Harga otomatis terisi dari harga jual produk → bisa diubah manual
- [x] **Stale closure bug sudah diperbaiki:** setelah pilih produk, dropdown tetap menampilkan nama produk yang dipilih
- [x] Subtotal per item dihitung otomatis (qty × harga)
- [x] Toggle diskon persen/nominal → preview nilai diskon tampil
- [x] Preview total real-time (subtotal − diskon + ongkir)
- [x] Submit valid → redirect ke halaman show, nomor pesanan auto-generate (PSN-YYYYMMDD-XXXX)

### 8.3 Edit
- [x] Hanya bisa diakses saat status pending atau dibatalkan
- [x] Edit item, diskon, ongkir → kalkulasi diperbarui
- [x] Status selesai → tombol edit tidak tampil

### 8.4 Detail
- [x] Informasi pesanan tampil: customer, tanggal, **jenis pembayaran**, status
- [x] Jenis pembayaran yang dipilih tersimpan dan tampil dengan benar (bukan strip)
- [x] Tabel item pesanan: produk, harga, qty, subtotal
- [x] Ringkasan pembayaran: subtotal, diskon (merah), ongkir, total
- [x] **Ubah Status** via dropdown Select tampil sesuai status saat ini
- [x] Tombol "Cetak Invoice" tampil

### 8.5 Status Flow
- [x] Pending → Proses → berhasil
- [x] Pending → Dibatalkan → berhasil
- [x] Proses → Selesai → berhasil
- [x] Proses → Dibatalkan → berhasil
- [x] Selesai → tidak bisa diubah lagi

### 8.6 Hapus
- [x] Hapus pesanan pending/proses → berhasil, redirect ke index
- [x] Hapus pesanan selesai → ditolak
- [x] Hapus pesanan dibatalkan → ditolak
- [x] Dialog konfirmasi muncul sebelum hapus

### 8.7 Invoice PDF
- [x] Klik "Cetak Invoice" → PDF terbuka di tab baru
- [x] PDF memuat: header Provillo, nomor invoice (INV-xxx), info customer, tabel produk, ringkasan pembayaran, footer
- [x] Nomor invoice format INV-YYYYMMDD-XXXX (berbasis nomor pesanan)

---

## 9. Stok Bahan Baku

### 9.1 Index (Riwayat)
- [x] Halaman `/stok-bahan-baku` tampil dengan tabel riwayat
- [x] Search by kode bahan → hasil terfilter
- [x] Search by nama bahan → hasil terfilter
- [x] Search by keterangan → hasil terfilter
- [x] Filter bahan baku (dropdown) → hasil terfilter
- [x] Filter jenis transaksi (restock/produksi/rollback/penyesuaian) → hasil terfilter
- [x] Filter rentang tanggal (dari–sampai) → hasil terfilter
- [x] Reset filter → semua data kembali
- [x] Sort kolom → urutan berubah
- [x] Pagination berfungsi

### 9.2 Transaksi — Restock
- [x] Buka `/stok-bahan-baku/create`
- [x] Pilih bahan baku → info stok saat ini tampil
- [x] Pilih jenis "Restock"
- [x] Input qty > 0 → preview stok sesudah tampil (hijau)
- [x] Submit → flash success, stok bertambah, log tercatat dengan jenis=restock

### 9.3 Transaksi — Penyesuaian
- [x] Pilih jenis "Penyesuaian"
- [x] Input qty positif → stok bertambah + preview hijau
- [x] Input qty negatif → stok berkurang + preview merah jika hasil negatif
- [x] Input qty 0 → validasi ditolak
- [x] Keterangan **wajib diisi** untuk penyesuaian → error muncul jika kosong
- [x] Submit tanpa keterangan → form tidak tersubmit, error keterangan tampil
- [x] Submit dengan keterangan valid → berhasil tersimpan

### 9.4 Detail Transaksi
- [x] Halaman show tampil: bahan baku, kode, jenis, qty, stok sebelum, stok sesudah, tanggal, keterangan

---

## 10. Stok Produk Jadi

### 10.1 Index (Riwayat)
- [x] Halaman `/stok-produk-jadi` tampil
- [x] Filter produk → hasil terfilter
- [x] Filter jenis transaksi (produksi/pengiriman/rollback/penyesuaian) → hasil terfilter
- [x] Filter rentang tanggal → hasil terfilter
- [x] Log dari progress produksi (jenis=produksi) tampil dengan benar

### 10.2 Transaksi — Pengiriman
- [x] Buka `/stok-produk-jadi/create`
- [x] Pilih produk → stok saat ini tampil
- [x] Pilih jenis "Pengiriman"
- [x] Input qty → preview stok sesudah tampil
- [x] Submit qty melebihi stok → flash error stok tidak mencukupi
- [x] Submit valid → stok berkurang, log tercatat dengan jenis=pengiriman

### 10.3 Transaksi — Penyesuaian
- [x] Pilih jenis "Penyesuaian"
- [x] Input qty positif → stok bertambah
- [x] Input qty negatif → stok berkurang
- [x] Keterangan wajib diisi untuk penyesuaian
- [x] Submit valid → berhasil tersimpan

### 10.4 Detail Transaksi
- [x] Halaman show tampil dengan perubahan stok, qty +/− dengan warna sesuai jenis
- [x] Klik kode produk → mengarah ke halaman detail produk

---

## 11. Produksi

### 11.1 Index
- [x] Halaman `/produksi` tampil dengan tabel dan summary cards
- [x] **Card 1** (Produksi Hari Ini): qty dari detail_produksi hari ini
- [x] **Card 2** (Karyawan Paling Produktif): nama + progress bar kontribusi
- [x] **Card 3** (Efisiensi Produksi): persentase qty selesai / qty target produksi aktif
- [x] Search by nomor pesanan → hasil terfilter
- [x] Filter status → hasil terfilter
- [x] Sort kolom → urutan berubah

### 11.2 Create — Produksi untuk Pesanan
- [x] Halaman `/produksi/create` tampil
- [x] Step 1: pilih jenis "Produksi untuk Pesanan"
- [x] Dropdown pesanan menampilkan pesanan pending/proses yang belum punya produksi aktif
- [x] **Setelah pilih pesanan, dropdown tetap menampilkan pesanan yang dipilih** (bug sudah diperbaiki)
- [x] Detail pesanan tampil di bawah dropdown (daftar produk + qty)
- [x] Preview kebutuhan bahan baku dari BOM tampil
- [x] Indikator cukup/tidak cukup per bahan
- [x] Pilih karyawan via dropdown + tombol "Tambah Karyawan" (bisa > 1)
- [x] Karyawan yang sudah dipilih tidak muncul lagi di dropdown baris lain
- [x] Isi deadline dan catatan (opsional)
- [x] Submit → produksi tersimpan, status = draft, `produksi_item` di-populate dari detail_pesanan

### 11.3 Create — Produksi untuk Restok
- [x] Step 1: pilih jenis "Produksi untuk Restok"
- [x] Step 2: tambah produk + qty target secara manual (bisa > 1)
- [x] Pilih karyawan + deadline + catatan
- [x] Submit → produksi tersimpan dengan `pesanan_id = null`

### 11.4 Detail Produksi
- [x] Informasi produksi tampil: jenis, pesanan (jika ada), customer, status, deadline, catatan
- [x] **Tabel Target Produk** tampil dari `produksi_item` (produk + target + lolos QC + sisa)
- [x] **Kebutuhan Bahan Baku** tampil dari BOM produksi_item
- [x] **Daftar Tim Karyawan** tampil dari `produksi_karyawan`
- [x] **Progress Bar 1** (Progress Produksi): qty lolos / qty target
- [x] **Progress Bar 2** (Progress QC): qty lolos vs total progress
- [x] **Histori Progress** tampil dari detail_produksi dengan badge QC (lolos hijau / tidak lolos merah)
- [x] Tombol "Mulai Produksi" tampil hanya saat status=draft dan stok cukup
- [x] Tombol "Batalkan Produksi" tampil saat status=draft atau proses
- [x] Warning stok tidak cukup tampil jika status=draft dan stok kurang

### 11.5 Mulai Produksi (Tahap 2)
- [x] Klik "Mulai Produksi" → dialog konfirmasi muncul
- [x] Konfirmasi → status berubah menjadi proses
- [x] Stok bahan baku berkurang sesuai BOM × qty_target per produk
- [x] Log `stok_bahan_baku` bertambah dengan jenis=produksi, keterangan="Produksi PSN-xxx"
- [x] Jika stok tidak cukup → tombol disable, tidak bisa dimulai

### 11.6 Input Progress (Tahap 3)
- [x] Section "Input Progress" tampil hanya saat status=proses
- [x] Dropdown produk hanya menampilkan produk yang qty lolos QC masih < target
- [x] Produk yang sudah selesai (lolos = target) tidak muncul di dropdown
- [x] Info sisa target per produk tampil
- [x] Toggle QC: "Lolos QC" (hijau) / "Tidak Lolos" (merah)
- [x] Input qty melebihi sisa target → flash error
- [x] Submit QC Lolos → detail_produksi tersimpan, qty_selesai bertambah, stok produk jadi bertambah
- [x] Submit QC Tidak Lolos → detail_produksi tersimpan (histori), stok tidak berubah, qty_selesai tidak berubah
- [x] Log `stok_produk_jadi` hanya bertambah saat QC Lolos
- [x] Keterangan log: "Progress Produksi PSN-xxx — nama_produk"

### 11.7 Selesaikan Produksi
- [x] Tombol "Selesaikan Produksi" muncul hanya saat qty_selesai == qty_target
- [x] Klik → dialog konfirmasi muncul
- [x] Konfirmasi → status berubah menjadi selesai
- [x] Stok produk jadi **tidak** bertambah lagi (sudah bertambah bertahap)
- [x] Setelah selesai: tombol Mulai, Batalkan, Input Progress → semua hilang

### 11.8 Batalkan Produksi
- [x] Batalkan dari status draft → status = dibatalkan, tidak ada perubahan stok
- [x] Batalkan dari status proses → status = dibatalkan, stok bahan baku dikembalikan
- [x] Log rollback dengan keterangan "Rollback Produksi PSN-xxx"
- [x] Dialog konfirmasi berbeda tergantung status (draft vs proses)
- [x] Status selesai → tombol batalkan tidak tampil sama sekali

### 11.9 Validasi Tambahan
- [x] Produksi dari pesanan yang sama tidak bisa dibuat dua kali (ada produksi aktif)
- [x] Dropdown pesanan di create tidak menampilkan pesanan yang sudah punya produksi aktif

---

## 12. Regression Test Lintas Modul

### 12.1 Integrasi Stok
- [x] Mulai produksi → stok bahan baku berkurang, cek di `/stok-bahan-baku`
- [x] Progress lolos QC → stok produk jadi bertambah, cek di `/stok-produk-jadi`
- [x] Batalkan produksi proses → stok bahan baku kembali, cek di `/stok-bahan-baku`
- [x] Kirim produk (stok produk jadi) → stok berkurang, cek di `/stok-produk-jadi`

### 12.2 Integrasi Master Data → Inventory
- [x] Detail produk → section BOM dinamis (data dari bom_detail)
- [x] Detail produk → section riwayat stok dinamis (dari stok_produk_jadi)
- [x] Detail customer → riwayat pesanan dinamis (dari tabel pesanan)

### 12.3 Guard Hapus
- [x] Hapus karyawan yang terlibat produksi aktif → ditolak
- [x] Hapus produk yang ada di detail_pesanan → ditolak
- [x] Hapus customer yang punya pesanan → ditolak
- [x] Hapus bahan baku yang ada di BOM → ditolak

### 12.4 Navigation & UI
- [x] Semua link sidebar mengarah ke halaman yang benar
- [x] Sidebar "Stok > Bahan Baku" → `/stok-bahan-baku`
- [x] Sidebar "Stok > Produk Jadi" → `/stok-produk-jadi`
- [x] Sidebar "Pesanan" → `/pesanan`
- [x] Sidebar "Produksi Karyawan" → `/produksi`
- [x] Tombol back di semua halaman show/create/edit berfungsi
- [x] Flash success/error tampil setelah setiap aksi

---

## Catatan Testing

| No | Skenario | Status | Detail Error |
|----|----------|--------|--------------|
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |

---

*Checklist ini mencakup seluruh skenario modul 1–11 yang sudah diimplementasi.*  
*Tandai setiap item setelah pengujian. Laporkan item yang gagal sebelum lanjut ke modul berikutnya.*
