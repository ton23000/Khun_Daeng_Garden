import { test, expect } from '@playwright/test';

test.describe('Public Pages and Browse Flow', () => {

  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check page title or main heading
    await expect(page).toHaveTitle(/Khun Daeng Garden|สวนคุณแดง/);
    
    // Verify header exists (since it doesn't use nav tag directly)
    await expect(page.getByRole('banner')).toBeVisible();
  });

  test('should be able to view trees list', async ({ page }) => {
    // Go to shop via direct URL to avoid mobile menu hidden issues
    await page.goto('/shop');
    
    // The shop page should have a heading 'สินค้าทั้งหมด' or similar
    // Using a more generalized selector for the main content area
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.locator('input[placeholder*="ค้นหา"]')).toBeVisible();
  });

  test('should load contact page and show info', async ({ page }) => {
    await page.goto('/contact');
    
    await expect(page.getByRole('heading', { name: 'ติดต่อเรา' })).toBeVisible();
    
    // Ensure the message button is visible, which confirms the contact form is there
    await expect(page.getByRole('button', { name: /ส่งข้อความ/i })).toBeVisible();
  });

});
