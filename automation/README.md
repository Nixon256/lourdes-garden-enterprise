# 🧪 Lourdes Garden Enterprise - Test Automation

Professional E2E test automation using Playwright for the Lourdes Garden Enterprise platform.

## 📋 Prerequisites

- Node.js 18+ installed
- Main application running on `http://localhost:3000`
- Test data seeded in database

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Install Playwright Browsers
```bash
npx playwright install
```

### 3. Run Tests
```bash
# Run all tests (headless)
npm test

# Run tests with browser visible
npm run test:headed

# Run tests in UI mode (interactive)
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Run specific browser tests
npm run test:chrome
npm run test:firefox
npm run test:safari
```

## 📂 Folder Structure

```
automation/
├── tests/
│   ├── auth/              # Authentication tests
│   ├── admin/             # Admin panel tests
│   ├── cart/              # Shopping cart tests
│   ├── checkout/          # Checkout flow tests
│   └── ui/                # UI/UX tests
├── utils/
│   ├── fixtures.ts        # Custom fixtures
│   ├── helpers.ts         # Helper functions
│   └── test-data.ts       # Test data
├── playwright.config.ts   # Playwright configuration
└── package.json
```

## 🎯 Test Execution

### Run Specific Test Files
```bash
npx playwright test tests/auth/login.spec.ts
npx playwright test tests/admin/products.spec.ts
```

### Run Tests by Tag
```bash
npx playwright test --grep @smoke
npx playwright test --grep @critical
```

### Run Tests on Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run Tests on Mobile
```bash
npx playwright test --project=mobile-chrome
npx playwright test --project=mobile-safari
```

## 📊 Test Reports

### View HTML Report
```bash
npm run report
```

### Report Locations
- HTML Report: `test-results/html-report/index.html`
- JSON Report: `test-results/results.json`
- JUnit Report: `test-results/junit.xml`

## 🛠️ Test Development

### Generate Tests with Codegen
```bash
npm run codegen
```

This opens a browser where you can:
1. Interact with your app
2. Playwright records your actions
3. Generates test code automatically

### Debug Tests
```bash
npm run test:debug
```

This opens Playwright Inspector for step-by-step debugging.

## 📝 Writing Tests

### Basic Test Example
```typescript
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'admin@lourdesgarden.com');
  await page.fill('input[name="password"]', 'Admin123!');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/admin/dashboard');
});
```

### Using Custom Fixtures
```typescript
import { test } from '../utils/fixtures';

test('admin can create product', async ({ authenticatedPage }) => {
  // authenticatedPage is already logged in
  await authenticatedPage.goto('/admin/products/new');
  // ... test steps
});
```

## 🎨 Best Practices

1. **Use Page Object Model** - Organize locators and actions
2. **Tag Tests** - Use `@smoke`, `@regression`, `@critical` tags
3. **Parallel Execution** - Tests run in parallel by default
4. **Data-Driven Tests** - Use fixtures for test data
5. **Screenshot on Failure** - Automatically captured
6. **Video Recording** - Recorded on failure for debugging

## 📦 Test Data

Test credentials (after seeding database):

**Admin User:**
- Email: `admin@lourdesgarden.com`
- Password: `Admin123!`

**Customer User:**
- Email: `customer@example.com`
- Password: `Customer123!`

## 🔧 Configuration

Edit `playwright.config.ts` to customize:
- Base URL
- Test timeout
- Browsers to test
- Parallel workers
- Screenshot/video settings
- Reporter configuration

## 🐛 Troubleshooting

### Tests Failing - Server Not Running
Ensure the main app is running:
```bash
cd ..
npm run dev
```

### Browser Installation Issues
```bash
npx playwright install --with-deps
```

### Clear Test Cache
```bash
rm -rf test-results
rm -rf playwright-report
```

## 📈 CI/CD Integration

### GitHub Actions Example
```yaml
- name: Install dependencies
  run: cd automation && npm ci
  
- name: Install Playwright Browsers
  run: cd automation && npx playwright install --with-deps
  
- name: Run tests
  run: cd automation && npm test
  
- name: Upload test results
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: automation/test-results/
```

## 📞 Support

For test automation issues, check:
1. Playwright documentation: https://playwright.dev
2. Test case documentation: See `test_cases.md` in artifacts
3. Main app README: `../README.md`

---

**Happy Testing! 🧪**
