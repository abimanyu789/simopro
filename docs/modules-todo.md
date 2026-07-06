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

## 4. Master Data — Produk
- [ ] Migration + Seeder
- [ ] Model + FormRequest
- [ ] Controller CRUD + filter/search/import/export
- [ ] React page
- [ ] Test CRUD + validasi "produk harus punya BOM" (setelah modul BOM selesai)

## 5. Bill of Materials (BOM)
- [ ] Migration `bom_categorie` + `bom_detail` (singular, sesuai database-schema.md — bukan `boms`/`bom_details`)
- [ ] Model + relasi ke Produk & BahanBaku
- [ ] Service: hitung total kebutuhan bahan
- [ ] Controller + React page (form tambah/edit komposisi)
- [ ] Test: 1 produk 1 BOM aktif, qty tidak boleh 0

## 6. Master Data — Karyawan
- [ ] Migration + Seeder
- [ ] Model + FormRequest
- [ ] Controller CRUD
- [ ] React page
- [ ] Test CRUD + rule "tidak bisa dihapus jika masih ada produksi aktif"

## 7. Master Data — Customer
- [ ] Migration + Seeder
- [ ] Model + FormRequest (`no_hp` unik — sesuai database-schema.md, bukan `no_telp`)
- [ ] Controller CRUD
- [ ] React page
- [ ] Test CRUD

## 8. Pesanan + Invoice
- [ ] Migration `pesanan` + `detail_pesanan` (singular, sesuai database-schema.md — bukan `pesanans`)
- [ ] Model + relasi Customer, Produk
- [ ] Service: hitung subtotal & total otomatis
- [ ] Controller (create multi-item, update status, cetak invoice PDF)
- [ ] React page (form pesanan, list, detail, invoice)
- [ ] Test: multi produk per pesanan, status flow, invoice PDF

## 9. Stok Bahan Baku
- [ ] Migration `stok_bahan_baku` (log, singular — sesuai database-schema.md, bukan `stok_bahan_bakus`)
- [ ] Service: restock manual + catat log
- [ ] Controller + React page
- [ ] Test: stok tidak boleh negatif, log tercatat

## 10. Stok Produk Jadi
- [ ] Migration `stok_produk_jadi` (log, singular — sesuai database-schema.md, bukan `stok_produk_jadis`)
- [ ] Service: catat pengiriman + log
- [ ] Controller + React page
- [ ] Test: stok tidak boleh negatif, log tercatat

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
