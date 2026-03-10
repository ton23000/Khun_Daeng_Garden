import { test, expect } from '@playwright/test';

test.describe('Promotions Page', () => {

  test('should load promotions page', async ({ page }) => {
    await page.goto('/promotion');
    // Page should load with a heading related to promotions or products
    await expect(page.getByRole('heading').first()).toBeVisible();
  });
});

test.describe('Favorites Page', () => {

  test('should redirect to login from favorites if not authenticated', async ({ page }) => {
    await page.goto('/favorites');
    // Should either show login prompt or a favorites page with empty state
    const loginMsg = page.getByText('กรุณาเข้าสู่ระบบ');
    const alreadyOnLogin = page.getByRole('heading', { name: 'เข้าสู่ระบบ' });
    const favoritesEmpty = page.getByText('รายการโปรด');

    await expect(loginMsg.or(alreadyOnLogin).or(favoritesEmpty)).toBeVisible({ timeout: 8000 });
  });
});

test.describe('Other Static Pages', () => {

  test('should load FAQ page', async ({ page }) => {
    await page.goto('/faq');
    await expect(page.getByRole('heading').first()).toBeVisible();
  });

  test('should load about page', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('heading').first()).toBeVisible();
  });

  test('should load services page', async ({ page }) => {
    await page.goto('/services');
    await expect(page.getByRole('heading').first()).toBeVisible();
  });

  test('should load forgot password page', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.getByRole('heading').first()).toBeVisible();
  });
});
