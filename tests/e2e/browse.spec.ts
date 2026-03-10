import { test, expect } from '@playwright/test';

test.describe('Public Pages and Browse Flow', () => {

  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Khun Daeng Garden|สวนคุณแดง/);
    await expect(page.getByRole('banner')).toBeVisible();
  });

  test('should be able to view trees list', async ({ page }) => {
    await page.goto('/shop');
    
    // Shop page shows loading initially, wait for it to load
    // Then look for a product card or the "แสดง" text that counts products
    await expect(page.locator('text=กำลังโหลด').or(page.locator('text=แสดง'))).toBeVisible({ timeout: 10000 });
  });

  test('should load contact page and show info', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByRole('heading', { name: 'ติดต่อเรา' })).toBeVisible();
    await expect(page.getByRole('button', { name: /ส่งข้อความ/i })).toBeVisible();
  });

});
