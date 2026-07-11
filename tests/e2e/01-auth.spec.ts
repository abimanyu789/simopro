import { test, expect } from '@playwright/test';

// Auth test tidak pakai storageState — sengaja test tanpa session
test.describe('Modul 1 — Authentication', () => {
    test('1.1 halaman / accessible (welcome page)', async ({ page }) => {
        await page.goto('/');
        // / adalah welcome page atau redirect ke login — kedua-duanya valid
        await expect(page.locator('body')).not.toContainText(
            /error|exception|whoops/i,
        );
    });

    test('1.2 akses /dashboard tanpa auth → redirect login', async ({
        page,
    }) => {
        await page.goto('/dashboard');
        // Harus redirect ke login
        await expect(page).toHaveURL(/login/, { timeout: 10000 });
    });

    test('1.3 login dengan kredensial benar', async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[type="email"]', 'admin@provillo.com');
        await page.fill('input[type="password"]', 'password');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/dashboard/, { timeout: 15000 });
    });

    test('1.4 login dengan email salah → pesan error tampil', async ({
        page,
    }) => {
        await page.goto('/login');
        await page.fill('input[type="email"]', 'wrong@wrong.com');
        await page.fill('input[type="password"]', 'password');
        await page.click('button[type="submit"]');
        // Laravel Fortify menampilkan "These credentials do not match our records."
        await expect(page.locator('body')).toContainText(
            /credentials do not match|salah|invalid/i,
            { timeout: 8000 },
        );
    });

    test('1.5 login dengan password salah → pesan error tampil', async ({
        page,
    }) => {
        await page.goto('/login');
        await page.fill('input[type="email"]', 'admin@provillo.com');
        await page.fill('input[type="password"]', 'wrongpassword');
        await page.click('button[type="submit"]');
        await expect(page.locator('body')).toContainText(
            /credentials do not match|salah|invalid/i,
            { timeout: 8000 },
        );
    });

    test('1.6 form login memiliki field email dan password', async ({
        page,
    }) => {
        await page.goto('/login');
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();
    });
});
