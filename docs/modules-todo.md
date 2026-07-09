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
- [ ] **Revisi:** Tambah kolom `jenis_pembayaran` enum(`dp`,`lunas`,`bertahap`,`cod`,`termin`) ke tabel `pesanan`
- [ ] **Revisi:** Update form Create/Edit Pesanan untuk field `jenis_pembayaran`
- [ ] **Bug Fix:** Tambah method `invoice()` ke `PesananController` (method hilang, route sudah ada, blade+dompdf sudah ada)
- [x] Wayfinder generate — typed routes tersedia di `@/routes/pesanan`
- [x] Seeder `PesananSeeder` — 12 pesanan dummy mix status
- [x] Install `barryvdh/laravel-dompdf` v3.1.2
- [x] Blade template `resources/views/pdf/invoice.blade.php` — layout profesional (logo, info perusahaan, customer, tabel item, ringkasan, footer)
- [x] TypeScript types `pesanan.ts` (StatusPesanan, Pesanan, DetailPesanan, PesananFormData, props interfaces)
- [x] Component `PesananStatusBadge` — 4 warna (kuning=pending, biru=proses, hijau=selesai, merah=dibatalkan)
- [x] Component `PesananDeleteDialog`
- [x] Component `PesananForm` — multi-item, toggle diskon persen/nominal, preview total real-time, fix stale closure bug pada handleProdukChange
- [x] React pages: index (search + filter status + sort + pagination), create, edit, show
- [x] Show page: ubah status via dropdown Select, tombol Cetak Invoice (stream PDF di tab baru)
- [x] Edit diizinkan untuk status pending DAN dibatalkan (hanya selesai yang tidak bisa diedit)
- [x] Detail produk: BOM dan riwayat stok ditampilkan dinamis (load relasi di controller)
- [x] Fix: field "Dibuat oleh" menampilkan nama admin dari relasi createdBy
- [x] Sidebar menu Pesanan diaktifkan
- [x] Build berhasil tanpa error
- [x] Test manual: buat pesanan multi-item, kalkulasi total benar, status flow pending→proses→selesai/dibatalkan, cetak invoice PDF berfungsi

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

## 11. Produksi — Revisi (Post-UAT Requirement Change)
- [ ] **Bug Fix:** `PesananController::invoice()` — method hilang, perlu ditambahkan
- [ ] **Pesanan:** Tambah `jenis_pembayaran` ke tabel `pesanan` (migration + model + form + validasi)
- [ ] **Produksi:** Migration `pesanan_id` nullable + tambah `jenis_produksi` enum(`pesanan`,`restok`) ke tabel `produksi`
- [ ] **Produksi:** Migration tabel baru `produksi_item` (produksi_id, produk_id, qty_target) — sumber target per produk
- [ ] **Produksi:** Migration tambah `qc_status` enum(`lolos`,`tidak_lolos`) ke `detail_produksi`
- [ ] **Produksi:** Revisi form create produksi — step 1 pilih jenis (pesanan/restok), step 2 berbeda per jenis
- [ ] **Produksi:** Revisi `ProduksiService` — support restok, hitungKebutuhanBahan dari produksi_item
- [ ] **Produksi:** Revisi dropdown progress — hanya tampil produk yang qty lolos QC < qty_target per produk
- [ ] **Produksi:** Tambah dua progress bar di halaman show (Progress Produksi + Progress QC)
- [ ] **Produksi:** Simpan qc_status di detail_produksi saat input progress
- [ ] Test manual semua revisi
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

## 12. Arus Kas
- [ ] Migration arus_kas
- [ ] Service: hitung ulang saldo otomatis tiap transaksi
- [ ] Integrasi: pembayaran pesanan otomatis buat entry arus kas
- [ ] Controller + React page (form transaksi, grafik, insight card)
- [ ] Test: saldo konsisten setelah tambah/ubah/hapus transaksi

## 13. Laporan & Export (cross-cutting)
- [ ] Export PDF/Excel per modul (bahan baku, produk, karyawan, customer, pesanan, stok, arus kas)
- [ ] Halaman download laporan dengan filter periode + jenis laporan
- [ ] Test semua jenis export
