import { test, expect } from '../fixtures/test';
import { credentials } from '../test-data/credentials';

test.describe('Login', { tag: '@login' }, () => {
  // These tests exercise the login form itself, so they start logged out.
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('TC01 standard user logs in', { tag: '@smoke' }, async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(credentials.standardUser, credentials.password);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('TC02 locked-out user cannot log in', async ({ page, loginPage }) => {
    await loginPage.login(credentials.lockedOutUser, credentials.password);
    await expect(loginPage.error).toContainText('Sorry, this user has been locked out.');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });
});
