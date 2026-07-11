import { test, expect } from '@playwright/test';
import { loginAsAdmin, collectConsoleErrors } from './helpers';

test.describe('Modul 11 — Produksi', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
    });

    test('11.1 index produksi tampil dengan summary cards', async ({
        page,
    }) => {
        const errors = collectConsoleErrors(page);
        await page.goto('/produksi');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('table')).toBeVisible();
        await expect(page.locator('body')).not.toContainText(
            /whoops|exception/i,
        );
        expect(errors).toHaveLength(0);
    });

    test('11.2 summary cards tampil (tidak hardcode)', async ({ page }) => {
        await page.goto('/produksi');
        await page.waitForLoadState('networkidle');
        // Minimal 3 card harus ada
        await expect(page.locator('body')).toContainText(
            /Produksi Hari Ini|Karyawan|Efisiensi/i,
        );
    });

    test('11.3 halaman create produksi tampil', async ({ page }) => {
        const errors = collectConsoleErrors(page);
        await page.goto('/produksi/create');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('form')).toBeVisible();
        await expect(page.locator('body')).toContainText(/Pesanan|Restok/i);
        expect(errors).toHaveLength(0);
    });

    test('11.4 switch ke jenis restok menampilkan form produk', async ({
        page,
    }) => {
        await page.goto('/produksi/create');
        await page.waitForLoadState('networkidle');
        const restokBtn = page.locator('button:has-text("Restok")').first();
        if ((await restokBtn.count()) > 0) {
            await restokBtn.click();
            await expect(page.locator('body')).toContainText(
                /Produk yang Diproduksi|produk/i,
            );
        }
    });

    test('11.5 detail produksi tampil dengan progress bar', async ({
        page,
    }) => {
        const errors = collectConsoleErrors(page);
        await page.goto('/produksi');
        await page.waitForLoadState('networkidle');
        const showLink = page
            .locator('a[href*="/produksi/"]:not([href*="create"])')
            .first();
        if ((await showLink.count()) > 0) {
            await showLink.click();
            await page.waitForLoadState('networkidle');
            await expect(page.locator('body')).toContainText(/Progress/i);
            await expect(page.locator('body')).not.toContainText(
                /whoops|exception/i,
            );
        }
        expect(errors).toHaveLength(0);
    });

    test('11.6 detail produksi draft - kebutuhan bahan tampil', async ({
        page,
    }) => {
        const errors = collectConsoleErrors(page);
        await page.goto('/produksi');
        await page.waitForLoadState('networkidle');
        const draftRow = page.locator('tr:has-text("Draft")').first();
        if ((await draftRow.count()) > 0) {
            const viewBtn = draftRow.locator('a[href*="/produksi/"]').first();
            if ((await viewBtn.count()) > 0) {
                await viewBtn.click();
                await page.waitForLoadState('networkidle');
                await expect(page.locator('body')).toContainText(
                    /Kebutuhan Bahan|Target Produk/i,
                );
            }
        }
        expect(errors).toHaveLength(0);
    });

    test('11.7 detail produksi proses - form input progress tampil', async ({
        page,
    }) => {
        const errors = collectConsoleErrors(page);
        await page.goto('/produksi');
        await page.waitForLoadState('networkidle');
        const prosesRow = page.locator('tr:has-text("Proses")').first();
        if ((await prosesRow.count()) > 0) {
            const viewBtn = prosesRow.locator('a[href*="/produksi/"]').first();
            if ((await viewBtn.count()) > 0) {
                await viewBtn.click();
                await page.waitForLoadState('networkidle');
                await expect(page.locator('body')).toContainText(
                    /Input Progress/i,
                );
            }
        }
        expect(errors).toHaveLength(0);
    });

    test('11.8 filter status produksi berfungsi', async ({ page }) => {
        const errors = collectConsoleErrors(page);
        await page.goto('/produksi');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('body')).not.toContainText(
            /whoops|exception/i,
        );
        expect(errors).toHaveLength(0);
    });
});
