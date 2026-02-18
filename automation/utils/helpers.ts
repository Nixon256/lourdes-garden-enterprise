import { Page, expect } from '@playwright/test';
import { TEST_USERS, ROUTES } from './test-data';

/**
 * Helper Functions for E2E Tests
 */

/**
 * Login as a specific user
 */
export async function login(page: Page, userType: 'admin' | 'customer' = 'admin') {
    const user = TEST_USERS[userType];

    await page.goto(ROUTES.login);
    await page.fill('input[name="email"], input[type="email"]', user.email);
    await page.fill('input[name="password"], input[type="password"]', user.password);
    await page.click('button[type="submit"]');

    // Wait for navigation after login
    await page.waitForURL(/\/(admin|customer)?/, { timeout: 10000 });
}

/**
 * Logout user
 */
export async function logout(page: Page) {
    // Look for user menu or logout button
    const logoutButton = page.locator('text=/logout/i, button:has-text("Sign Out")').first();
    if (await logoutButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await logoutButton.click();
    }
}

/**
 * Wait for toast notification
 */
export async function waitForToast(page: Page, expectedText?: string | RegExp, timeout: number = 5000) {
    const toast = page.locator('[role="status"], .toast, [data-sonner-toast]').first();
    await expect(toast).toBeVisible({ timeout });

    if (expectedText) {
        await expect(toast).toContainText(expectedText, { timeout });
    }

    return toast;
}

/**
 * Fill form field by label
 */
export async function fillFieldByLabel(page: Page, label: string, value: string) {
    const input = page.locator(`label:has-text("${label}") + input, input[placeholder*="${label}" i]`).first();
    await input.fill(value);
}

/**
 * Select dropdown option by label
 */
export async function selectByLabel(page: Page, label: string, option: string) {
    const select = page.locator(`label:has-text("${label}") + select, select[aria-label="${label}"]`).first();
    await select.selectOption(option);
}

/**
 * Upload file
 */
export async function uploadFile(page: Page, selector: string, filePath: string) {
    const fileInput = page.locator(selector);
    await fileInput.setInputFiles(filePath);
}

/**
 * Wait for API response
 */
export async function waitForAPIResponse(page: Page, urlPattern: string | RegExp, timeout: number = 10000) {
    return page.waitForResponse(
        (response) => {
            const url = response.url();
            if (typeof urlPattern === 'string') {
                return url.includes(urlPattern);
            }
            return urlPattern.test(url);
        },
        { timeout }
    );
}

/**
 * Add product to cart (for shopping tests)
 */
export async function addToCart(page: Page, productName?: string) {
    if (productName) {
        // Find specific product and add to cart
        const productCard = page.locator(`[data-testid="product-card"]:has-text("${productName}")`).first();
        await productCard.locator('button:has-text("Add to Cart")').click();
    } else {
        // Add first available product
        await page.locator('button:has-text("Add to Cart")').first().click();
    }

    // Wait for toast confirmation
    await waitForToast(page);
}

/**
 * Clear shopping cart
 */
export async function clearCart(page: Page) {
    // Open cart
    const cartButton = page.locator('[data-testid="cart-button"], button:has-text("Cart")').first();
    await cartButton.click();

    // Remove all items
    const removeButtons = page.locator('button:has-text("Remove"), [data-testid="remove-item"]');
    const count = await removeButtons.count();

    for (let i = 0; i < count; i++) {
        await removeButtons.first().click();
        await page.waitForTimeout(500);
    }
}

/**
 * Take screenshot with timestamp
 */
export async function takeScreenshot(page: Page, name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({
        path: `test-results/screenshots/${name}-${timestamp}.png`,
        fullPage: true
    });
}

/**
 * Check if element exists
 */
export async function elementExists(page: Page, selector: string): Promise<boolean> {
    try {
        await page.waitForSelector(selector, { timeout: 2000 });
        return true;
    } catch {
        return false;
    }
}

/**
 * Get table row count
 */
export async function getTableRowCount(page: Page, tableSelector: string = 'table tbody tr'): Promise<number> {
    return await page.locator(tableSelector).count();
}

/**
 * Search in admin panel
 */
export async function searchInAdmin(page: Page, query: string) {
    const searchInput = page.locator('input[type="text"][placeholder*="Search" i], input[type="search"]').first();
    await searchInput.fill(query);
    await page.waitForTimeout(500); // Debounce
}

/**
 * Navigate to page and wait for load
 */
export async function navigateAndWait(page: Page, url: string) {
    await page.goto(url);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
        // Ignore timeout, sometimes network doesn't go idle
    });
}
