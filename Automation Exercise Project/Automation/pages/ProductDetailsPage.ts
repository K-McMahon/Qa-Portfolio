import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { expect, type Page } from '@playwright/test';
import { dismissAdOverlay } from '../tests/ui/support/ui-test';

export type ProductReview = {
  name: string;
  email: string;
  message: string;
};

export class ProductDetailsPage {
  constructor(private readonly page: Page) {}

  private get reviewSection() {
    return this.page.locator('#reviews');
  }

  async expectReviewForm() {
    await dismissAdOverlay(this.page);
    await this.reviewSection.scrollIntoViewIfNeeded();
    await expect(
      this.page.getByRole('link', { name: 'Write Your Review', exact: true })
    ).toBeVisible();
    await expect(this.reviewSection.locator('#name')).toBeVisible();
    await expect(this.reviewSection.locator('#email')).toBeVisible();
    await expect(this.reviewSection.locator('#review')).toBeVisible();
    await expect(this.reviewSection.locator('#button-review')).toBeVisible();
  }

  async fillReview(review: ProductReview) {
    await this.reviewSection.locator('#name').fill(review.name);
    await this.reviewSection.locator('#email').fill(review.email);
    await this.reviewSection.locator('#review').fill(review.message);
    await expect(this.reviewSection.locator('#name')).toHaveValue(review.name);
    await expect(this.reviewSection.locator('#email')).toHaveValue(review.email);
    await expect(this.reviewSection.locator('#review')).toHaveValue(review.message);
  }

  async submitReview() {
    await dismissAdOverlay(this.page);
    await this.reviewSection.locator('#button-review').click();
  }

  async expectReviewSubmitted() {
    await expect(
      this.reviewSection.getByText('Thank you for your review.', { exact: true })
    ).toBeVisible();
  }

  async captureEvidence(fileName: string) {
    await this.reviewSection.scrollIntoViewIfNeeded();
    const screenshotPath = resolve(process.cwd(), 'Execution Evidence', fileName);
    await mkdir(dirname(screenshotPath), { recursive: true });
    await this.page.screenshot({ path: screenshotPath, fullPage: false });
    return screenshotPath;
  }
}
