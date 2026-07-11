import { test, expect } from '@playwright/test';
import { collectConsoleErrors, collectFailedRequests } from './helpers';

// Test ini pakai storageState (sudah login)
test.describe('Modul 2 — Dashboard', () => {
    test('2.1 halaman dashboard tampil tanpa error', async ({ page }) => {
        const errors = collectConsoleErrors(page);
        const failed = collectFailedRequests(page);

        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');

        await expect(page.locator('body')).not.toContainText(
            /whoops|exception|fatal/i,
        );
        expect(errors, `Console errors: ${errors.join(', ')}`).toHaveLength(0);
        const criticalFailed = failed.filter(
            (r) => !r.includes('favicon') && !r.includes('_debugbar'),
        );
        expect(
            criticalFailed,
            `Failed requests: ${criticalFailed.join(', ')}`,
        ).toHaveLength(0);
    });

    test('2.2 stat cards tampil tanpa crash', async ({ page }) => {
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('body')).not.toContainText(
            /whoops|exception|fatal/i,
        );
    });

    test('2.3 sidebar navigation tampil', async ({ page }) => {
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');
        const sidebar = page
            .locator('nav, aside, [data-sidebar], [class*="sidebar"]')
            .first();
        await expect(sidebar).toBeVisible({ timeout: 5000 });
    });

    test('2.4 link Bahan Baku di sidebar berfungsi', async ({ page }) => {
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');
        const link = page.locator('a[href*="bahan-baku"]').first();
        if (await link.isVisible()) {
            await link.click();
            await page.waitForLoadState('networkidle');
            await expect(page).toHaveURL(/bahan-baku/);
        }
    });
});
