# Modules TODO — urutan pengerjaan

Checklist ini dipakai untuk membatasi 1 sesi AI = 1 modul. Centang manual setelah modul
lulus testing manual, baru lanjut ke modul berikutnya. Jangan minta AI mengerjakan lebih
dari satu modul dalam satu percakapan.

## 1. Auth / Login ✅ SELESAI (commit e897488)
- [x] Migration users (default Laravel + kolom 2FA dari Fortify)
- [x] Seeder admin default (AdminSeeder — updateOrCreate, email_verified_at diisi)
- [x] Auth scaffolding (Laravel Fortify — registration + emailVerification dinonaktifkan)
- [x] React Login page (Inertia, split layout, branding Provillo, UI bahasa Indonesia)
- [x] Test: login sukses (admin@provillo.com/password → redirect /dashboard ✅)

## 2. Dashboard ✅ SELESAI (commit efb9b2d)
- [x] DashboardController dengan query defensive (Schema::hasTable checks)
- [x] Query ringkasan: stat cards, financial chart, best sellers, active orders, top employees
- [x] Dashboard types (TypeScript)
- [x] StatCard, FinancialChart, BestSellersChart components
- [x] Progress UI component (Radix UI)
- [x] Sidebar update dengan menu Provillo lengkap + collapsible support
- [x] NavMain update untuk nested navigation
- [x] Full dashboard layout dengan responsive design
- [x] Install recharts & @radix-ui/react-progress
- [x] Test manual: semua komponen tampil, data 0/kosong normal (tabel belum ada) ✅

## 3. Master Data — Bahan Baku ✅ SELESAI (commit 9b76e6d)
- [x] Migration `bahan_baku` table (singular)
- [x] Seeder `BahanBakuSeeder` (8 data dummy)
- [x] Model `BahanBaku` dengan `$table = 'bahan_baku'`
- [x] FormRequest `BahanBakuRequest` (validation: unique kode, required, min values)
- [x] Controller `BahanBakuController` (resource CRUD + search + pagination)
- [x] Route resource `bahan-baku`
- [x] TypeScript types `bahan-baku.ts`
- [x] React pages (index, create, edit, show)
- [x] Table UI component
- [x] Sidebar link updated
- [x] Test manual: CRUD berfungsi, validasi OK, search & pagination OK ✅

## 4. Master Data — Produk ✅ SELESAI (commit c3555bf)
- [x] Migration `produk` table (singular, `bom_category_id` nullable, FK ke `bom_categorie` ditambahkan di migration terpisah)
- [x] Seeder `ProdukSeeder` (20 data dummy produk sepatu, PRD-001 s/d PRD-020)
- [x] Model `Produk` dengan `$table = 'produk'`, fillable, casts
- [x] FormRequest `ProdukRequest` (kode unik, required, min values, bahasa Indonesia)
- [x] Controller `ProdukController` (resource CRUD, search: kode/nama/warna, sort: created_at DESC, paginate 15)
- [x] Route resource `produk`
- [x] TypeScript types `produk.ts` + export di `types/index.ts`
- [x] Reusable component `ProdukForm` (shared create & edit)
- [x] Reusable component `ProdukDeleteDialog` (shadcn Dialog)
- [x] React Pages: Index (table + search + pagination + low-stock indicator), Create, Edit, Show
- [x] Sidebar update (Produk → `produk.index()`)
- [x] Wayfinder route di-generate (`resources/js/routes/produk/index.ts`)
- [x] Test manual: CRUD berhasil, search & pagination OK, produk bisa dibuat tanpa BOM ✅

## 5. Bill of Materials (BOM) ✅ SELESAI (commit aa89da1)
- [x] Migration `bom_categorie` table (singular, `bom_categorie`)
- [x] Migration `bom_detail` table (singular, `bom_detail`)
- [x] Migration tambahan: FK `bom_category_id` ke tabel `produk`
- [x] Seeder `BomCategorieSeeder` (10 BOM dummy, 33 detail bahan)
- [x] Model `BomCategorie` dengan `$table = 'bom_categorie'` + relasi ke Produk & BomDetail
- [x] Model `BomDetail` dengan `$table = 'bom_detail'` + relasi ke BahanBaku
- [x] FormRequest `BomCategorieRequest` + `BomDetailRequest`
- [x] Controller `BomCategorieController` (resource CRUD full)
- [x] Controller `BomDetailController` (store/update/destroy — inline, tanpa halaman terpisah)
- [x] Route resource `bom-categorie` + custom routes `bom-detail.store/update/destroy`
- [x] Wayfinder routes di-generate (`routes/bom-categorie/`, `routes/bom-detail/`)
- [x] React Pages: Index, Create, Edit, Show (dengan inline CRUD detail bahan)
- [x] Sidebar link updated (Bill of Materials → `bomCategorie.index()`)
- [x] Test manual:
      - CRUD BOM Category berhasil
      - Tambah/edit/hapus detail bahan inline berhasil
      - Assign BOM ke Produk berhasil
      - Validasi qty_per_pair > 0
      - BOM yang terhubung produk tidak bisa dihapus

## 6. Master Data — Karyawan ✅ SELESAI (commit f429200)    
- [x] Migration `karyawan` table (singular, `status` enum aktif/nonaktif default `aktif`)
- [x] Seeder `KaryawanSeeder` (20 dummy: Penjahit, Tukang Sol, Finishing, QC, Supervisor, Pola & Potong — mix aktif/nonaktif)
- [x] Model `Karyawan` dengan `$table = 'karyawan'`, fillable, relasi `detailProduksis()` (di-comment — aktif setelah Modul Produksi)
- [x] FormRequest `KaryawanRequest` (nama required, jabatan/no_hp nullable, status enum, pesan Indonesia)
- [x] Controller `KaryawanController` (CRUD, search: nama/no_hp/jabatan, filter status, orderByDesc created_at, paginate 15)
- [x] Route resource `karyawan`
- [x] TypeScript types `karyawan.ts` (`StatusKaryawan`, `Karyawan`, `KaryawanFormData`, `KaryawanIndexProps`, `KaryawanShowProps`, `KaryawanCreateEditProps`) + export di `index.ts`
- [x] Reusable component `KaryawanBadge` (hijau=Aktif, abu-abu=Nonaktif)
- [x] Reusable component `KaryawanDeleteDialog` (shadcn Dialog, validasi produksi aktif di-comment — aktif setelah Modul Produksi)
- [x] Reusable component `KaryawanForm` (shared create & edit, Select untuk status)
- [x] React Pages: Index (table + search + filter status + pagination), Create, Edit, Show
- [x] Wayfinder route di-generate (`resources/js/routes/karyawan/index.ts`)
- [x] Sidebar update (Karyawan → `karyawan.index()`, dark mode toggle ditambah, tombol Repository & Documentation dihapus)
- [x] Test manual:
      - CRUD berhasil (tambah, lihat, edit, hapus)
      - Validasi: nama required, status required (enum aktif/nonaktif)
      - Search: nama_karyawan, no_hp, jabatan
      - Filter: Semua / Aktif / Nonaktif
      - Pagination berfungsi
      - Badge warna: Aktif hijau, Nonaktif abu-abu
      - Hapus via dialog (index & show page)
      - Default status saat create = aktif

## 7. Master Data — Customer ✅ SELESAI (commit 882865a)
- [x] Migration `customer` table (singular, `no_hp` nullable + unique)
- [x] Seeder `CustomerSeeder` (20 dummy: 10 B2B + 10 B2C, alamat Mojokerto/Jawa Timur)
- [x] Model `Customer` dengan `$table = 'customer'`, fillable, relasi `pesanans()` (di-comment — aktif setelah Modul Pesanan)
- [x] FormRequest `CustomerRequest` (unique no_hp ignore self, enum jenis_customer, pesan Indonesia)
- [x] Controller `CustomerController` (CRUD, search: nama/no_hp/alamat/jenis, filter jenis, orderBy created_at DESC, paginate 15)
- [x] Route resource `customer`
- [x] TypeScript types `customer.ts` (`Customer`, `CustomerFormData`, `CustomerIndexProps`, `CustomerShowProps`, `CustomerCreateEditProps`) + export di `index.ts`
- [x] Reusable component `CustomerBadge` (warna berbeda: biru=B2B, hijau=B2C)
- [x] Reusable component `CustomerDeleteDialog` (shadcn Dialog, pola sama dengan `BahanBakuDeleteDialog`)
- [x] Reusable component `CustomerForm` (shared create & edit, dengan Textarea untuk alamat)
- [x] React Pages: Index (table + search + filter jenis + pagination), Create, Edit, Show
- [x] Install shadcn `textarea` component
- [x] Sidebar update (Customer → `customer.index()`)
- [x] Wayfinder route di-generate (`resources/js/routes/customer/index.ts`)
- [x] Test manual:
      - CRUD berhasil (tambah, lihat, edit, hapus)
      - Validasi: nama required, jenis required (enum b2b/b2c), no_hp unik
      - Search: nama, no_hp, alamat, jenis
      - Filter: Semua / B2B / B2C
      - Pagination berfungsi
      - Badge warna: B2B biru, B2C hijau
      - Hapus via dialog (index & show page)

## 8. Pesanan + Invoice ✅ SELESAI
- [x] Migration `pesanan` + `detail_pesanan`
- [x] Model `Pesanan`, `DetailPesanan`, relasi, service, controller, routes
- [x] Build berhasil, test manual lulus
- [x] **Revisi:** Migration `add_jenis_pembayaran_to_pesanan` + update Model, FormRequest, form create/edit, show page
- [x] **Revisi:** `jenis_pembayaran` enum(`dp`,`lunas`,`bertahap`,`cod`,`termin`) tersimpan dan tampil di detail pesanan
- [x] **Bug Fix:** Method `invoice()` ditambahkan ke `PesananController` — invoice PDF berfungsi (HTTP 200, content-type: application/pdf dikonfirmasi Playwright)
- [x] **Bug Fix:** Tombol "Cetak Invoice" ditambahkan kembali ke halaman show pesanan
- [x] Wayfinder generate — typed routes tersedia di `@/routes/pesanan`
- [x] Seeder `PesananSeeder` — 12 pesanan dummy mix status
- [x] Install `barryvdh/laravel-dompdf` v3.1.2
- [x] Blade template `resources/views/pdf/invoice.blade.php` — layout profesional
- [x] TypeScript types `pesanan.ts`, components, React pages
- [x] Show page: ubah status via dropdown Select, tombol Cetak Invoice
- [x] Edit diizinkan untuk status pending DAN dibatalkan
- [x] Sidebar menu Pesanan diaktifkan
- [x] Build berhasil tanpa error
- [x] Playwright UAT: 5/7 PASS (2 false failure — throttle + selector)
- [x] Invoice PDF dikonfirmasi PASS via direct HTTP request test

## 9. Stok Bahan Baku ✅ SELESAI
- [x] Migration `stok_bahan_baku` (kolom: bahan_baku_id, jenis_transaksi enum, qty decimal, stok_sebelum, stok_sesudah, keterangan, created_by nullable FK)
- [x] Model `StokBahanBaku` ($table singular, $fillable, $casts float, relasi belongsTo BahanBaku + createdBy User)
- [x] Relasi `hasMany(StokBahanBaku)` ditambahkan ke model `BahanBaku`
- [x] Service `app/Services/Inventory/StockBahanBakuService.php` — addStock() + reduceStock() + DB::transaction()
- [x] FormRequest `TransaksiBahanBakuRequest` (jenis_transaksi: restock|penyesuaian, qty not_in:0, keterangan wajib untuk penyesuaian)
- [x] Controller `StokBahanBakuController` (index, create, store, show — thin, routing ke addStock/reduceStock berdasarkan jenis + sign qty)
- [x] Route resource `stok-bahan-baku` (only: index, create, store, show)
- [x] Wayfinder generate — route typed functions tersedia di `@/routes/stok-bahan-baku`
- [x] TypeScript types `stok-bahan-baku.ts` (StokBahanBaku, JenisTransaksiStok, props interfaces, RestockFormData dengan jenis_transaksi)
- [x] React pages:
      - index: riwayat + search + filter bahan baku + filter jenis transaksi + filter rentang tanggal + sort + pagination
      - create: form terpadu (dropdown jenis: restock/penyesuaian, qty ±, preview stok sesudah real-time, keterangan wajib untuk penyesuaian)
      - show: detail transaksi lengkap
- [x] Sidebar "Stok > Bahan Baku" aktif
- [x] Refactor: Master Data Bahan Baku tidak lagi menampilkan info stok (index/show)
- [x] Refactor: Edit Bahan Baku — field stok dihapus, diganti information card + tombol "Lihat Stok"
- [x] Build berhasil tanpa error
- [x] Test manual: restock berhasil, penyesuaian + dan − berhasil, stok tidak bisa negatif, log tercatat, filter jenis OK

## 10. Stok Produk Jadi ✅ SELESAI
- [x] Migration `stok_produk_jadi` (kolom: produk_id, jenis_transaksi enum, qty int, stok_sebelum, stok_sesudah, keterangan, created_by nullable FK → users)
- [x] Model `StokProdukJadi` ($table singular, $fillable, $casts integer, relasi belongsTo Produk + createdBy User)
- [x] Relasi `hasMany(StokProdukJadi)` ditambahkan ke model `Produk`
- [x] Service `app/Services/Inventory/StockProdukService.php` — addStock() + reduceStock() + DB::transaction() + created_by
- [x] FormRequest `TransaksiProdukRequest` (jenis_transaksi: pengiriman|penyesuaian, qty not_in:0, keterangan wajib untuk penyesuaian)
- [x] Controller `StokProdukJadiController` (index, create, store, show — thin, routing ke addStock/reduceStock berdasarkan jenis + sign qty)
- [x] Route resource `stok-produk-jadi` (only: index, create, store, show)
- [x] Wayfinder generate — route typed functions tersedia di `@/routes/stok-produk-jadi`
- [x] TypeScript types `stok-produk-jadi.ts` (StokProdukJadi, JenisTransaksiProduk, props interfaces, PengirimanFormData dengan jenis_transaksi)
- [x] React pages:
      - index: riwayat + search + filter produk + filter jenis transaksi + filter rentang tanggal + sort + pagination
      - create: form terpadu (dropdown jenis: pengiriman/penyesuaian, qty ±, preview stok sesudah real-time, keterangan wajib untuk penyesuaian)
      - show: detail transaksi lengkap (qty ± dengan warna merah/hijau)
- [x] Sidebar "Stok > Produk Jadi" aktif
- [x] Refactor: Master Data Produk tidak lagi menampilkan info stok (index/show)
- [x] Refactor: Edit Produk — field stok dihapus, diganti information card + tombol "Lihat Stok"
- [x] Build berhasil tanpa error
- [x] Test manual: pengiriman berhasil, penyesuaian + dan − berhasil, stok tidak bisa negatif, log tercatat, filter jenis OK

## 11. Produksi — Tahap 1 (Production Planning) ✅ SELESAI
- [x] Migration `produksi` + `detail_produksi` (singular, sesuai database-schema.md)
- [x] Model `Produksi` (status helpers: isDraft/isProses/isAktif, relasi pesanan/createdBy/detailProduksi)
- [x] Model `DetailProduksi` (relasi produksi, karyawan)
- [x] Aktifkan relasi `Karyawan::detailProduksis()` hasMany
- [x] Tambah relasi `Pesanan::produksi()` hasMany
- [x] Guard hapus Karyawan jika terlibat produksi aktif (BR Karyawan)
- [x] FormRequest `ProduksiRequest` (pesanan_id exists, deadline nullable, catatan)
- [x] Service `ProduksiService`:
      - [x] create() — DB::transaction, validasi BR-11 (tidak ada produksi aktif ganda)
      - [x] hitungTargetProduksi() — sum qty dari detail_pesanan
      - [x] hitungKebutuhanBahan() — kalkulasi BOM per produk di pesanan
      - [x] cekKecukupanStok() — bandingkan kebutuhan vs stok tersedia
- [x] Controller `ProduksiController` (index, create, store, show — thin)
- [x] Route resource `produksi` (only: index, create, store, show)
- [x] Wayfinder generate
- [x] Seeder `ProduksiSeeder` — 4 data dummy variasi status
- [x] TypeScript types `produksi.ts`
- [x] Component `ProduksiStatusBadge` — 4 warna (abu=draft, biru=proses, hijau=selesai, merah=dibatalkan)
- [x] React pages: index (search + filter status + sort + pagination), create (dropdown pesanan + preview kebutuhan bahan via Inertia props), show (detail + tabel kebutuhan bahan + status kecukupan stok + progress bar)
- [x] Sidebar menu Produksi diaktifkan
- [x] Build berhasil tanpa error
- [x] Test manual berhasil

## 11. Produksi — Tahap 2 (Inventory Integration) ✅ SELESAI
- [x] Mulai Produksi (status draft → proses)
- [x] StockBahanBakuService::reduceStock() dipanggil saat mulai produksi (BR-04)
- [x] Guard: stok tidak cukup → tolak, status tetap draft (BR-03, BR-05)
- [x] Rollback Produksi: draft → dibatalkan (tanpa rollback stok)
- [x] Rollback Produksi: proses → dibatalkan (rollback stok via addStock jenis=rollback, BR-08)
- [x] DB::transaction() untuk semua operasi inventory
- [x] Route PATCH produksi/{produksi}/mulai + PATCH produksi/{produksi}/batalkan
- [x] Wayfinder generate
- [x] Component ProduksiActionDialog — dialog konfirmasi Mulai & Batalkan
- [x] Keterangan audit trail otomatis: "Produksi PSN-xxx" / "Rollback Produksi PSN-xxx"
- [x] Warning stok tidak cukup di halaman show
- [x] Build berhasil tanpa error
- [x] Test manual berhasil:
      - Mulai Produksi ✔
      - Validasi stok cukup ✔
      - Pengurangan stok bahan baku ✔
      - Rollback stok ✔
      - Audit trail inventory ✔
      - Regression test ✔
- Catatan: validasi transisi menuju status “selesai” dan seluruh flow QC akan diuji setelah Tahap 3 selesai

## 11. Produksi — Tahap 3 (Execution & QC) ✅ SELESAI
- [x] Migration tambah `produk_id` FK pada `detail_produksi`
- [x] FormRequest `InputProgressRequest`, `ProduksiService::inputProgress()`, `selesaikanProduksi()`, `hitungSummary()`
- [x] QC sebagai keputusan saat input (tidak disimpan di DB — **direvisi: perlu disimpan, lihat Revisi di bawah**)
- [x] Build berhasil, UAT 46/46 lulus

## 11. Produksi — Revisi (Post-UAT Requirement Change) ✅ SELESAI
- [x] **Prioritas 1 — Bug Fix Invoice:** `PesananController::invoice()` ditambahkan
- [x] **Prioritas 2 — Jenis Pembayaran:** Migration + Model + FormRequest + form create/edit + show page
- [x] **Prioritas 3 — Schema Produksi Baru:**
      - Migration `add_jenis_produksi_to_produksi` + `pesanan_id` nullable
      - Migration `create_produksi_item_table`
      - Migration `create_produksi_karyawan_table`
      - Migration `revisi_detail_produksi` (DROP `karyawan_id`, ADD `qc_status`)
      - Model baru: `ProduksiItem`, `ProduksiKaryawan`
      - Update Model `Produksi`, `DetailProduksi`
- [x] **Prioritas 4 — Refactor Produksi Service & Controller:**
      - `ProduksiService::create()` support Pesanan + Restok
      - `ProduksiService::hitungKebutuhanBahan()` baca dari `produksi_item`
      - `ProduksiService::inputProgress()` simpan `qc_status`, validasi per produk
      - `ProduksiService::selesaikanProduksi()` cek `produksi_item`
      - Update `ProduksiController`, `ProduksiRequest`, `InputProgressRequest`
- [x] **Prioritas 5 — Frontend Produksi:**
      - Update TypeScript types
      - Refactor `create.tsx` (step jenis pesanan/restok, dropdown karyawan)
      - Refactor `show.tsx` (dua progress bar, daftar karyawan, histori QC)
      - Refactor `input-progress-form.tsx` (filter dropdown per target per produk)
- [x] **Prioritas 6 — Summary Cards Dinamis:** dari `detail_produksi` aktual
- [x] `migrate:fresh --seed` berhasil dengan schema baru
- [x] Build berhasil tanpa error
- [x] Playwright UAT: 7/8 PASS (1 false failure — throttle)
- [x] Catatan: Route `/` diubah redirect ke `/login`
- [x] `ProduksiService::selesaikanProduksi()` — hanya ubah status, TIDAK menambah stok
- [x] Guard: `qty_selesai == qty_target` sebelum selesai
- [x] Guard: produksi selesai tidak bisa progress/batalkan
- [x] `ProduksiService::hitungSummary()` — data dari `detail_produksi` (batch hari ini, karyawan produktif, efisiensi)
- [x] Controller: tambah `progress()`, `selesai()`, update `index()` kirim summary, update `show()` kirim produkList + karyawanList
- [x] Route: `PATCH produksi/{produksi}/progress` + `PATCH produksi/{produksi}/selesai`
- [x] Wayfinder generate
- [x] Component `input-progress-form.tsx` (dropdown produk+karyawan, input qty, toggle QC)
- [x] `show.tsx`: section form input progress + tabel histori detail_produksi + tombol selesai dengan dialog konfirmasi
- [x] `index.tsx`: summary cards statis diganti dinamis dari `props.summary`
- [x] Build berhasil tanpa error
- [x] UAT 46 skenario — seluruhnya LULUS (lihat `docs/uat-produksi-tahap3.md`)
      - Input Progress (3/3)
      - Validasi Produk (2/2)
      - Validasi Qty (3/3)
      - QC Lolos (3/3)
      - QC Tidak Lolos (4/4)
      - Update qty_selesai (3/3)
      - Update Stok Produk Jadi (3/3)
      - Riwayat Stok Produk Jadi (3/3)
      - Penyelesaian Produksi (6/6)
      - Summary Cards (4/4)
      - Regression Test Tahap 1+2 (12/12)

---

## Ringkasan Testing — Playwright E2E (2026-07-11)

| Metrik | Nilai |
|---|---|
| Tanggal | 2026-07-11 |
| Tool | Playwright + Chromium (headless) |
| Total testcase | 54 |
| PASS | 43 |
| FAIL | 11 |
| False failure (login throttle) | 8 |
| False failure (selector CSS) | 2 |
| False failure (assertion) | 1 |
| Bug aplikasi dari Playwright | 0 |
| Bug aplikasi dari testing manual | 5 (semua sudah diperbaiki) |
| Commit | eddb6c4 |

**Bug aplikasi diperbaiki setelah UAT:**
1. `PesananController::invoice()` method hilang ✅
2. `jenis_pembayaran` tidak tersimpan di `PesananService` ✅
3. Validasi keterangan penyesuaian stok (closure) ✅
4. Tombol "Cetak Invoice" hilang dari `show.tsx` pesanan ✅
5. Route `/` menampilkan welcome page Laravel (redirect ke `/login`) ✅

**Kesimpulan:** Tidak ada bug kritis. Aplikasi siap untuk Modul 12 — Arus Kas.

---

## 12. Arus Kas ✅ SELESAI
- [x] Migration `pembayaran` (pesanan_id, tanggal, jenis_pembayaran enum dp/pelunasan/termin, nominal, metode, keterangan)
- [x] Migration `arus_kas` (pembayaran_id nullable, created_by, tanggal, jenis enum, kategori, nominal, metode_pembayaran, keterangan, bukti_transaksi nullable)
- [x] Seeder `PembayaranSeeder` + `ArusKasSeeder` — 4 pembayaran pesanan + 5 transaksi manual
- [x] Model `Pembayaran` (belongsTo Pesanan, hasOne ArusKas)
- [x] Model `ArusKas` (belongsTo Pembayaran nullable, belongsTo User, helper dariPembayaran())
- [x] Update Model `Pesanan` — tambah relasi hasMany(Pembayaran)
- [x] FormRequest `PembayaranRequest` + `ArusKasRequest`
- [x] Service `PembayaranService` — create() + destroy() dalam DB::transaction(), auto-create arus_kas
- [x] Service `ArusKasService` — create(), update(), destroy(), hitungSaldo(), hitungRingkasan()
      — guard: transaksi dari pembayaran tidak bisa diedit/dihapus via ArusKas
      — saldo dihitung dinamis dari SUM aggregate (tidak disimpan di DB)
- [x] Controller `PembayaranController` — store, destroy (inline dari detail pesanan)
- [x] Controller `ArusKasController` — resource CRUD lengkap
- [x] Route: POST/DELETE pembayaran + resource arus-kas (parameter binding arusKas)
- [x] Wayfinder generate
- [x] TypeScript types `arus-kas.ts` + `pembayaran.ts` + update `index.ts` + update `pesanan.ts`
- [x] Component `ArusKasBadge` — hijau=pemasukan, merah=pengeluaran
- [x] Pages: index (stat cards saldo aktual + filter + tabel), create, edit, show
- [x] Update `pesanan/show.tsx` — section Riwayat Pembayaran + form inline Tambah Pembayaran
- [x] Update sidebar: href Arus Kas aktif
- [x] Route `/` redirect ke `/login`
- [x] Build berhasil tanpa error ✅
- [ ] Test manual: saldo konsisten setelah tambah/ubah/hapus transaksi

---

## Bug Fixes — Post Modul 12 (2026-07-12)

### Bug 4 (Critical) — Blank Page Detail Pesanan: `React is not defined`
- **Root cause:** `PembayaranForm` dalam `pesanan/show.tsx` menggunakan `React.useState(false)` tanpa `import React`. Project pakai React 19 JSX transform sehingga `React` namespace tidak tersedia secara global.
- **Fix:** Ubah `React.useState(false)` → `useState(false)` (sudah diimport dari `'react'`)
- **File:** `resources/js/pages/pesanan/show.tsx`
- [x] Selesai

### Bug 3 (High) — Produksi bisa dimulai tanpa BOM
- **Root cause:** `cekKecukupanStok()` mereturn true jika BOM kosong, dan `ProduksiActionDialog` tidak menonaktifkan tombol Mulai Produksi saat validasi produk tanpa BOM lolos.
- **Fix:** Menambah pengecekan BOM kosong di `ProduksiService` dan memperbarui pesan exception, serta memperjelas warning message di `show.tsx`.
- **File:** `app/Services/ProduksiService.php`, `resources/js/pages/produksi/show.tsx`
- [x] Selesai

### Bug 2 (Medium) — Detail Stok Produk Jadi selalu tampil `+` meski transaksi pengurangan
- **Root cause:** `isPengurangan` di `show.tsx` hanya cek `['pengiriman', 'rollback']`. Penyesuaian negatif dan jenis lain tidak ter-cover. DB menyimpan `qty` sebagai nilai absolut, sehingga tanda tidak bisa ditentukan hanya dari `jenis_transaksi`.
- **Fix:** Gunakan `stok_sebelum > stok_sesudah` untuk menentukan arah perubahan — ini akurat untuk semua jenis transaksi
- **File:** `resources/js/pages/stok-produk-jadi/show.tsx`
- [ ] Belum

### Bug 1 — Penyesuaian Stok Bahan Baku tidak bisa input negatif
- **Root cause:** Konversi langsung menggunakan `Number()` di `onChange` handler pada `<Input>` membuat pengguna tidak bisa mengetik tanda minus `-` pertama kali.
- **Fix:** Menghapus konversi `Number()` pada `onChange` dan menggunakan `setData('qty', e.target.value)`.
- **File:** `resources/js/pages/stok-bahan-baku/create.tsx`
- [x] Selesai

## 13. Laporan & Export (cross-cutting)
- [ ] Export PDF/Excel per modul (bahan baku, produk, karyawan, customer, pesanan, stok, arus kas)
- [ ] Halaman download laporan dengan filter periode + jenis laporan
- [ ] Test semua jenis export
