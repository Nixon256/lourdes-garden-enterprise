import { test, expect } from '@playwright/test';

test.describe('Full Site Verification', () => {

    test('TC-SITE-001: Navigation and Page Titles @high', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Lourdes Garden/);

        // More robust navigation helper
        const navigateTo = async (linkName: string | RegExp) => {
            // Check if mobile menu button is visible (regardless of isMobile flag or exact width)
            const menuBtn = page.locator('button.md\\:hidden');
            const isMenuVisible = await menuBtn.isVisible();

            if (isMenuVisible) {
                await menuBtn.click();
                await page.locator('.md\\:hidden').getByRole('link', { name: linkName }).click();
            } else {
                // Use a generic link selector within the header but not in mobile menu
                await page.locator('nav.hidden.md\\:flex').getByRole('link', { name: linkName }).click();
            }
            await page.waitForLoadState('domcontentloaded');
        };

        // About
        await navigateTo(/Our Story|எங்கள் கதை/);
        await expect(page).toHaveURL(/\/about/);
        await expect(page.getByRole('heading', { level: 1, name: /Our Story|எங்கள் கதை/ })).toBeVisible();

        // Products
        await navigateTo(/Products|தயாரிப்புகள்/);
        await expect(page).toHaveURL(/\/products/);
        await expect(page.getByRole('heading', { level: 1, name: /Nature's Harvest|இயற்கையின் அறுவடை/ })).toBeVisible();

        // Gallery
        await navigateTo(/Gallery|கேலரி/);
        await expect(page).toHaveURL(/\/gallery/);
        await expect(page.getByRole('heading', { level: 1, name: /Our Gallery|புகைப்படத் தொகுப்பு/ })).toBeVisible();

        // Contact
        await navigateTo(/Contact|தொடர்பு/);
        await expect(page).toHaveURL(/\/contact/);
        await expect(page.getByRole('heading', { level: 1, name: /Contact Us|தொடர்பு கொள்ள/ })).toBeVisible();
    });

    test('TC-SITE-002: Language Switching @high', async ({ page }) => {
        await page.goto('/');

        const menuBtn = page.locator('button.md\\:hidden');
        const isMenuVisible = await menuBtn.isVisible();

        // Check English content
        await expect(page.getByRole('heading', { name: 'Lourdes Garden', exact: false }).first()).toBeVisible();

        if (isMenuVisible) {
            await menuBtn.click();
            await page.locator('.md\\:hidden').getByLabel('Toggle language').click();
        } else {
            await page.getByLabel('Toggle language').first().click();
        }

        // Check Tamil content
        await expect(page.getByRole('heading', { name: 'லூர்து கார்டன்' }).first()).toBeVisible();

        // Switch back
        if (isMenuVisible) {
            await page.locator('.md\\:hidden').getByLabel('Toggle language').click();
        } else {
            await page.getByLabel('Toggle language').first().click();
        }
        await expect(page.getByRole('heading', { name: 'Lourdes Garden', exact: false }).first()).toBeVisible();
    });

    test('TC-SITE-003: Home Page Narrative Integrity (No Prices/Cart) @high', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('text=₹')).toHaveCount(0);
        await expect(page.locator('button:has-text("Add to Cart")')).toHaveCount(0);
        await expect(page.locator('a:has-text("Discover")').first()).toBeVisible();
    });

    test('TC-SITE-004: Responsive Mobile Menu @high', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto('/');
        await page.waitForTimeout(1000);

        const menuBtn = page.locator('button.md\\:hidden');
        await expect(menuBtn).toBeVisible({ timeout: 15000 });
        await menuBtn.click();

        const mobileOverlayQuery = '.md\\:hidden';
        await expect(page.locator(mobileOverlayQuery).locator('a:has-text("Products")').first()).toBeVisible({ timeout: 15000 });

        await menuBtn.click();
        await expect(page.locator(mobileOverlayQuery).locator('a:has-text("Products")').first()).toBeHidden({ timeout: 15000 });
    });

    test('TC-SITE-005: Custom Botanical Cursor @medium', async ({ page }) => {
        const viewport = page.viewportSize();
        if (viewport && viewport.width < 768) return;

        await page.goto('/');
        const cursor = page.locator('.cursor-follower, div >> svg >> path').first();
        await expect(cursor).toBeVisible();
    });
});
