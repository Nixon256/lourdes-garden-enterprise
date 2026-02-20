import { Page, Locator, expect } from '@playwright/test';

export class ContactPage {
    readonly page: Page;
    readonly form: Locator;
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly countryCodeSelect: Locator;
    readonly phoneInput: Locator;
    readonly subjectSelect: Locator;
    readonly messageTextarea: Locator;
    readonly submitButton: Locator;
    readonly closeButton: Locator;
    readonly successHeading: Locator;
    readonly phoneCounter: Locator;
    readonly messageCounter: Locator;

    constructor(page: Page) {
        this.page = page;
        this.form = page.getByTestId('contact-form');
        this.nameInput = page.getByTestId('contact-name-input');
        this.emailInput = page.getByTestId('contact-email-input');
        this.countryCodeSelect = page.getByTestId('contact-country-code-select');
        this.phoneInput = page.getByTestId('contact-phone-input');
        this.subjectSelect = page.getByTestId('contact-subject-select');
        this.messageTextarea = page.getByTestId('contact-message-textarea');
        this.submitButton = page.getByTestId('contact-submit-button');
        this.closeButton = page.getByTestId('contact-close-button');
        this.successHeading = page.locator('h3:has-text("Message Sent Successfully!"), h3:has-text("செய்தி வெற்றிகரமாக அனுப்பப்பட்டது!")');
        this.phoneCounter = page.getByTestId('contact-phone-counter');
        this.messageCounter = page.getByTestId('contact-message-counter');
    }

    async goto() {
        await this.page.goto('/contact');
    }

    async fillForm(data: { name?: string; email?: string; phone?: string; subject?: string; message?: string }) {
        if (data.name) await this.nameInput.fill(data.name);
        if (data.email) await this.emailInput.fill(data.email);
        if (data.phone) await this.phoneInput.fill(data.phone);
        if (data.subject) await this.subjectSelect.selectOption(data.subject);
        if (data.message) await this.messageTextarea.fill(data.message);
    }

    async submit() {
        await this.submitButton.click();
    }

    async clickClose() {
        await this.closeButton.click();
    }

    getErrorLocator(field: string) {
        return this.page.getByTestId(`contact-${field}-error`);
    }

    getLinkLocator(val: string) {
        return this.page.getByTestId(`contact-link-${val.toLowerCase().replace(/['\s,]+/g, '-')}`);
    }

    getInfoLocator(val: string) {
        return this.page.getByTestId(`contact-info-${val.toLowerCase().replace(/['\s,]+/g, '-')}`);
    }
}
