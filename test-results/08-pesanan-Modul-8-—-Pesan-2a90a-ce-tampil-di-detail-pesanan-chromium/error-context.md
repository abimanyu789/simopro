# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 08-pesanan.spec.ts >> Modul 8 — Pesanan + Invoice >> 8.5 tombol cetak invoice tampil di detail pesanan
- Location: tests\e2e\08-pesanan.spec.ts:63:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Cetak Invoice, a[href*="invoice"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Cetak Invoice, a[href*="invoice"]').first()

```

```yaml
- list:
  - listitem:
    - link "Laravel Starter Kit":
      - /url: /dashboard
      - img
      - text: Laravel Starter Kit
- text: Platform
- list:
  - listitem:
    - link "Dashboard":
      - /url: /dashboard
      - img
      - text: Dashboard
  - listitem:
    - button "Data Master":
      - img
      - text: Data Master
      - img
  - listitem:
    - link "Pesanan":
      - /url: /pesanan
      - img
      - text: Pesanan
  - listitem:
    - button "Stok":
      - img
      - text: Stok
      - img
  - listitem:
    - link "Produksi":
      - /url: /produksi
      - img
      - text: Produksi
  - listitem:
    - link "Arus Kas":
      - /url: ""
      - img
      - text: Arus Kas
- list:
  - listitem:
    - button "AP Admin Provillo":
      - text: AP Admin Provillo
      - img
- main:
  - button "Toggle sidebar":
    - img
    - text: Toggle sidebar
  - navigation "breadcrumb":
    - list:
      - listitem:
        - link "Pesanan":
          - /url: /pesanan
      - listitem:
        - link "Buat Pesanan" [disabled]
  - link:
    - /url: /pesanan
    - button:
      - img
  - heading "Buat Pesanan Baru" [level=1]
  - paragraph: Isi form di bawah untuk membuat pesanan baru
  - heading "Informasi Pesanan" [level=2]
  - text: Customer *
  - combobox "Customer *": Pilih customer...
  - text: Tanggal Pesanan *
  - textbox "Tanggal Pesanan *": 2026-07-11
  - text: Jenis Pembayaran
  - combobox "Jenis Pembayaran": Belum ditentukan
  - heading "Item Produk" [level=2]
  - button "Tambah Produk":
    - img
    - text: Tambah Produk
  - text: Produk
  - combobox: Pilih produk...
  - text: Qty
  - spinbutton
  - text: Harga (Rp)
  - spinbutton
  - text: Subtotal Rp 0
  - button [disabled]:
    - img
  - heading "Ringkasan Pembayaran" [level=2]
  - text: Subtotal Rp 0 Diskon
  - button "Rp"
  - text: Nominal rupiah
  - spinbutton
  - text: Ongkos Kirim
  - spinbutton "Ongkos Kirim"
  - text: Total Rp 0 Keterangan
  - textbox "Keterangan":
    - /placeholder: Catatan pesanan (opsional)...
  - link "Batal":
    - /url: /pesanan
    - button "Batal"
  - button "Simpan Pesanan"
- region "Notifications alt+T"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import {
  3   |     loginAsAdmin,
  4   |     collectConsoleErrors,
  5   |     collectFailedRequests,
  6   | } from './helpers';
  7   | 
  8   | test.describe('Modul 8 — Pesanan + Invoice', () => {
  9   |     test.beforeEach(async ({ page }) => {
  10  |         await loginAsAdmin(page);
  11  |     });
  12  | 
  13  |     test('8.1 index pesanan tampil', async ({ page }) => {
  14  |         const errors = collectConsoleErrors(page);
  15  |         await page.goto('/pesanan');
  16  |         await page.waitForLoadState('networkidle');
  17  |         await expect(page.locator('table')).toBeVisible();
  18  |         expect(errors).toHaveLength(0);
  19  |     });
  20  | 
  21  |     test('8.2 form create pesanan tampil tanpa error', async ({ page }) => {
  22  |         const errors = collectConsoleErrors(page);
  23  |         await page.goto('/pesanan/create');
  24  |         await page.waitForLoadState('networkidle');
  25  |         await expect(page.locator('form')).toBeVisible();
  26  |         expect(errors).toHaveLength(0);
  27  |     });
  28  | 
  29  |     test('8.3 validasi form pesanan kosong', async ({ page }) => {
  30  |         await page.goto('/pesanan/create');
  31  |         await page.waitForLoadState('networkidle');
  32  |         await page.click('button[type="submit"]');
  33  |         await page.waitForLoadState('networkidle');
  34  |         await expect(
  35  |             page.locator('.text-red-500, .text-destructive').first(),
  36  |         ).toBeVisible({ timeout: 5000 });
  37  |     });
  38  | 
  39  |     test('8.4 detail pesanan tampil dengan jenis pembayaran', async ({
  40  |         page,
  41  |     }) => {
  42  |         const errors = collectConsoleErrors(page);
  43  |         await page.goto('/pesanan');
  44  |         await page.waitForLoadState('networkidle');
  45  |         const showLink = page
  46  |             .locator(
  47  |                 'a[href*="/pesanan/"]:not([href*="edit"]):not([href*="invoice"])',
  48  |             )
  49  |             .first();
  50  |         if ((await showLink.count()) > 0) {
  51  |             await showLink.click();
  52  |             await page.waitForLoadState('networkidle');
  53  |             await expect(page.locator('body')).toContainText(
  54  |                 /Jenis Pembayaran/i,
  55  |             );
  56  |             await expect(page.locator('body')).not.toContainText(
  57  |                 /whoops|exception/i,
  58  |             );
  59  |         }
  60  |         expect(errors).toHaveLength(0);
  61  |     });
  62  | 
  63  |     test('8.5 tombol cetak invoice tampil di detail pesanan', async ({
  64  |         page,
  65  |     }) => {
  66  |         const errors = collectConsoleErrors(page);
  67  |         await page.goto('/pesanan');
  68  |         await page.waitForLoadState('networkidle');
  69  |         const showLink = page
  70  |             .locator(
  71  |                 'a[href*="/pesanan/"]:not([href*="edit"]):not([href*="invoice"])',
  72  |             )
  73  |             .first();
  74  |         if ((await showLink.count()) > 0) {
  75  |             await showLink.click();
  76  |             await page.waitForLoadState('networkidle');
  77  |             await expect(
  78  |                 page.locator('text=Cetak Invoice, a[href*="invoice"]').first(),
> 79  |             ).toBeVisible({ timeout: 5000 });
      |               ^ Error: expect(locator).toBeVisible() failed
  80  |         }
  81  |         expect(errors).toHaveLength(0);
  82  |     });
  83  | 
  84  |     test('8.6 invoice PDF dapat diakses (HTTP 200 + content-type pdf)', async ({
  85  |         page,
  86  |     }) => {
  87  |         await page.goto('/pesanan');
  88  |         await page.waitForLoadState('networkidle');
  89  |         const invoiceLink = page.locator('a[href*="/invoice"]').first();
  90  |         if ((await invoiceLink.count()) > 0) {
  91  |             const href = await invoiceLink.getAttribute('href');
  92  |             if (href) {
  93  |                 const response = await page.request.get(href);
  94  |                 expect(response.status(), `Invoice PDF harus 200`).toBe(200);
  95  |                 const ct = response.headers()['content-type'];
  96  |                 expect(ct, 'Content-type harus PDF').toContain('pdf');
  97  |             }
  98  |         }
  99  |     });
  100 | 
  101 |     test('8.7 dropdown ubah status tampil di detail pesanan', async ({
  102 |         page,
  103 |     }) => {
  104 |         const errors = collectConsoleErrors(page);
  105 |         await page.goto('/pesanan');
  106 |         await page.waitForLoadState('networkidle');
  107 |         const showLink = page
  108 |             .locator(
  109 |                 'a[href*="/pesanan/"]:not([href*="edit"]):not([href*="invoice"])',
  110 |             )
  111 |             .first();
  112 |         if ((await showLink.count()) > 0) {
  113 |             await showLink.click();
  114 |             await page.waitForLoadState('networkidle');
  115 |             await expect(page.locator('body')).not.toContainText(
  116 |                 /whoops|exception/i,
  117 |             );
  118 |         }
  119 |         expect(errors).toHaveLength(0);
  120 |     });
  121 | });
  122 | 
```