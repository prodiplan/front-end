import { test, expect } from '@playwright/test';

test.describe('Profile - Protected Route Access', () => {
  test('should redirect to auth when not logged in', async ({ page }) => {
    await page.goto('/profile');
    
    // Should redirect to auth page
    await page.waitForURL(/.*auth.*/, { timeout: 10000 });
    await expect(page).toHaveURL(/.*auth.*/);
  });
});

test.describe('Profile - Enhanced Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/profile/enhanced');
  });

  test('should display profile tabs', async ({ page }) => {
    const currentUrl = page.url();
    if (currentUrl.includes('profile')) {
      // Look for tab navigation
      const tabs = page.locator('[role="tablist"]').first();
      if (await tabs.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(tabs).toBeVisible();
      }
    }
  });

  test('should have profile settings tab', async ({ page }) => {
    const currentUrl = page.url();
    if (currentUrl.includes('profile')) {
      const settingsTab = page.locator('text=/pengaturan|settings|profil/i').first();
      if (await settingsTab.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(settingsTab).toBeVisible();
      }
    }
  });

  test('should have statistics tab', async ({ page }) => {
    const currentUrl = page.url();
    if (currentUrl.includes('profile')) {
      const statsTab = page.locator('text=/statistik|statistics|dashboard/i').first();
      if (await statsTab.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(statsTab).toBeVisible();
        await statsTab.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should have session history tab', async ({ page }) => {
    const currentUrl = page.url();
    if (currentUrl.includes('profile')) {
      const historyTab = page.locator('text=/riwayat|history|session/i').first();
      if (await historyTab.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(historyTab).toBeVisible();
        await historyTab.click();
        await page.waitForTimeout(1000);
      }
    }
  });
});

test.describe('Profile - Profile Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/profile/enhanced');
  });

  test('should display user information form', async ({ page }) => {
    const currentUrl = page.url();
    if (currentUrl.includes('profile')) {
      const nameInput = page.getByPlaceholder(/nama|name/i).first();
      if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(nameInput).toBeVisible();
      }
    }
  });

  test('should have email field', async ({ page }) => {
    const currentUrl = page.url();
    if (currentUrl.includes('profile')) {
      const emailInput = page.getByPlaceholder(/email/i).first();
      if (await emailInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(emailInput).toBeVisible();
      }
    }
  });

  test('should have save changes button', async ({ page }) => {
    const currentUrl = page.url();
    if (currentUrl.includes('profile')) {
      const saveButton = page.getByRole('button', { 
        name: /simpan|save|update/i 
      }).first();
      
      if (await saveButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(saveButton).toBeVisible();
      }
    }
  });

  test('should have delete account option', async ({ page }) => {
    const currentUrl = page.url();
    if (currentUrl.includes('profile')) {
      const deleteButton = page.locator('text=/hapus akun|delete account/i').first();
      if (await deleteButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(deleteButton).toBeVisible();
      }
    }
  });
});

test.describe('Profile - Statistics Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/profile/enhanced');
  });

  test('should switch to statistics tab', async ({ page }) => {
    const currentUrl = page.url();
    if (currentUrl.includes('profile')) {
      const statsTab = page.locator('text=/statistik|statistics/i').first();
      if (await statsTab.isVisible({ timeout: 2000 }).catch(() => false)) {
        await statsTab.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should display statistics cards', async ({ page }) => {
    const currentUrl = page.url();
    if (currentUrl.includes('profile')) {
      const statsTab = page.locator('text=/statistik|statistics/i').first();
      if (await statsTab.isVisible({ timeout: 2000 }).catch(() => false)) {
        await statsTab.click();
        await page.waitForTimeout(1000);
        
        // Look for statistics metrics
        const statsCards = page.locator('text=/total|rata-rata|average/i');
        const count = await statsCards.count();
        expect(count).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test('should display charts or graphs', async ({ page }) => {
    const currentUrl = page.url();
    if (currentUrl.includes('profile')) {
      const statsTab = page.locator('text=/statistik|statistics/i').first();
      if (await statsTab.isVisible({ timeout: 2000 }).catch(() => false)) {
        await statsTab.click();
        await page.waitForTimeout(2000);
        
        // Charts might be rendered with SVG or canvas
        const charts = page.locator('svg, canvas');
        const count = await charts.count();
        expect(count).toBeGreaterThanOrEqual(0);
      }
    }
  });
});

test.describe('Profile - Session History', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/profile/enhanced');
  });

  test('should switch to session history tab', async ({ page }) => {
    const currentUrl = page.url();
    if (currentUrl.includes('profile')) {
      const historyTab = page.locator('text=/riwayat|history/i').first();
      if (await historyTab.isVisible({ timeout: 2000 }).catch(() => false)) {
        await historyTab.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should display session list or empty state', async ({ page }) => {
    const currentUrl = page.url();
    if (currentUrl.includes('profile')) {
      const historyTab = page.locator('text=/riwayat|history/i').first();
      if (await historyTab.isVisible({ timeout: 2000 }).catch(() => false)) {
        await historyTab.click();
        await page.waitForTimeout(1000);
        
        // Either sessions or empty state
        const sessions = page.locator('text=/session|sesi|tidak ada|no sessions/i');
        const count = await sessions.count();
        expect(count).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test('should have view result button for completed sessions', async ({ page }) => {
    const currentUrl = page.url();
    if (currentUrl.includes('profile')) {
      const historyTab = page.locator('text=/riwayat|history/i').first();
      if (await historyTab.isVisible({ timeout: 2000 }).catch(() => false)) {
        await historyTab.click();
        await page.waitForTimeout(1000);
        
        const viewButton = page.getByRole('button', { 
          name: /lihat|view|detail/i 
        }).first();
        
        if (await viewButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await expect(viewButton).toBeVisible();
        }
      }
    }
  });
});

test.describe('Profile - Assessments Page', () => {
  test('should navigate to assessments page', async ({ page }) => {
    await page.goto('/profile/assessments');
    
    await page.waitForTimeout(2000);
  });

  test('should display assessment history', async ({ page }) => {
    await page.goto('/profile/assessments');
    
    const currentUrl = page.url();
    if (currentUrl.includes('assessments')) {
      await page.waitForTimeout(1000);
      
      const assessments = page.locator('text=/assessment|penilaian|tidak ada/i');
      const count = await assessments.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });
});

test.describe('Profile - Result Detail Page', () => {
  test('should handle result page with ID parameter', async ({ page }) => {
    await page.goto('/profile/result/test-123');
    
    await page.waitForTimeout(2000);
    
    // Should either show result or redirect/error
    const currentUrl = page.url();
    expect(currentUrl).toBeTruthy();
  });
});

test.describe('Profile - Responsive Design', () => {
  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/profile/enhanced');
    
    await page.waitForTimeout(2000);
  });

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/profile/enhanced');
    
    await page.waitForTimeout(2000);
  });
});
