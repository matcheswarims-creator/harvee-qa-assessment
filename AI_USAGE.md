# AI Usage Disclosure

AI assistance was used to help structure the assessment, draft manual test cases, scaffold Playwright Page Object Model code, and draft written answers.

## What I asked for
- Create a focused manual test suite from the supplied Sauce Demo use case.
- Scaffold Playwright + TypeScript tests with Page Objects, no fixed sleeps, configuration outside test bodies, failure screenshots, and an HTML report.
- Review the sample AI-generated cart-total test and draft AI evaluation, defect, and client communication answers.

## What I reviewed or changed
- Mapped automated tests to manual case IDs and checked the requested scenario coverage.
- Added assertions for full-list price sorting, cart contents/counts, checkout total calculation, required-field validation, and access after logout.
- Section C2: wrote up my own observations from the `problem_user` account instead of inventing a production incident.

## Refactor against Playwright best practices
- **Asked for:** an AI coding assistant (Claude Code) to review the suite against the open-source Playwright best-practices guide from Currents (github.com/currents-dev/playwright-best-practices-skill) and apply what fits this project.
- **What changed:**
  - Split the single spec into one file per feature.
  - Injected page objects through custom fixtures and added a shared header component.
  - Moved assertions out of page objects into tests.
  - Moved the locators that were still in test bodies into page objects.
  - Switched CSS selectors to role, placeholder and `data-test` locators.
  - Added a setup project that logs in once and reuses the session.
  - Added `@smoke` and per-feature tags, plus `test.step` in longer tests.
  - Made assertions web-first, for example comparing the whole sorted price list with `toHaveText`.
  - Compared totals in cents.
  - Asserted the exact validation messages.
  - Added a JUnit report, timeouts, a type check and a GitHub Actions workflow.
- **What I checked:**
  - The assistant's first logout locator (`getByRole('link', { name: 'Logout' })`) failed because the anchor has no `href`. It was replaced with the `data-test` id.
  - TC22 no longer hardcodes the site's hostname, so `BASE_URL` overrides work.

## Second review by a different AI model
- **Asked for:** a separate AI model to review the whole submission against the brief and the same best-practices guide, and to suggest changes.
- **Applied:**
  - Automated TC07, TC08, TC10, TC13 and TC21, so all four sorts and both remove paths are covered.
  - Split the combined cart test into TC12 and TC14.
  - Listed one traceability row per case ID.
  - Restored the product-count check that the first refactor had dropped.
  - Checked the item total against the product price.
  - Sharpened the product-owner questions and the B1, B3 and B4 answers.
  - Added `.env.example` with `.env` loading.
  - Removed a GitHub Actions workflow the brief did not ask for.
- **Rejected:** suggestions that would have stated facts nobody had checked, for example that the bug "passes on 4.1.x".
- **Checked on the site before writing:**
  - whitespace-only checkout details are accepted (now TC05, kept manual pending the product owner);
  - Cancel on the information page returns to the cart;
  - the badge disappears when the last item is removed;
  - tax is 8%.

## Verification status
All 15 automated tests pass against the Sauce Demo practice site in Chromium, including 5 repeated runs (`npx playwright test --repeat-each=5`) with no flaky results. The `@smoke` subset and single tests run on their own.
