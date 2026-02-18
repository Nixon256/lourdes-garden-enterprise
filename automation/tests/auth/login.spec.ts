import { test, expect } from '../../utils/fixtures';
import { TEST_USERS, ROUTES } from '../../utils/test-data';
import { waitForToast } from '../../utils/helpers';

/**
 * Authentication Tests
 * TC-AUTH-001 to TC-AUTH-006
 */

test.describe('Authentication Module', () => {
    // No global beforeEach to avoid interference with fixtures


    test('TC-AUTH-001: User Login - Valid Credentials @smoke @critical', async ({ page }) => {
        // Navigate to login page
        await page.goto(ROUTES.login);
        await expect(page).toHaveURL(/.*login/);

        // Fill in credentials
        await page.fill('input[name="email"], input[type="email"]', TEST_USERS.admin.email);
        await page.fill('input[name="password"], input[type="password"]', TEST_USERS.admin.password);

        // Submit form
        await page.click('button[type="submit"]');

        // Verify successful login
        await waitForToast(page, /welcome|success/i, 10000);

        // Should redirect to admin area
        await page.waitForURL(/\/(admin|dashboard)/, { timeout: 10000 });

        // Verify we're logged in
        const currentUrl = page.url();
        expect(currentUrl).toMatch(/\/(admin|dashboard)/);
    });

    test('TC-AUTH-002: User Login - Invalid Credentials @critical', async ({ page }) => {
        await page.goto(ROUTES.login);

        // Enter wrong credentials
        await page.fill('input[name="email"], input[type="email"]', TEST_USERS.admin.email);
        await page.fill('input[name="password"], input[type="password"]', 'WrongPassword123!');

        await page.click('button[type="submit"]');

        // Should show error
        await waitForToast(page, /invalid|error|incorrect|signin/i, 8000);

        // Should stay on login page
        await expect(page).toHaveURL(/.*login/);
    });

    test('TC-AUTH-003: User Login - Empty Fields @medium', async ({ page }) => {
        await page.goto(ROUTES.login);

        // Try to submit with empty fields
        await page.click('button[type="submit"]');

        // Should show validation errors or prevent submission
        const emailInput = page.locator('input[name="email"], input[type="email"]');
        const isRequired = await emailInput.getAttribute('required');

        // HTML5 validation or custom validation should prevent submission
        expect(isRequired !== null || await page.locator('text=/required|enter email/i').count() > 0).toBeTruthy();
    });

    test('TC-AUTH-004: User Registration - Valid Data @high', async ({ page }) => {
        // Check if registration page exists
        const hasRegisterPage = await page.goto(ROUTES.register).then(() => true).catch(() => false);

        if (!hasRegisterPage) {
            test.skip(true, 'Registration page not implemented yet');
            return;
        }

        const uniqueEmail = `test-${Date.now()}@example.com`;

        await page.fill('input[name="email"], input[type="email"]', uniqueEmail);
        await page.fill('input[name="password"]', 'Test123!@#');
        await page.fill('input[name="confirmPassword"]', 'Test123!@#');
        await page.fill('input[name="name"]', 'Test User');

        await page.click('button[type="submit"]');

        // Should show success or redirect
        await waitForToast(page, /success|registered|created|account/i, 15000);
    });

    test('TC-AUTH-006: Logout Functionality @high', async ({ authenticatedPage: page }) => {
        // User is already logged in via fixture
        await page.waitForLoadState('networkidle');

        // Wait for session to load and logout button to appear
        await expect(page.getByTestId('logout-button')).toBeVisible({ timeout: 10000 });

        await page.click('[data-testid="logout-button"]');

        // Verify logout (should redirect to home or login)
        await page.waitForURL(/.*login.*/, { timeout: 10000 });

        // Try to access admin page - should redirect
        await page.goto(ROUTES.adminProducts);
        await page.waitForTimeout(2000); // Wait for potential redirect

        const finalUrl = page.url();
        const isRedirected = finalUrl.includes('login') || !finalUrl.includes('admin');
        expect(isRedirected).toBeTruthy();
    });
});
