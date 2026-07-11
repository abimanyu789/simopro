import { type Page } from '@playwright/test';

export const BASE_URL = 'http://localhost:8000';
export const ADMIN_EMAIL = 'admin@provillo.com';
export const ADMIN_PASSWORD = 'password';

/**
 * Login sebagai admin - dipanggil di beforeEach setiap describe block
 */
export async function loginAsAdmin(page: Page): Promise<void> {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard**', { timeout: 15000 });
}

/**
 * Kumpulkan console errors selama test.
 */
export function collectConsoleErrors(page: Page): string[] {
    const errors: string[] = [];
    page.on('console', (msg) => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
        }
    });
    page.on('pageerror', (err) => {
        errors.push(err.message);
    });
    return errors;
}

/**
 * Kumpulkan failed network requests (4xx/5xx).
 */
export function collectFailedRequests(page: Page): string[] {
    const failed: string[] = [];
    page.on('response', (res) => {
        if (res.status() >= 400 && !res.url().includes('favicon')) {
            failed.push(`${res.status()} ${res.url()}`);
        }
    });
    return failed;
}

/**
 * Klik Shadcn Select trigger dan pilih option berdasarkan index
 */
export async function selectOption(
    page: Page,
    triggerText: string,
    optionIndex = 0,
): Promise<void> {
    const trigger = page
        .locator(`button[role="combobox"]:near(:text("${triggerText}"))`)
        .or(page.locator('button[role="combobox"]').nth(optionIndex));
    await trigger.first().click();
    await page.locator('[role="option"]').nth(optionIndex).click();
}
