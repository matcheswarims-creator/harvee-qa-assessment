import { test as setup, expect } from '../fixtures/test';
import { credentials, storageStatePath } from '../test-data/credentials';

// Logs in once through the UI and saves the session, so other tests skip the login form.
setup('authenticate as standard user', async ({ page, loginPage }) => {
  await loginPage.goto();
  await loginPage.login(credentials.standardUser, credentials.password);
  await expect(page).toHaveURL(/inventory\.html/);
  await page.context().storageState({ path: storageStatePath });
});
