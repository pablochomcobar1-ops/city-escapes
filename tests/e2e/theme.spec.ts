import { test, expect } from "@playwright/test";

test("a saved day theme is applied before first paint (no dark flash)", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("ce-theme", "day");
    // Record the theme the moment <body> is created, before any app JS runs.
    // (Init scripts run before <html> exists, so observe the document itself.)
    new MutationObserver((_, obs) => {
      if (document.body) {
        (window as unknown as { __firstPaintTheme?: string }).__firstPaintTheme =
          document.documentElement.dataset.theme;
        obs.disconnect();
      }
    }).observe(document, { childList: true, subtree: true });
  });
  await page.goto("/");
  const first = await page.evaluate(
    () => (window as unknown as { __firstPaintTheme?: string }).__firstPaintTheme,
  );
  expect(first).toBe("day");
});

test("toggle switches theme and it survives a reload", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "night");

  await page.getByRole("button", { name: "Switch to day" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "day");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#f3ede3");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "day");
  await expect(page.getByRole("button", { name: "Switch to night" })).toBeVisible();
});

test("an invalid stored value falls back to night", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("ce-theme", "purple"));
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "night");
});
