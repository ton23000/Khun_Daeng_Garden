import { test, expect } from "@playwright/test";

test.describe("User Profile Flow", () => {
  test("should redirect to login prompt when not authenticated", async ({
    page,
  }) => {
    await page.goto("/profile");
    // Profile page shows a login message when not authenticated
    await expect(page.getByText("กรุณาเข้าสู่ระบบก่อน")).toBeVisible();
    // Use .first() since the same link may appear in header and footer
    await expect(
      page.getByRole("link", { name: "เข้าสู่ระบบ" }).first(),
    ).toBeVisible();
  });

  test("should show login page when visiting booking history without auth", async ({
    page,
  }) => {
    await page.goto("/profile/bookings");
    // Either redirect to login or show login prompt
    await expect(
      page
        .getByText("กรุณาเข้าสู่ระบบก่อน")
        .or(page.getByRole("heading", { name: "เข้าสู่ระบบ" })),
    ).toBeVisible();
  });
});
