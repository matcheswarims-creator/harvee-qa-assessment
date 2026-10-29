import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly items: Locator;
  readonly itemNames: Locator;

  constructor(private readonly page: Page) {
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
  }

  async remove(name: string) {
    await this.items.filter({ hasText: name }).getByRole('button', { name: 'Remove' }).click();
  }

  async checkout() { await this.page.getByRole('button', { name: 'Checkout' }).click(); }
}
