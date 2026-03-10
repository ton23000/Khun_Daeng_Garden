import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {

  test('should show login page correctly', async ({ page }) => {
    await page.goto('/login');
    
    // Check if essential elements are present
    await expect(page.getByRole('heading', { name: 'เข้าสู่ระบบ' })).toBeVisible();
    await expect(page.getByPlaceholder('0812345678 หรือ user@example.com')).toBeVisible();
    await expect(page.getByPlaceholder('••••••')).toBeVisible();
    await expect(page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true })).toBeVisible();
  });

  test('should show validation errors on empty submission', async ({ page }) => {
    await page.goto('/login');
    
    const phoneInput = page.getByPlaceholder('0812345678 หรือ user@example.com');
    const isRequired = await phoneInput.evaluate((el: HTMLInputElement) => el.required);
    expect(isRequired).toBe(true);
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login');
    
    // Click register link - use .first() because there could be footer links too
    await page.getByRole('link', { name: 'สมัครสมาชิก' }).first().click();
    
    // Should be on register page - heading is "สมัครสมาชิก" (from CardTitle)
    await expect(page).toHaveURL(/.*register/);
    await expect(page.getByRole('heading', { name: 'สมัครสมาชิก' })).toBeVisible();
  });

});
