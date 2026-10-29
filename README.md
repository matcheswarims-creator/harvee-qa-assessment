# Harvee Technologies — QA Automation Assessment

**Candidate:** Matcheswari M  
**Role:** QA Automation Tester  
**Practice application:** https://www.saucedemo.com/

## Contents
- `A1_Manual_Test_Cases.md` — Section A1, including assumptions, 25 test cases, exploratory charter, and test strategy.
- `A1_Manual_Test_Cases.xlsx` — the same A1 content as a spreadsheet (one sheet each for test cases, questions, charter and strategy), with an extra column linking each case to its automated test.
- `tests/` — Playwright specs split by feature (`login`, `products`, `cart`, `checkout`, `access`) plus `auth.setup.ts`.
- `pages/` — Page Object Model classes (`components/` holds the shared header). All locators live here, never in test bodies.
- `fixtures/test.ts` — custom Playwright fixtures that provide the page objects to each test.
- `test-data/` — users, password, products and checkout data kept outside tests.
- `utils/money.ts` — parses prices into cents so totals are compared without floating-point errors.
- `playwright.config.ts` — base URL, timeouts, setup project, failure screenshots/videos, traces on retry, HTML and JUnit reports.
- `.env.example` — template for local overrides of the base URL and users.
- `ANSWERS.md` — Section B answers and Section C interview preparation.
- `AI_USAGE.md` — AI assistance disclosure.

## Prerequisites
- Node.js 20.12 or later (uses Node's built-in `.env` loading)
- npm
- Internet access to Sauce Demo

## Setup
```bash
npm install
npx playwright install chromium
```

The suite runs with Sauce Demo's public defaults. To override the base URL or users, copy the template and edit it:

```bash
cp .env.example .env
```

`.env` is gitignored. Variables set in the shell take precedence over `.env`:

**PowerShell**
```powershell
$env:BASE_URL="https://www.saucedemo.com"
$env:STANDARD_USER="standard_user"
$env:LOCKED_OUT_USER="locked_out_user"
$env:SAUCE_PASSWORD="secret_sauce"
npm test
```

**macOS/Linux**
```bash
BASE_URL="https://www.saucedemo.com" STANDARD_USER="standard_user" LOCKED_OUT_USER="locked_out_user" SAUCE_PASSWORD="secret_sauce" npm test
```

These credentials are for the public practice site only. Do not use this project against any other live system.

## Run
```bash
npm test               # full suite
npm run test:smoke     # @smoke tests only
npm run test:headed    # watch the browser
npm run test:report    # open the HTML report
npm run typecheck      # TypeScript check
npx playwright test -g TC09   # one test on its own
SLOW_MO=500 npm run test:headed -- --workers=1   # watch slowly, one test at a time
```

- **Login once, reuse the session:** the `setup` project logs in through the UI and saves the session to `.auth/` (gitignored). The other tests start already logged in, so each test opens its own page directly and does not depend on another test. TC01 and TC02 start logged out because they test the login form itself.
- **Isolation:** every test gets a fresh browser context and builds its own cart, so tests run in parallel and in any order.
- **Waiting:** no fixed sleeps; tests use Playwright's auto-waiting and web-first assertions (`toHaveText`, `toHaveURL`, `toHaveCount`).
- **Locators:** role and placeholder locators first; `data-test` ids (configured with `testIdAttribute`) where the page has no accessible role.
- **Tags:** each feature group has a tag (`@login`, `@products`, `@cart`, `@checkout`, `@security`); critical journeys also carry `@smoke`. Filter with `--grep`.
- **Evidence:** screenshots and video are saved on failure in `test-results/`; traces are recorded on the first retry when `CI` is set. The HTML report is in `playwright-report/` and JUnit XML in `results/junit.xml`.
- **Retries:** none locally so flaky tests stay visible; 2 when `CI` is set, where a pass on retry is reported as flaky.

## Manual-to-automation traceability

| Manual case ID | Automated test |
|---|---|
| TC01 | `TC01 standard user logs in` |
| TC02 | `TC02 locked-out user cannot log in` |
| TC03 | Manual only (automation candidate, not in this submission) |
| TC04 | Manual only (automation candidate, not in this submission) |
| TC05 | Manual only (rule needs product owner confirmation) |
| TC06 | Manual only (automation candidate, not in this submission) |
| TC07 | `TC07 sorts the full product list by name A to Z` |
| TC08 | `TC08 sorts the full product list by name Z to A` |
| TC09 | `TC09 sorts the full product list by price low to high` |
| TC10 | `TC10 sorts the full product list by price high to low` |
| TC11 | Manual only (automation candidate, not in this submission) |
| TC12 | `TC12 adds two products to the cart` |
| TC13 | `TC13 removes the last product from the products page` |
| TC14 | `TC14 removes one of two products from the cart page` |
| TC15 | Manual only (automation candidate, not in this submission) |
| TC16 | Covered by the "enter customer details" step of `TC20` |
| TC17 | `TC17 checkout validation: missing first name` |
| TC18 | `TC18 checkout validation: missing last name` |
| TC19 | `TC19 checkout validation: missing postal code` |
| TC20 | `TC20 checkout total is correct and cart is empty after order` |
| TC21 | `TC21 cancel on the information page returns to the cart without placing an order` |
| TC22 | `TC22 products URL is not accessible after logout` |
| TC23 | Manual only |
| TC24 | Manual only (viewport checks could be automated later) |
| TC25 | Manual only (keyboard checks could be automated later) |

The three missing-field cases (TC17–TC19) and the four sort cases (TC07–TC10) each come from one parameterized data set, with a separate test result for each input.

## Growing the suite to 200 tests
The structure already scales: one spec file per feature, page objects and a shared header component injected through fixtures, data in `test-data/`, and a saved login session so tests skip the login form. New features add a page object and a spec file without touching existing tests. I would run the `@smoke` tests on every pull request and the full regression suite on merge and nightly, sharded across CI workers and run on Firefox and WebKit as well as Chromium. I would monitor flaky-test rates, prefer stable role/test-id locators, and publish HTML/JUnit reports with traces for failures. API, accessibility, and cross-browser tests would be added where requirements and supported environments justify them.
