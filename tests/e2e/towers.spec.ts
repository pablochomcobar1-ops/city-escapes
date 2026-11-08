import { test, expect, type Page } from "@playwright/test";

const layer = (page: Page, name: string) => page.locator(`[data-testid="towers-frame"] [data-layer="${name}"]`);
const clip = (page: Page) => layer(page, "night").evaluate((el) => getComputedStyle(el).clipPath);
const opacity = (page: Page, name: string) =>
  layer(page, name).evaluate((el) => Number(getComputedStyle(el).opacity));

async function scrollToTowers(page: Page) {
  await page.getByTestId("towers-frame").scrollIntoViewIfNeeded();
}

test("night: lit photo shows immediately on load (no wipe on first paint)", async ({ page }) => {
  await page.goto("/");
  await scrollToTowers(page);
  expect(await opacity(page, "night")).toBe(1);
  expect(await clip(page)).toMatch(/inset\(0(px)?\)/);
});

test("switching to day fades the night layers out; back to night wipes the lights up", async ({ page }) => {
  await page.goto("/");
  await scrollToTowers(page);
  const sw = page.getByRole("button", { name: /See it by day/ });
  await sw.click();
  await expect.poll(() => opacity(page, "night")).toBe(0);
  await expect.poll(() => opacity(page, "bluehour")).toBe(0);

  await page.getByRole("button", { name: /See it at night/ }).click();
  // Mid-way: the wipe is partly done (inset top between 0% and 100%).
  await page.waitForTimeout(1100);
  const mid = await clip(page);
  const top = Number(/inset\(([\d.]+)%/.exec(mid)?.[1] ?? "0");
  expect(top).toBeGreaterThan(5);
  expect(top).toBeLessThan(95);
  // End: fully lit.
  await expect.poll(() => clip(page), { timeout: 4000 }).toMatch(/inset\(0(px)?\)/);
});

test("night loop video plays only at night and in view", async ({ page }) => {
  await page.goto("/");
  await scrollToTowers(page);
  const v = layer(page, "night-loop");
  await expect(v).toHaveCount(1);
  await expect.poll(() => v.evaluate((el: HTMLVideoElement) => !el.paused)).toBe(true);
  await expect(v).toHaveClass(/opacity-100/);

  await page.getByRole("button", { name: /See it by day/ }).click();
  await expect.poll(() => v.evaluate((el: HTMLVideoElement) => el.paused)).toBe(true);
});

test("counters land on the real numbers", async ({ page }) => {
  await page.goto("/");
  await page.getByText("Floors", { exact: true }).scrollIntoViewIfNeeded();
  await expect(page.locator("dd").filter({ hasText: /^\d+$/ })).toHaveText(["02", "24"], { timeout: 4000 });
});

test("reduced motion: no loop video, no zoom", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  await scrollToTowers(page);
  await expect(layer(page, "night-loop")).toHaveCount(0);
  const transform = await page.locator("[data-zoom]").evaluate((el) => getComputedStyle(el).transform);
  expect(transform).toBe("none");
  await ctx.close();
});
