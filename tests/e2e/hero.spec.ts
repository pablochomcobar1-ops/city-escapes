import { test, expect } from "@playwright/test";
import { clickThemeToggle } from "./helpers";

const activeVideo = (page: import("@playwright/test").Page) =>
  page.locator('[data-testid="hero-videos"] video[data-active="true"]');

test("plays the right clip for theme and screen shape", async ({ page, isMobile }) => {
  await page.goto("/");
  const night = isMobile ? "hero-night-vertical.mp4" : "hero-night.mp4";
  await expect(activeVideo(page)).toHaveAttribute("src", new RegExp(night));

  // It actually plays (muted autoplay) and fades in over the poster.
  await expect
    .poll(() => activeVideo(page).evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime > 0))
    .toBe(true);
  await expect(activeVideo(page)).toHaveClass(/opacity-100/);

  await clickThemeToggle(page, "Switch to day");
  if (await page.getByRole("dialog").isVisible()) await page.keyboard.press("Escape");
  await expect(activeVideo(page)).toHaveAttribute("src", /hero-day\.mp4/);
  // The night clip is paused once it is no longer active.
  await expect
    .poll(() =>
      page.locator(`video[src*="${night}"]`).evaluate((v: HTMLVideoElement) => v.paused),
    )
    .toBe(true);
});

test("pauses when scrolled out of view", async ({ page }) => {
  await page.goto("/");
  await expect.poll(() => activeVideo(page).evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true);
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
  await expect.poll(() => activeVideo(page).evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
});

test("reduced motion: poster only, no video", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.locator("video")).toHaveCount(0);
  await expect(page.locator('img[src*="hero-night-poster"]')).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await ctx.close();
});

test("headline words end fully revealed", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(1800);
  const transforms = await page
    .locator("h1 .animate-\\[ce-word_1100ms_var\\(--ease-luxe\\)_both\\]")
    .evaluateAll((els) => els.map((e) => getComputedStyle(e).transform));
  expect(transforms.length).toBe(5);
  for (const t of transforms) expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(t);
});
