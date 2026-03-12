import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AboutPage extends BasePage {
    readonly heroSection: Locator;
    readonly ctaButton: Locator;

    constructor(page: Page) {
        super(page);
        this.heroSection = page.getByTestId('about-hero-section');
        this.ctaButton = page.getByTestId('about-cta-button');
    }

    async goto() {
        await this.page.goto('/about');
    }

    getPillarCard(title: string) {
        const testId = title.toLowerCase().replace(/[\s&()]+/g, '-');
        return this.page.getByTestId(`about-pillar-card-${testId}`);
    }
}
