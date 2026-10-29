import { Page, Locator } from '@playwright/test';
import { toCents } from '../utils/money';

export type CustomerInfo = { firstName: string; lastName: string; postalCode: string };

// Covers the three checkout steps: information, overview and complete.
export class CheckoutPage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly error: Locator;
  readonly itemPrices: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly completeHeading: Locator;

  constructor(private readonly page: Page) {
    this.firstName = page.getByPlaceholder('First Name');
    this.lastName = page.getByPlaceholder('Last Name');
    this.postalCode = page.getByPlaceholder('Zip/Postal Code');
    this.error = page.getByTestId('error');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.completeHeading = page.getByRole('heading', { name: 'Thank you for your order!' });
  }

  async fillCustomerInfo(info: CustomerInfo) {
    await this.firstName.fill(info.firstName);
    await this.lastName.fill(info.lastName);
    await this.postalCode.fill(info.postalCode);
  }

  async cancel() { await this.page.getByRole('button', { name: 'Cancel' }).click(); }
  async continue() { await this.page.getByRole('button', { name: 'Continue' }).click(); }
  async finish() { await this.page.getByRole('button', { name: 'Finish' }).click(); }
  async backHome() { await this.page.getByRole('button', { name: 'Back Home' }).click(); }

  async subtotalCents() { return toCents(await this.subtotalLabel.textContent()); }
  async taxCents() { return toCents(await this.taxLabel.textContent()); }
}
