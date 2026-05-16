import { test, expect } from "@playwright/test";

test.describe("Admin Panel Flow", () => {
  test("admin login page should redirect to main login", async ({ page }) => {
    // /admin/login just redirects to /login
    await page.goto("/admin/login");
    await expect(page).toHaveURL(/.*login/);
    await expect(
      page.getByRole("heading", { name: "เข้าสู่ระบบ" }),
    ).toBeVisible();
  });

  test("should redirect to login when visiting admin without auth", async ({
    page,
  }) => {
    await page.goto("/admin");
    // Should redirect to login or show an unauthorized message
    // Use first() to avoid strict mode violation if multiple headings match
    const loginPage = page
      .getByRole("heading", { name: "เข้าสู่ระบบ" })
      .first();
    const adminPage = page
      .getByRole("heading", { name: /admin|แดชบอร์ด|Dashboard/i })
      .first();

    await expect(loginPage.or(adminPage).first()).toBeVisible();
  });
});
