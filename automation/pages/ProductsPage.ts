import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
    readonly heroSection: Locator;
    readonly exploreScrollButton: Locator;

    constructor(page: Page) {
        super(page);
        this.heroSection = page.getByTestId('products-hero-section');
        this.exploreScrollButton = page.getByTestId('products-explore-scroll-button');
    }

    async goto() {
        await this.page.goto('/products');
    }

    getProductArticle(id: string) {
        return this.page.getByTestId(`product-article-${id}`);
    }

    getProductImage(id: string) {
        return this.page.getByTestId(`product-image-${id}`);
    }

    async scrollToCatalog() {
        await this.exploreScrollButton.click();
    }
}
