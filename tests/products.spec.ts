import { test, expect } from '../fixtures/test';
import { SortOption } from '../pages/InventoryPage';
import { productCount } from '../test-data/shop';
import { toCents } from '../utils/money';

const byName = (a: string, b: string) => a.localeCompare(b);
const byPrice = (a: string, b: string) => toCents(a) - toCents(b);

const sorts: { id: string; title: string; option: SortOption; column: 'itemNames' | 'itemPrices'; compare: typeof byName }[] = [
  { id: 'TC07', title: 'by name A to Z', option: 'az', column: 'itemNames', compare: byName },
  { id: 'TC08', title: 'by name Z to A', option: 'za', column: 'itemNames', compare: (a, b) => byName(b, a) },
  { id: 'TC09', title: 'by price low to high', option: 'lohi', column: 'itemPrices', compare: byPrice },
  { id: 'TC10', title: 'by price high to low', option: 'hilo', column: 'itemPrices', compare: (a, b) => byPrice(b, a) }
];

test.describe('Product sorting', { tag: '@products' }, () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  for (const { id, title, option, column, compare } of sorts) {
    test(`${id} sorts the full product list ${title}`, async ({ inventoryPage }) => {
      // Start from a different order so the default A to Z list cannot pass by accident.
      await inventoryPage.sortBy(option === 'az' ? 'za' : 'az');
      const values = inventoryPage[column];
      await expect(values).toHaveCount(productCount);
      const expected = [...(await values.allTextContents())].sort(compare);

      await inventoryPage.sortBy(option);

      // Compares every product in order, not only the first item.
      await expect(values).toHaveText(expected);
    });
  }
});
