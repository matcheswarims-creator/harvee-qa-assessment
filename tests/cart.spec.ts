import { test, expect } from '../fixtures/test';
import { products } from '../test-data/shop';

test.describe('Cart', { tag: '@cart' }, () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('TC12 adds two products to the cart', async ({ inventoryPage, header, cartPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.bikeLight);
    await expect(header.cartBadge).toHaveText('2');

    await header.openCart();
    await expect(cartPage.itemNames).toHaveText([products.backpack, products.bikeLight]);
  });

  test('TC13 removes the last product from the products page', async ({ inventoryPage, header, cartPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await expect(header.cartBadge).toHaveText('1');

    await inventoryPage.removeFromCart(products.backpack);
    await expect(header.cartBadge).toHaveCount(0);

    await header.openCart();
    await expect(cartPage.items).toHaveCount(0);
  });

  test('TC14 removes one of two products from the cart page', async ({ inventoryPage, header, cartPage }) => {
    await test.step('add two products', async () => {
      await inventoryPage.addToCart(products.backpack);
      await inventoryPage.addToCart(products.bikeLight);
      await header.openCart();
      await expect(cartPage.itemNames).toHaveText([products.backpack, products.bikeLight]);
    });

    await test.step('remove one product in the cart', async () => {
      await cartPage.remove(products.bikeLight);
      await expect(cartPage.itemNames).toHaveText([products.backpack]);
      await expect(header.cartBadge).toHaveText('1');
    });
  });
});
