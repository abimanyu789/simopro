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

## 8. Pesanan + Invoice
- [ ] Migration `pesanan` + `detail_pesanan` (singular, sesuai database-schema.md — bukan `pesanans`)
- [ ] Model + relasi Customer, Produk
- [ ] Service: hitung subtotal & total otomatis
- [ ] Controller (create multi-item, update status, cetak invoice PDF)
- [ ] React page (form pesanan, list, detail, invoice)
- [ ] Test: multi produk per pesanan, status flow, invoice PDF

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
- [ ] Test manual: restock berhasil, penyesuaian + dan − berhasil, stok tidak bisa negatif, log tercatat, filter jenis OK

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
- [ ] Test manual: pengiriman berhasil, penyesuaian + dan − berhasil, stok tidak bisa negatif, log tercatat, filter jenis OK

## 11. Produksi (modul paling kompleks — pecah lagi jika perlu jadi beberapa sesi)
- [ ] Migration `produksi` + `detail_produksi` (singular, sesuai database-schema.md — bukan `produksis`)
- [ ] Service: hitung kebutuhan bahan dari BOM, cek stok, potong stok bahan (DB::transaction)
- [ ] Service: update progres → tambah stok produk jadi (DB::transaction)
- [ ] Service: cancel produksi → kembalikan stok bahan (DB::transaction)
- [ ] Controller + React page
- [ ] Test: stok cukup vs tidak cukup, update progres bertahap, cancel

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
