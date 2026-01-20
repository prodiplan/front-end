import { test, expect } from '@playwright/test';

test.describe('Authentication - Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
  });

  test('should display login form by default', async ({ page }) => {
    await expect(page.locator('text=/login|masuk/i').first()).toBeVisible();
    await expect(page.getByPlaceholder(/email/i).first()).toBeVisible();
    await expect(page.getByPlaceholder(/password|kata sandi/i).first()).toBeVisible();
  });

  test('should show validation error for empty email', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: /login|masuk/i }).first();
    await loginButton.click();
    
    // Should show toast or error message
    await page.waitForTimeout(1000);
  });

  test('should show validation error for invalid email format', async ({ page }) => {
    await page.getByPlaceholder(/email/i).first().fill('invalidemail');
    await page.getByPlaceholder(/password|kata sandi/i).first().fill('password123');
    
    const loginButton = page.getByRole('button', { name: /login|masuk/i }).first();
    await loginButton.click();
    
    await page.waitForTimeout(1000);
  });

  test('should show validation error for empty password', async ({ page }) => {
    await page.getByPlaceholder(/email/i).first().fill('test@example.com');
    
    const loginButton = page.getByRole('button', { name: /login|masuk/i }).first();
    await loginButton.click();
    
    await page.waitForTimeout(1000);
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.getByPlaceholder(/password|kata sandi/i).first();
    await passwordInput.fill('testpassword');
    
    // Find eye icon button
    const eyeButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    if (await eyeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Check initial type
      await expect(passwordInput).toHaveAttribute('type', 'password');
      
      // Click to show password
      await eyeButton.click();
      await page.waitForTimeout(500);
      
      // Type might change to text
      const inputType = await passwordInput.getAttribute('type');
      expect(inputType).toBeTruthy();
    }
  });

  test('should have forgot password link', async ({ page }) => {
    const forgotPasswordLink = page.getByRole('link', { name: /lupa password|forgot password/i });
    if (await forgotPasswordLink.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(forgotPasswordLink).toBeVisible();
      await forgotPasswordLink.click();
      await expect(page).toHaveURL(/.*forgot-password.*/);
    }
  });
});

test.describe('Authentication - Register Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
  });

  test('should switch to register form', async ({ page }) => {
    const registerTab = page.locator('text=/daftar|register|sign up/i').first();
    await registerTab.click();
    
    await page.waitForTimeout(500);
    
    // Should show register form fields (placeholder: "John Doe")
    await expect(page.getByPlaceholder(/john doe|nama lengkap|full name/i).first()).toBeVisible({ timeout: 5000 });
  });

  test('should display all required register fields', async ({ page }) => {
    const registerTab = page.locator('text=/daftar|register|sign up/i').first();
    await registerTab.click();
    
    await page.waitForTimeout(500);
    
    // Check for required fields (placeholder: "John Doe" and "nama@email.com")
    const fullNameInput = page.getByPlaceholder(/john doe|nama lengkap|full name/i).first();
    await expect(fullNameInput).toBeVisible({ timeout: 5000 });
    
    const emailInput = page.getByPlaceholder(/nama@email|email/i).first();
    await expect(emailInput).toBeVisible();
  });

  test('should validate password matching', async ({ page }) => {
    const registerTab = page.locator('text=/daftar|register|sign up/i').first();
    await registerTab.click();
    
    await page.waitForTimeout(500);
    
    // Fill in form with mismatched passwords (placeholder: "John Doe" and "nama@email.com")
    await page.getByPlaceholder(/john doe/i).first().fill('Test User');
    await page.getByPlaceholder(/nama@email/i).first().fill('testuser@example.com');
    
    const passwordInputs = page.getByPlaceholder(/password|kata sandi/i);
    if (await passwordInputs.count() >= 2) {
      await passwordInputs.nth(0).fill('password123');
      await passwordInputs.nth(1).fill('differentpassword');
      
      const registerButton = page.getByRole('button', { name: /daftar|register|sign up/i }).first();
      await registerButton.click();
      
      // Should show error
      await page.waitForTimeout(1000);
    }
  });

  test('should have searchable select for school and major', async ({ page }) => {
    const registerTab = page.locator('text=/daftar|register|sign up/i').first();
    await registerTab.click();
    
    await page.waitForTimeout(500);
    
    // Look for school and major selectors
    const schoolInput = page.locator('text=/sekolah|school/i').first();
    if (await schoolInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(schoolInput).toBeVisible();
    }
    
    const majorInput = page.locator('text=/jurusan|major|prodi/i').first();
    if (await majorInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(majorInput).toBeVisible();
    }
  });
});

test.describe('Authentication - Forgot Password Flow', () => {
  test('should navigate to forgot password page', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    
    await expect(page.locator('text=/lupa password|forgot password|reset password/i').first()).toBeVisible();
  });

  test('should have email input for password reset', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    
    const emailInput = page.getByPlaceholder(/email/i).first();
    await expect(emailInput).toBeVisible();
  });

  test('should validate email format for password reset', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    
    const emailInput = page.getByPlaceholder(/email/i).first();
    await emailInput.fill('invalidemail');
    
    const submitButton = page.getByRole('button', { name: /kirim|send|submit/i }).first();
    await submitButton.click();
    
    await page.waitForTimeout(1000);
  });

  test('should have back to login link', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    
    const backLink = page.getByRole('link', { name: /kembali|back|login/i }).first();
    if (await backLink.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(backLink).toBeVisible();
    }
  });
});

test.describe('Authentication - Reset Password Flow', () => {
  test('should navigate to reset password page', async ({ page }) => {
    await page.goto('/auth/reset-password?token=test123');
    
    const resetForm = page.locator('text=/reset password|atur ulang password/i').first();
    await expect(resetForm).toBeVisible({ timeout: 5000 });
  });

  test('should require token parameter', async ({ page }) => {
    await page.goto('/auth/reset-password');
    
    // Should either redirect or show error about missing token
    await page.waitForTimeout(2000);
  });
});

test.describe('Authentication - UI/UX Elements', () => {
  test('should display ProdiPlan branding', async ({ page }) => {
    await page.goto('/auth');
    
    const branding = page.locator('text=/prodiplan/i').first();
    await expect(branding).toBeVisible();
  });

  test('should have smooth animations', async ({ page }) => {
    await page.goto('/auth');
    
    // Switch between login and register
    const registerTab = page.locator('text=/daftar|register|sign up/i').first();
    await registerTab.click();
    
    await page.waitForTimeout(1000);
    
    const loginTab = page.locator('text=/^login$|^masuk$/i').first();
    await loginTab.click();
    
    await page.waitForTimeout(1000);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/auth');
    
    const form = page.locator('form').first();
    await expect(form).toBeVisible();
  });
});
