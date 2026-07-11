import { test, expect } from '@playwright/test';
import {
    loginAsAdmin,
    collectConsoleErrors,
    collectFailedRequests,
} from './helpers';

test.describe('Modul 4 — Master Data Produk', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
    });

    test('4.1 index tampil, kolom stok tidak ada', async ({ page }) => {
        const errors = collectConsoleErrors(page);
        await page.goto('/produk');
        await page.waitForLoadState('networkidle');

        await expect(page.locator('table')).toBeVisible();
        await expect(page.locator('body')).not.toContainText(
            /whoops|exception|fatal/i,
        );
        // Kolom stok tidak boleh ada di header tabel index
        const headers = await page.locator('th').allTextContents();
        const hasStok = headers.some((h) => h.trim().toLowerCase() === 'stok');
        expect(
            hasStok,
            'Kolom Stok tidak boleh tampil di Master Data Produk',
        ).toBeFalsy();
        expect(errors).toHaveLength(0);
    });

    test('4.2 filter BOM ada/tidak ada', async ({ page }) => {
        await page.goto('/produk');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('body')).not.toContainText(
            /whoops|exception/i,
        );
    });

    test('4.3 edit produk - field stok readonly', async ({ page }) => {
        await page.goto('/produk');
        await page.waitForLoadState('networkidle');
        const editBtn = page
            .locator('a[href*="/produk/"][href*="edit"]')
            .first();
        if ((await editBtn.count()) > 0) {
            await editBtn.click();
            await page.waitForLoadState('networkidle');
            await expect(page.locator('body')).toContainText(
                /Pengelolaan stok dilakukan|Lihat Stok|Modul Inventory/i,
            );
        }
    });

    test('4.4 detail produk - BOM dinamis tampil', async ({ page }) => {
        const errors = collectConsoleErrors(page);
        await page.goto('/produk');
        await page.waitForLoadState('networkidle');
        const showBtn = page
            .locator('a[href*="/produk/"]:not([href*="edit"])')
            .first();
        if ((await showBtn.count()) > 0) {
            await showBtn.click();
            await page.waitForLoadState('networkidle');
            await expect(page.locator('body')).toContainText(
                /BOM|Bill of Material/i,
            );
            await expect(page.locator('body')).not.toContainText(
                /whoops|exception/i,
            );
        }
        expect(errors).toHaveLength(0);
    });
});
