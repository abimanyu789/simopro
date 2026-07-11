# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 02-dashboard.spec.ts >> Modul 2 — Dashboard >> 2.3 sidebar navigation tampil
- Location: tests\e2e\02-dashboard.spec.ts:34:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('nav, aside, [data-sidebar], [class*="sidebar"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('nav, aside, [data-sidebar], [class*="sidebar"]').first()

```

```yaml
- link "Provillo":
  - /url: /
  - img
  - text: Provillo
- text: Sistem Manajemen Operasional
- blockquote:
  - paragraph: Kelola produksi, pesanan, dan keuangan UMKM sepatu dalam satu platform terpadu.
  - contentinfo: Provillo — Mojokerto
- heading "Masuk ke Provillo" [level=1]
- paragraph: Masukkan email dan password untuk mengakses sistem manajemen operasional
- button "Sign in with a passkey":
  - img
  - text: Sign in with a passkey
- text: Or continue with email Alamat Email
- textbox "Alamat Email":
  - /placeholder: masukkan email Anda
- text: Password
- link "Lupa password?":
  - /url: /forgot-password
- textbox "Password":
  - /placeholder: masukkan password Anda
- button "Show password":
  - img
- checkbox "Ingat saya"
- text: Ingat saya
- button "Masuk"
- region "Notifications alt+T"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { collectConsoleErrors, collectFailedRequests } from './helpers';
  3  | 
  4  | // Test ini pakai storageState (sudah login)
  5  | test.describe('Modul 2 — Dashboard', () => {
  6  |     test('2.1 halaman dashboard tampil tanpa error', async ({ page }) => {
  7  |         const errors = collectConsoleErrors(page);
  8  |         const failed = collectFailedRequests(page);
  9  | 
  10 |         await page.goto('/dashboard');
  11 |         await page.waitForLoadState('networkidle');
  12 | 
  13 |         await expect(page.locator('body')).not.toContainText(
  14 |             /whoops|exception|fatal/i,
  15 |         );
  16 |         expect(errors, `Console errors: ${errors.join(', ')}`).toHaveLength(0);
  17 |         const criticalFailed = failed.filter(
  18 |             (r) => !r.includes('favicon') && !r.includes('_debugbar'),
  19 |         );
  20 |         expect(
  21 |             criticalFailed,
  22 |             `Failed requests: ${criticalFailed.join(', ')}`,
  23 |         ).toHaveLength(0);
  24 |     });
  25 | 
  26 |     test('2.2 stat cards tampil tanpa crash', async ({ page }) => {
  27 |         await page.goto('/dashboard');
  28 |         await page.waitForLoadState('networkidle');
  29 |         await expect(page.locator('body')).not.toContainText(
  30 |             /whoops|exception|fatal/i,
  31 |         );
  32 |     });
  33 | 
  34 |     test('2.3 sidebar navigation tampil', async ({ page }) => {
  35 |         await page.goto('/dashboard');
  36 |         await page.waitForLoadState('networkidle');
  37 |         const sidebar = page
  38 |             .locator('nav, aside, [data-sidebar], [class*="sidebar"]')
  39 |             .first();
> 40 |         await expect(sidebar).toBeVisible({ timeout: 5000 });
     |                               ^ Error: expect(locator).toBeVisible() failed
  41 |     });
  42 | 
  43 |     test('2.4 link Bahan Baku di sidebar berfungsi', async ({ page }) => {
  44 |         await page.goto('/dashboard');
  45 |         await page.waitForLoadState('networkidle');
  46 |         const link = page.locator('a[href*="bahan-baku"]').first();
  47 |         if (await link.isVisible()) {
  48 |             await link.click();
  49 |             await page.waitForLoadState('networkidle');
  50 |             await expect(page).toHaveURL(/bahan-baku/);
  51 |         }
  52 |     });
  53 | });
  54 | 
```