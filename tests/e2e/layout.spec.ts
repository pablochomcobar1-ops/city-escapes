import { test, expect } from "@playwright/test";

test("nav hides on scroll down and returns on scroll up", async ({ page }) => {
  await page.goto("/");
  // Wait until the app is interactive (Lenis starts after hydration), or the
  // scroll can happen before the nav's listener exists.
  await page.waitForFunction(() => "__lenis" in window);
  const header = page.locator("header");
  await page.mouse.wheel(0, 1200);
  await expect(header).toHaveClass(/-translate-y-full/);
  // Lenis eases toward its target; let the downward glide finish before reversing.
  await page.waitForFunction(() => {
    const w = window as unknown as { __y?: number };
    const same = w.__y === window.scrollY;
    w.__y = window.scrollY;
    return same;
  }, null, { polling: 250 });
  await page.mouse.wheel(0, -300);
  await expect(header).not.toHaveClass(/-translate-y-full/);
});

test("phone menu traps focus and closes with Escape", async ({ page, isMobile }) => {
  test.skip(!isMobile, "phone only");
  await page.goto("/");
  await page.getByRole("button", { name: "Menu" }).click();
  const dialog = page.getByRole("dialog", { name: "Menu" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Residence" })).toBeFocused();
  // The panel must cover the whole screen (regression: it was trapped in the header box).
  const box = await dialog.boundingBox();
  const vp = page.viewportSize()!;
  expect(box?.height).toBeGreaterThanOrEqual(vp.height - 1);
  // Page content underneath must not be clickable/visible through it.
  const hit = await page.evaluate(() => {
    const el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight * 0.6);
    return !!el?.closest('[role="dialog"]');
  });
  expect(hit).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "Menu" })).toBeFocused();
});

test("reduced motion: no smooth scroll, no cursor ring", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  expect(await page.evaluate(() => "__lenis" in window)).toBe(false);
  await expect(page.locator(".mix-blend-difference")).toHaveCount(0);
  await ctx.close();
});

test("footer credit is visible", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByText("Concept project by Pablo Chomcobar. Not a real development. Visuals generated with AI."),
  ).toBeVisible();
});
