import { test, expect } from '@playwright/test';
import { BasePage } from '../../pages/BasePage';

test.describe('Global Layout — Header & Footer Professionalism', () => {
    let basePage: BasePage;

    test.beforeEach(async ({ page }) => {
        basePage = new BasePage(page);
        await page.goto('/');
    });

    test('Header: Links and Logo are accessible via data-testid', async () => {
        await expect(basePage.headerBrandLink).toBeVisible();
        await expect(basePage.navLinkStory).toBeVisible();
        await expect(basePage.navLinkProducts).toBeVisible();
        await expect(basePage.navLinkGallery).toBeVisible();
        await expect(basePage.navLinkContact).toBeVisible();
    });

    test('Header: Language toggle updates DOM state', async () => {
        const { before, after } = await basePage.toggleLanguage();
        expect(before).not.toBe(after);
    });

    test('Header: Theme toggle exists and is clickable', async () => {
        await expect(basePage.themeToggle).toBeVisible();
        await basePage.toggleTheme();
    });

    test('Footer: All professional info and links are traceable', async () => {
        await expect(basePage.footerBrand).toBeVisible();
        await expect(basePage.footerWhatsApp).toBeVisible();
        await expect(basePage.footerEmail).toBeVisible();
        await expect(basePage.footerNavHome).toBeVisible();
        await expect(basePage.footerNavContact).toBeVisible();
        await expect(basePage.footerInfoAddress).toBeVisible();
        await expect(basePage.footerInfoEmail).toBeVisible();
        await expect(basePage.footerInfoPhone).toBeVisible();
    });

    test('Footer: Legal links are present', async () => {
        const privacy = basePage.page.getByTestId('footer-legal-privacy');
        const terms = basePage.page.getByTestId('footer-legal-terms');
        await expect(privacy).toBeVisible();
        await expect(terms).toBeVisible();
    });

    test('WhatsApp: Widget localization and professional IDs', async () => {
        // WhatsApp button should be visible after initial 2s delay
        await expect(basePage.whatsappButton).toBeVisible({ timeout: 10000 });

        // Tooltip appears after 5s
        await expect(basePage.whatsappTooltip).toBeVisible({ timeout: 15000 });

        // Verify default English text
        await expect(basePage.whatsappTooltip).toContainText('Need help? Chat with us on WhatsApp!');

        // Switch to Tamil
        await basePage.toggleLanguage();

        // Verify Tamil text
        await expect(basePage.whatsappTooltip).toContainText('உதவி வேண்டுமா? வாட்ஸ்அப்பில் எங்களைத் தொடர்பு கொள்ளுங்கள்!');

        // Close tooltip
        await basePage.whatsappTooltipClose.click();
        await expect(basePage.whatsappTooltip).not.toBeVisible();
    });
});
