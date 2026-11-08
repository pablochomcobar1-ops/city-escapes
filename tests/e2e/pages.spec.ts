import { test, expect } from "@playwright/test";

test.describe("/about", () => {
  test("has the idea, architecture, site photo, progress and a booking CTA", async ({ page }) => {
    const res = await page.goto("/about");
    expect(res?.status()).toBe(200);
    await expect(page).toHaveTitle("About · City Escapes");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/The\s+idea/);

    for (const name of [/light from three sides/, /on schedule/, /age well/, /the open/, /your terms/]) {
      await expect(page.getByRole("heading", { level: 2, name })).toBeAttached();
    }

    const site = page.getByRole("img", { name: /site at dawn/ });
    await site.scrollIntoViewIfNeeded();
    await expect(site).toBeVisible();

    await expect(page.locator("li[aria-current=step]")).toContainText("Facade");
    await expect(page.getByRole("main").getByRole("link", { name: "Book a visit" })).toHaveAttribute("href", "/contact");
  });

  test("section labels run 01–06 in order", async ({ page }) => {
    await page.goto("/about");
    const labels = await page.locator("main p").allTextContents();
    const nums = labels.filter((t) => /^0\d \/ [A-Za-z]/.test(t.trim())).map((t) => t.trim().slice(0, 2));
    expect(nums).toEqual(["01", "02", "03", "04", "05", "06"]);
  });

  test("nav About link opens the page", async ({ page, isMobile }) => {
    await page.goto("/");
    const scope = isMobile ? page.getByRole("dialog", { name: "Menu" }) : page.getByRole("navigation", { name: "Main" });
    if (isMobile) await page.getByRole("button", { name: "Menu" }).click();
    await scope.getByRole("link", { name: "About", exact: true }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/The\s+idea/);
  });
});
