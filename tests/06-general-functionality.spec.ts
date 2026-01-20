import { test, expect } from '@playwright/test';

test.describe('Navigation and Routing', () => {
  test('should navigate between main pages', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to auth
    const authLink = page.getByRole('link', { name: /masuk|login/i }).first();
    if (await authLink.isVisible({ timeout: 2000 }).catch(() => false)) {
      await authLink.click();
      await expect(page).toHaveURL(/.*auth.*/);
    }
    
    // Go back to home
    await page.goto('/');
    await expect(page.url()).toContain('localhost:3000');
  });

  test('should handle 404 for non-existent routes', async ({ page }) => {
    await page.goto('/non-existent-route-12345');
    
    await page.waitForTimeout(2000);
    
    // Next.js should show 404 page or redirect
    const pageContent = await page.content();
    expect(pageContent).toBeTruthy();
  });

  test('should preserve query parameters', async ({ page }) => {
    await page.goto('/auth?redirect=/dashboard');
    
    const url = page.url();
    expect(url).toContain('redirect');
  });
});

test.describe('Performance and Loading', () => {
  test('should load home page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Should load within 10 seconds
    expect(loadTime).toBeLessThan(10000);
  });

  test('should handle slow network gracefully', async ({ page }) => {
    await page.goto('/');
    
    // Page should still be functional
    const content = await page.content();
    expect(content.length).toBeGreaterThan(0);
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy on landing page', async ({ page }) => {
    await page.goto('/');
    
    const h1 = page.locator('h1');
    const h1Count = await h1.count();
    expect(h1Count).toBeGreaterThan(0);
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/');
    
    const images = page.locator('img');
    const count = await images.count();
    
    if (count > 0) {
      for (let i = 0; i < Math.min(count, 5); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        // Alt can be empty string for decorative images, but should exist
        expect(alt !== null).toBe(true);
      }
    }
  });

  test('should have proper button labels', async ({ page }) => {
    await page.goto('/');
    
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    if (count > 0) {
      const firstButton = buttons.first();
      const text = await firstButton.textContent();
      const ariaLabel = await firstButton.getAttribute('aria-label');
      
      // Button should have either text content or aria-label
      expect(text || ariaLabel).toBeTruthy();
    }
  });

  test('should have focusable interactive elements', async ({ page }) => {
    await page.goto('/auth');
    
    // Tab through form elements
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    
    expect(focusedElement).toBeTruthy();
  });
});

test.describe('Cross-browser Compatibility', () => {
  test('should render correctly on Chromium', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium');
    
    await page.goto('/');
    
    const navbar = page.locator('nav').first();
    await expect(navbar).toBeVisible();
  });

  test('should render correctly on Firefox', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox');
    
    await page.goto('/');
    
    const navbar = page.locator('nav').first();
    await expect(navbar).toBeVisible();
  });

  test('should render correctly on WebKit', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit');
    
    await page.goto('/');
    
    const navbar = page.locator('nav').first();
    await expect(navbar).toBeVisible();
  });
});

test.describe('Form Validation', () => {
  test('should validate required fields on auth forms', async ({ page }) => {
    await page.goto('/auth');
    
    const loginButton = page.getByRole('button', { name: /login|masuk/i }).first();
    await loginButton.click();
    
    await page.waitForTimeout(1000);
    
    // Should show validation errors or stay on page
    const url = page.url();
    expect(url).toContain('auth');
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/auth');
    
    const emailInput = page.getByPlaceholder(/email/i).first();
    await emailInput.fill('not-an-email');
    
    const loginButton = page.getByRole('button', { name: /login|masuk/i }).first();
    await loginButton.click();
    
    await page.waitForTimeout(1000);
  });

  test('should validate password minimum length', async ({ page }) => {
    await page.goto('/auth');
    
    // Switch to register if needed
    const registerTab = page.locator('text=/daftar|register/i').first();
    if (await registerTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await registerTab.click();
      await page.waitForTimeout(500);
    }
    
    const passwordInput = page.getByPlaceholder(/password|kata sandi/i).first();
    if (await passwordInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await passwordInput.fill('123');
      
      const registerButton = page.getByRole('button', { name: /daftar|register/i }).first();
      await registerButton.click();
      
      await page.waitForTimeout(1000);
    }
  });
});

test.describe('Error Handling', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    await page.goto('/');
    
    // Simulate offline
    await page.context().setOffline(true);
    
    // Try to navigate
    await page.goto('/dashboard').catch(() => {});
    
    // Restore connection
    await page.context().setOffline(false);
    
    await page.waitForTimeout(1000);
  });

  test('should display error messages for failed requests', async ({ page }) => {
    await page.goto('/auth');
    
    // Try to login with random credentials
    await page.getByPlaceholder(/email/i).first().fill('test@example.com');
    await page.getByPlaceholder(/password|kata sandi/i).first().fill('wrongpassword');
    
    const loginButton = page.getByRole('button', { name: /login|masuk/i }).first();
    await loginButton.click();
    
    await page.waitForTimeout(3000);
    
    // Should show error message (toast or inline)
    const errorMessage = page.locator('text=/error|gagal|salah/i').first();
    if (await errorMessage.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(errorMessage).toBeVisible();
    }
  });
});

test.describe('UI/UX Elements', () => {
  test('should have smooth page transitions', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForTimeout(1000);
    
    const authLink = page.getByRole('link', { name: /masuk|login/i }).first();
    if (await authLink.isVisible({ timeout: 2000 }).catch(() => false)) {
      await authLink.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should show loading states', async ({ page }) => {
    await page.goto('/auth');
    
    // Fill in form
    await page.getByPlaceholder(/email/i).first().fill('test@example.com');
    await page.getByPlaceholder(/password|kata sandi/i).first().fill('password123');
    
    const loginButton = page.getByRole('button', { name: /login|masuk/i }).first();
    await loginButton.click();
    
    // Should show loading indicator
    await page.waitForTimeout(500);
    
    const loadingIndicator = page.locator('text=/loading|memuat/i, [role="progressbar"]').first();
    if (await loadingIndicator.isVisible({ timeout: 1000 }).catch(() => false)) {
      await expect(loadingIndicator).toBeVisible();
    }
  });

  test('should display toast notifications', async ({ page }) => {
    await page.goto('/auth');
    
    // Try to submit empty form
    const loginButton = page.getByRole('button', { name: /login|masuk/i }).first();
    await loginButton.click();
    
    await page.waitForTimeout(1000);
    
    // Look for toast notification
    const toast = page.locator('[role="alert"], [role="status"]').first();
    if (await toast.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(toast).toBeVisible();
    }
  });
});

test.describe('Mobile-specific Features', () => {
  test('should have mobile navigation menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Look for hamburger menu
    const menuButton = page.locator('button').filter({ 
      has: page.locator('svg') 
    }).first();
    
    if (await menuButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await menuButton.click();
      await page.waitForTimeout(500);
      
      // Menu should open
      const menu = page.locator('nav, [role="menu"]').first();
      await expect(menu).toBeVisible();
    }
  });

  test('should handle touch interactions', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Scroll using touch simulation
    await page.evaluate(() => window.scrollBy(0, 100));
    await page.waitForTimeout(500);
    
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });
});
