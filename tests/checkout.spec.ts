import { test, expect } from '../fixtures/test';
import { customer, products } from '../test-data/shop';
import { formatCents, toCents } from '../utils/money';

test.describe('Checkout', { tag: '@checkout' }, () => {
  test.beforeEach(async ({ inventoryPage, header, cartPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(products.backpack);
    await header.openCart();
    await cartPage.checkout();
  });

  test('TC20 checkout total is correct and cart is empty after order', { tag: '@smoke' }, async ({ page, header, cartPage, checkoutPage }) => {
    await test.step('enter customer details', async () => {
      await checkoutPage.fillCustomerInfo(customer);
      await checkoutPage.continue();
      await expect(page).toHaveURL(/checkout-step-two\.html/);
    });

    await test.step('item total matches the product price', async () => {
      await expect(checkoutPage.itemPrices).toHaveCount(1);
      const itemPrice = toCents(await checkoutPage.itemPrices.textContent());
      await expect(checkoutPage.subtotalLabel).toHaveText(`Item total: ${formatCents(itemPrice)}`);
    });

    await test.step('total equals item total plus tax', async () => {
      const subtotal = await checkoutPage.subtotalCents();
      const tax = await checkoutPage.taxCents();
      await expect(checkoutPage.totalLabel).toHaveText(`Total: ${formatCents(subtotal + tax)}`);
    });

    await test.step('finish places the order and empties the cart', async () => {
      await checkoutPage.finish();
      await expect(checkoutPage.completeHeading).toBeVisible();
      await checkoutPage.backHome();
      await expect(header.cartBadge).toHaveCount(0);
      await header.openCart();
      await expect(cartPage.items).toHaveCount(0);
    });
  });

  test('TC21 cancel on the information page returns to the cart without placing an order', async ({ page, header, cartPage, checkoutPage }) => {
    await checkoutPage.cancel();

    await expect(page).toHaveURL(/cart\.html/);
    await expect(cartPage.itemNames).toHaveText([products.backpack]);
    await expect(header.cartBadge).toHaveText('1');
  });

  const missingFields = [
    { id: 'TC17', field: 'first name', info: { ...customer, firstName: '' }, error: 'Error: First Name is required' },
    { id: 'TC18', field: 'last name', info: { ...customer, lastName: '' }, error: 'Error: Last Name is required' },
    { id: 'TC19', field: 'postal code', info: { ...customer, postalCode: '' }, error: 'Error: Postal Code is required' }
  ];

  for (const { id, field, info, error } of missingFields) {
    test(`${id} checkout validation: missing ${field}`, async ({ page, checkoutPage }) => {
      await checkoutPage.fillCustomerInfo(info);
      await checkoutPage.continue();
      await expect(checkoutPage.error).toHaveText(error);
      await expect(page).toHaveURL(/checkout-step-one\.html/);
    });
  }
});
