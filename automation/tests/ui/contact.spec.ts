import { test, expect } from '@playwright/test';

test.describe('Contact Form Functionality', () => {
    test('TC-CONTACT-001: Submit Contact Form Successfully @high', async ({ page }) => {
        // Go to contact page
        await page.goto('/contact');

        // Check initial state
        await expect(page.getByRole('heading', { name: 'Contact Us', exact: true })).toBeVisible();

        // Fill form
        await page.fill('input[name="name"]', 'Test User');
        await page.fill('input[name="email"]', 'test@example.com');
        await page.fill('input[name="phone"]', '1234567890');
        await page.selectOption('select[name="subject"]', 'General Inquiry');
        await page.fill('textarea[name="message"]', 'This is an automated test message from Playwright.');

        // Submit - Use both Enter key and click for maximum compatibility in headless Safari
        await page.keyboard.press('Enter');
        const submitButton = page.locator('button[type="submit"]');
        await expect(submitButton).toBeEnabled();
        await submitButton.click({ force: true });

        // Assert success message
        // Extremely robust selector for webkit/safari
        const successMessage = page.locator('h3:has-text("Message Sent Successfully!"), h3:has-text("செய்தி வெற்றிகரமாக அனுப்பப்பட்டது!")').first();
        await expect(successMessage).toBeVisible({ timeout: 30000 });

        await expect(page.locator('text=Thank you for contacting us').first()).toBeVisible();

        // Verify form is replaced by success message
        await expect(page.locator('form')).toBeHidden();

        // Reset form
        await page.getByRole('button', { name: /Send Another Message|மற்றொரு செய்தி அனுப்பு/ }).click();
        await expect(page.locator('form')).toBeVisible();
    });

    test('TC-CONTACT-002: Form Validation @medium', async ({ page }) => {
        await page.goto('/contact');
        await page.click('button[type="submit"]');
        const nameInput = page.locator('input[name="name"]');
        const validationMessage = await nameInput.evaluate((el: HTMLInputElement) => el.validationMessage);
        expect(validationMessage).toBeTruthy();
        await expect(page.locator('text=Message Sent Successfully!')).toBeHidden();
    });
});
