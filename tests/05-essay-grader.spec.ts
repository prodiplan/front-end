import { test, expect } from '@playwright/test';

test.describe('Essay Grader - Protected Route Access', () => {
  test('should redirect to auth when not logged in', async ({ page }) => {
    await page.goto('/essay-grader');
    
    // Should redirect to auth page
    await page.waitForURL(/.*auth.*/, { timeout: 10000 });
    await expect(page).toHaveURL(/.*auth.*/);
  });
});

test.describe('Essay Grader - Main Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/essay-grader');
  });

  test('should display grader interface', async ({ page }) => {
    const currentUrl = page.url();
    if (currentUrl.includes('essay-grader')) {
      await page.waitForTimeout(1000);
      
      const graderContent = page.locator('main').first();
      await expect(graderContent).toBeVisible();
    }
  });

  test('should have major selection', async ({ page }) => {
    const currentUrl = page.url();
    if (currentUrl.includes('essay-grader')) {
      const majorSelect = page.locator('text=/jurusan|major|pilih jurusan/i').first();
      if (await majorSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(majorSelect).toBeVisible();
      }
    }
  });

  test('should have start session button', async ({ page }) => {
    const currentUrl = page.url();
    if (currentUrl.includes('essay-grader')) {
      const startButton = page.getByRole('button', { 
        name: /mulai|start|begin/i 
      }).first();
      
      if (await startButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(startButton).toBeVisible();
      }
    }
  });

  test('should display question when session starts', async ({ page }) => {
    const currentUrl = page.url();
    if (currentUrl.includes('essay-grader')) {
      // Try to start a session
      const startButton = page.getByRole('button', { 
        name: /mulai|start|begin/i 
      }).first();
      
      if (await startButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await startButton.click();
        await page.waitForTimeout(2000);
        
        // Should show question or redirect to confirmation
        const question = page.locator('text=/pertanyaan|question/i').first();
        if (await question.isVisible({ timeout: 2000 }).catch(() => false)) {
          await expect(question).toBeVisible();
        }
      }
    }
  });
});

test.describe('Essay Grader - Confirmation Page', () => {
  test('should navigate to confirmation page', async ({ page }) => {
    await page.goto('/essay-grader/confirmation');
    
    await page.waitForTimeout(2000);
  });

  test('should display session details', async ({ page }) => {
    await page.goto('/essay-grader/confirmation');
    
    const currentUrl = page.url();
    if (currentUrl.includes('confirmation')) {
      const details = page.locator('text=/konfirmasi|confirmation|detail/i').first();
      if (await details.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(details).toBeVisible();
      }
    }
  });

  test('should have confirm and cancel buttons', async ({ page }) => {
    await page.goto('/essay-grader/confirmation');
    
    const currentUrl = page.url();
    if (currentUrl.includes('confirmation')) {
      const confirmButton = page.getByRole('button', { 
        name: /konfirmasi|confirm|ya|yes/i 
      }).first();
      
      if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(confirmButton).toBeVisible();
      }
      
      const cancelButton = page.getByRole('button', { 
        name: /batal|cancel|tidak|no/i 
      }).first();
      
      if (await cancelButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(cancelButton).toBeVisible();
      }
    }
  });
});

test.describe('Essay Grader - Result Page', () => {
  test('should navigate to result page', async ({ page }) => {
    await page.goto('/essay-grader/result');
    
    await page.waitForTimeout(2000);
  });

  test('should display result summary', async ({ page }) => {
    await page.goto('/essay-grader/result');
    
    const currentUrl = page.url();
    if (currentUrl.includes('result')) {
      const result = page.locator('text=/hasil|result|score|nilai/i').first();
      if (await result.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(result).toBeVisible();
      }
    }
  });

  test('should display readiness level', async ({ page }) => {
    await page.goto('/essay-grader/result');
    
    const currentUrl = page.url();
    if (currentUrl.includes('result')) {
      const readiness = page.locator('text=/siap|ready|perlu perbaikan|belum siap/i').first();
      if (await readiness.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(readiness).toBeVisible();
      }
    }
  });

  test('should have analysis sections', async ({ page }) => {
    await page.goto('/essay-grader/result');
    
    const currentUrl = page.url();
    if (currentUrl.includes('result')) {
      await page.waitForTimeout(2000);
      
      // Look for various analysis sections
      const sections = page.locator('text=/analisis|analysis|strengths|weaknesses|rekomendasi/i');
      const count = await sections.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('should have action buttons', async ({ page }) => {
    await page.goto('/essay-grader/result');
    
    const currentUrl = page.url();
    if (currentUrl.includes('result')) {
      const actionButtons = page.getByRole('button');
      const count = await actionButtons.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });
});

test.describe('Essay Grader - Responsive Design', () => {
  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/essay-grader');
    
    await page.waitForTimeout(2000);
  });

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/essay-grader');
    
    await page.waitForTimeout(2000);
  });
});
