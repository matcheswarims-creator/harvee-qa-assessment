# Section A1 — Manual Test Suite

**Name:** Matcheswari M  
**Role:** QA Automation Tester  
**Organization:** Harvee Technologies  
**Application:** Sauce Demo  
**Test approach:** Manual functional, negative, boundary, usability, accessibility, compatibility, and security testing.

## 1. Questions and Assumptions

| ID | Question for Product Owner | Assumption if unanswered |
|---|---|---|
| Q1 | Should the cart be kept when the user logs out and logs back in? | Yes; the same user sees the same cart contents. |
| Q2 | Are names or a postal code made only of spaces valid at checkout? | No; they are treated as empty and rejected with the required-field error. |
| Q3 | Should sorting consider every product? | Yes, the entire product list must be sorted correctly. |
| Q4 | Should the chosen sort order be kept after visiting the cart or a product page? | No; the products page returns to the default Name (A to Z) order. |
| Q5 | Can the same product be added more than once? | Verify the application's behavior and ensure the badge and cart remain consistent. |
| Q6 | Is the postal code validated against a specific format? | A non-empty postal code is accepted unless stricter validation is specified. |
| Q7 | What is the tax rate, and how is tax rounded? | Tax is 8% of the item total (the rate observed on the site), rounded to the cent; total = item total + tax. |
| Q8 | Where should Cancel go from the information page and from the overview page? | Information page → cart; overview page → products page. No order is placed and the cart is kept. |
| Q9 | Which browsers and screen sizes are supported? | Test Chrome at desktop and narrow mobile viewport sizes. |
| Q10 | What accessibility standard must the application meet? | Check keyboard navigation, visible focus, and accessible form controls. |

## 2. Manual Test Cases

Priority definitions:
- **P1:** Critical business flow, security, or major functionality.
- **P2:** Important functionality or validation.
- **P3:** Lower-risk usability improvement.

| ID | Area | Type | Title | Pre-conditions | Steps | Test data | Expected result | Priority | Automate? Why? |
|---|---|---|---|---|---|---|---|---|---|
| TC01 | Login | Positive | Standard user logs in | Login page open | Enter credentials and click Login | `standard_user` / `secret_sauce` | Products page appears | P1 | Yes — critical smoke test |
| TC02 | Login | Negative | Locked-out user login | Login page open | Enter credentials and click Login | `locked_out_user` / `secret_sauce` | Error appears; login is denied | P1 | Yes — repeatable negative test |
| TC03 | Login | Negative | Invalid password | Login page open | Enter valid username and wrong password | `standard_user` / `wrong123` | Error appears; user remains logged out | P1 | Yes — authentication regression |
| TC04 | Login | Boundary | Submit empty login form | Login page open | Click Login without entering data | Empty username and password | Validation error appears; login is denied | P2 | Yes — deterministic validation |
| TC05 | Checkout | Boundary | Customer details made only of spaces | Product in cart; checkout information page open | Enter spaces only in first name, last name and postal code; click Continue | `"   "` in each field | Treated as empty: required-field error appears and checkout does not continue (assumption Q2) | P2 | No — the rule needs product owner confirmation first. The site currently accepts these values and opens the overview page; raise it with Q2 |
| TC06 | Products | Positive | Verify product listing | Logged in as standard user | Inspect product cards | All displayed products | Product names, prices, and Add to cart controls are displayed | P1 | Yes — core functionality |
| TC07 | Sorting | Positive | Sort by name A to Z | Products page open | Select Name (A to Z) | All product names | All names appear in ascending alphabetical order | P1 | Yes — compare full list |
| TC08 | Sorting | Positive | Sort by name Z to A | Products page open | Select Name (Z to A) | All product names | All names appear in descending alphabetical order | P2 | Yes — sorting regression |
| TC09 | Sorting | Positive | Sort by price low to high | Products page open | Select Price (low to high) | All product prices | Entire list is in ascending numeric price order | P1 | Yes — critical sorting check |
| TC10 | Sorting | Positive | Sort by price high to low | Products page open | Select Price (high to low) | All product prices | Entire list is in descending numeric price order | P1 | Yes — critical sorting check |
| TC11 | Cart | Positive | Add one product | Products page open; cart empty | Click Add to cart for one product | Sauce Labs Bike Light | Button changes to Remove; badge shows 1 | P1 | Yes — core cart behavior |
| TC12 | Cart | Positive | Add two products | Products page open; cart empty | Add two different products | Bike Light and Backpack | Badge shows 2; both products appear in cart | P1 | Yes — repeatable cart test |
| TC13 | Cart | Boundary | Remove the last product from products page | Exactly one product added | Click Remove on its card; open cart | Backpack | Badge disappears (1 → 0); cart is empty | P1 | Yes — regression test |
| TC14 | Cart | Positive | Remove product from cart page | Two products added | Open cart and remove one | Bike Light and Backpack | Removed product disappears; remaining item and badge are correct | P1 | Yes — regression test |
| TC15 | Cart | Boundary | Open empty cart | Logged in; no items added | Open cart | Empty cart | No product rows appear; checkout cannot place an order with no items | P2 | Yes — boundary validation |
| TC16 | Checkout | Positive | Continue with valid customer details | At least one product in cart | Click Checkout, fill all fields, and click Continue | First name: Test; last name: User; postal code: 641001 | Checkout overview appears | P1 | Yes — checkout smoke test |
| TC17 | Checkout | Negative | Missing first name | Product in cart; checkout information page open | Leave first name blank and submit | Last name: User; postal code: 641001 | "Error: First Name is required" appears; checkout does not continue | P1 | Yes — parameterized validation |
| TC18 | Checkout | Negative | Missing last name | Product in cart; checkout information page open | Leave last name blank and submit | First name: Test; postal code: 641001 | "Error: Last Name is required" appears; checkout does not continue | P1 | Yes — parameterized validation |
| TC19 | Checkout | Negative | Missing postal code | Product in cart; checkout information page open | Leave postal code blank and submit | First name: Test; last name: User | "Error: Postal Code is required" appears; checkout does not continue | P1 | Yes — parameterized validation |
| TC20 | Checkout | Positive | Verify order totals and finish | Checkout overview displayed | Compare subtotal, tax, and total; click Finish | One or more products | Total equals subtotal plus tax; confirmation appears and cart is emptied | P1 | Yes — end-to-end critical flow |
| TC21 | Checkout | Positive | Cancel checkout from the information page | Product in cart; checkout information page open | Click Cancel | Backpack | Returns to the cart; product still in cart; badge unchanged; no order placed | P2 | Yes — repeatable navigation test |
| TC22 | Security | Negative | Access products page after logout | User logged in | Log out; navigate directly to `/inventory.html` | Logged-out session | Protected products content is not accessible; user is redirected to login or denied access | P1 | Yes — security regression |
| TC23 | Usability | Positive | Verify navigation and feedback | Products page open | Use menu, cart, and action buttons | Standard user | Labels and feedback are clear; navigation is understandable | P3 | No — human judgment is useful |
| TC24 | Compatibility | Positive | Check narrow-screen layout | Products page open | Resize viewport to mobile dimensions; inspect and navigate | 375 × 667 viewport | Text, prices, and controls remain usable without unintended overlap or clipping | P2 | Partly — automate viewport checks; manual visual review |
| TC25 | Accessibility | Positive | Check keyboard accessibility | Login and products pages available | Navigate with Tab and Shift+Tab; activate controls with keyboard | Keyboard only | Focus is visible, controls are keyboard-operable, and labels are understandable | P2 | Partly — automate keyboard checks; manual review remains necessary |

**Notes:**
- Test cases are based on the stated business rules and assumptions. Confirm actual application behavior during execution.
- If behavior differs from an assumption, record the actual result and raise a defect only when it conflicts with an agreed requirement.
- A redirect alone does not prove security; verify that protected content is not accessible after logout.

## 3. Exploratory Testing Charter — 15 Minutes

**Charter ID:** EC01  
**Title:** Explore the application using `problem_user`  
**Objective:** Discover unexpected behavior affecting a user account known to have problems.  
**Test data:** `problem_user` / `secret_sauce`

| Time | Activity | What to inspect |
|---|---|---|
| 0–3 minutes | Log in and inspect the product listing | Product names, images, layout, and page loading |
| 3–6 minutes | Try all four sorting options | Complete product order and consistency with selected sort |
| 6–10 minutes | Add and remove products | Cart badge, product names, prices, and button states |
| 10–13 minutes | Try checkout and cancellation | Form validation, displayed totals, and cancellation behavior |
| 13–15 minutes | Record findings | Reproduction steps, expected and actual results, screenshots, and severity |

**Exit criteria:** Document every issue found with reproducible steps, supporting evidence, and potential business impact. Do not assume a defect exists before observing it.

## 4. Test Strategy

I would automate stable, high-priority regression flows at the UI layer, including login, locked-out login, all four sorting options, cart operations, checkout validation, total calculation, order completion, and access after logout. I would use API tests for authentication, cart, and order calculations where supported APIs are available, and unit tests for tax calculations and business rules where source code is accessible. I would keep exploratory testing, visual usability, accessibility judgment, and browser-specific visual checks partly manual, supported by automated accessibility and viewport checks. The biggest remaining risk is an incorrect order total or an incorrectly placed order in production, resulting in customer complaints or financial discrepancies. I would recommend prioritizing checkout validation, price calculations, and order confirmation before release.
