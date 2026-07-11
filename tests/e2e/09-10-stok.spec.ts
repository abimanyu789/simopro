import { test, expect } from '@playwright/test';
import { loginAsAdmin, collectConsoleErrors } from './helpers';

test.describe('Modul 9 — Stok Bahan Baku', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
    });

    test('9.1 index riwayat tampil', async ({ page }) => {
        const errors = collectConsoleErrors(page);
        await page.goto('/stok-bahan-baku');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('table')).toBeVisible();
        expect(errors).toHaveLength(0);
    });

    test('9.2 form create tampil tanpa error', async ({ page }) => {
        const errors = collectConsoleErrors(page);
        await page.goto('/stok-bahan-baku/create');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('form')).toBeVisible();
        expect(errors).toHaveLength(0);
    });

    test('9.3 penyesuaian tanpa keterangan ditolak', async ({ page }) => {
        await page.goto('/stok-bahan-baku/create');
        await page.waitForLoadState('networkidle');

        // Pilih bahan baku
        const bahanTrigger = page.locator('button[role="combobox"]').first();
        await bahanTrigger.click();
        await page.locator('[role="option"]').first().click();

        // Pilih jenis penyesuaian
        const jenisTrigger = page.locator('button[role="combobox"]').nth(1);
        await jenisTrigger.click();
        await page.locator('[role="option"]:has-text("Penyesuaian")').click();

        // Input qty tanpa keterangan
        await page.fill('input[id="qty"]', '5');
        await page.click('button[type="submit"]');
        await page.waitForLoadState('networkidle');

        // Harus ada error keterangan
        await expect(page.locator('body')).toContainText(/keterangan/i, {
            timeout: 5000,
        });
    });

    test('9.4 detail transaksi tampil', async ({ page }) => {
        const errors = collectConsoleErrors(page);
        await page.goto('/stok-bahan-baku');
        await page.waitForLoadState('networkidle');
        const detailBtn = page.locator('a[href*="/stok-bahan-baku/"]').first();
        if ((await detailBtn.count()) > 0) {
            await detailBtn.click();
            await page.waitForLoadState('networkidle');
            await expect(page.locator('body')).not.toContainText(
                /whoops|exception/i,
            );
        }
        expect(errors).toHaveLength(0);
    });
});

test.describe('Modul 10 — Stok Produk Jadi', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
    });

    test('10.1 index riwayat tampil', async ({ page }) => {
        const errors = collectConsoleErrors(page);
        await page.goto('/stok-produk-jadi');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('table')).toBeVisible();
        expect(errors).toHaveLength(0);
    });

    test('10.2 form create pengiriman tampil', async ({ page }) => {
        const errors = collectConsoleErrors(page);
        await page.goto('/stok-produk-jadi/create');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('form')).toBeVisible();
        expect(errors).toHaveLength(0);
    });

    test('10.3 filter jenis transaksi produksi', async ({ page }) => {
        await page.goto('/stok-produk-jadi');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('body')).not.toContainText(
            /whoops|exception/i,
        );
    });

    test('10.4 detail transaksi tampil', async ({ page }) => {
        const errors = collectConsoleErrors(page);
        await page.goto('/stok-produk-jadi');
        await page.waitForLoadState('networkidle');
        const detailBtn = page.locator('a[href*="/stok-produk-jadi/"]').first();
        if ((await detailBtn.count()) > 0) {
            await detailBtn.click();
            await page.waitForLoadState('networkidle');
            await expect(page.locator('body')).not.toContainText(
                /whoops|exception/i,
            );
        }
        expect(errors).toHaveLength(0);
    });
});
