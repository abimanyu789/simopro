import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: false,
    forbidOnly: false,
    retries: 0,
    workers: 1,
    reporter: [
        ['list'],
        ['html', { outputFolder: 'tests/e2e/report', open: 'never' }],
    ],
    use: {
        baseURL: 'http://localhost:8000',
        headless: true,
        screenshot: 'only-on-failure',
        video: 'off',
        trace: 'off',
        actionTimeout: 10000,
        navigationTimeout: 20000,
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
            testIgnore: ['**/auth.setup.ts'],
        },
    ],
});
