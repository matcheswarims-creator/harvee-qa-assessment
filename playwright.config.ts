import { defineConfig, devices } from '@playwright/test';
import { storageStatePath } from './test-data/credentials';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? '50%' : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [
    [process.env.CI ? 'github' : 'list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'results/junit.xml' }]
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
    testIdAttribute: 'data-test',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    // Optional pause between actions (ms) for watching a headed run, e.g. SLOW_MO=500.
    launchOptions: { slowMo: Number(process.env.SLOW_MO) || 0 }
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: storageStatePath },
      dependencies: ['setup']
    }
  ]
});
