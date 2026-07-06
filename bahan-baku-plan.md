# Rencana Implementasi — Modul 3: Master Data Bahan Baku

## Analisis Mockup

Dari `mockup/Data Master/Bahan Baku/`, modul ini memiliki:

### Halaman Utama - List Bahan Baku
- **Header** dengan judul "Data Master - Bahan Baku"
- **Toolbar** dengan:
  - Search bar
  - Tombol "Tambah Bahan Baku" (hijau)
  - Tombol "Import" (opsional untuk fase ini)
  - Tombol "Export" (akan dikerjakan di Modul 13)
- **Tabel** dengan kolom:
  - No
  - Kode Bahan
  - Nama Bahan
  - Satuan
  - Stok
  - Minimum Stok
  - Aksi (Detail, Edit, Delete)
- **Pagination** di bawah tabel

### Form Tambah/Edit Bahan Baku (Modal/Page)
- Kode Bahan (input text, unique)
- Nama Bahan (input text, required)
- Satuan (select dropdown, required)
- Stok Awal (number input, min: 0, default: 0)
- Minimum Stok (number input, nullable)

### Halaman Detail Bahan Baku
- Menampilkan semua info bahan baku
- Tombol Edit & Delete
- Riwayat perubahan stok (akan aktif setelah Modul 9)

### Dialog/Alert
- Konfirmasi delete
- Success notification (tambah/edit/delete)
- Error validation

---

## Database Schema (dari database-schema.md - FINAL)

### Tabel `bahan_baku`
```
id               bigint        PK
kode_bahan       varchar(50)   unique
nama_bahan       varchar(255)  required
satuan           varchar(50)   nullable
stok             decimal(12,2) current stock
minimum_stok     decimal(12,2) nullable
created_at       timestamp
updated_at       timestamp
```

**Penting:** Tabel singular `bahan_baku` (bukan `bahan_bakus`)

---

## Business Rules (dari business-rules.md)

- **BR-01** Kode bahan baku harus unik
- **BR-02** Nama bahan baku tidak boleh kosong
- **BR-03** Stok awal minimal nol
- **BR-04** Satuan harus dipilih
- **BR-05** Import hanya menerima template yang sesuai (Modul 13)

---

## Keputusan Implementasi

### Satuan Options
Berdasarkan domain UMKM sepatu, satuan yang umum:
- **meter** (m) - untuk kain, kulit, tali
- **pasang** - untuk aksesoris berpasangan
- **buah** (pcs) - untuk komponen kecil
- **kilogram** (kg) - untuk bahan berdasarkan berat
- **lembar** - untuk kulit lembaran, sol

Akan disimpan sebagai enum di migration atau array di config.

### CRUD Pattern
- **Create/Edit** menggunakan **Modal Dialog** (sesuai mockup "Alert Tambah/Edit")
- **Delete** menggunakan **Alert Dialog** konfirmasi
- **Detail** menggunakan **Slide-over/Drawer** dari kanan

### Validasi
- Unique check untuk `kode_bahan`
- Required: `nama_bahan`, `satuan`
- Min value: `stok >= 0`, `minimum_stok >= 0`

### No Service Class Needed
CRUD sederhana, langsung di Controller dengan Eloquent + FormRequest validation.

---

## Daftar File yang Dibuat/Diubah

### Backend (5 file baru)
| Aksi | File | Keterangan |
|---|---|---|
| **BUAT** | `database/migrations/xxxx_create_bahan_baku_table.php` | Migration tabel bahan_baku |
| **BUAT** | `database/seeders/BahanBakuSeeder.php` | Seeder data dummy 5-10 bahan baku |
| **BUAT** | `app/Models/BahanBaku.php` | Eloquent Model |
| **BUAT** | `app/Http/Requests/BahanBakuRequest.php` | Form validation request |
| **BUAT** | `app/Http/Controllers/BahanBakuController.php` | Resource controller CRUD |

### Backend (1 file diubah)
| Aksi | File | Keterangan |
|---|---|---|
| **UBAH** | `routes/web.php` | Tambah resource route `bahan-baku` |

### Frontend - Types (1 file baru)
| Aksi | File | Keterangan |
|---|---|---|
| **BUAT** | `resources/js/types/bahan-baku.ts` | TypeScript types untuk BahanBaku |

### Frontend - Pages (3 file baru)
| Aksi | File | Keterangan |
|---|---|---|
| **BUAT** | `resources/js/pages/bahan-baku/index.tsx` | Halaman list dengan table |
| **BUAT** | `resources/js/pages/bahan-baku/create.tsx` | Modal/form tambah (atau inline di index) |
| **BUAT** | `resources/js/pages/bahan-baku/edit.tsx` | Modal/form edit (atau inline di index) |

### Frontend - Components (2 file baru)
| Aksi | File | Keterangan |
|---|---|---|
| **BUAT** | `resources/js/components/bahan-baku/form-dialog.tsx` | Reusable form dialog (create/edit) |
| **BUAT** | `resources/js/components/bahan-baku/delete-dialog.tsx` | Reusable delete confirmation |

### Frontend - Sidebar Update (1 file diubah)
| Aksi | File | Keterangan |
|---|---|---|
| **UBAH** | `resources/js/components/app-sidebar.tsx` | Update link "Bahan Baku" dari `#` ke route aktif |

**Total Backend: 6 file** (5 baru + 1 diubah)  
**Total Frontend: 7 file** (6 baru + 1 diubah)  
**Grand Total: 13 file**

---

## Alur Kerja Implementasi (sesuai AGENTS.md)

### Phase 1: Backend Foundation
1. Migration `bahan_baku` table
2. Seeder `BahanBakuSeeder` (5-10 dummy data)
3. Model `BahanBaku` (declare `protected $table = 'bahan_baku';`)
4. FormRequest `BahanBakuRequest` (validation rules)
5. Controller `BahanBakuController` (resource controller)
6. Route `web.php` (resource route)
7. **Test manual dengan Tinker/Postman** (CRUD backend saja)

### Phase 2: Frontend Implementation
8. Types `bahan-baku.ts` (TypeScript interfaces)
9. Page `bahan-baku/index.tsx` (table list dengan pagination)
10. Component `form-dialog.tsx` (reusable create/edit modal)
11. Component `delete-dialog.tsx` (reusable delete confirmation)
12. Update sidebar link
13. **Test end-to-end** (UI + backend)

### Phase 3: Verification & Commit
14. Test semua CRUD operations
15. Test validasi (unique kode_bahan, required fields, min value)
16. Test search & pagination
17. **Commit git**

---

## Backend Implementation Detail

### Migration
```php
Schema::create('bahan_baku', function (Blueprint $table) {
    $table->id();
    $table->string('kode_bahan', 50)->unique();
    $table->string('nama_bahan', 255);
    $table->string('satuan', 50)->nullable();
    $table->decimal('stok', 12, 2)->default(0);
    $table->decimal('minimum_stok', 12, 2)->nullable();
    $table->timestamps();
});
```

### Model
```php
protected $table = 'bahan_baku'; // WAJIB karena singular
protected $fillable = ['kode_bahan', 'nama_bahan', 'satuan', 'stok', 'minimum_stok'];
```

### Validation Rules (BahanBakuRequest)
```php
'kode_bahan' => ['required', 'string', 'max:50', 'unique:bahan_baku,kode_bahan,'.$this->route('bahan_baku')],
'nama_bahan' => ['required', 'string', 'max:255'],
'satuan' => ['required', 'string', 'in:meter,pasang,buah,kilogram,lembar'],
'stok' => ['required', 'numeric', 'min:0'],
'minimum_stok' => ['nullable', 'numeric', 'min:0'],
```

### Controller Methods
- `index()` - list dengan search & pagination (15 per page)
- `create()` - render form (atau return data untuk modal)
- `store()` - save baru
- `show($id)` - detail
- `edit($id)` - render form edit (atau return data)
- `update($id)` - update
- `destroy($id)` - delete (cek apakah masih dipakai di BOM)

---

## Frontend Implementation Detail

### Index Page Features
- DataTable dengan sorting
- Search bar (realtime atau on-submit)
- Pagination (Laravel paginator)
- Action buttons: Detail, Edit, Delete
- Tombol "Tambah Bahan Baku" → open modal

### Form Dialog
- Shared component untuk Create & Edit
- Fields sesuai mockup
- Client-side validation + server-side error display
- Submit dengan Inertia `useForm` hook

### Delete Dialog
- Confirmation dialog
- Display nama bahan yang akan dihapus
- Handle error jika bahan baku masih dipakai

---

## Catatan Penting

1. **Tidak ada import/export di fase ini** → akan dikerjakan di Modul 13
2. **Riwayat stok** belum aktif di detail page → akan dikerjakan di Modul 9 (Stok Bahan Baku)
3. **Validasi "masih dipakai"** saat delete → check relasi ke `bom_detail` (tabel belum ada, skip dulu)
4. **Stok manual** di form hanya untuk stok awal → perubahan stok selanjutnya via Modul 9 (Restock)
5. **Satuan** hardcoded sebagai array/enum untuk saat ini → bisa dijadikan master data terpisah nanti jika perlu

---

## Expected Result

Setelah modul ini selesai:
- ✅ CRUD Bahan Baku fully functional
- ✅ Validasi sesuai business rules
- ✅ Search & pagination berfungsi
- ✅ UI match dengan mockup
- ✅ Data seeder ready untuk testing
- ✅ Link sidebar "Bahan Baku" aktif
- ✅ No error di console/backend logs

---

**SIAP IMPLEMENTASI** setelah approval.
