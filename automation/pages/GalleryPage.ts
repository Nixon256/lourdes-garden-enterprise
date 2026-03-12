import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class GalleryPage extends BasePage {
    readonly heroSection: Locator;
    readonly lightboxModal: Locator;
    readonly lightboxClose: Locator;
    readonly lightboxPrev: Locator;
    readonly lightboxNext: Locator;
    readonly lightboxImage: Locator;
    readonly lightboxCounter: Locator;

    constructor(page: Page) {
        super(page);
        this.heroSection = page.getByTestId('gallery-hero-section');
        this.lightboxModal = page.getByTestId('gallery-lightbox-modal');
        this.lightboxClose = page.getByTestId('gallery-lightbox-close');
        this.lightboxPrev = page.getByTestId('gallery-lightbox-prev');
        this.lightboxNext = page.getByTestId('gallery-lightbox-next');
        this.lightboxImage = page.getByTestId('gallery-lightbox-image');
        this.lightboxCounter = page.getByTestId('gallery-lightbox-counter');
    }

    async goto() {
        await this.page.goto('/gallery');
    }

    getGalleryItem(index: number) {
        return this.page.getByTestId(`gallery-item-${index}`);
    }

    async openLightbox(index: number) {
        await this.getGalleryItem(index).click();
    }

    async closeLightbox() {
        await this.lightboxClose.click();
    }
}
