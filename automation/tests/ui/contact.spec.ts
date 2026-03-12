import { test, expect } from '@playwright/test';
import { ContactPage } from '../../pages/ContactPage';

const VALID_DATA = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '9626494555',
    subject: 'General Inquiry',
    message: 'This is an automated test message using Page Object Model.'
};

test.describe('Premium Contact Form — Layout & Structure', () => {
    let contactPage: ContactPage;

    test.beforeEach(async ({ page }) => {
        contactPage = new ContactPage(page);
        await contactPage.goto();
    });

    test('TC-CONTACT-001: Split-panel layout renders (left + right panels) @high', async () => {
        await expect(contactPage.page.locator('text=GET IN TOUCH').first()).toBeVisible();
        await expect(contactPage.page.locator('text=Send us a Message').first()).toBeVisible();

        // Left panel contact info strips visible using POM getLinkLocator/getInfoLocator
        await expect(contactPage.getLinkLocator("LOURDE'S GARDEN")).toBeVisible();
        await expect(contactPage.getLinkLocator('lourdesgarden.odc@gmail.com')).toBeVisible();
        await expect(contactPage.getLinkLocator('+91 96264 94555')).toBeVisible();

        // Right panel form exists
        await expect(contactPage.form).toBeVisible();
    });

    test('TC-CONTACT-002: All required form fields are present @high', async () => {
        await expect(contactPage.nameInput).toBeVisible();
        await expect(contactPage.emailInput).toBeVisible();
        await expect(contactPage.phoneInput).toBeVisible();
        await expect(contactPage.subjectSelect).toBeVisible();
        await expect(contactPage.messageTextarea).toBeVisible();
        await expect(contactPage.submitButton).toBeVisible();
    });

    test('TC-CONTACT-003: Subject dropdown has placeholder as first option @medium', async () => {
        const value = await contactPage.subjectSelect.inputValue();
        expect(value).toBe('');

        const placeholderOptionText = await contactPage.page.evaluate(() => {
            const select = document.querySelector('[data-testid="contact-subject-select"]') as HTMLSelectElement;
            const first = select?.options[0];
            return { value: first?.value ?? null, text: first?.text ?? null };
        });
        expect(placeholderOptionText.value).toBe('');
        expect(placeholderOptionText.text).toMatch(/Select a subject|தேர்ந்தெடுக்கவும்/);
    });

    test('TC-CONTACT-004: Form has noValidate — no browser-native popups @medium', async () => {
        const noValidate = await contactPage.form.getAttribute('novalidate');
        expect(noValidate).not.toBeNull();
    });
});

test.describe('Premium Contact Form — Custom Validation', () => {
    let contactPage: ContactPage;

    test.beforeEach(async ({ page }) => {
        contactPage = new ContactPage(page);
        await contactPage.goto();
    });

    test('TC-CONTACT-005: Submitting empty form shows inline errors for all required fields @high', async () => {
        await contactPage.submit();

        await expect(contactPage.getErrorLocator('name')).toBeVisible();
        await expect(contactPage.getErrorLocator('email')).toBeVisible();
        await expect(contactPage.getErrorLocator('subject')).toBeVisible();
        await expect(contactPage.getErrorLocator('message')).toBeVisible();

        await expect(contactPage.successHeading).toBeHidden();
    });

    test('TC-CONTACT-006: Invalid email format shows inline error @medium', async () => {
        await contactPage.fillForm({ ...VALID_DATA, email: 'not-an-email' });
        await contactPage.submit();
        await expect(contactPage.getErrorLocator('email')).toBeVisible();
    });

    test('TC-CONTACT-007: Phone shorter than 10 digits shows error @high', async () => {
        await contactPage.fillForm({ ...VALID_DATA, phone: '12345' });
        await contactPage.submit();
        await expect(contactPage.getErrorLocator('phone')).toBeVisible();
    });

    test('TC-CONTACT-008: Phone field rejects non-digit key presses @high', async () => {
        await contactPage.phoneInput.click();
        await contactPage.page.keyboard.type('abc!@#');
        const val = await contactPage.phoneInput.inputValue();
        expect(val).toBe('');
    });

    test('TC-CONTACT-009: Phone field accepts exactly 10 digits @high', async () => {
        await contactPage.phoneInput.fill(VALID_DATA.phone);
        const val = await contactPage.phoneInput.inputValue();
        expect(val).toBe(VALID_DATA.phone);
        expect(val.length).toBe(10);
    });

    test('TC-CONTACT-011: Error clears when user corrects the field @medium', async () => {
        await contactPage.submit();
        await expect(contactPage.getErrorLocator('name')).toBeVisible();

        await contactPage.nameInput.fill('Valid Name');
        await expect(contactPage.getErrorLocator('name')).toBeHidden();
    });
});

test.describe('Premium Contact Form — Counters', () => {
    let contactPage: ContactPage;

    test.beforeEach(async ({ page }) => {
        contactPage = new ContactPage(page);
        await contactPage.goto();
    });

    test('TC-CONTACT-012: Message counter starts at 500/500 @medium', async () => {
        await expect(contactPage.messageCounter).toContainText('500/500');
    });

    test('TC-CONTACT-013: Message counter decreases as user types @medium', async () => {
        await contactPage.messageTextarea.fill('Hello World');
        await expect(contactPage.messageCounter).toContainText('489/500');
    });

    test('TC-CONTACT-015: Phone digit counter shows 0/10 initially @low', async () => {
        await expect(contactPage.phoneCounter).toContainText('0/10');
    });

    test('TC-CONTACT-017: Phone digit counter shows 10/10 when complete @medium', async () => {
        await contactPage.phoneInput.fill(VALID_DATA.phone);
        await expect(contactPage.phoneCounter).toContainText('10/10');
    });
});

test.describe('Premium Contact Form — Left Panel Links', () => {
    let contactPage: ContactPage;

    test.beforeEach(async ({ page }) => {
        contactPage = new ContactPage(page);
        await contactPage.goto();
    });

    test('TC-CONTACT-018: Map link has correct href @medium', async () => {
        const mapLink = contactPage.getLinkLocator("LOURDE'S GARDEN");
        await expect(mapLink).toHaveAttribute('href', 'https://maps.app.goo.gl/V6dsG6TcT7jjnBkR9');
        await expect(mapLink).toHaveAttribute('target', '_blank');
    });

    test('TC-CONTACT-019: Email link has correct mailto href @medium', async () => {
        const emailLink = contactPage.getLinkLocator('lourdesgarden.odc@gmail.com');
        await expect(emailLink).toHaveAttribute('href', 'mailto:lourdesgarden.odc@gmail.com');
    });
});

test.describe('Premium Contact Form — Success State', () => {
    let contactPage: ContactPage;

    test.beforeEach(async ({ page }) => {
        contactPage = new ContactPage(page);
        await contactPage.goto();
    });

    test('TC-CONTACT-024: Successful submission shows premium success state @high', async () => {
        await contactPage.fillForm(VALID_DATA);
        await contactPage.submit();

        await expect(contactPage.successHeading).toBeVisible({ timeout: 30000 });
        await expect(contactPage.form).toBeHidden();
    });

    test('TC-CONTACT-025: Close button resets back to form @high', async () => {
        await contactPage.fillForm(VALID_DATA);
        await contactPage.submit();
        await expect(contactPage.successHeading).toBeVisible({ timeout: 30000 });

        await contactPage.clickClose();

        await expect(contactPage.form).toBeVisible();
        await expect(contactPage.nameInput).toHaveValue('');
        await expect(contactPage.phoneInput).toHaveValue('');
        await expect(contactPage.messageTextarea).toHaveValue('');
    });
});
