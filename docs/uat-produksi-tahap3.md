# UAT Checklist — Produksi Tahap 3 (Execution & QC)

Tanggal: 2026-07-09
Versi: Tahap 3 — Progress, QC, Penyelesaian, Summary Cards

Legend:
- [ ] Belum diuji
- [x] Lulus
- [!] Gagal — catat detail error

---

## 1. Input Progress

### 1.1 Form Input Progress Tampil saat Status `proses`
- **Langkah:** Buka halaman Detail Produksi berstatus `proses`
- **Hasil yang diharapkan:** Section "Input Progress" tampil di kolom kiri bawah dengan dropdown Produk, Karyawan, input Qty, dan toggle QC Lolos/Tidak Lolos
- **DB yang dicek:** —
- **BR:** BR-06, BR-12
- [x] Lulus

### 1.2 Form Tidak Tampil saat Status Bukan `proses`
- **Langkah:** Buka halaman Detail Produksi berstatus `draft`, kemudian `selesai`, kemudian `dibatalkan`
- **Hasil yang diharapkan:** Section "Input Progress" tidak tampil pada ketiga status tersebut
- **DB yang dicek:** —
- **BR:** Guard `isProses()`
- [x] Lulus

### 1.3 Submit Progress Lolos QC Berhasil
- **Langkah:** Pilih produk, pilih karyawan, input qty=5, pilih "Lolos QC", klik "Catat Progress"
- **Hasil yang diharapkan:** Flash success "Progress produksi berhasil dicatat. Stok produk jadi telah bertambah.", form reset, tabel histori bertambah 1 baris
- **DB yang dicek:** `detail_produksi` (baris baru), `produksi` (qty_selesai bertambah), `produk` (stok bertambah), `stok_produk_jadi` (baris baru)
- **Kolom yang berubah:** `detail_produksi.qty_selesai`, `produksi.qty_selesai`, `produk.stok`
- **BR:** BR-06, BR-07
- [x] Lulus
---

## 2. Validasi Produk

### 2.1 Dropdown Produk Hanya Menampilkan Produk dari Pesanan Ini
- **Langkah:** Buka form input progress, buka dropdown Produk
- **Hasil yang diharapkan:** Hanya produk yang ada di `detail_pesanan` pesanan terkait yang tampil. Produk dari pesanan lain tidak muncul.
- **DB yang dicek:** —
- **BR:** BR-12
- [x] Lulus

### 2.2 Backend Guard — Produk dari Pesanan Lain Ditolak
- **Langkah:** Via Tinker, cari produk yang tidak ada di pesanan produksi ini, kirim PATCH ke `/produksi/{id}/progress` dengan `produk_id` tersebut:
  ```
  php artisan tinker
  $p = App\Models\Produksi::where('status','proses')->first();
  $produkLain = App\Models\Produk::whereNotIn('id', $p->pesanan->detailPesanan->pluck('produk_id'))->first();
  // kirim request manual dengan produk_lain->id
  ```
- **Hasil yang diharapkan:** RuntimeException: "Produk yang dipilih tidak termasuk dalam pesanan ini."
- **DB yang dicek:** `detail_produksi` tidak bertambah, `produk.stok` tidak berubah
- **BR:** BR-12
- [x] Lulus

---

## 3. Validasi Qty

### 3.1 Qty = 0 Ditolak
- **Langkah:** Input qty=0, klik "Catat Progress"
- **Hasil yang diharapkan:** Validasi error dari FormRequest: "Jumlah progress harus lebih dari 0."
- **DB yang dicek:** Tidak ada perubahan
- **BR:** `InputProgressRequest` min:1
- [x] Lulus

### 3.2 Qty Melebihi Sisa Target Ditolak
- **Langkah:** Pastikan `qty_target=10`, `qty_selesai=7` (sisa=3). Input qty=5, pilih QC Lolos, submit.
- **Hasil yang diharapkan:** Flash error: "Jumlah progress (5) akan melebihi target produksi. Sisa target: 3 pcs."
- **DB yang dicek:** `detail_produksi` tidak bertambah, `produksi.qty_selesai` tidak berubah, `produk.stok` tidak berubah
- **BR:** Guard `qty_selesai + qty <= qty_target`
- [x] Lulus

### 3.3 Qty Tepat Sama dengan Sisa Target Diterima
- **Langkah:** `qty_target=10`, `qty_selesai=7` (sisa=3). Input qty=3, QC Lolos, submit.
- **Hasil yang diharapkan:** Berhasil. `produksi.qty_selesai` menjadi 10. Tombol "Selesaikan Produksi" muncul.
- **DB yang dicek:** `detail_produksi`, `produksi.qty_selesai=10`, `produk.stok`, `stok_produk_jadi`
- **BR:** Guard qty, BR-07
- [x] Lulus

---

## 4. QC Lolos

### 4.1 QC Lolos — Progress Tersimpan di Histori
- **Langkah:** Submit progress qty=5, QC Lolos
- **Hasil yang diharapkan:** Baris baru muncul di tabel histori dengan produk, karyawan, qty=5, dan timestamp
- **DB yang dicek:** `detail_produksi.qty_selesai = 5`
- **Kolom:** `produksi_id`, `produk_id`, `karyawan_id`, `qty_selesai`
- **BR:** BR-06, BR-09
- [x] Lulus

### 4.2 QC Lolos — `qty_selesai` Produksi Bertambah
- **Langkah:** Catat `produksi.qty_selesai` sebelumnya (X), submit progress qty=5, QC Lolos
- **Hasil yang diharapkan:** `produksi.qty_selesai = X + 5` (hasil recalculate SUM, bukan sekadar increment)
- **DB yang dicek:** `produksi.qty_selesai`
- **BR:** BR-06, Recalculate `SUM(detail_produksi.qty_selesai)`
- [x] Lulus

### 4.3 QC Lolos — Progress Bar di UI Bertambah
- **Langkah:** Catat progress bar sebelum input, submit QC Lolos, refresh halaman
- **Hasil yang diharapkan:** Progress bar dan persentase bertambah sesuai qty yang diinput
- **DB yang dicek:** `produksi.qty_selesai`
- **BR:** BR-06
- [x] Lulus

---

## 5. QC Tidak Lolos

### 5.1 QC Tidak Lolos — Ditolak dengan Pesan Jelas
- **Langkah:** Input qty=5, pilih "Tidak Lolos" (toggle merah), klik "Catat Progress"
- **Hasil yang diharapkan:** Flash error: "Hasil produksi tidak lolos QC. Produk harus diperbaiki (rework) sebelum dapat dicatat sebagai progress."
- **DB yang dicek:** Tidak ada perubahan sama sekali
- **BR:** BR-09
- [x] Lulus

### 5.2 QC Tidak Lolos — Tidak Ada Baris di `detail_produksi`
- **Langkah:** Catat jumlah baris `detail_produksi` sebelum, submit QC Tidak Lolos, cek kembali
- **Hasil yang diharapkan:** Jumlah baris tidak bertambah
- **DB yang dicek:** `detail_produksi` tidak berubah
- **BR:** BR-09 — progress tidak lolos tidak disimpan
- [x] Lulus

### 5.3 QC Tidak Lolos — Stok Produk Tidak Berubah
- **Langkah:** Catat `produk.stok`, submit QC Tidak Lolos, cek stok lagi
- **Hasil yang diharapkan:** `produk.stok` tetap sama. Tidak ada baris baru di `stok_produk_jadi`.
- **DB yang dicek:** `produk`, `stok_produk_jadi` tidak berubah
- **BR:** BR-07, BR-09
- [x] Lulus

### 5.4 QC Tidak Lolos — `qty_selesai` Produksi Tidak Berubah
- **Langkah:** Catat `produksi.qty_selesai`, submit QC Tidak Lolos
- **Hasil yang diharapkan:** `produksi.qty_selesai` tetap sama
- **DB yang dicek:** `produksi` tidak berubah
- **BR:** BR-09
- [x] Lulus


---

## 6. Update `qty_selesai`

### 6.1 Konsistensi Recalculate SUM
- **Langkah:** Submit 3 progress QC Lolos secara berurutan: qty=3, qty=4, qty=2. Setelah setiap submit, verifikasi via Tinker:
  ```
  App\Models\Produksi::find($id)->qty_selesai;
  App\Models\DetailProduksi::where('produksi_id',$id)->sum('qty_selesai');
  ```
- **Hasil yang diharapkan:** Kedua nilai selalu identik: 3, lalu 7, lalu 9
- **DB yang dicek:** `produksi.qty_selesai`, `detail_produksi.qty_selesai`
- **BR:** Recalculate dari SUM — konsistensi data
- [x] Lulus

### 6.2 Multiple Karyawan — SUM Tetap Benar
- **Langkah:** Karyawan A input qty=5 QC Lolos, Karyawan B input qty=3 QC Lolos
- **Hasil yang diharapkan:** `produksi.qty_selesai = 8`. Tabel histori menampilkan 2 baris (satu per karyawan).
- **DB yang dicek:** `detail_produksi` (2 baris), `produksi.qty_selesai=8`
- **BR:** BR-10
- [x] Lulus

### 6.3 Multiple Produk dari Pesanan — SUM Per Produksi
- **Langkah:** Pesanan punya 2 produk. Input PRD-001 qty=4 QC Lolos, PRD-002 qty=6 QC Lolos.
- **Hasil yang diharapkan:** `produksi.qty_selesai = 10`. Histori menampilkan 2 baris dengan produk berbeda.
- **DB yang dicek:** `detail_produksi`, `produksi.qty_selesai=10`
- **BR:** BR-12
- [x] Lulus

---

## 7. Update Stok Produk Jadi

### 7.1 Stok Bertambah Sesuai Qty Progress Lolos QC
- **Langkah:** Catat `produk.stok` (misal=10), submit progress produk ini qty=5, QC Lolos
- **Hasil yang diharapkan:** `produk.stok = 15`
- **DB yang dicek:** `produk.stok`
- **BR:** BR-07
- [x] Lulus

### 7.2 Stok Bertambah Bertahap (Bukan Sekali di Akhir)
- **Langkah:** Submit progress 1 qty=3 QC Lolos (stok harus +3), progress 2 qty=4 QC Lolos (stok harus +4 lagi), progress 3 qty=3 QC Lolos (stok harus +3 lagi)
- **Hasil yang diharapkan:** Stok bertambah setelah setiap progress yang lolos QC. Total +10.
- **DB yang dicek:** `produk.stok`, `stok_produk_jadi` (3 baris baru)
- **BR:** BR-07 — stok bertambah bertahap
- [x] Lulus
    
### 7.3 Stok Produk Berbeda Bertambah Secara Independen
- **Langkah:** Input PRD-001 qty=5 QC Lolos → cek stok PRD-001 +5, PRD-002 tidak berubah. Lalu input PRD-002 qty=3 QC Lolos → cek stok PRD-002 +3, PRD-001 tidak berubah lagi.
- **Hasil yang diharapkan:** Setiap progress hanya menambah stok produk yang dipilih
- **DB yang dicek:** `produk.stok` per produk
- **BR:** BR-07, BR-12
- [x] Lulus

---

## 8. Riwayat Stok Produk Jadi

### 8.1 Baris Baru di `stok_produk_jadi` saat QC Lolos
- **Langkah:** Submit progress QC Lolos produk X qty=5. Buka `/stok-produk-jadi`, filter produk X.
- **Hasil yang diharapkan:** Baris baru dengan:
  - `jenis_transaksi = produksi`
  - `qty = 5`
  - `stok_sebelum` = nilai lama
  - `stok_sesudah = stok_sebelum + 5`
  - `keterangan = "Progress Produksi PSN-xxx — nama_produk"`
  - `created_by` = ID admin yang login
- **DB yang dicek:** `stok_produk_jadi` (semua kolom)
- **BR:** BR-07, audit trail stok
- [x] Lulus

### 8.2 Tidak Ada Baris di `stok_produk_jadi` saat QC Tidak Lolos
- **Langkah:** Submit progress QC Tidak Lolos. Cek tabel `stok_produk_jadi`.
- **Hasil yang diharapkan:** Tidak ada baris baru
- **DB yang dicek:** `stok_produk_jadi` tidak berubah
- **BR:** BR-09
- [x] Lulus

### 8.3 Format Keterangan di Log Stok
- **Langkah:** Submit QC Lolos untuk pesanan "PSN-20260709-0001", produk "Sepatu Formal Pria". Cek kolom `keterangan` di `stok_produk_jadi`.
- **Hasil yang diharapkan:** `keterangan = "Progress Produksi PSN-20260709-0001 — Sepatu Formal Pria"`
- **DB yang dicek:** `stok_produk_jadi.keterangan`
- **BR:** Audit trail
- [x] Lulus

---

## 9. Penyelesaian Produksi

### 9.1 Tombol "Selesaikan Produksi" Hanya Muncul saat `qty_selesai == qty_target`
- **Langkah:** Buka produksi proses dengan `qty_selesai < qty_target` (tombol tidak ada). Input progress hingga `qty_selesai == qty_target`, refresh halaman.
- **Hasil yang diharapkan:** Tombol "Selesaikan Produksi" muncul setelah kondisi terpenuhi
- **DB yang dicek:** —
- **BR:** Guard kondisi tombol di `show.tsx`

### 9.2 Selesaikan Produksi — Status Berubah
- **Langkah:** Pastikan `qty_selesai == qty_target`. Klik "Selesaikan Produksi", konfirmasi dialog "Ya, Selesaikan".
- **Hasil yang diharapkan:** Flash success "Produksi berhasil diselesaikan.", badge status berubah "Selesai" (hijau), `produksi.status = selesai`
- **DB yang dicek:** `produksi.status`
- **BR:** `selesaikanProduksi()`

### 9.3 Selesaikan Produksi — Stok TIDAK Bertambah Lagi
- **Langkah:** Catat `produk.stok` sesaat sebelum klik selesai. Klik selesai. Cek `produk.stok` setelah.
- **Hasil yang diharapkan:** `produk.stok` tidak berubah. Tidak ada baris baru di `stok_produk_jadi` dengan timestamp sekarang.
- **DB yang dicek:** `produk` tidak berubah, `stok_produk_jadi` tidak bertambah
- **BR:** `selesaikanProduksi()` tidak memanggil `StockProdukService`

### 9.4 Selesaikan Produksi Gagal saat `qty_selesai < qty_target` (Backend Guard)
- **Langkah:** Via Tinker pada produksi yang `qty_selesai < qty_target`:
  ```
  app(App\Services\ProduksiService::class)->selesaikanProduksi($produksi);
  ```
- **Hasil yang diharapkan:** RuntimeException: "Produksi belum dapat diselesaikan. Progress saat ini: X / Y pcs."
- **DB yang dicek:** Tidak ada perubahan
- **BR:** Guard `qty_selesai == qty_target`

### 9.5 Produksi Selesai — Tidak Bisa Input Progress, Batalkan, atau Mulai Lagi
- **Langkah:** Buka halaman detail produksi yang sudah berstatus `selesai`
- **Hasil yang diharapkan:** Section "Input Progress" tidak tampil. Tombol "Batalkan Produksi", "Mulai Produksi", dan "Selesaikan Produksi" semua tidak tampil.
- **DB yang dicek:** —
- **BR:** Guard `isSelesai()`

### 9.6 Produksi Selesai — Tidak Bisa Dibatalkan (Backend Guard)
- **Langkah:** Via Tinker pada produksi selesai:
  ```
  app(App\Services\ProduksiService::class)->batalkanProduksi($produksi, 1);
  ```
- **Hasil yang diharapkan:** RuntimeException: "Produksi dengan status 'selesai' tidak dapat dibatalkan."
- **DB yang dicek:** Tidak ada perubahan
- **BR:** Guard `isSelesai() || isDibatalkan()`

---

## 10. Summary Cards

### 10.1 Card 1 — Produksi Hari Ini Dinamis
- **Langkah:** Catat nilai Card 1 (batch dan qty). Buat 1 produksi baru hari ini. Input beberapa progress QC Lolos. Refresh halaman index.
- **Hasil yang diharapkan:** Nilai batch bertambah 1. qty_selesai hari ini mengikuti total progress yang dicatat hari ini.
- **DB yang dicek:** `produksi`, `detail_produksi`
- **BR:** `hitungSummary()` — data dari backend

### 10.2 Card 2 — Karyawan Paling Produktif Dinamis
- **Langkah:** Input beberapa progress QC Lolos untuk karyawan yang sama (hari ini atau 30 hari terakhir). Refresh halaman index.
- **Hasil yang diharapkan:** Nama karyawan dengan total `qty_selesai` terbesar tampil. Persentase kontribusi dan progress bar sesuai.
- **DB yang dicek:** `detail_produksi`, `karyawan`
- **BR:** SUM qty_selesai per karyawan 30 hari terakhir

### 10.3 Card 3 — Efisiensi Produksi Aktif Dinamis
- **Langkah:** Catat persentase efisiensi. Input beberapa progress QC Lolos pada produksi berstatus `proses`. Refresh.
- **Hasil yang diharapkan:** Persentase efisiensi bertambah. Rumus: `SUM(qty_selesai proses) / SUM(qty_target proses) * 100%`
- **DB yang dicek:** `produksi` (hanya status=proses)
- **BR:** `hitungSummary()` — hanya produksi aktif

### 10.4 Card Menampilkan Nilai Default saat Tidak Ada Data
- **Langkah:** Jika belum ada progress hari ini / 30 hari terakhir, buka halaman index
- **Hasil yang diharapkan:** Card Karyawan menampilkan "Belum ada data". Card lain menampilkan 0. Tidak ada error.
- **DB yang dicek:** —
- **BR:** Null-safe handling di frontend dan backend

---

## 11. Regression Test (Tahap 1 + Tahap 2)

### 11.1 Buat Produksi Baru dari Pesanan Valid (Tahap 1)
- **Langkah:** Buka `/produksi/create`, pilih pesanan berstatus `pending` atau `proses`, isi deadline opsional, submit
- **Hasil yang diharapkan:** Redirect ke halaman show produksi baru. `status=draft`, `qty_selesai=0`. Preview kebutuhan bahan baku tampil.
- **DB yang dicek:** `produksi`
- **BR:** BR-01, BR-11

### 11.2 Tidak Bisa Buat Produksi Ganda untuk Pesanan yang Sama (Tahap 1)
- **Langkah:** Buat produksi untuk pesanan X (draft/proses). Coba buat produksi kedua untuk pesanan X.
- **Hasil yang diharapkan:** Error: "Pesanan ... sudah memiliki produksi aktif." Pesanan X tidak tampil di dropdown.
- **DB yang dicek:** `produksi` tidak bertambah
- **BR:** BR-11

### 11.3 Preview Kebutuhan Bahan saat Pilih Pesanan (Tahap 1)
- **Langkah:** Di `/produksi/create`, pilih pesanan dari dropdown
- **Hasil yang diharapkan:** Halaman reload, tabel kebutuhan bahan baku dari BOM tampil dengan indikator cukup/tidak cukup per bahan
- **DB yang dicek:** —
- **BR:** BR-02, `hitungKebutuhanBahan()`

### 11.4 Mulai Produksi — Stok Bahan Berkurang (Tahap 2)
- **Langkah:** Catat stok semua bahan yang dibutuhkan. Klik "Mulai Produksi" pada produksi `draft`. Konfirmasi dialog.
- **Hasil yang diharapkan:** `status=proses`. Stok bahan berkurang sesuai `BOM x qty_target`. Log di `stok_bahan_baku` dengan `jenis_transaksi=produksi` dan `keterangan="Produksi PSN-xxx"`.
- **DB yang dicek:** `produksi.status`, `bahan_baku.stok`, `stok_bahan_baku` (baris baru)
- **BR:** BR-03, BR-04

### 11.5 Batalkan Produksi Proses — Stok Bahan Dikembalikan (Tahap 2)
- **Langkah:** Mulai produksi. Catat stok bahan setelah mulai. Batalkan produksi `proses`. Konfirmasi dialog.
- **Hasil yang diharapkan:** `status=dibatalkan`. Stok bahan kembali ke nilai sebelum mulai. Log di `stok_bahan_baku` dengan `jenis_transaksi=rollback` dan `keterangan="Rollback Produksi PSN-xxx"`.
- **DB yang dicek:** `produksi.status`, `bahan_baku.stok`, `stok_bahan_baku` (baris rollback)
- **BR:** BR-08

### 11.6 Batalkan Produksi Draft — Tidak Ada Perubahan Stok (Tahap 2)
- **Langkah:** Catat stok bahan. Batalkan produksi berstatus `draft`.
- **Hasil yang diharapkan:** `status=dibatalkan`. Stok bahan tidak berubah. Tidak ada log baru di `stok_bahan_baku`.
- **DB yang dicek:** `produksi.status` saja berubah
- **BR:** Guard draft — batalkan tanpa rollback stok

### 11.7 Mulai Produksi Gagal saat Stok Tidak Cukup (Tahap 2)
- **Langkah:** Buat produksi dari pesanan yang stok bahan bakunya tidak cukup. Coba klik "Mulai Produksi".
- **Hasil yang diharapkan:** Tombol "Mulai Produksi" disable (UI menampilkan warning) atau flash error setelah klik. Status tetap `draft`.
- **DB yang dicek:** Tidak ada perubahan
- **BR:** BR-03, BR-05

### 11.8 Filter dan Sorting di Index Produksi Berfungsi (Tahap 1)
- **Langkah:** Filter status=`proses` → hanya produksi proses. Filter status=`selesai` → hanya produksi selesai. Search nomor pesanan. Klik sort header kolom.
- **Hasil yang diharapkan:** Semua filter, sorting, dan pagination berfungsi normal
- **DB yang dicek:** —
- **BR:** Regression UI

### 11.9 Hapus Karyawan yang Terlibat Produksi Aktif Ditolak
- **Langkah:** Temukan karyawan yang punya `detail_produksi` di produksi berstatus `draft` atau `proses`. Coba hapus dari halaman Master Data Karyawan.
- **Hasil yang diharapkan:** Error: "Karyawan tidak dapat dihapus karena masih terlibat dalam produksi aktif."
- **DB yang dicek:** `karyawan` tidak berubah
- **BR:** Guard hapus karyawan

### 11.10 Sidebar Menu "Produksi Karyawan" Mengarah ke Halaman yang Benar
- **Langkah:** Klik menu "Produksi Karyawan" di sidebar
- **Hasil yang diharapkan:** Redirect ke `/produksi`. Halaman index produksi tampil dengan summary cards.
- **DB yang dicek:** —
- **BR:** Navigasi sidebar

### 11.11 Modul Stok Produk Jadi Masih Berfungsi Normal
- **Langkah:** Buka `/stok-produk-jadi`. Filter `jenis_transaksi=produksi`. Lihat riwayat log.
- **Hasil yang diharapkan:** Semua log stok yang dihasilkan dari progress produksi tampil dengan data yang benar (produk, qty, keterangan, created_by)
- **DB yang dicek:** `stok_produk_jadi`
- **BR:** Regression Modul 10

### 11.12 Modul Pesanan Tidak Terpengaruh Otomatis oleh Perubahan Status Produksi
- **Langkah:** Buka detail pesanan yang sedang diproduksi. Perhatikan status pesanan sebelum dan sesudah produksi diselesaikan.
- **Hasil yang diharapkan:** Status pesanan tidak berubah secara otomatis karena produksi. Sinkronisasi status pesanan dilakukan secara terpisah.
- **DB yang dicek:** `pesanan.status` tidak berubah otomatis
- **BR:** Modul Produksi dan Pesanan masih independen

---

*Checklist ini mencakup seluruh skenario Produksi Tahap 3 dan regression test Tahap 1-2.*
*Centang setiap item setelah pengujian berhasil.*
*Laporkan setiap item yang gagal beserta detail error sebelum lanjut ke modul berikutnya.*
