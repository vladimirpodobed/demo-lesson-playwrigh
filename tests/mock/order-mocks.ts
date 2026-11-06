import { Page } from '@playwright/test'

// Mock for existing order
export async function existingOrderMock(page: Page): Promise<void> {
  const order = {
    status: 'OPEN',
    courierId: null,
    customerName: 'Mark',
    customerPhone: '55667788',
    comment: 'keep near door',
    id: 23999,
  }

  await page.route('**/orders/*', async (route) => {
    await route.fulfill({
      body: JSON.stringify(order),
      contentType: 'application/json',
    })
  })
}

// Mock for non-existing order
export async function nonExistingOrderMock(page: Page): Promise<void> {
  await page.route('**/orders/*', async (route) => {
    await route.fulfill({
      status: 500,
      body: '',
    })
  })
}

// Mock for order creation
export async function orderCreationMock(page: Page): Promise<void> {
  await page.route('**/orders', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'OPEN',
          courierId: null,
          customerName: 'Mark',
          customerPhone: '55667788',
          comment: 'keep near door',
          id: 23999,
        }),
      })
    } else {
      await route.continue()
    }
  })
}
