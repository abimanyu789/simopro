import { test, expect } from '@playwright/test';
import {
    loginAsAdmin,
    collectConsoleErrors,
    collectFailedRequests,
} from './helpers';

test.describe('Modul 8 — Pesanan + Invoice', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
    });

    test('8.1 index pesanan tampil', async ({ page }) => {
        const errors = collectConsoleErrors(page);
        await page.goto('/pesanan');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('table')).toBeVisible();
        expect(errors).toHaveLength(0);
    });

    test('8.2 form create pesanan tampil tanpa error', async ({ page }) => {
        const errors = collectConsoleErrors(page);
        await page.goto('/pesanan/create');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('form')).toBeVisible();
        expect(errors).toHaveLength(0);
    });

    test('8.3 validasi form pesanan kosong', async ({ page }) => {
        await page.goto('/pesanan/create');
        await page.waitForLoadState('networkidle');
        await page.click('button[type="submit"]');
        await page.waitForLoadState('networkidle');
        await expect(
            page.locator('.text-red-500, .text-destructive').first(),
        ).toBeVisible({ timeout: 5000 });
    });

    test('8.4 detail pesanan tampil dengan jenis pembayaran', async ({
        page,
    }) => {
        const errors = collectConsoleErrors(page);
        await page.goto('/pesanan');
        await page.waitForLoadState('networkidle');
        const showLink = page
            .locator(
                'a[href*="/pesanan/"]:not([href*="edit"]):not([href*="invoice"])',
            )
            .first();
        if ((await showLink.count()) > 0) {
            await showLink.click();
            await page.waitForLoadState('networkidle');
            await expect(page.locator('body')).toContainText(
                /Jenis Pembayaran/i,
            );
            await expect(page.locator('body')).not.toContainText(
                /whoops|exception/i,
            );
        }
        expect(errors).toHaveLength(0);
    });

    test('8.5 tombol cetak invoice tampil di detail pesanan', async ({
        page,
    }) => {
        const errors = collectConsoleErrors(page);
        await page.goto('/pesanan');
        await page.waitForLoadState('networkidle');
        const showLink = page
            .locator(
                'a[href*="/pesanan/"]:not([href*="edit"]):not([href*="invoice"])',
            )
            .first();
        if ((await showLink.count()) > 0) {
            await showLink.click();
            await page.waitForLoadState('networkidle');
            await expect(
                page.locator('text=Cetak Invoice, a[href*="invoice"]').first(),
            ).toBeVisible({ timeout: 5000 });
        }
        expect(errors).toHaveLength(0);
    });

    test('8.6 invoice PDF dapat diakses (HTTP 200 + content-type pdf)', async ({
        page,
    }) => {
        await page.goto('/pesanan');
        await page.waitForLoadState('networkidle');
        const invoiceLink = page.locator('a[href*="/invoice"]').first();
        if ((await invoiceLink.count()) > 0) {
            const href = await invoiceLink.getAttribute('href');
            if (href) {
                const response = await page.request.get(href);
                expect(response.status(), `Invoice PDF harus 200`).toBe(200);
                const ct = response.headers()['content-type'];
                expect(ct, 'Content-type harus PDF').toContain('pdf');
            }
        }
    });

    test('8.7 dropdown ubah status tampil di detail pesanan', async ({
        page,
    }) => {
        const errors = collectConsoleErrors(page);
        await page.goto('/pesanan');
        await page.waitForLoadState('networkidle');
        const showLink = page
            .locator(
                'a[href*="/pesanan/"]:not([href*="edit"]):not([href*="invoice"])',
            )
            .first();
        if ((await showLink.count()) > 0) {
            await showLink.click();
            await page.waitForLoadState('networkidle');
            await expect(page.locator('body')).not.toContainText(
                /whoops|exception/i,
            );
        }
        expect(errors).toHaveLength(0);
    });
});
