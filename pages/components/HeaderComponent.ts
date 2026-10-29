import { Page, Locator } from '@playwright/test';

// Header shown on every logged-in page: menu and cart.
export class HeaderComponent {
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  async openCart() { await this.cartLink.click(); }

  async logout() {
    await this.page.getByRole('button', { name: 'Open Menu' }).click();
    // The Logout anchor has no href, so it has no link role.
    await this.page.getByTestId('logout-sidebar-link').click();
  }
}
