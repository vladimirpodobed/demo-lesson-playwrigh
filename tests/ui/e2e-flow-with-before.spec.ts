import { test, expect } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { LoginPage } from '../pages/login-page'
import { OrderPage } from '../pages/order-page'
import { USERNAME, PASSWORD } from '../../config/env-data'

// Login page
let loginPage: LoginPage

// Open login page before each test
test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page)
  await loginPage.open()
})

// Test 1. Sign in button disabled when password
// is less than 8 characters
test('signIn button disabled when password is less than 8 characters', async () => {
  await loginPage.usernameField.fill(faker.lorem.word(2))
  await loginPage.passwordField.fill(faker.lorem.word(7))

  await expect(loginPage.signInButton).toBeDisabled()
})

// Test 2. Invalid credentials should lead to error
test('signIn with invalid credentials should lead to error', async () => {
  await loginPage.usernameField.fill(faker.lorem.word(2))
  await loginPage.passwordField.fill(faker.lorem.word(9))

  await loginPage.signInButton.click()

  await expect(loginPage.authError).toBeVisible()
})

// Test 3. Login with correct credentials
// and verify order creation page
test('login with correct credentials and verify order creation page', async () => {
  const orderCreationPage: OrderPage = await loginPage.signIn(USERNAME, PASSWORD)

  await expect(orderCreationPage.usernameInput).toBeVisible()
  await expect(orderCreationPage.phoneInput).toBeVisible()
  await expect(orderCreationPage.commentInput).toBeVisible()
  await expect(orderCreationPage.createOrderButton).toBeVisible()
})

// Test 4. Check errors on order creation
test('check errors on order creation', async () => {
  const orderCreationPage: OrderPage = await loginPage.signIn(USERNAME, PASSWORD)

  // Fill form with invalid data
  await orderCreationPage.usernameInput.fill('a')
  await orderCreationPage.phoneInput.fill('12345')
  await orderCreationPage.commentInput.fill('leave nearby')

  // Check that create order button is disabled
  await expect(orderCreationPage.createOrderButton).toBeDisabled()
})

// Test 5. Logout from order page
test('logout from order page', async ({ page }) => {
  const orderCreationPage: OrderPage = await loginPage.signIn(USERNAME, PASSWORD)

  // Logout
  await orderCreationPage.logoutButton.click()

  // Check login button
  await expect(loginPage.signInButton).toBeVisible()

  // Check URL
  await expect(page).toHaveURL(/signin/)
})

// Test 6. Order not found page
test('order not found page', async () => {
  const orderCreationPage: OrderPage = await loginPage.signIn(USERNAME, PASSWORD)

  // Open order search
  await orderCreationPage.statusButton.click()

  // Search for non-existing order
  await orderCreationPage.searchOrderInput.fill('25000')
  await orderCreationPage.searchOrderButton.click()

  // Checks
  await expect(orderCreationPage.orderNotFoundText).toBeVisible()
  await expect(orderCreationPage.orderNotFoundImage).toBeVisible()
})

// Test 7. Order found page
test('order found page', async () => {
  const orderCreationPage: OrderPage = await loginPage.signIn(USERNAME, PASSWORD)

  // Search for existing order
  await orderCreationPage.statusButton.click()

  // Fill order number
  await orderCreationPage.searchOrderInput.fill('20616')
  await orderCreationPage.searchOrderButton.click()

  // Checks
  await expect(orderCreationPage.orderStatusOpen).toBeVisible()
  await expect(orderCreationPage.orderNameDetails).toBeVisible()
})
