# Section B — Written Answers

## B1. Review AI-generated code

### Problems identified

1. **Hardcoded URL and credentials:** Environment-specific settings and credentials should be configured outside the test. Credentials should not be committed to source control.
2. **No reusable structure:** Locators and actions are embedded in the test. A Page Object or reusable helper would make the test easier to maintain, especially in a larger suite.
3. **Ambiguous product locator:** `text=Add to cart` can match several buttons because each product has an Add to cart button. The test must scope the button to a specific product.
4. **Fixed wait:** `waitForTimeout(3000)` slows the test and can still be flaky. Use Playwright's auto-waiting and web-first assertions instead.
5. **No product/cart verification:** It never checks that the intended product was added or appears in the cart.
6. **No calculation validation:** It reads the final total but does not compare it with the item subtotal and tax.
7. **Weak assertion:** `toBeTruthy()` only checks that the total text is non-empty; it does not validate the amount.
8. **Checkout is not completed:** The test stops at the overview page and does not place the order or check the confirmation.
9. **No login/navigation assertion:** It does not verify that login succeeded or that the inventory page loaded.
10. **Unclear test data:** `A`, `B`, and `1` are unrealistic and make the test's intent unclear. Use valid, descriptive checkout data.
11. **Unknown starting state:** It does not explicitly establish a known cart state or verify the cart contents before checkout.
12. **Legacy API and selector style:** `page.click`/`page.fill` with CSS ids and the `text=` engine are discouraged. Locators such as `getByRole` and `getByPlaceholder` auto-wait and match what the user sees.
13. **Name does not match what is checked:** it is called "cart total is correct" but never looks at the cart and never checks a total.

### Rewritten test

Rewritten with the suite's page objects and fixtures. The logged-in session comes from the setup project and the base URL from configuration, so no URL or credentials appear in the test. It follows the same flow as TC20.

```typescript
import { test, expect } from '../fixtures/test';
import { customer, products } from '../test-data/shop';
import { formatCents, toCents } from '../utils/money';

test('cart total equals item total plus tax and the order completes', async ({ page, inventoryPage, header, cartPage, checkoutPage }) => {
  await inventoryPage.goto();
  await inventoryPage.addToCart(products.backpack);
  await expect(header.cartBadge).toHaveText('1');

  await header.openCart();
  await expect(cartPage.itemNames).toHaveText([products.backpack]);
  await cartPage.checkout();

  await checkoutPage.fillCustomerInfo(customer);
  await checkoutPage.continue();
  await expect(page).toHaveURL(/checkout-step-two\.html/);

  const itemPrice = toCents(await checkoutPage.itemPrices.textContent());
  await expect(checkoutPage.subtotalLabel).toHaveText(`Item total: ${formatCents(itemPrice)}`);
  const tax = await checkoutPage.taxCents();
  await expect(checkoutPage.totalLabel).toHaveText(`Total: ${formatCents(itemPrice + tax)}`);

  await checkoutPage.finish();
  await expect(checkoutPage.completeHeading).toBeVisible();
  await checkoutPage.backHome();
  await expect(header.cartBadge).toHaveCount(0);
});
```

## B2. AI feature evaluation — Test case generator

**Selected scenario:** An internal AI tool converts a user story into test cases in a fixed JSON format that is imported into a test management tool.

| Check | Method | Scoring |
|---|---|---|
| Coverage of story requirements | Rubric against a human-approved checklist of functional, negative, and boundary scenarios | 0 = critical scenarios missing; 1 = partial coverage; 2 = all required critical scenarios covered |
| Invented requirements | Human review against the original user story and acceptance criteria | Pass if no unsupported business rule is added; fail if a material requirement is invented |
| Duplicate cases | Automatic similarity/rule check, with human review of borderline pairs | Report the percentage of materially duplicated pairs; target zero material duplicates |
| Valid fixed-format JSON | Automatic JSON parsing and schema validation | Pass only if output parses and matches the required schema; otherwise fail |

**Release gate:** 100% JSON/schema pass; coverage score 2 on at least 90% of stories; zero invented requirements; pairs with text similarity above 0.9 flagged automatically and confirmed by a reviewer, with a target of zero confirmed duplicates.

I would evaluate representative clear, ambiguous, negative, and boundary-value user stories. I would record each result and review failures before changing the prompt or model. Generated cases must not be imported until JSON/schema validation passes and a reviewer confirms coverage and relevance.

## B3. Defect report

**Title:** [4.2.0] Price low-to-high sorting displays a higher-priced product before a lower-priced product

**Environment:** Sauce Demo, release 4.2.0, Chrome desktop, logged in as `standard_user`.

**Preconditions:** The user is logged in and the Products page is displayed.

**Steps to reproduce:**
1. Open the Products page.
2. Open the sorting dropdown.
3. Select **Price (low to high)**.
4. Review the product list and compare prices from top to bottom.

**Expected result:** All products are ordered by numeric price from lowest to highest.

**Actual result:** The $29.99 item appears before the $15.99 item.

**Reproducibility:** Every run since release 4.2.0 (consistent, not intermittent). Appears to be a regression introduced in 4.2.0.

**Affected scope:** The Price (low to high) sort on the Products page, seen in Chrome. Other sort options and browsers still to be checked.

**Severity:** Major. The selected sort order is incorrect and can mislead customers comparing prices; there is a workaround (other sort options or scrolling), so it is not Critical.

**Priority:** High — proposed release blocker for this shopping flow. Final priority to be confirmed by the product owner.

**Evidence to attach:** Screenshot showing the selected sort option and the two prices in the wrong order; short screen recording if available; test execution result; exact browser/version and reproduction steps; browser console log; HAR/network capture of the products request, to show whether the API returns the list unsorted or the page sorts it wrongly.

## B4. Message to the client (under 150 words)

Hi, our testing found two issues to consider before Friday's release. The "Price (low to high)" sort consistently shows a $29.99 item above a $15.99 one, so customers comparing prices see the wrong order. Separately, one checkout test fails about 1 time in 10 but passes when rerun; we need to investigate whether this reflects a product issue or an unstable test/environment.

I recommend delaying the full release until the sorting issue is fixed and checkout has been investigated and retested. A practical alternative: release Friday with the price-sort option hidden (if it can be switched off), after checkout passes 20 repeated runs, with monitoring and a rollback plan ready; turn sorting back on once fixed. I will share the defect evidence and updated results as soon as the investigation is complete.

## Section C — Issue analysis and production incidents

### C1. Client reports: “Checkout has been failing for some users since this morning.”

**1. Clarify the impact first**

I would acknowledge the report promptly and ask when the failures began, which users or regions are affected, whether the issue affects all payment methods or only certain ones, the exact error message, and whether the user can reproduce it. I would ask for approximate timestamps, order/session IDs where safe to share, browser/device details, and the checkout step where the failure occurs. I would not ask the client to send passwords or payment-card details.

**2. Check monitoring, logs, releases, and test results**

I would check error rates, checkout conversion, payment/API response codes, latency, application and server logs, and any alerts. I would compare the start time with recent deployments, feature-flag changes, configuration updates, database changes, and third-party payment-provider incidents. I would review CI results, smoke/regression tests, and recent defect reports. I would correlate events using timestamps and request/correlation IDs, while following access and privacy rules.

**3. Reproduce and narrow down the failing step**

I would try to reproduce the issue in a safe test or staging environment with representative test data. I would follow the checkout flow step by step—cart, address, shipping, payment authorization, order creation, and confirmation—and identify the first step that fails. I would compare a failing case with a successful one and vary one factor at a time, such as browser, account, payment method, or region. I would avoid creating real charges or duplicate orders during investigation.

**4. Distinguish a product defect from data or environment problems**

I would look for repeatable evidence and compare logs, request/response codes, configuration, account permissions, test data, and dependency health. If the same valid scenario fails across appropriate accounts or environments and the application behaves contrary to requirements, that supports a product defect. If it occurs only with invalid or inconsistent data, a specific account configuration, or a failing test environment/dependency, I would investigate that cause instead. I would keep the conclusion provisional until supported by evidence.

**5. Communicate while investigating**

I would tell the client that the issue is being investigated, summarize the known impact without speculation, explain any safe workaround if one is confirmed, and agree on the next update time. I would escalate promptly if checkout is broadly unavailable, payments may be duplicated, or orders may be lost. I would send updates even if the root cause is not yet known, then communicate the confirmed cause, mitigation, fix status, and verification results in plain language.

**6. Confirm the root cause and prevent recurrence**

After identifying the cause, I would help validate the fix with targeted tests and relevant regression coverage, check that orders and payments remain consistent, and monitor production after deployment. I would document the timeline, impact, evidence, root cause, resolution, and follow-up actions.

### C2. A recent issue I identified during this assessment

**Context:** I do not have a confirmed production incident that I personally found and owned. Rather than invent one, I describe what I actually observed on the Sauce Demo practice site with the `problem_user` account.

**1. What happened and how I found it**

During exploratory testing (charter EC01) I found: every product showed the same dog image; opening a product sometimes showed a different item; Remove on the products page did not work; none of the four sort options worked; the About link opened "Page Not Found"; and the Last Name field could not be filled at checkout, which blocks every order for that user.

**2. Root cause**

I reproduced each symptom and compared it with `standard_user`, which behaves correctly, so the problem is tied to the account rather than the environment. I did not establish the underlying code cause; in a real project I would check console and network errors, logs and recent changes before recording one.

**3. Explaining it to the client**

I would log each issue the same day with steps, screenshots and severity, and tell the product owner in plain words: "Customers on this account cannot complete an order, and product pictures and sorting are wrong, which can lead to wrong purchases."

**4. Stopping it happening again**

Add regression tests for image-to-product mapping, product details, removing items, all four sorts and required checkout fields, run for every listed user. No fixes were made here, so I cannot claim these checks have caught anything since.

**5. Looking back**

I would capture evidence the moment each issue appears and compare against a known-good account before generalising. If asked for a production incident from my employment, I would say I do not have a verified example rather than invent a root cause, client conversation or resolution.
