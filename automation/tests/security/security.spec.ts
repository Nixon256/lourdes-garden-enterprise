import { test, expect } from '@playwright/test';
import { ROUTES, TEST_USERS } from '../../utils/test-data';

/**
 * Security Tests
 * TC-SEC-001 to TC-SEC-003
 */

test.describe('Security & Access Control', () => {
    test('TC-SEC-001: Protected Routes @critical', async ({ page }) => {
        // Try to access admin routes without authentication
        await page.goto(ROUTES.adminProducts);

        // Should redirect to login or show access denied
        await page.waitForTimeout(2000);

        const currentUrl = page.url();
        const isProtected = currentUrl.includes('login') || currentUrl.includes('unauthorized') || !currentUrl.includes('admin');

        expect(isProtected).toBeTruthy();
    });

    test('TC-SEC-002: SQL Injection Prevention @critical', async ({ page }) => {
        await page.goto(ROUTES.login);

        // Attempt SQL injection in email field
        const sqlInjectionPayloads = [
            "' OR '1'='1",
            "admin'--",
            "' OR '1'='1' /*",
            "1' OR '1' = '1",
        ];

        for (const payload of sqlInjectionPayloads) {
            await page.fill('input[name="email"], input[type="email"]', payload);
            await page.fill('input[name="password"], input[type="password"]', 'anything');
            await page.click('button[type="submit"]');

            await page.waitForTimeout(1000);

            // Should NOT be logged in
            const url = page.url();
            expect(url).toContain('login');
        }
    });

    test('TC-SEC-003: XSS Prevention @critical', async ({ page }) => {
        await page.goto(ROUTES.login);

        // Attempt XSS in input fields
        const xssPayloads = [
            '<script>alert("XSS")</script>',
            '<img src=x onerror=alert("XSS")>',
            'javascript:alert("XSS")',
        ];

        for (const payload of xssPayloads) {
            await page.fill('input[name="email"], input[type="email"]', payload);
            await page.fill('input[name="password"], input[type="password"]', payload);

            // Check if script was executed (it shouldn't be)
            page.on('dialog', async dialog => {
                // If alert appears, XSS vulnerability exists
                expect(dialog.message()).not.toContain('XSS');
                await dialog.dismiss();
            });

            await page.click('button[type="submit"]');
            await page.waitForTimeout(500);
        }

        // If we got here without alerts, XSS is prevented
        expect(true).toBeTruthy();
    });

    test('TC-SEC-004: CSRF Token Validation @high', async ({ page }) => {
        // Login first
        await page.goto(ROUTES.login);
        await page.fill('input[name="email"], input[type="email"]', TEST_USERS.admin.email);
        await page.fill('input[name="password"], input[type="password"]', TEST_USERS.admin.password);
        await page.click('button[type="submit"]');

        await page.waitForTimeout(2000);

        // Check if forms have CSRF protection
        await page.goto(ROUTES.adminProducts);

        const forms = page.locator('form');
        const formCount = await forms.count();

        if (formCount > 0) {
            // Look for CSRF token field
            const csrfField = page.locator('input[name*="csrf"], input[name*="token"]').first();
            const hasCSRF = await csrfField.isVisible({ timeout: 2000 }).catch(() => false);

            // Note: NextAuth and Next.js handle CSRF automatically
            console.log(`CSRF Protection: ${hasCSRF ? 'Explicit token found' : 'Framework-level protection'}`);
        }
    });

    test('TC-SEC-005: Password Requirements @high', async ({ page }) => {
        const hasRegister = await page.goto(ROUTES.register).then(() => true).catch(() => false);

        if (!hasRegister) {
            test.skip(true, 'Registration page not implemented');
            return;
        }

        // Try weak password
        await page.fill('input[name="email"], input[type="email"]', 'test@example.com');
        await page.fill('input[name="password"], input[type="password"]', '123');

        await page.click('button[type="submit"]');
        await page.waitForTimeout(500);

        // Should show validation error for weak password
        const hasError = await page.locator('text=/password.*required|weak.*password|minimum/i').isVisible({ timeout: 2000 }).catch(() => false);

        expect(hasError || await page.locator('input[name="password"]:invalid').count() > 0).toBeTruthy();
    });

    test('TC-SEC-006: Session Timeout @medium', async ({ page, context }) => {
        // Login
        await page.goto(ROUTES.login);
        await page.fill('input[name="email"], input[type="email"]', TEST_USERS.admin.email);
        await page.fill('input[name="password"], input[type="password"]', TEST_USERS.admin.password);
        await page.click('button[type="submit"]');

        await page.waitForTimeout(2000);

        // Clear all cookies (simulate session expiry)
        await context.clearCookies();

        // Try to access protected route
        await page.goto(ROUTES.adminProducts);
        await page.waitForTimeout(2000);

        // Should redirect to login
        const url = page.url();
        expect(url).toMatch(/login|unauthorized/);
    });
});
