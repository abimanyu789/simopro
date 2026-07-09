# Database Schema (FINAL) — sesuai DDL SQL final

Sumber: SQL DDL final (lihat lampiran di bawah). File ini adalah dokumentasi naratif dari
DDL tersebut — kalau ada perbedaan antara tabel di bawah dan SQL, **SQL yang benar**, laporkan
supaya file ini diperbaiki lagi.

## Daftar tabel & kolom

### `users`
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint unsigned | PK |
| nama | varchar(255) | NOT NULL |
| email | varchar(255) | NOT NULL, unique |
| password | varchar(255) | NOT NULL |
| role | enum(`admin`) | NOT NULL, default `admin` |
| created_at / updated_at | timestamp | nullable |

### `customer`
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint unsigned | PK |
| nama_customer | varchar(255) | NOT NULL |
| jenis_customer | enum(`b2b`,`b2c`) | NOT NULL |
| no_hp | varchar(25) | nullable |
| alamat | text | nullable |
| created_at / updated_at | timestamp | nullable |

### `karyawan`
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint unsigned | PK |
| nama_karyawan | varchar(255) | NOT NULL |
| jabatan | varchar(100) | nullable |
| no_hp | varchar(25) | nullable |
| status | enum(`aktif`,`nonaktif`) | NOT NULL |
| created_at / updated_at | timestamp | nullable |

### `bahan_baku`
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint unsigned | PK |
| kode_bahan | varchar(50) | NOT NULL, unique |
| nama_bahan | varchar(255) | NOT NULL |
| satuan | varchar(50) | nullable |
| stok | decimal(12,2) | NOT NULL, default 0 — current stock |
| minimum_stok | decimal(12,2) | nullable |
| created_at / updated_at | timestamp | nullable |

### `bom_categorie` (header/kategori komposisi BOM)
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint unsigned | PK |
| nama_bom | varchar(255) | NOT NULL |
| keterangan | text | nullable |
| created_at / updated_at | timestamp | nullable |

### `produk`
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint unsigned | PK |
| kode_produk | varchar(50) | NOT NULL, unique |
| nama_produk | varchar(255) | NOT NULL |
| ukuran | varchar(30) | nullable |
| warna | varchar(50) | nullable |
| harga_jual | decimal(15,2) | nullable |
| stok | int | NOT NULL, default 0 — current stock |
| minimum_stok | int | nullable |
| bom_category_id | bigint unsigned | nullable, FK → `bom_categorie.id` (RESTRICT) |
| created_at / updated_at | timestamp | nullable |

### `bom_detail` (rincian bahan per kategori BOM)
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint unsigned | PK |
| bom_category_id | bigint unsigned | NOT NULL, FK → `bom_categorie.id` (RESTRICT) |
| bahan_baku_id | bigint unsigned | NOT NULL, FK → `bahan_baku.id` (RESTRICT) |
| qty_per_pair | decimal(12,2) | NOT NULL — kebutuhan bahan per 1 pasang produk |
| created_at / updated_at | timestamp | nullable |

### `pesanan`
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint unsigned | PK |
| customer_id | bigint unsigned | NOT NULL, FK → `customer.id` (RESTRICT) |
| created_by | bigint unsigned | NOT NULL, FK → `users.id` (RESTRICT) |
| nomor_pesanan | varchar(100) | unique, auto-generated |
| tanggal | date | NOT NULL |
| status | enum(`pending`,`proses`,`selesai`,`dibatalkan`) | NOT NULL |
| subtotal | decimal(15,2) | nullable |
| diskon | decimal(15,2) | nullable |
| ongkir | decimal(15,2) | nullable |
| total | decimal(15,2) | nullable |
| keterangan | text | nullable |
| created_at / updated_at | timestamp | nullable |

### `detail_pesanan`
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint unsigned | PK |
| pesanan_id | bigint unsigned | NOT NULL, FK → `pesanan.id` (RESTRICT) |
| produk_id | bigint unsigned | NOT NULL, FK → `produk.id` (RESTRICT) |
| qty | int | NOT NULL |
| harga | decimal(15,2) | NOT NULL |
| subtotal | decimal(15,2) | NOT NULL |
| created_at / updated_at | timestamp | nullable |

### `produksi`
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint unsigned | PK |
| pesanan_id | bigint unsigned | NOT NULL, FK → `pesanan.id` (RESTRICT) |
| created_by | bigint unsigned | NOT NULL, FK → `users.id` (RESTRICT) |
| deadline | date | nullable |
| qty_target | int | NOT NULL |
| qty_selesai | int | default 0 |
| status | enum(`draft`,`proses`,`selesai`,`dibatalkan`) | NOT NULL |
| status_qc | enum(`belum_dicek`,`lolos`,`tidak_lolos`) | default `belum_dicek` |
| catatan | text | nullable |
| created_at / updated_at | timestamp | nullable |

### `detail_produksi`
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint unsigned | PK |
| produksi_id | bigint unsigned | NOT NULL, FK → `produksi.id` (RESTRICT) |
| produk_id | bigint unsigned | NOT NULL, FK → `produk.id` (RESTRICT) |
| karyawan_id | bigint unsigned | NOT NULL, FK → `karyawan.id` (RESTRICT) |
| qty_selesai | int | NOT NULL |
| created_at / updated_at | timestamp | nullable |

### `pembayaran`
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint unsigned | PK |
| pesanan_id | bigint unsigned | NOT NULL, FK → `pesanan.id` (RESTRICT) |
| tanggal | date | nullable |
| jenis_pembayaran | enum(`dp`,`pelunasan`) | NOT NULL |
| nominal | decimal(15,2) | nullable |
| metode | varchar(100) | nullable |
| keterangan | text | nullable |
| created_at / updated_at | timestamp | nullable |

### `arus_kas`
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint unsigned | PK |
| pembayaran_id | bigint unsigned | nullable, FK → `pembayaran.id` (RESTRICT) — null kalau bukan dari pembayaran pesanan |
| created_by | bigint unsigned | NOT NULL, FK → `users.id` (RESTRICT) |
| tanggal | date | nullable |
| jenis | enum(`pemasukan`,`pengeluaran`) | NOT NULL |
| kategori | varchar(100) | nullable |
| nominal | decimal(15,2) | nullable |
| metode_pembayaran | varchar(100) | nullable |
| keterangan | text | nullable |
| bukti_transaksi | varchar(255) | nullable — path/nama file |
| created_at / updated_at | timestamp | nullable |

### `stok_bahan_baku` (log riwayat)
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint unsigned | PK |
| bahan_baku_id | bigint unsigned | NOT NULL, FK → `bahan_baku.id` (RESTRICT) |
| jenis_transaksi | enum(`restock`,`produksi`,`rollback`,`penyesuaian`) | NOT NULL |
| qty | decimal(12,2) | NOT NULL — selisih perubahan |
| stok_sebelum | decimal(12,2) | NOT NULL |
| stok_sesudah | decimal(12,2) | NOT NULL |
| keterangan | text | nullable |
| created_by | bigint unsigned | nullable, FK → `users.id` (RESTRICT) |
| created_at / updated_at | timestamp | nullable |

### `stok_produk_jadi` (log riwayat)
| Kolom | Tipe | Ket |
|---|---|---|
| id | bigint unsigned | PK |
| produk_id | bigint unsigned | NOT NULL, FK → `produk.id` (RESTRICT) |
| jenis_transaksi | enum(`produksi`,`pengiriman`,`rollback`,`penyesuaian`) | NOT NULL |
| qty | int | NOT NULL — selisih perubahan |
| stok_sebelum | int | NOT NULL |
| stok_sesudah | int | NOT NULL |
| keterangan | text | nullable |
| created_by | bigint unsigned | nullable, FK → `users.id` (RESTRICT) |
| created_at / updated_at | timestamp | nullable |

## Relasi antar tabel

- `customer` 1—n `pesanan` (pesanan.customer_id, RESTRICT)
- `users` 1—n `pesanan`, `produksi`, `arus_kas`, `stok_bahan_baku`, `stok_produk_jadi` (created_by, RESTRICT)
- `pesanan` 1—n `detail_pesanan` (RESTRICT)
- `produk` 1—n `detail_pesanan` (RESTRICT)
- `produk` n—1 `bom_categorie` (bom_category_id, nullable, RESTRICT)
- `bom_categorie` 1—n `bom_detail` (RESTRICT)
- `bahan_baku` 1—n `bom_detail` (RESTRICT)
- `pesanan` 1—n `produksi` (RESTRICT)
- `produksi` 1—n `detail_produksi` (RESTRICT)
- `produk` 1—n `detail_produksi` (RESTRICT)
- `karyawan` 1—n `detail_produksi` (RESTRICT)
- `pesanan` 1—n `pembayaran` (RESTRICT)
- `pembayaran` 1—n `arus_kas` (pembayaran_id, nullable, RESTRICT)
- `bahan_baku` 1—n `stok_bahan_baku` (RESTRICT)
- `produk` 1—n `stok_produk_jadi` (RESTRICT)

## Catatan implementasi (update dari revisi sebelumnya)

- **Nilai enum status berubah**: `pesanan.status` dan `produksi.status` pakai
  `selesai`/`dibatalkan` — **bukan** `done`/`cancel` seperti draft sebelumnya. Business
  rules & dokumentasi lain yang masih menyebut "Done"/"Cancel" perlu disamakan istilahnya
  (lihat catatan di bawah).
- **Nama kolom log stok berubah**: dulu diusulkan `jenis_perubahan` + `jumlah`, final-nya
  jadi **`jenis_transaksi`** + **`qty`**. Jenis "cancel_produksi" juga final-nya jadi
  **`rollback`** (dipakai sama di `stok_bahan_baku` maupun `stok_produk_jadi`).
- **Kolom `referensi_id` dihapus** dari `stok_bahan_baku`/`stok_produk_jadi` di versi final
  ini. Konsekuensinya: log riwayat stok tidak bisa langsung dilacak balik ke produksi/pesanan
  spesifik mana yang menyebabkannya — hanya `jenis_transaksi` + `keterangan` (teks bebas)
  sebagai konteks. Ini bukan salah, tapi kalau nanti butuh audit trail yang bisa diklik ke
  produksi terkait, kolom itu perlu ditambah lewat migration baru (bukan mengubah desain
  yang sudah final).
- `created_by` di kedua tabel log stok **nullable** (beda dari tabel lain yang NOT NULL) —
  konsisten dengan DDL, tapi service yang menulis ke tabel ini tetap disarankan selalu
  mengisi `created_by` supaya jejak audit lengkap.
- Semua FK pakai `ON DELETE RESTRICT`, sudah konsisten di seluruh tabel.
- Semua tabel singular kecuali `users` (plural) — tetap berlaku, tidak berubah.
- `bom_category_id` di `produk` tetap nullable secara DB; validasi "produk harus punya BOM
  sebelum diproduksi" ditegakkan di level Service, bukan constraint NOT NULL.

## ⚠️ Perlu disinkronkan ke file lain
`AGENTS.md` dan `business-rules.md` masih menyebut status pesanan/produksi sebagai
"Done"/"Cancel" — sebaiknya diubah ke "Selesai"/"Dibatalkan" supaya istilah di semua
dokumen sama persis dengan enum di database. Beri tahu aku kalau mau sekalian aku perbaiki.

## Lampiran — DDL SQL final (sumber kebenaran)

```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin') NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

CREATE TABLE customer (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nama_customer VARCHAR(255) NOT NULL,
    jenis_customer ENUM('b2b','b2c') NOT NULL,
    no_hp VARCHAR(25),
    alamat TEXT,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

CREATE TABLE karyawan (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nama_karyawan VARCHAR(255) NOT NULL,
    jabatan VARCHAR(100),
    no_hp VARCHAR(25),
    status ENUM('aktif','nonaktif') NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

CREATE TABLE bahan_baku (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    kode_bahan VARCHAR(50) NOT NULL UNIQUE,
    nama_bahan VARCHAR(255) NOT NULL,
    satuan VARCHAR(50),
    stok DECIMAL(12,2) NOT NULL DEFAULT 0,
    minimum_stok DECIMAL(12,2),
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

CREATE TABLE bom_categorie (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nama_bom VARCHAR(255) NOT NULL,
    keterangan TEXT,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

CREATE TABLE produk (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    kode_produk VARCHAR(50) NOT NULL UNIQUE,
    nama_produk VARCHAR(255) NOT NULL,
    ukuran VARCHAR(30),
    warna VARCHAR(50),
    harga_jual DECIMAL(15,2),
    stok INT NOT NULL DEFAULT 0,
    minimum_stok INT,
    bom_category_id BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    CONSTRAINT fk_produk_bom
        FOREIGN KEY (bom_category_id)
        REFERENCES bom_categorie(id)
        ON DELETE RESTRICT
);

CREATE TABLE bom_detail (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    bom_category_id BIGINT UNSIGNED NOT NULL,
    bahan_baku_id BIGINT UNSIGNED NOT NULL,
    qty_per_pair DECIMAL(12,2) NOT NULL,

    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    CONSTRAINT fk_bomdetail_category
        FOREIGN KEY (bom_category_id)
        REFERENCES bom_categorie(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_bomdetail_bahan
        FOREIGN KEY (bahan_baku_id)
        REFERENCES bahan_baku(id)
        ON DELETE RESTRICT
);

CREATE TABLE pesanan (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    customer_id BIGINT UNSIGNED NOT NULL,
    created_by BIGINT UNSIGNED NOT NULL,

    nomor_pesanan VARCHAR(100) UNIQUE,
    tanggal DATE NOT NULL,

    status ENUM(
        'pending',
        'proses',
        'selesai',
        'dibatalkan'
    ) NOT NULL,

    subtotal DECIMAL(15,2),
    diskon DECIMAL(15,2),
    ongkir DECIMAL(15,2),
    total DECIMAL(15,2),

    keterangan TEXT,

    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    FOREIGN KEY (customer_id)
        REFERENCES customer(id)
        ON DELETE RESTRICT,

    FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT
);

CREATE TABLE detail_pesanan (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    pesanan_id BIGINT UNSIGNED NOT NULL,
    produk_id BIGINT UNSIGNED NOT NULL,

    qty INT NOT NULL,
    harga DECIMAL(15,2) NOT NULL,
    subtotal DECIMAL(15,2) NOT NULL,

    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    FOREIGN KEY (pesanan_id)
        REFERENCES pesanan(id)
        ON DELETE RESTRICT,

    FOREIGN KEY (produk_id)
        REFERENCES produk(id)
        ON DELETE RESTRICT
);

CREATE TABLE produksi (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    pesanan_id BIGINT UNSIGNED NOT NULL,
    created_by BIGINT UNSIGNED NOT NULL,

    deadline DATE,

    qty_target INT NOT NULL,
    qty_selesai INT DEFAULT 0,

    status ENUM(
        'draft',
        'proses',
        'selesai',
        'dibatalkan'
    ) NOT NULL,

    status_qc ENUM(
        'belum_dicek',
        'lolos',
        'tidak_lolos'
    ) DEFAULT 'belum_dicek',

    catatan TEXT,

    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    FOREIGN KEY (pesanan_id)
        REFERENCES pesanan(id)
        ON DELETE RESTRICT,

    FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT
);

CREATE TABLE detail_produksi (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    produksi_id BIGINT UNSIGNED NOT NULL,
    karyawan_id BIGINT UNSIGNED NOT NULL,

    qty_selesai INT NOT NULL,

    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    FOREIGN KEY (produksi_id)
        REFERENCES produksi(id)
        ON DELETE RESTRICT,

    FOREIGN KEY (karyawan_id)
        REFERENCES karyawan(id)
        ON DELETE RESTRICT
);

CREATE TABLE pembayaran (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    pesanan_id BIGINT UNSIGNED NOT NULL,

    tanggal DATE,

    jenis_pembayaran ENUM(
        'dp',
        'pelunasan'
    ) NOT NULL,

    nominal DECIMAL(15,2),

    metode VARCHAR(100),

    keterangan TEXT,

    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    FOREIGN KEY (pesanan_id)
        REFERENCES pesanan(id)
        ON DELETE RESTRICT
);

CREATE TABLE arus_kas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    pembayaran_id BIGINT UNSIGNED NULL,
    created_by BIGINT UNSIGNED NOT NULL,

    tanggal DATE,

    jenis ENUM(
        'pemasukan',
        'pengeluaran'
    ) NOT NULL,

    kategori VARCHAR(100),

    nominal DECIMAL(15,2),

    metode_pembayaran VARCHAR(100),

    keterangan TEXT,

    bukti_transaksi VARCHAR(255),

    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    FOREIGN KEY (pembayaran_id)
        REFERENCES pembayaran(id)
        ON DELETE RESTRICT,

    FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT
);

CREATE TABLE stok_bahan_baku (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    bahan_baku_id BIGINT UNSIGNED NOT NULL,

    jenis_transaksi ENUM(
        'restock',
        'produksi',
        'rollback',
        'penyesuaian'
    ) NOT NULL,

    qty DECIMAL(12,2) NOT NULL,

    stok_sebelum DECIMAL(12,2) NOT NULL,
    stok_sesudah DECIMAL(12,2) NOT NULL,

    keterangan TEXT,

    created_by BIGINT UNSIGNED,

    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    FOREIGN KEY (bahan_baku_id)
        REFERENCES bahan_baku(id)
        ON DELETE RESTRICT,

    FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT
);

CREATE TABLE stok_produk_jadi (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    produk_id BIGINT UNSIGNED NOT NULL,

    jenis_transaksi ENUM(
        'produksi',
        'pengiriman',
        'rollback',
        'penyesuaian'
    ) NOT NULL,

    qty INT NOT NULL,

    stok_sebelum INT NOT NULL,
    stok_sesudah INT NOT NULL,

    keterangan TEXT,

    created_by BIGINT UNSIGNED,

    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    FOREIGN KEY (produk_id)
        REFERENCES produk(id)
        ON DELETE RESTRICT,

    FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT
);
```
