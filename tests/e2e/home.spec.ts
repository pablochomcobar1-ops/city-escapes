import { test, expect } from "@playwright/test";

test("home has the 8 numbered sections in order and one h1", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  // Section labels look like "04 / Residences" (a word after the slash, not "01 / 04").
  const labels = await page.locator("main p, main span").allTextContents();
  const nums = [...new Set(labels.filter((t) => /^0\d \/ [A-Za-z]/.test(t.trim())).map((t) => t.trim().slice(0, 2)))];
  expect(nums).toEqual(["02", "03", "04", "05", "06", "07", "08"]);
});

test("sections reveal as you scroll and end fully visible", async ({ page }) => {
  await page.goto("/");
  const cta = page.getByRole("heading", { name: "Visit on your terms." });
  await cta.scrollIntoViewIfNeeded();
  await expect(page.locator('[data-reveal]:has(#cta-title)')).toHaveAttribute("data-shown", "");
  await expect.poll(() => cta.evaluate((el) => getComputedStyle(el.closest("[data-reveal]")!).opacity)).toBe("1");
});

test("reduced motion: content is visible without scrolling into view", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  const op = await page
    .locator('[data-reveal]:has(#cta-title)')
    .evaluate((el) => getComputedStyle(el).opacity);
  expect(op).toBe("1");
  await ctx.close();
});

test("nav 'Residence' link lands on the residences section", async ({ page, isMobile }) => {
  await page.goto("/");
  const scope = isMobile ? page.getByRole("dialog", { name: "Menu" }) : page.getByRole("navigation", { name: "Main" });
  if (isMobile) await page.getByRole("button", { name: "Menu" }).click();
  await scope.getByRole("link", { name: "Residence", exact: true }).click();
  await expect
    .poll(() => page.locator("#residences").evaluate((el) => Math.round(el.getBoundingClientRect().top)), {
      timeout: 6000,
    })
    .toBeLessThan(140);
});

test("progress fill stops just past the current milestone (facade)", async ({ page, isMobile }) => {
  await page.goto("/");
  const fill = page.locator(isMobile ? ".md\\:hidden [data-fill]" : ".md\\:block [data-fill]");
  await fill.scrollIntoViewIfNeeded();
  const style = await fill.getAttribute("style");
  expect(style).toMatch(/44%/);
});
