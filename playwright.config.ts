import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 30000,

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 1 : 0,

  workers: process.env.CI ? 4 : undefined,

  maxFailures: 2,

  reporter: 'html',

  use: {
    headless: !!process.env.CI, //Теперь браузеры будут открываться, и я сможегу наблюдать за выполнением тестов.
    trace: 'on-first-retry',

    // IMPORTANT: application uses data-name instead of data-testid
    testIdAttribute: 'data-name',

    viewport: { width: 1920, height: 1080 },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
})
