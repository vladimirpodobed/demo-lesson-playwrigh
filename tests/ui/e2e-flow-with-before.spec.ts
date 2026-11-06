import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login-page'
import { faker } from '@faker-js/faker'
import { PASSWORD, USERNAME } from '../../config/env-data'

let loginPage: LoginPage

// Перед каждым тестом открываем страницу авторизации
test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page)
  await loginPage.open()
})

// Test 1. Проверяем, что кнопка входа отключена,
// если пароль содержит меньше 8 символов
test('signIn button disabled when password is less than 8 characters', async ({}) => {
  // Вводим случайное имя пользователя
  await loginPage.usernameField.fill(faker.lorem.word(2))

  // Вводим короткий пароль
  await loginPage.passwordField.fill(faker.lorem.word(7))

  // Проверяем, что кнопка входа отключена
  await expect(loginPage.signInButton).toBeDisabled()
})

// Test 2. Проверяем сообщение об ошибке
// при вводе неправильных учётных данных
test('signIn with invalid credentials should lead to error', async ({}) => {
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
test('login with correct credentials and verify order creation page', async ({}) => {
  const orderCreationPage = await loginPage.signIn(USERNAME, PASSWORD)

  // Проверяем элементы страницы создания заказа
  await expect(orderCreationPage.statusButton).toBeVisible()
  await expect(orderCreationPage.usernameInput).toBeVisible()
  await expect(orderCreationPage.phoneInput).toBeVisible()
  await expect(orderCreationPage.commentInput).toBeVisible()
  await expect(orderCreationPage.createOrderButton).toBeVisible()
})

// Test 4. Проверяем создание нового заказа
test('login and create order', async ({}) => {
  const orderCreationPage = await loginPage.signIn(USERNAME, PASSWORD)

  // Заполняем данные нового заказа
  await orderCreationPage.usernameInput.fill('random-user')
  await orderCreationPage.phoneInput.fill('56765434')
  await orderCreationPage.commentInput.fill('Testing')

  // Создаём заказ
  await orderCreationPage.createOrderButton.click()

  // Проверяем сообщение об успешном создании заказа
  await expect(orderCreationPage.successMessage).toBeVisible()
})

// Test 5. Проверяем ошибки при создании заказа
test('check error on order creation', async ({}) => {
  const orderCreationPage = await loginPage.signIn(USERNAME, PASSWORD)

  // Вводим некорректные данные
  await orderCreationPage.usernameInput.fill('r')
  await orderCreationPage.phoneInput.fill('55434')
  await orderCreationPage.commentInput.fill('Testing')

  // Проверяем, что кнопка создания заказа отключена
  await expect(orderCreationPage.createOrderButton).toBeDisabled()

  // Проверяем сообщения об ошибках
  await expect(orderCreationPage.customerNameError).toBeVisible()
  await expect(orderCreationPage.phoneError).toBeVisible()
})

// Test 6. Проверяем выход из учётной записи
test('log out from order page', async ({}) => {
  const orderCreationPage = await loginPage.signIn(USERNAME, PASSWORD)

  // Выходим из учётной записи
  await orderCreationPage.logoutButton.click()

  // Проверяем возвращение на страницу авторизации
  await expect(loginPage.signInButton).toBeVisible()
  await expect(orderCreationPage.logoutButton).toBeHidden()
})

// Test 7. Проверяем страницу, если заказ не найден
test('order not found page', async ({}) => {
  const orderCreationPage = await loginPage.signIn(USERNAME, PASSWORD)

  // Открываем окно поиска заказа
  await orderCreationPage.statusButton.click()

  // Вводим номер несуществующего заказа
  await orderCreationPage.searchOrderInput.fill('123986')

  // Запускаем поиск
  await orderCreationPage.searchOrderButton.click()

  // Проверяем сообщение об отсутствии заказа
  await expect(orderCreationPage.orderNotFoundText).toBeVisible()

  // Проверяем изображение отсутствующего заказа
  await expect(orderCreationPage.orderNotFoundImage).toBeVisible()
})

// Test 8. Проверяем страницу найденного заказа
test('order found page', async ({}) => {
  const orderCreationPage = await loginPage.signIn(USERNAME, PASSWORD)

  // Открываем окно поиска заказа
  await orderCreationPage.statusButton.click()

  // Вводим номер существующего заказа
  await orderCreationPage.searchOrderInput.fill('20619')

  // Запускаем поиск
  await orderCreationPage.searchOrderButton.click()

  // Проверяем статус и информацию о заказе
  await expect(orderCreationPage.orderStatusOpen).toBeVisible()
  await expect(orderCreationPage.orderNameDetails).toBeVisible()
})
