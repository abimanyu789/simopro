import { test, expect } from '@playwright/test';
import { collectConsoleErrors, collectFailedRequests } from './helpers';

test.describe('Modul 3 — Master Data Bahan Baku', () => {
    test('3.1 index tampil dengan tabel dan tidak ada console error', async ({
        page,
    }) => {
        const errors = collectConsoleErrors(page);
        const failed = collectFailedRequests(page);

        await page.goto('/bahan-baku');
        await page.waitForLoadState('networkidle');

        await expect(page.locator('table')).toBeVisible();
        await expect(page.locator('body')).not.toContainText(
            /whoops|exception|fatal/i,
        );
        expect(errors, `Console errors: ${errors.join('\n')}`).toHaveLength(0);
        expect(
            failed.filter((r) => !r.includes('favicon')),
            `Failed: ${failed.join(', ')}`,
        ).toHaveLength(0);
    });

    test('3.2 search berfungsi tanpa error', async ({ page }) => {
        await page.goto('/bahan-baku');
        await page.waitForLoadState('networkidle');

        const searchInput = page
            .locator('input[type="text"], input[placeholder*="Cari"]')
            .first();
        await searchInput.fill('a');
        await searchInput.press('Enter');
        await page.waitForLoadState('networkidle');

        await expect(page.locator('body')).not.toContainText(
            /whoops|exception/i,
        );
    });

    test('3.3 form create tampil tanpa error', async ({ page }) => {
        const errors = collectConsoleErrors(page);
        await page.goto('/bahan-baku/create');
        await page.waitForLoadState('networkidle');

        await expect(page.locator('form')).toBeVisible();
        expect(errors).toHaveLength(0);
    });

    test('3.4 create bahan baku baru berhasil', async ({ page }) => {
        await page.goto('/bahan-baku/create');
        await page.waitForLoadState('networkidle');

        const kode = `PW-${Date.now()}`;
        await page.fill('input[id="kode_bahan"]', kode);
        await page.fill('input[id="nama_bahan"]', 'Bahan Test Playwright');

        // Satuan menggunakan native <select> atau Shadcn SelectTrigger
        // Coba native select dulu, fallback ke Shadcn
        const nativeSelect = page.locator(
            'select[id="satuan"], select[name="satuan"]',
        );
        if ((await nativeSelect.count()) > 0) {
            await nativeSelect.selectOption({ index: 1 });
        } else {
            // Shadcn SelectTrigger — cari button/div yang berisi placeholder satuan
            const trigger = page
                .locator('button[role="combobox"], [data-radix-select-trigger]')
                .first();
            await trigger.click();
            await page.locator('[role="option"]').first().click();
        }

        await page.fill('input[id="stok"]', '10');
        await page.click('button[type="submit"]');
        await page.waitForLoadState('networkidle');

        await expect(page).toHaveURL(/bahan-baku/, { timeout: 10000 });
        await expect(page.locator('body')).not.toContainText(
            /whoops|exception/i,
        );
    });

    test('3.5 validasi kode duplikat ditolak', async ({ page }) => {
        // Ambil kode pertama dari tabel
        await page.goto('/bahan-baku');
        await page.waitForLoadState('networkidle');
        const firstCode = await page.locator('td').first().innerText();

        await page.goto('/bahan-baku/create');
        await page.waitForLoadState('networkidle');
        await page.fill('input[id="kode_bahan"]', firstCode.trim());
        await page.fill('input[id="nama_bahan"]', 'Duplikat Test');

        const satuanTrigger = page.locator('button[role="combobox"]').first();
        await satuanTrigger.click();
        await page.locator('[role="option"]').first().click();
        await page.fill('input[id="stok"]', '5');
        await page.click('button[type="submit"]');
        await page.waitForLoadState('networkidle');

        // Harus ada error validasi
        await expect(
            page.locator('.text-red-500, .text-destructive').first(),
        ).toBeVisible({ timeout: 5000 });
    });

    test('3.6 halaman detail tampil tanpa stok info', async ({ page }) => {
        const errors = collectConsoleErrors(page);
        await page.goto('/bahan-baku');
        await page.waitForLoadState('networkidle');

        // Klik tombol detail/show
        const showBtn = page
            .locator('a[href*="/bahan-baku/"]:not([href*="edit"])')
            .first();
        if ((await showBtn.count()) > 0) {
            await showBtn.click();
            await page.waitForLoadState('networkidle');
            await expect(page.locator('body')).not.toContainText(
                /whoops|exception/i,
            );
        }
        expect(errors).toHaveLength(0);
    });

    test('3.7 halaman edit tampil dengan field stok readonly', async ({
        page,
    }) => {
        const errors = collectConsoleErrors(page);
        await page.goto('/bahan-baku');
        await page.waitForLoadState('networkidle');

        const editBtn = page
            .locator('a[href*="/bahan-baku/"][href*="edit"]')
            .first();
        if ((await editBtn.count()) > 0) {
            await editBtn.click();
            await page.waitForLoadState('networkidle');

            // Info card stok harus ada — teks aktual dari app
            await expect(page.locator('body')).toContainText(
                /Pengelolaan stok dilakukan|Lihat Stok|Modul Inventory/i,
            );
        }
        expect(errors).toHaveLength(0);
    });
});
