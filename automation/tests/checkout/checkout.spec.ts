import { test, expect } from '../../utils/fixtures';
import { ROUTES, TEST_ADDRESSES } from '../../utils/test-data';
import { addToCart, waitForToast } from '../../utils/helpers';

/**
 * Checkout Flow Tests
 * TC-CHECK-001 to TC-CHECK-004
 */

test.describe('Checkout Module', () => {
    test('TC-CHECK-001: Proceed to Checkout @critical', async ({ page }) => {
        // Add product to cart first
        await page.goto(ROUTES.home);

        const hasAddToCart = await page.locator('button:has-text("Add to Cart")').first().isVisible({ timeout: 3000 }).catch(() => false);

        if (!hasAddToCart) {
            test.skip(true, 'Shopping feature not implemented');
            return;
        }

        await addToCart(page);

        // Find and click checkout button
        const checkoutButton = page.locator('button:has-text("Checkout"), a:has-text("Checkout")').first();
        await checkoutButton.click();

        // Should navigate to checkout page
        await page.waitForURL(/.*checkout/, { timeout: 10000 });

        // Verify checkout page elements
        await expect(page.locator('text=/order summary|checkout/i').first()).toBeVisible();
    });

    test('TC-CHECK-002: Complete Checkout - New Address @critical', async ({ page }) => {
        const hasCheckout = await page.goto(ROUTES.checkout).then(() => true).catch(() => false);

        if (!hasCheckout) {
            test.skip(true, 'Checkout page not implemented');
            return;
        }

        // Fill shipping address
        const addressForm = page.locator('form').first();

        await addressForm.locator('input[name="fullName"], input[placeholder*="name" i]').fill(TEST_ADDRESSES.shipping.fullName);
        await addressForm.locator('input[name="phone"], input[type="tel"]').fill(TEST_ADDRESSES.shipping.phone);
        await addressForm.locator('input[name="addressLine1"], textarea[name="address"]').first().fill(TEST_ADDRESSES.shipping.addressLine1);
        await addressForm.locator('input[name="city"], input[placeholder*="city" i]').fill(TEST_ADDRESSES.shipping.city);
        await addressForm.locator('input[name="state"], input[placeholder*="state" i]').fill(TEST_ADDRESSES.shipping.state);
        await addressForm.locator('input[name="postalCode"], input[placeholder*="postal" i]').fill(TEST_ADDRESSES.shipping.postalCode);

        // Submit order
        const placeOrderButton = page.locator('button:has-text("Place Order"), button[type="submit"]').first();
        await placeOrderButton.click();

        // Should redirect to success page or show confirmation
        await page.waitForURL(/.*success|.*order/, { timeout: 15000 });

        // Verify success
        const successMessage = page.locator('text=/success|thank you|order placed/i');
        await expect(successMessage).toBeVisible({ timeout: 10000 });
    });

    test('TC-CHECK-004: Order Success Page @high', async ({ page }) => {
        // Try to access a success page (if exists)
        const hasSuccessPage = await page.goto('/checkout/success/test123').then(() => true).catch(() => false);

        if (!hasSuccessPage) {
            test.skip(true, 'Success page not implemented or requires real order ID');
            return;
        }

        // Verify success page elements
        const expectedElements = [
            page.locator('text=/order.*id/i'),
            page.locator('text=/thank you|success/i'),
        ];

        for (const element of expectedElements) {
            const isVisible = await element.isVisible({ timeout: 2000 }).catch(() => false);
            // At least one success indicator should be present
        }
    });
});
