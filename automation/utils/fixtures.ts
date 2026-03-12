import { test as base, expect, Page } from '@playwright/test';
import { login } from './helpers';

/**
 * Custom Fixtures for Test Automation
 * Extends Playwright's base test with custom fixtures
 */

type CustomFixtures = {
    authenticatedPage: Page;
    adminPage: Page;
    customerPage: Page;
};

/**
 * Extended test with custom fixtures
 */
export const test = base.extend<CustomFixtures>({
    /**
     * Fixture: Authenticated page (admin user)
     */
    authenticatedPage: async ({ page }, use) => {
        await login(page, 'admin');
        await use(page);
    },

    /**
     * Fixture: Admin authenticated page
     */
    adminPage: async ({ page }, use) => {
        await login(page, 'admin');
        await use(page);
    },

    /**
     * Fixture: Customer authenticated page
     */
    customerPage: async ({ page }, use) => {
        await login(page, 'customer');
        await use(page);
    },
});

export { expect };
