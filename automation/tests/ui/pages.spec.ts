import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { AboutPage } from '../../pages/AboutPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { GalleryPage } from '../../pages/GalleryPage';

test.describe('Public Pages — Professional DOM & Traceability Suite', () => {

    test('Home Page: Verify professional structure and growth section', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await expect(homePage.heroSection).toBeVisible();
        await expect(homePage.featureOrganic).toBeVisible();
        await expect(homePage.businessGrowthSection).toBeVisible();
        await expect(homePage.growthCTAButton).toBeVisible();
    });

    test('About Page: Verify story pillars and CTA', async ({ page }) => {
        const aboutPage = new AboutPage(page);
        await aboutPage.goto();
        await expect(aboutPage.heroSection).toBeVisible();
        await expect(aboutPage.getPillarCard('Purely Organic')).toBeVisible();
        await expect(aboutPage.ctaButton).toBeVisible();
    });

    test('Products Page: Verify editorial catalog and images', async ({ page }) => {
        const productsPage = new ProductsPage(page);
        await productsPage.goto();
        await expect(productsPage.heroSection).toBeVisible();
        // Wait for products to load and check the first one
        await page.waitForSelector('[data-testid^="product-article-"]');
        const articles = await page.locator('[data-testid^="product-article-"]').all();
        expect(articles.length).toBeGreaterThan(0);

        // Check the first product image instead of assuming ID '1'
        const firstArticleId = await articles[0].getAttribute('data-testid');
        const productId = firstArticleId?.replace('product-article-', '');
        if (productId) {
            await expect(productsPage.getProductImage(productId)).toBeVisible();
        }
    });

    test('Gallery Page: Verify masonry grid and lightbox navigation', async ({ page }) => {
        const galleryPage = new GalleryPage(page);
        await galleryPage.goto();
        await expect(galleryPage.heroSection).toBeVisible();
        await expect(galleryPage.getGalleryItem(0)).toBeVisible();

        // Test Lightbox
        await galleryPage.openLightbox(0);
        await expect(galleryPage.lightboxModal).toBeVisible();
        await expect(galleryPage.lightboxImage).toBeVisible();
        await expect(galleryPage.lightboxCounter).toContainText('1 /');

        await galleryPage.closeLightbox();
        await expect(galleryPage.lightboxModal).not.toBeVisible();
    });
});
