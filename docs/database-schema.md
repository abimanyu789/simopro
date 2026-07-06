# Database Schema (usulan) — verifikasi ke ERD asli sebelum bikin migration!

⚠️ File ini disusun dari deskripsi teks di Bab IV (Tabel 4.4 Analisis Data & 4.2.5 Struktur
Database). Skripsi tidak mencantumkan detail kolom/tipe data di teks, hanya di gambar ERD
(Gambar 4.16) & Struktur Database (Gambar 4.17) yang ada di folder `diagram/` kamu.
**Cek ulang nama tabel, kolom, dan tipe data terhadap gambar tersebut** sebelum bikin
migration — anggap isi file ini sebagai starting point, bukan kebenaran mutlak.

## Daftar tabel

| Tabel | Fungsi | Kolom kunci (usulan) |
|---|---|---|
| `users` | Akun admin | id, name, email (unik), password |
| `customers` | Data pelanggan B2B/B2C | id, nama, jenis (enum b2b/b2c), no_telp (unik), alamat |
| `produks` | Master produk sepatu | id, kode_produk (unik), nama, kategori, warna, harga_jual, status |
| `bahan_bakus` | Master bahan baku | id, kode_bahan (unik), nama, satuan, stok |
| `boms` | Header BOM per produk | id, produk_id (FK, 1 BOM aktif per produk) |
| `bom_details` | Rincian bahan per BOM | id, bom_id (FK), bahan_baku_id (FK), qty |
| `karyawans` | Data tukang/karyawan | id, nama, status (aktif/nonaktif) |
| `pesanans` | Header pesanan | id, customer_id (FK), tanggal, status (pending/proses/done/cancel), diskon, catatan, total |
| `detail_pesanans` | Item produk per pesanan | id, pesanan_id (FK), produk_id (FK), qty, harga, subtotal |
| `produksis` | Header produksi | id, pesanan_id (FK), tanggal_target, status (draft/proses/done/cancel), status_qc, catatan |
| `detail_produksis` | Karyawan & hasil per produksi | id, produksi_id (FK), karyawan_id (FK), jumlah_selesai |
| `pembayarans` | Riwayat pembayaran pesanan | id, pesanan_id (FK), tanggal, nominal, metode |
| `arus_kas` | Transaksi keuangan | id, jenis (pemasukan/pengeluaran), kategori, pesanan_id (nullable FK), nominal, tanggal, metode, keterangan, bukti_file |
| `stok_bahan_bakus` | Riwayat perubahan stok bahan baku | id, bahan_baku_id (FK), jenis_perubahan (restock/produksi/cancel/penyesuaian), jumlah, keterangan |
| `stok_produk_jadis` | Riwayat perubahan stok produk jadi | id, produk_id (FK), jenis_perubahan (produksi/pengiriman/penyesuaian), jumlah, keterangan |

## Catatan penting
- Skripsi menyebut nama tabel BOM sebagai `bom_categorie` di teks Bab 4.2.5 — kemungkinan
  typo/inkonsistensi penamaan. Cek gambar Struktur Database untuk nama tabel BOM yang
  sebenarnya dipakai, lalu samakan di sini.
- Stok "current" (jumlah stok sekarang) disimpan di tabel `bahan_bakus` / `produks` itu
  sendiri; tabel `stok_bahan_bakus` / `stok_produk_jadis` adalah **log riwayat perubahan**,
  bukan sumber utama jumlah stok — jangan sampai terbalik logikanya.
- Semua foreign key sebaiknya pakai `onDelete('restrict')`, bukan `cascade`, karena banyak
  business rule yang melarang penghapusan data yang masih dipakai (lihat business-rules.md).
