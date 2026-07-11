import { test as setup } from '@playwright/test';

const authFile = 'tests/e2e/.auth/user.json';

setup('authenticate', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[type="email"]', 'admin@provillo.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard**', { timeout: 15000 });

    // Simpan session state agar tidak perlu login ulang di setiap test
    await page.context().storageState({ path: authFile });
});
