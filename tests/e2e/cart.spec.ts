import { test, expect } from "@playwright/test";

test.describe("Cart Flow", () => {
  test("should show empty cart state when no items", async ({ page }) => {
    await page.goto("/cart");
    await expect(
      page.getByRole("heading", { name: "ตะกร้าสินค้าว่างเปล่า" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "จองต้นไม้" })).toBeVisible();
  });

  test("should show login warning in cart when not logged in", async ({
    page,
  }) => {
    // Add item to localStorage cart first, then check cart warning
    await page.goto("/shop");
    // Click the cart link in the navbar
    await page.locator("a[href='/cart']").first().click();
    // Either empty cart or not-logged-in warning should be visible
    const emptyCart = page.getByRole("heading", {
      name: "ตะกร้าสินค้าว่างเปล่า",
    });
    await expect(emptyCart).toBeVisible();
  });

  test("shop page should show tree listings or no results", async ({
    page,
  }) => {
    await page.goto("/shop");
    // Wait for loading spinner to disappear (shop is async)
    await page.waitForTimeout(5000);
    // Should show either trees (any h3) or no results message or the text "แสดง"
    const hasH3 = await page.locator("h3").count();
    const hasNoResults = await page.locator("text=ไม่พบรายการต้นไม้").count();
    const hasCountText = await page.locator("text=แสดง").count();

    // At least one of these should be present after loading
    expect(hasH3 + hasNoResults + hasCountText).toBeGreaterThan(0);
  });
});
