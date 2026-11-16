import { defineConfig, devices } from '@playwright/test' // Импортируем инструменты для настройки Playwright и готовые конфигурации браузеров.

export default defineConfig({ // Экспортируем конфигурацию Playwright.

  testDir: './tests', // Папка, в которой находятся тесты.
  timeout: 30000, // Максимальное время выполнения одного теста — 30 секунд.

  fullyParallel: true, // Разрешаем параллельное выполнение тестов.

  forbidOnly: !!process.env.CI, // Запрещаем test.only в CI, чтобы случайно не пропустить остальные тесты.

  retries: process.env.CI ? 1 : 0, // В CI повторяем упавший тест один раз, локально не повторяем.

  workers: process.env.CI ? 4 : 1, // В CI используем 4 рабочих процесса, локально — 1.

  maxFailures: 2, // Останавливаем запуск после двух неудачных тестов.

  reporter: 'html', // Формируем HTML-отчёт с результатами тестирования.

  use: { // Общие настройки для всех тестов.
    headless: !!process.env.CI, // В CI браузер работает в фоновом режиме, локально открывается с интерфейсом.
    trace: 'on-first-retry', // Сохраняем трассировку при первом повторном запуске упавшего теста.
    testIdAttribute: 'data-name', // Используем data-name вместо стандартного data-testid для поиска элементов.
    viewport: { width: 1920, height: 1080 }, // Устанавливаем размер окна браузера: 1920 × 1080 пикселей.
  },

  projects: [ // Определяем браузеры, в которых будут запускаться тесты.
    {
      name: 'chromium', // Название проекта — Chromium.
      use: { ...devices['Desktop Chrome'] }, // Используем настройки настольного Chrome.
    },

    {
      name: 'firefox', // Название проекта — Firefox.
      use: { ...devices['Desktop Firefox'] }, // Используем настройки настольного Firefox.
    },

    {
      name: 'webkit', // Название проекта — WebKit.
      use: { ...devices['Desktop Safari'] }, // Используем настройки настольного Safari.
    },
  ],
})
