import { test, expect } from '../fixtures/test';

test.describe('Access control', { tag: '@security' }, () => {
  test('TC22 products URL is not accessible after logout', { tag: '@smoke' }, async ({ page, inventoryPage, header, loginPage }) => {
    await inventoryPage.goto();
    await header.logout();
    await expect(loginPage.loginButton).toBeVisible();

    await page.goto('/inventory.html');

    await expect(page).not.toHaveURL(/inventory\.html/);
    await expect(loginPage.error).toContainText("You can only access '/inventory.html' when you are logged in.");
    await expect(inventoryPage.items).toHaveCount(0);
  });
});
