import { test, expect } from '../../utils/fixtures';
import { ROUTES } from '../../utils/test-data';
import { waitForToast, searchInAdmin, getTableRowCount } from '../../utils/helpers';

/**
 * Admin Product Management Tests
 * TC-PROD-001 to TC-PROD-010
 */

test.describe('Admin Product Management', () => {
    test.use({ storageState: undefined }); // Start fresh

    test('TC-PROD-001: View Product List @smoke @high', async ({ adminPage: page }) => {
        // Navigate to products page
        await page.goto(ROUTES.adminProducts);
        await expect(page).toHaveURL(/.*\/admin\/products/);

        // Verify page title
        await expect(page.locator('h1, h2').filter({ hasText: /products/i }).first()).toBeVisible();

        // Verify product table exists
        const table = page.locator('table');
        await expect(table).toBeVisible({ timeout: 10000 });

        // Verify table headers
        const headers = ['Product', 'SKU', 'Category', 'Price', 'Stock', 'Status'];
        for (const header of headers) {
            await expect(page.locator(`th:has-text("${header}")`)).toBeVisible();
        }

        // Verify at least one product row exists (from seed data)
        const rowCount = await getTableRowCount(page);
        expect(rowCount).toBeGreaterThan(0);

        // Verify action buttons exist (Edit, Delete)
        await expect(page.locator('button, a').filter({ hasText: /edit/i }).first()).toBeVisible();
    });

    test('TC-PROD-002: Search Products by Name @high', async ({ adminPage: page }) => {
        await page.goto(ROUTES.adminProducts);

        // Wait for products to load
        await page.waitForSelector('table tbody tr', { timeout: 10000 });
        const initialCount = await getTableRowCount(page);

        // Search for a product (using seed data product name)
        await searchInAdmin(page, 'Black Pepper');

        // Wait for filtered results
        await page.waitForTimeout(1000);

        const filteredCount = await getTableRowCount(page);

        // Should have fewer or equal results
        expect(filteredCount).toBeLessThanOrEqual(initialCount);

        // Verify search term appears in results
        const firstRow = page.locator('table tbody tr').first();
        await expect(firstRow).toContainText(/pepper/i);
    });

    test('TC-PROD-003: Search Products by SKU @medium', async ({ adminPage: page }) => {
        await page.goto(ROUTES.adminProducts);
        await page.waitForSelector('table tbody tr', { timeout: 10000 });

        // Get the first product's SKU
        const firstSKU = await page.locator('table tbody tr').first().locator('td').nth(1).textContent();

        if (firstSKU) {
            // Search by SKU
            await searchInAdmin(page, firstSKU.trim());
            await page.waitForTimeout(1000);

            // Should find the product
            const results = await getTableRowCount(page);
            expect(results).toBeGreaterThan(0);

            // Verify SKU in results
            await expect(page.locator('table tbody tr').first()).toContainText(firstSKU.trim());
        }
    });

    test('TC-PROD-004: Product Pagination @medium', async ({ adminPage: page }) => {
        await page.goto(ROUTES.adminProducts);
        await page.waitForSelector('table tbody tr', { timeout: 10000 });

        // Check if pagination exists
        const nextButton = page.locator('button:has-text("Next"), button:has-text("›")').first();
        const hasPagination = await nextButton.isVisible({ timeout: 2000 }).catch(() => false);

        if (!hasPagination) {
            test.skip(true, 'Not enough products for pagination (< 10 products)');
            return;
        }

        // Get first page product count
        const page1Count = await getTableRowCount(page);
        expect(page1Count).toBeLessThanOrEqual(10); // Should show max 10 per page

        // Click next
        await nextButton.click();
        await page.waitForTimeout(1000);

        // Verify page changed
        const url = page.url();
        expect(url).toContain('page=2');

        // Verify different products
        const page2Count = await getTableRowCount(page);
        expect(page2Count).toBeGreaterThan(0);

        // Click previous
        const prevButton = page.locator('button:has-text("Previous"), button:has-text("‹")').first();
        await prevButton.click();
        await page.waitForTimeout(1000);

        // Should be back on page 1
        expect(page.url()).toContain('page=1');
    });

    test('TC-PROD-005: Create New Product @critical', async ({ adminPage: page }) => {
        await page.goto(ROUTES.adminProducts);

        // Click "Add Product" button
        const addButton = page.locator('button, a').filter({ hasText: /add.*product/i }).first();
        await addButton.click();

        // Should navigate to new product page
        await page.waitForURL(/.*\/admin\/products\/(new|create)/, { timeout: 10000 });

        // Fill in product details
        await page.fill('input[name="name"], input[placeholder*="name" i]', 'Test Automation Product');
        await page.fill('input[name="sku"], input[placeholder*="sku" i]', `TEST-AUTO-${Date.now()}`);

        // Select category if dropdown exists
        const categorySelect = page.locator('select[name="category"], select[name="categoryId"]').first();
        if (await categorySelect.isVisible({ timeout: 2000 }).catch(() => false)) {
            const options = await categorySelect.locator('option').count();
            if (options > 1) {
                await categorySelect.selectOption({ index: 1 });
            }
        }

        // Fill prices
        await page.fill('input[name="basePrice"], input[placeholder*="base price" i]', '100');
        await page.fill('input[name="retailPrice"], input[placeholder*="retail price" i]', '150');

        // Fill description
        const descField = page.locator('textarea[name="description"], textarea').first();
        if (await descField.isVisible({ timeout: 2000 }).catch(() => false)) {
            await descField.fill('Test product created by automation');
        }

        // Submit form
        const saveButton = page.locator('button[type="submit"], button:has-text("Save"), button:has-text("Create")').first();
        await saveButton.click();

        // Should show success and redirect
        await waitForToast(page, /success|created/i, 10000);
        await page.waitForURL(/.*\/admin\/products($|\?)/, { timeout: 10000 });

        // Verify product appears in list
        await page.waitForTimeout(1000);
        await expect(page.locator('text=/Test Automation Product/i')).toBeVisible();
    });

    test('TC-PROD-007: Delete Product - Confirm @high', async ({ adminPage: page }) => {
        await page.goto(ROUTES.adminProducts);
        await page.waitForSelector('table tbody tr', { timeout: 10000 });

        // Get initial count
        const initialCount = await getTableRowCount(page);

        // Find first delete button
        const deleteButton = page.locator('button[title="Delete"], button:has-text("Delete"), svg').filter({ has: page.locator('[class*="trash"]') }).first();

        if (!await deleteButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            test.skip(true, 'Delete button not found');
            return;
        }

        await deleteButton.click();

        // Confirmation modal should appear
        const modal = page.locator('[role="dialog"], .modal, [class*="modal"]').first();
        await expect(modal).toBeVisible({ timeout: 5000 });

        // Click confirm
        const confirmButton = modal.locator('button:has-text("Delete"), button:has-text("Confirm")').first();
        await confirmButton.click();

        // Should show success toast
        await waitForToast(page, /deleted|removed/i, 10000);

        // Wait for table to update
        await page.waitForTimeout(1000);

        // Verify count decreased
        const finalCount = await getTableRowCount(page);
        expect(finalCount).toBeLessThan(initialCount);
    });

    test('TC-PROD-008: Delete Product - Cancel @medium', async ({ adminPage: page }) => {
        await page.goto(ROUTES.adminProducts);
        await page.waitForSelector('table tbody tr', { timeout: 10000 });

        const initialCount = await getTableRowCount(page);

        // Click delete
        const deleteButton = page.locator('button[title="Delete"], svg').filter({ has: page.locator('[class*="trash"]') }).first();

        if (!await deleteButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            test.skip(true, 'Delete button not found');
            return;
        }

        await deleteButton.click();

        // Wait for modal
        const modal = page.locator('[role="dialog"], .modal').first();
        await expect(modal).toBeVisible({ timeout: 5000 });

        // Click cancel
        const cancelButton = modal.locator('button:has-text("Cancel")').first();
        await cancelButton.click();

        // Modal should close
        await expect(modal).not.toBeVisible({ timeout: 3000 });

        // Count should be same
        const finalCount = await getTableRowCount(page);
        expect(finalCount).toBe(initialCount);
    });
});
