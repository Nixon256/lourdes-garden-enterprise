import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
    readonly page: Page;

    // Header elements
    readonly headerBrandLink: Locator;
    readonly navLinkStory: Locator;
    readonly navLinkProducts: Locator;
    readonly navLinkGallery: Locator;
    readonly navLinkContact: Locator;
    readonly languageToggle: Locator;
    readonly themeToggle: Locator;
    readonly mobileMenuButton: Locator;

    // Footer elements
    readonly footerBrand: Locator;
    readonly footerWhatsApp: Locator;
    readonly footerEmail: Locator;
    readonly footerNavHome: Locator;
    readonly footerNavAbout: Locator;
    readonly footerNavProducts: Locator;
    readonly footerNavGallery: Locator;
    readonly footerNavContact: Locator;
    readonly footerInfoAddress: Locator;
    readonly footerInfoEmail: Locator;
    readonly footerInfoPhone: Locator;

    // WhatsApp Widget
    readonly whatsappButton: Locator;
    readonly whatsappTooltip: Locator;
    readonly whatsappTooltipClose: Locator;

    constructor(page: Page) {
        this.page = page;

        // Header
        this.headerBrandLink = page.getByTestId('header-brand-link');
        this.navLinkStory = page.getByTestId('header-nav-link-about');
        this.navLinkProducts = page.getByTestId('header-nav-link-products');
        this.navLinkGallery = page.getByTestId('header-nav-link-gallery');
        this.navLinkContact = page.getByTestId('header-nav-link-contact');
        this.languageToggle = page.getByTestId('language-toggle-button');
        this.themeToggle = page.getByTestId('theme-toggle-button');
        this.mobileMenuButton = page.getByTestId('header-mobile-menu-button');

        // Footer
        this.footerBrand = page.getByTestId('footer-brand');
        this.footerWhatsApp = page.getByTestId('footer-whatsapp-link');
        this.footerEmail = page.getByTestId('footer-email-link');
        this.footerNavHome = page.getByTestId('footer-nav-link-home');
        this.footerNavAbout = page.getByTestId('footer-nav-link-about');
        this.footerNavProducts = page.getByTestId('footer-nav-link-products');
        this.footerNavGallery = page.getByTestId('footer-nav-link-gallery');
        this.footerNavContact = page.getByTestId('footer-nav-link-contact');
        this.footerInfoAddress = page.getByTestId('footer-info-address');
        this.footerInfoEmail = page.getByTestId('footer-info-email');
        this.footerInfoPhone = page.getByTestId('footer-info-phone');

        // WhatsApp Widget
        this.whatsappButton = page.getByTestId('whatsapp-floating-button');
        this.whatsappTooltip = page.getByTestId('whatsapp-tooltip');
        this.whatsappTooltipClose = page.getByTestId('whatsapp-tooltip-close');
    }

    async toggleLanguage() {
        const textBefore = await this.languageToggle.textContent();
        await this.languageToggle.click();
        await this.page.waitForTimeout(500); // Small wait for state transition
        const textAfter = await this.languageToggle.textContent();
        return { before: textBefore?.trim(), after: textAfter?.trim() };
    }

    async toggleTheme() {
        await this.themeToggle.click();
        // Theme transition might have small delay, but next-themes is usually fast
    }

    async openMobileMenu() {
        await this.mobileMenuButton.click();
    }
}
