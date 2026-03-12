import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('Home Page — Professional DOM & data-testid Verification', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.goto();
    });

    test('Hero Section: Traceable elements and professional structure', async () => {
        await expect(homePage.heroSection).toBeVisible();
        await expect(homePage.heroShopButton).toBeVisible();
        await expect(homePage.heroStoryButton).toBeVisible();
    });

    test('Features: Core value cards are identified', async () => {
        await expect(homePage.featureOrganic).toBeVisible();
        await expect(homePage.featureExport).toBeVisible();
        await expect(homePage.featureWholesale).toBeVisible();
    });

    test('Business Growth: Stats and Supply Chain items are traceable', async () => {
        await expect(homePage.businessGrowthSection).toBeVisible();

        // Check some specific stats using the dynamic mapper
        await expect(homePage.getStatCard('Acres of Heritage Grove')).toBeVisible();
        await expect(homePage.getStatCard('Global Export Markets')).toBeVisible();

        // Check supply chain steps
        await expect(homePage.getSupplyChainStep(1)).toBeVisible();
        await expect(homePage.getSupplyChainStep(5)).toBeVisible();

        // CTA button
        await expect(homePage.growthCTAButton).toBeVisible();
    });
});
