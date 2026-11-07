import { test, expect } from "@playwright/test";

test("home loads with night tokens, and day tokens switch on data-theme", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.status()).toBe(200);

  const bg = () =>
    page.evaluate(() => getComputedStyle(document.body).backgroundColor);

  await expect(page.locator("html")).toHaveAttribute("data-theme", "night");
  expect(await bg()).toBe("rgb(14, 13, 11)");

  await page.evaluate(() => {
    document.documentElement.dataset.theme = "day";
    document.body.style.transition = "none";
  });
  expect(await bg()).toBe("rgb(243, 237, 227)");
});

test("display font and type scale are applied", async ({ page }) => {
  await page.goto("/");
  const h1 = page.getByRole("heading", { level: 1 });
  const family = await h1.evaluate((el) => getComputedStyle(el).fontFamily);
  expect(family.toLowerCase()).toContain("cormorant");
});
