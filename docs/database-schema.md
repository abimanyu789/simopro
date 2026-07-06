# Database Schema (FINAL) — sesuai Gambar 4.16/4.17 (ERD & Struktur Database)

Sumber: diagram ERD final. Revisi ini menutup 2 keputusan terbuka dari draft sebelumnya:
`user` → `users` (ikut konvensi Laravel), dan menambahkan tabel riwayat stok yang memang
disyaratkan Bab IV (Tabel 4.4) tapi belum ada di diagram awal.

## Daftar tabel & kolom

### `users` *(direname dari `user` di diagram — ikut konvensi Laravel, tanpa override)*
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint | PK |
| nama | varchar(255) | |
| email | varchar(255) | unique |
| password | varchar(255) | |
| role | enum | `admin` (single value untuk saat ini, forward-compatible kalau nanti nambah role) |
| created_at / updated_at | timestamp | |

### `customer`
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint | PK |
| nama_customer | varchar(255) | |
| jenis_customer | enum | `b2b`, `b2c` |
| no_hp | varchar(25) | nullable |
| alamat | text | nullable |
| created_at / updated_at | timestamp | |

### `karyawan`
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint | PK |
| nama_karyawan | varchar(255) | |
| jabatan | varchar(100) | nullable |
| no_hp | varchar(25) | nullable |
| status | enum | `aktif`, `nonaktif` |
| created_at / updated_at | timestamp | |

### `bahan_baku`
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint | PK |
| kode_bahan | varchar(50) | unique |
| nama_bahan | varchar(255) | |
| satuan | varchar(50) | nullable |
| stok | decimal(12,2) | current stock — sumber utama jumlah, BUKAN riwayat |
| minimum_stok | decimal(12,2) | nullable |
| created_at / updated_at | timestamp | |

### `produk`
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint | PK |
| kode_produk | varchar(50) | unique |
| nama_produk | varchar(255) | |
| ukuran | varchar(30) | nullable |
| warna | varchar(50) | nullable |
| harga_jual | decimal(15,2) | nullable |
| stok | int | current stock produk jadi |
| minimum_stok | int | nullable |
| bom_category_id | bigint | FK → `bom_categorie.id`, nullable |
| created_at / updated_at | timestamp | |

### `bom_categorie` (header/kategori komposisi BOM)
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint | PK |
| nama_bom | varchar(255) | |
| keterangan | text | nullable |
| created_at / updated_at | timestamp | |

### `bom_detail` (rincian bahan per kategori BOM)
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint | PK |
| bom_category_id | bigint | FK → `bom_categorie.id` |
| bahan_baku_id | bigint | FK → `bahan_baku.id` |
| qty_per_pair | decimal(12,2) | kebutuhan bahan per 1 pasang produk |
| created_at / updated_at | timestamp | |

### `pesanan`
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint | PK |
| customer_id | bigint | FK → `customer.id` |
| created_by | bigint | FK → `users.id` |
| nomor_pesanan | varchar(100) | unique, auto-generated |
| tanggal | date | |
| status | enum | `pending`, `proses`, `done`, `cancel` |
| subtotal | decimal(15,2) | |
| diskon | decimal(15,2) | |
| ongkir | decimal(15,2) | |
| total | decimal(15,2) | |
| keterangan | text | nullable |
| created_at / updated_at | timestamp | |

### `detail_pesanan`
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint | PK |
| pesanan_id | bigint | FK → `pesanan.id` |
| produk_id | bigint | FK → `produk.id` |
| qty | int | |
| harga | decimal(15,2) | |
| subtotal | decimal(15,2) | |
| created_at / updated_at | timestamp | |

### `produksi`
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint | PK |
| pesanan_id | bigint | FK → `pesanan.id` |
| created_by | bigint | FK → `users.id` |
| deadline | date | |
| qty_target | int | |
| qty_selesai | int | |
| status | enum | `draft`, `proses`, `done`, `cancel` |
| status_qc | enum | `belum_dicek`, `lolos`, `tidak_lolos` |
| catatan | text | nullable |
| created_at / updated_at | timestamp | |

### `detail_produksi`
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint | PK |
| produksi_id | bigint | FK → `produksi.id` |
| karyawan_id | bigint | FK → `karyawan.id` |
| qty_selesai | int | |
| created_at / updated_at | timestamp | |

### `pembayaran`
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint | PK |
| pesanan_id | bigint | FK → `pesanan.id` |
| tanggal | date | |
| jenis_pembayaran | enum | `dp`, `pelunasan` |
| nominal | decimal(15,2) | |
| metode | varchar(100) | nullable |
| keterangan | text | nullable |
| created_at / updated_at | timestamp | |

### `arus_kas`
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint | PK |
| pembayaran_id | bigint | FK → `pembayaran.id`, nullable (null kalau bukan dari pembayaran pesanan) |
| created_by | bigint | FK → `users.id` |
| tanggal | date | |
| jenis | enum | `pemasukan`, `pengeluaran` |
| kategori | varchar(100) | |
| nominal | decimal(15,2) | |
| metode_pembayaran | varchar(100) | nullable |
| keterangan | text | nullable |
| bukti_transaksi | varchar(255) | nullable — path/nama file |
| created_at / updated_at | timestamp | |

### `stok_bahan_baku` *(BARU — riwayat perubahan stok bahan baku, sesuai Bab IV Tabel 4.4 data #14 & BR-05 Kelola Stok Bahan Baku)*
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint | PK |
| bahan_baku_id | bigint | FK → `bahan_baku.id` |
| jenis_perubahan | enum | `restock`, `produksi`, `cancel_produksi`, `penyesuaian` |
| jumlah | decimal(12,2) | selisih perubahan (+ nambah, - kurang) |
| stok_sebelum | decimal(12,2) | snapshot sebelum perubahan |
| stok_sesudah | decimal(12,2) | snapshot sesudah perubahan |
| referensi_id | bigint | nullable — id produksi terkait (kalau jenis = produksi/cancel_produksi) |
| keterangan | text | nullable |
| created_by | bigint | FK → `users.id` |
| created_at | timestamp | |

### `stok_produk_jadi` *(BARU — riwayat perubahan stok produk jadi, sesuai Bab IV Tabel 4.4 data #15 & BR-04 Kelola Stok Produk Jadi)*
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint | PK |
| produk_id | bigint | FK → `produk.id` |
| jenis_perubahan | enum | `produksi`, `pengiriman`, `penyesuaian` |
| jumlah | decimal(12,2) | selisih perubahan (+ nambah, - kurang) |
| stok_sebelum | decimal(12,2) | snapshot sebelum perubahan |
| stok_sesudah | decimal(12,2) | snapshot sesudah perubahan |
| referensi_id | bigint | nullable — id produksi/pesanan terkait |
| keterangan | text | nullable |
| created_by | bigint | FK → `users.id` |
| created_at | timestamp | |

## Relasi antar tabel

- `customer` 1—n `pesanan` (pesanan.customer_id)
- `users` 1—n `pesanan`, `produksi`, `arus_kas`, `stok_bahan_baku`, `stok_produk_jadi` (created_by)
- `pesanan` 1—n `detail_pesanan` (detail_pesanan.pesanan_id)
- `produk` 1—n `detail_pesanan` (detail_pesanan.produk_id)
- `produk` n—1 `bom_categorie` (produk.bom_category_id)
- `bom_categorie` 1—n `bom_detail` (bom_detail.bom_category_id)
- `bahan_baku` 1—n `bom_detail` (bom_detail.bahan_baku_id)
- `pesanan` 1—n `produksi` (produksi.pesanan_id)
- `produksi` 1—n `detail_produksi` (detail_produksi.produksi_id)
- `karyawan` 1—n `detail_produksi` (detail_produksi.karyawan_id)
- `pesanan` 1—n `pembayaran` (pembayaran.pesanan_id)
- `pembayaran` 1—n `arus_kas` (arus_kas.pembayaran_id)
- `bahan_baku` 1—n `stok_bahan_baku` (log riwayat)
- `produk` 1—n `stok_produk_jadi` (log riwayat)

## Catatan implementasi

- Semua nama tabel **singular** (`produk`, `pesanan`, `customer`, `karyawan`, `produksi`,
  `pembayaran`, `bahan_baku`, `bom_categorie`, `bom_detail`, `arus_kas`, `detail_pesanan`,
  `detail_produksi`, `stok_bahan_baku`, `stok_produk_jadi`) **kecuali `users`** (plural,
  ikut konvensi default Laravel untuk auth — sengaja tidak di-override supaya kompatibel
  langsung dengan starter kit).
- Setiap Eloquent Model selain `User` wajib deklarasi eksplisit
  `protected $table = 'nama_tabel_singular';` karena Laravel secara default menebak nama
  tabel jamak dari nama model.
- Kolom `stok` di `bahan_baku`/`produk` adalah **sumber utama** jumlah stok saat ini (dibaca
  di halaman list/dashboard). Tabel `stok_bahan_baku`/`stok_produk_jadi` adalah **log
  riwayat saja** — setiap kali stok berubah, keduanya harus diupdate bersamaan dalam satu
  `DB::transaction()` (update kolom `stok` + insert baris log), supaya tidak pernah
  out-of-sync.
- Semua foreign key pakai `onDelete('restrict')`, bukan `cascade` — banyak business rule
  yang melarang penghapusan data yang masih dipakai (lihat `business-rules.md`).
- Nilai enum (`role`, `status_qc`, `jenis_pembayaran`) di atas adalah rekomendasi final —
  ganti isi array-nya di migration kalau kebutuhan aslimu beda, tidak mempengaruhi struktur
  lain.
