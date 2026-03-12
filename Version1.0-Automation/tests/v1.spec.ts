import { test, expect } from '@playwright/test';

test.describe('Lourdes Garden Version 1.0 Verification', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('Navigation & Header: Admin/Cart elements are hidden', async ({ page }) => {
        // Nav links exist
        await expect(page.getByRole('link', { name: 'Our Story' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Products' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Gallery' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible();

        // Admin/Login/Cart should NOT be visible
        await expect(page.getByRole('link', { name: 'Admin' })).not.toBeVisible();
        await expect(page.getByRole('link', { name: 'Login' })).not.toBeVisible();
        await expect(page.getByRole('button', { name: 'Logout' })).not.toBeVisible();
        await expect(page.locator('svg.lucide-shopping-bag')).not.toBeVisible();
    });

    test('Public Gallery: Masonry layout and images loading', async ({ page }) => {
        await page.goto('/gallery');

        // Check for masonry columns (desktop)
        const galleryContainer = page.locator('div.columns-1');
        await expect(galleryContainer).toBeVisible();

        // Check if images are actually loaded (at least 10)
        const images = page.locator('img');
        const count = await images.count();
        expect(count).toBeGreaterThanOrEqual(10);

        // Verify no captions or filters are visible
        await expect(page.getByText('Filter by')).not.toBeVisible();
    });

    test('Products Page: Data Integrity & Images', async ({ page }) => {
        await page.goto('/products');

        // Check specifically for the 5 products
        const productNames = [
            'Organic Black Pepper',
            'Mountain Banana (Nendran)',
            'Fresh Mountain Lemons',
            'Premium Avocado',
            'Black Lemon'
        ];

        for (const name of productNames) {
            await expect(page.getByRole('heading', { name: name })).toBeVisible();
        }

        // Verify unique images for Black Lemon and Avocado
        const avocadoImg = page.locator('img[alt="Premium Avocado"]');
        const blackLemonImg = page.locator('img[alt="Black Lemon"]');

        const avocadoSrc = await avocadoImg.getAttribute('src');
        const blackLemonSrc = await blackLemonImg.getAttribute('src');

        expect(avocadoSrc).not.toBe(blackLemonSrc);
        expect(blackLemonSrc).toContain('lemon.png');
        expect(avocadoSrc).toContain('avocado.png');
    });

    test('Contact Form: Submission Success', async ({ page }) => {
        await page.goto('/contact');

        await page.fill('input[name="name"]', 'Automation Tester');
        await page.fill('input[name="email"]', 'test@example.com');
        await page.fill('input[name="subject"]', 'Hello from V1 Automation');
        await page.fill('textarea[name="message"]', 'This is an automated test message for version 1.0 verification.');

        await page.click('button[type="submit"]');

        // Verify success message
        await expect(page.getByText(/Your message has been sent successfully/i)).toBeVisible();
    });

    test('Multilingual support: Tamil toggle functionality', async ({ page }) => {
        // Click via aria-label
        await page.getByLabel('Toggle language').click();
        await page.waitForLoadState('networkidle');

        // Verify Tamil text appears in header
        await expect(page.getByRole('link', { name: 'தொடர்பு' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'தயாரிப்புகள்' })).toBeVisible();

        // Toggle back to English
        await page.getByLabel('Toggle language').click();
        await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible();
    });

});
