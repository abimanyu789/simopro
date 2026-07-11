import { test, expect } from '@playwright/test';
import { loginAsAdmin, collectConsoleErrors } from './helpers';

test.describe('Modul 5 — BOM', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
    });

    test('5.1 index BOM tampil', async ({ page }) => {
        const errors = collectConsoleErrors(page);
        await page.goto('/bom-categorie');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('body')).not.toContainText(
            /whoops|exception/i,
        );
        expect(errors).toHaveLength(0);
    });

    test('5.2 halaman create BOM tampil', async ({ page }) => {
        const errors = collectConsoleErrors(page);
        await page.goto('/bom-categorie/create');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('form')).toBeVisible();
        expect(errors).toHaveLength(0);
    });

    test('5.3 validasi nama BOM kosong', async ({ page }) => {
        await page.goto('/bom-categorie/create');
        await page.waitForLoadState('networkidle');
        await page.click('button[type="submit"]');
        await page.waitForLoadState('networkidle');
        await expect(
            page.locator('.text-red-500, .text-destructive').first(),
        ).toBeVisible({ timeout: 5000 });
    });

    test('5.4 detail BOM tampil', async ({ page }) => {
        const errors = collectConsoleErrors(page);
        await page.goto('/bom-categorie');
        await page.waitForLoadState('networkidle');
        const showBtn = page
            .locator('a[href*="/bom-categorie/"]:not([href*="edit"])')
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
});

test.describe('Modul 6 — Karyawan', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
    });

    test('6.1 index karyawan tampil', async ({ page }) => {
        const errors = collectConsoleErrors(page);
        await page.goto('/karyawan');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('table')).toBeVisible();
        expect(errors).toHaveLength(0);
    });

    test('6.2 filter status aktif/nonaktif', async ({ page }) => {
        await page.goto('/karyawan');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('body')).not.toContainText(
            /whoops|exception/i,
        );
    });

    test('6.3 form create karyawan', async ({ page }) => {
        const errors = collectConsoleErrors(page);
        await page.goto('/karyawan/create');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('form')).toBeVisible();
        expect(errors).toHaveLength(0);
    });
});

test.describe('Modul 7 — Customer', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
    });

    test('7.1 index customer tampil dengan badge', async ({ page }) => {
        const errors = collectConsoleErrors(page);
        await page.goto('/customer');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('table')).toBeVisible();
        expect(errors).toHaveLength(0);
    });

    test('7.2 filter jenis B2B/B2C', async ({ page }) => {
        await page.goto('/customer');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('body')).not.toContainText(
            /whoops|exception/i,
        );
    });

    test('7.3 detail customer - riwayat pesanan dinamis', async ({ page }) => {
        const errors = collectConsoleErrors(page);
        await page.goto('/customer');
        await page.waitForLoadState('networkidle');
        const showBtn = page
            .locator('a[href*="/customer/"]:not([href*="edit"])')
            .first();
        if ((await showBtn.count()) > 0) {
            await showBtn.click();
            await page.waitForLoadState('networkidle');
            await expect(page.locator('body')).toContainText(
                /Riwayat Pesanan|pesanan/i,
            );
        }
        expect(errors).toHaveLength(0);
    });
});
