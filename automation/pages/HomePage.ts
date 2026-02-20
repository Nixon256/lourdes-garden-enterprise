import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    readonly heroSection: Locator;
    readonly heroShopButton: Locator;
    readonly heroStoryButton: Locator;
    readonly featureOrganic: Locator;
    readonly featureExport: Locator;
    readonly featureWholesale: Locator;
    readonly businessGrowthSection: Locator;
    readonly growthCTAButton: Locator;

    constructor(page: Page) {
        super(page);
        this.heroSection = page.getByTestId('home-hero-section');
        this.heroShopButton = page.getByTestId('home-hero-shop-button');
        this.heroStoryButton = page.getByTestId('home-hero-story-button');
        this.featureOrganic = page.getByTestId('home-feature-organic');
        this.featureExport = page.getByTestId('home-feature-export');
        this.featureWholesale = page.getByTestId('home-feature-wholesale');
        this.businessGrowthSection = page.getByTestId('business-growth-section');
        this.growthCTAButton = page.getByTestId('growth-cta-button');
    }

    async goto() {
        await this.page.goto('/');
    }

    getStatCard(label: string) {
        const testId = label.toLowerCase().replace(/[\s&()]+/g, '-');
        return this.page.getByTestId(`stat-card-${testId}`);
    }

    getSupplyChainStep(step: number) {
        return this.page.getByTestId(`supply-chain-step-${step}`);
    }

    getFeaturedProductCard(id: string) {
        return this.page.getByTestId(`featured-product-card-${id}`);
    }
}
