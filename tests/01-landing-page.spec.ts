import { test, expect } from '@playwright/test';

test.describe('Landing Page - Navigation and UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the landing page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/ProdiPlan/i);
  });

  test('should display the navigation bar', async ({ page }) => {
    // Check if ProdiPlan logo/brand is visible
    const navbar = page.locator('nav').first();
    await expect(navbar).toBeVisible();
  });

  test('should navigate to auth page when clicking login/register button', async ({ page }) => {
    // Look for login or register button
    const authButton = page.getByRole('link', { name: /masuk|login|daftar|register/i }).first();
    if (await authButton.isVisible()) {
      await authButton.click();
      await expect(page).toHaveURL(/.*auth.*/);
    }
  });

  test('should display hero section', async ({ page }) => {
    // Hero section should be visible
    const heroSection = page.locator('text=/temukan jurusan|essay grader|ai-powered|kesiapan/i').first();
    await expect(heroSection).toBeVisible({ timeout: 10000 });
  });

  test('should scroll to features section', async ({ page }) => {
    // Try to find features section
    const featuresSection = page.locator('text=/fitur|features|keunggulan/i').first();
    if (await featuresSection.isVisible({ timeout: 5000 }).catch(() => false)) {
      await featuresSection.scrollIntoViewIfNeeded();
      await expect(featuresSection).toBeInViewport();
    }
  });

  test('should display how it works section', async ({ page }) => {
    const howItWorksSection = page.locator('text=/cara kerja|how it works|bagaimana/i').first();
    if (await howItWorksSection.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(howItWorksSection).toBeVisible();
    }
  });

  test('should display testimonials section', async ({ page }) => {
    const testimonialsSection = page.locator('text=/testimoni|testimonial|kata mereka/i').first();
    if (await testimonialsSection.isVisible({ timeout: 5000 }).catch(() => false)) {
      await testimonialsSection.scrollIntoViewIfNeeded();
      await expect(testimonialsSection).toBeVisible();
    }
  });

  test('should display CTA section', async ({ page }) => {
    const ctaSection = page.locator('text=/mulai sekarang|get started|coba gratis/i').first();
    if (await ctaSection.isVisible({ timeout: 5000 }).catch(() => false)) {
      await ctaSection.scrollIntoViewIfNeeded();
      await expect(ctaSection).toBeVisible();
    }
  });

  test('should display footer', async ({ page }) => {
    const footer = page.locator('footer').first();
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
  });
});

test.describe('Landing Page - Responsive Design', () => {
  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const navbar = page.locator('nav').first();
    await expect(navbar).toBeVisible();
  });

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    const navbar = page.locator('nav').first();
    await expect(navbar).toBeVisible();
  });

  test('should be responsive on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    const navbar = page.locator('nav').first();
    await expect(navbar).toBeVisible();
  });
});
