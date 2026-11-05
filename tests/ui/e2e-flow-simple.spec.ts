import { test, expect } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { LoginPage } from '../pages/login-page'
import { OrderPage } from '../pages/order-page'
import { USERNAME, PASSWORD } from '../../config/env-data'

// Test 1. Проверяем, что кнопка входа отключена,
// если пароль содержит меньше 8 символов
test('signIn button disabled when password is less than 8 characters', async ({ page }) => {
  const loginPage = new LoginPage(page)

  await loginPage.open()

  // Вводим случайное имя пользователя
  await loginPage.usernameField.fill(faker.lorem.word(2))

  // Вводим короткий пароль
  await loginPage.passwordField.fill(faker.lorem.word(7))

  // Проверяем, что кнопка входа отключена
  await expect(loginPage.signInButton).toBeDisabled()
})

// Test 2. Проверяем сообщение об ошибке
// при вводе неправильных учётных данных
test('signIn with invalid credentials should lead to error', async ({ page }) => {
  const loginPage = new LoginPage(page)

  await loginPage.open()

  // Вводим случайное имя пользователя
  await loginPage.usernameField.fill(faker.lorem.word(2))

  // Вводим неправильный пароль
  await loginPage.passwordField.fill(faker.lorem.word(9))

  // Нажимаем кнопку входа
  await loginPage.signInButton.click()

  // Проверяем сообщение об ошибке
  await expect(loginPage.authError).toBeVisible()
})

// Test 3. Проверяем вход с правильными учётными данными
// и открытие страницы создания заказа
test('login with correct credentials and verify order creation page', async ({ page }) => {
  const loginPage = new LoginPage(page)

  // Выполняем вход
  const orderCreationPage: OrderPage = await loginPage.signIn(USERNAME, PASSWORD)

  // Проверяем элементы страницы создания заказа
  await expect(orderCreationPage.usernameInput).toBeVisible()
  await expect(orderCreationPage.phoneInput).toBeVisible()
  await expect(orderCreationPage.commentInput).toBeVisible()
  await expect(orderCreationPage.createOrderButton).toBeVisible()
})
