# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 05-07-bom-karyawan-customer.spec.ts >> Modul 5 — BOM >> 5.2 halaman create BOM tampil
- Location: tests\e2e\05-07-bom-karyawan-customer.spec.ts:19:5

# Error details

```
TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/dashboard**" until "load"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - dialog [active] [ref=e2]:
    - iframe [ref=e3]:
      - main [ref=f1e2]:
        - generic [ref=f1e4]:
          - heading "429" [level=1] [ref=f1e5]
          - generic [ref=f1e6]: Too Many Requests
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - link "Provillo" [ref=e9] [cursor=pointer]:
          - /url: /
          - img [ref=e11]
          - generic [ref=e13]: Provillo
        - generic [ref=e14]:
          - generic [ref=e16]: Sistem Manajemen Operasional
          - blockquote [ref=e18]:
            - paragraph [ref=e19]: Kelola produksi, pesanan, dan keuangan UMKM sepatu dalam satu platform terpadu.
            - contentinfo [ref=e20]: Provillo — Mojokerto
      - generic [ref=e22]:
        - generic [ref=e23]:
          - heading "Masuk ke Provillo" [level=1] [ref=e24]
          - paragraph [ref=e25]: Masukkan email dan password untuk mengakses sistem manajemen operasional
        - button "Sign in with a passkey" [ref=e27]:
          - img
          - text: Sign in with a passkey
        - generic [ref=e31]: Or continue with email
        - generic [ref=e33]:
          - generic [ref=e34]:
            - generic [ref=e35]: Alamat Email
            - textbox "Alamat Email" [ref=e36]:
              - /placeholder: masukkan email Anda
              - text: admin@provillo.com
          - generic [ref=e37]:
            - generic [ref=e38]:
              - generic [ref=e39]: Password
              - link "Lupa password?" [ref=e40] [cursor=pointer]:
                - /url: /forgot-password
            - generic [ref=e41]:
              - textbox "Password" [ref=e42]:
                - /placeholder: masukkan password Anda
                - text: password
              - button "Show password" [ref=e43]:
                - img [ref=e44]
          - generic [ref=e47]:
            - checkbox "Ingat saya" [ref=e48]
            - checkbox
            - generic [ref=e49]: Ingat saya
          - button "Masuk" [ref=e50]
    - region "Notifications alt+T"
```

# Test source

```ts
  1  | import { type Page } from '@playwright/test';
  2  | 
  3  | export const BASE_URL = 'http://localhost:8000';
  4  | export const ADMIN_EMAIL = 'admin@provillo.com';
  5  | export const ADMIN_PASSWORD = 'password';
  6  | 
  7  | /**
  8  |  * Login sebagai admin - dipanggil di beforeEach setiap describe block
  9  |  */
  10 | export async function loginAsAdmin(page: Page): Promise<void> {
  11 |     await page.goto('/login');
  12 |     await page.waitForLoadState('domcontentloaded');
  13 |     await page.fill('input[type="email"]', ADMIN_EMAIL);
  14 |     await page.fill('input[type="password"]', ADMIN_PASSWORD);
  15 |     await page.click('button[type="submit"]');
> 16 |     await page.waitForURL('**/dashboard**', { timeout: 15000 });
     |                ^ TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
  17 | }
  18 | 
  19 | /**
  20 |  * Kumpulkan console errors selama test.
  21 |  */
  22 | export function collectConsoleErrors(page: Page): string[] {
  23 |     const errors: string[] = [];
  24 |     page.on('console', (msg) => {
  25 |         if (msg.type() === 'error') {
  26 |             errors.push(msg.text());
  27 |         }
  28 |     });
  29 |     page.on('pageerror', (err) => {
  30 |         errors.push(err.message);
  31 |     });
  32 |     return errors;
  33 | }
  34 | 
  35 | /**
  36 |  * Kumpulkan failed network requests (4xx/5xx).
  37 |  */
  38 | export function collectFailedRequests(page: Page): string[] {
  39 |     const failed: string[] = [];
  40 |     page.on('response', (res) => {
  41 |         if (res.status() >= 400 && !res.url().includes('favicon')) {
  42 |             failed.push(`${res.status()} ${res.url()}`);
  43 |         }
  44 |     });
  45 |     return failed;
  46 | }
  47 | 
  48 | /**
  49 |  * Klik Shadcn Select trigger dan pilih option berdasarkan index
  50 |  */
  51 | export async function selectOption(
  52 |     page: Page,
  53 |     triggerText: string,
  54 |     optionIndex = 0,
  55 | ): Promise<void> {
  56 |     const trigger = page
  57 |         .locator(`button[role="combobox"]:near(:text("${triggerText}"))`)
  58 |         .or(page.locator('button[role="combobox"]').nth(optionIndex));
  59 |     await trigger.first().click();
  60 |     await page.locator('[role="option"]').nth(optionIndex).click();
  61 | }
  62 | 
```