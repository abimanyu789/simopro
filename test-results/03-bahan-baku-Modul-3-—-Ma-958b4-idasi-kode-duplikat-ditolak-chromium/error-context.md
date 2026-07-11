# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 03-bahan-baku.spec.ts >> Modul 3 — Master Data Bahan Baku >> 3.5 validasi kode duplikat ditolak
- Location: tests\e2e\03-bahan-baku.spec.ts:84:5

# Error details

```
TimeoutError: locator.innerText: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('td').first()

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - link "Provillo" [ref=e7] [cursor=pointer]:
        - /url: /
        - img [ref=e9]
        - generic [ref=e11]: Provillo
      - generic [ref=e12]:
        - generic [ref=e14]: Sistem Manajemen Operasional
        - blockquote [ref=e16]:
          - paragraph [ref=e17]: Kelola produksi, pesanan, dan keuangan UMKM sepatu dalam satu platform terpadu.
          - contentinfo [ref=e18]: Provillo — Mojokerto
    - generic [ref=e20]:
      - generic [ref=e21]:
        - heading "Masuk ke Provillo" [level=1] [ref=e22]
        - paragraph [ref=e23]: Masukkan email dan password untuk mengakses sistem manajemen operasional
      - button "Sign in with a passkey" [ref=e25]:
        - img
        - text: Sign in with a passkey
      - generic [ref=e29]: Or continue with email
      - generic [ref=e31]:
        - generic [ref=e32]:
          - generic [ref=e33]: Alamat Email
          - textbox "Alamat Email" [active] [ref=e34]:
            - /placeholder: masukkan email Anda
        - generic [ref=e35]:
          - generic [ref=e36]:
            - generic [ref=e37]: Password
            - link "Lupa password?" [ref=e38] [cursor=pointer]:
              - /url: /forgot-password
          - generic [ref=e39]:
            - textbox "Password" [ref=e40]:
              - /placeholder: masukkan password Anda
            - button "Show password" [ref=e41]:
              - img [ref=e42]
        - generic [ref=e45]:
          - checkbox "Ingat saya" [ref=e46]
          - checkbox
          - generic [ref=e47]: Ingat saya
        - button "Masuk" [ref=e48]
  - region "Notifications alt+T"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { collectConsoleErrors, collectFailedRequests } from './helpers';
  3   | 
  4   | test.describe('Modul 3 — Master Data Bahan Baku', () => {
  5   |     test('3.1 index tampil dengan tabel dan tidak ada console error', async ({
  6   |         page,
  7   |     }) => {
  8   |         const errors = collectConsoleErrors(page);
  9   |         const failed = collectFailedRequests(page);
  10  | 
  11  |         await page.goto('/bahan-baku');
  12  |         await page.waitForLoadState('networkidle');
  13  | 
  14  |         await expect(page.locator('table')).toBeVisible();
  15  |         await expect(page.locator('body')).not.toContainText(
  16  |             /whoops|exception|fatal/i,
  17  |         );
  18  |         expect(errors, `Console errors: ${errors.join('\n')}`).toHaveLength(0);
  19  |         expect(
  20  |             failed.filter((r) => !r.includes('favicon')),
  21  |             `Failed: ${failed.join(', ')}`,
  22  |         ).toHaveLength(0);
  23  |     });
  24  | 
  25  |     test('3.2 search berfungsi tanpa error', async ({ page }) => {
  26  |         await page.goto('/bahan-baku');
  27  |         await page.waitForLoadState('networkidle');
  28  | 
  29  |         const searchInput = page
  30  |             .locator('input[type="text"], input[placeholder*="Cari"]')
  31  |             .first();
  32  |         await searchInput.fill('a');
  33  |         await searchInput.press('Enter');
  34  |         await page.waitForLoadState('networkidle');
  35  | 
  36  |         await expect(page.locator('body')).not.toContainText(
  37  |             /whoops|exception/i,
  38  |         );
  39  |     });
  40  | 
  41  |     test('3.3 form create tampil tanpa error', async ({ page }) => {
  42  |         const errors = collectConsoleErrors(page);
  43  |         await page.goto('/bahan-baku/create');
  44  |         await page.waitForLoadState('networkidle');
  45  | 
  46  |         await expect(page.locator('form')).toBeVisible();
  47  |         expect(errors).toHaveLength(0);
  48  |     });
  49  | 
  50  |     test('3.4 create bahan baku baru berhasil', async ({ page }) => {
  51  |         await page.goto('/bahan-baku/create');
  52  |         await page.waitForLoadState('networkidle');
  53  | 
  54  |         const kode = `PW-${Date.now()}`;
  55  |         await page.fill('input[id="kode_bahan"]', kode);
  56  |         await page.fill('input[id="nama_bahan"]', 'Bahan Test Playwright');
  57  | 
  58  |         // Satuan menggunakan native <select> atau Shadcn SelectTrigger
  59  |         // Coba native select dulu, fallback ke Shadcn
  60  |         const nativeSelect = page.locator(
  61  |             'select[id="satuan"], select[name="satuan"]',
  62  |         );
  63  |         if ((await nativeSelect.count()) > 0) {
  64  |             await nativeSelect.selectOption({ index: 1 });
  65  |         } else {
  66  |             // Shadcn SelectTrigger — cari button/div yang berisi placeholder satuan
  67  |             const trigger = page
  68  |                 .locator('button[role="combobox"], [data-radix-select-trigger]')
  69  |                 .first();
  70  |             await trigger.click();
  71  |             await page.locator('[role="option"]').first().click();
  72  |         }
  73  | 
  74  |         await page.fill('input[id="stok"]', '10');
  75  |         await page.click('button[type="submit"]');
  76  |         await page.waitForLoadState('networkidle');
  77  | 
  78  |         await expect(page).toHaveURL(/bahan-baku/, { timeout: 10000 });
  79  |         await expect(page.locator('body')).not.toContainText(
  80  |             /whoops|exception/i,
  81  |         );
  82  |     });
  83  | 
  84  |     test('3.5 validasi kode duplikat ditolak', async ({ page }) => {
  85  |         // Ambil kode pertama dari tabel
  86  |         await page.goto('/bahan-baku');
  87  |         await page.waitForLoadState('networkidle');
> 88  |         const firstCode = await page.locator('td').first().innerText();
      |                                                            ^ TimeoutError: locator.innerText: Timeout 10000ms exceeded.
  89  | 
  90  |         await page.goto('/bahan-baku/create');
  91  |         await page.waitForLoadState('networkidle');
  92  |         await page.fill('input[id="kode_bahan"]', firstCode.trim());
  93  |         await page.fill('input[id="nama_bahan"]', 'Duplikat Test');
  94  | 
  95  |         const satuanTrigger = page.locator('button[role="combobox"]').first();
  96  |         await satuanTrigger.click();
  97  |         await page.locator('[role="option"]').first().click();
  98  |         await page.fill('input[id="stok"]', '5');
  99  |         await page.click('button[type="submit"]');
  100 |         await page.waitForLoadState('networkidle');
  101 | 
  102 |         // Harus ada error validasi
  103 |         await expect(
  104 |             page.locator('.text-red-500, .text-destructive').first(),
  105 |         ).toBeVisible({ timeout: 5000 });
  106 |     });
  107 | 
  108 |     test('3.6 halaman detail tampil tanpa stok info', async ({ page }) => {
  109 |         const errors = collectConsoleErrors(page);
  110 |         await page.goto('/bahan-baku');
  111 |         await page.waitForLoadState('networkidle');
  112 | 
  113 |         // Klik tombol detail/show
  114 |         const showBtn = page
  115 |             .locator('a[href*="/bahan-baku/"]:not([href*="edit"])')
  116 |             .first();
  117 |         if ((await showBtn.count()) > 0) {
  118 |             await showBtn.click();
  119 |             await page.waitForLoadState('networkidle');
  120 |             await expect(page.locator('body')).not.toContainText(
  121 |                 /whoops|exception/i,
  122 |             );
  123 |         }
  124 |         expect(errors).toHaveLength(0);
  125 |     });
  126 | 
  127 |     test('3.7 halaman edit tampil dengan field stok readonly', async ({
  128 |         page,
  129 |     }) => {
  130 |         const errors = collectConsoleErrors(page);
  131 |         await page.goto('/bahan-baku');
  132 |         await page.waitForLoadState('networkidle');
  133 | 
  134 |         const editBtn = page
  135 |             .locator('a[href*="/bahan-baku/"][href*="edit"]')
  136 |             .first();
  137 |         if ((await editBtn.count()) > 0) {
  138 |             await editBtn.click();
  139 |             await page.waitForLoadState('networkidle');
  140 | 
  141 |             // Info card stok harus ada — teks aktual dari app
  142 |             await expect(page.locator('body')).toContainText(
  143 |                 /Pengelolaan stok dilakukan|Lihat Stok|Modul Inventory/i,
  144 |             );
  145 |         }
  146 |         expect(errors).toHaveLength(0);
  147 |     });
  148 | });
  149 | 
```