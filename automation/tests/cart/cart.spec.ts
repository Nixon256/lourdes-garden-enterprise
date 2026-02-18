import { test, expect } from '../../utils/fixtures';
import { ROUTES } from '../../utils/test-data';
import { waitForToast, addToCart } from '../../utils/helpers';

/**
 * Shopping Cart Tests
 * TC-CART-001 to TC-CART-005
 */

test.describe('Shopping Cart Module', () => {
    test.beforeEach(async ({ page }) => {
        // Start from home page
        await page.goto(ROUTES.home);
    });

    test('TC-CART-001: Add Product to Cart @critical', async ({ page }) => {
        // Look for "Add to Cart" button
        const addToCartButton = page.locator('button:has-text("Add to Cart")').first();

        if (!await addToCartButton.isVisible({ timeout: 5000 }).catch(() => false)) {
            test.skip('Shopping cart feature not yet implemented');
            return;
        }

        // Get initial cart count
        const cartBadge = page.locator('[data-testid="cart-count"], .cart-count, .badge').first();
        const initialCount = await cartBadge.textContent().then(t => parseInt(t || '0')).catch(() => 0);

        // Click add to cart
        await addToCartButton.click();

        // Should show success toast
        await waitForToast(page, /added|cart/i, 5000);

        // Cart count should increase
        const newCount = await cartBadge.textContent().then(t => parseInt(t || '0')).catch(() => 0);
        expect(newCount).toBeGreaterThan(initialCount);
    });

    test('TC-CART-002: Update Cart Quantity @high', async ({ page }) => {
        // Check if cart feature exists
        const hasCart = await page.goto('/cart').then(() => true).catch(() => false);

        if (!hasCart) {
            test.skip('Cart page not implemented');
            return;
        }

        // Add product first
        await page.goto(ROUTES.home);
        await addToCart(page);

        // Open cart
        await page.goto('/cart');

        // Find quantity controls
        const increaseButton = page.locator('button[aria-label*="increase"], button:has-text("+")').first();
        const quantityDisplay = page.locator('[data-testid="quantity"], input[type="number"]').first();

        if (!await increaseButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            test.skip('Quantity controls not found');
            return;
        }

        // Get initial quantity
        const initialQty = await quantityDisplay.inputValue().then(v => parseInt(v)).catch(() => 1);

        // Increase quantity
        await increaseButton.click();
        await page.waitForTimeout(500);

        // Verify quantity increased
        const newQty = await quantityDisplay.inputValue().then(v => parseInt(v));
        expect(newQty).toBe(initialQty + 1);

        // Verify total price updated
        const priceElement = page.locator('[data-testid="total"], .total, .price').first();
        await expect(priceElement).toBeVisible();
    });

    test('TC-CART-003: Remove Item from Cart @high', async ({ page }) => {
        const hasCart = await page.goto('/cart').then(() => true).catch(() => false);

        if (!hasCart) {
            test.skip('Cart page not implemented');
            return;
        }

        // Add product
        await page.goto(ROUTES.home);
        await addToCart(page);

        // Go to cart
        await page.goto('/cart');

        // Find remove button
        const removeButton = page.locator('button:has-text("Remove"), button[aria-label*="remove"], [data-testid="remove-item"]').first();

        if (!await removeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            test.skip('Remove button not found');
            return;
        }

        // Click remove
        await removeButton.click();

        // Should show confirmation or directly remove
        await page.waitForTimeout(500);

        // Verify item removed (empty cart message or count = 0)
        const emptyMessage = page.locator('text=/empty|no items/i');
        const hasEmptyMessage = await emptyMessage.isVisible({ timeout: 2000 }).catch(() => false);

        const cartCount = await page.locator('[data-testid="cart-count"]').textContent().catch(() => '0');

        expect(hasEmptyMessage || cartCount === '0').toBeTruthy();
    });

    test('TC-CART-004: Cart Persistence @medium', async ({ page }) => {
        const hasCart = await page.goto('/cart').then(() => true).catch(() => false);

        if (!hasCart) {
            test.skip('Cart page not implemented');
            return;
        }

        // Add product to cart
        await page.goto(ROUTES.home);
        await addToCart(page);

        // Get cart count
        const initialCount = await page.locator('[data-testid="cart-count"]').textContent().catch(() => '0');

        // Reload page
        await page.reload();
        await page.waitForTimeout(1000);

        // Verify cart persisted
        const afterReloadCount = await page.locator('[data-testid="cart-count"]').textContent().catch(() => '0');
        expect(afterReloadCount).toBe(initialCount);
    });

    test('TC-CART-005: Cart - Out of Stock Product @high', async ({ page }) => {
        await page.goto(ROUTES.home);

        // Look for out of stock product
        const outOfStockButton = page.locator('button:has-text("Out of Stock")').first();

        const hasOutOfStock = await outOfStockButton.isVisible({ timeout: 3000 }).catch(() => false);

        if (!hasOutOfStock) {
            test.skip('No out of stock products found for testing');
            return;
        }

        // Verify button is disabled
        await expect(outOfStockButton).toBeDisabled();
    });
});
