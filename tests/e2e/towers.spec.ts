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

test("night is a still photo: no video in the towers frame (the AI loop shimmered)", async ({ page }) => {
  await page.goto("/");
  await scrollToTowers(page);
  await expect(page.locator('[data-testid="towers-frame"] video')).toHaveCount(0);
  // Two screenshots 1 s apart are identical when the page is still: nothing inside moves.
  // (Wait until every layer is decoded and revealed.)
  await expect(page.locator('[data-zoom][data-ready="true"]')).toBeVisible();
  await page.waitForTimeout(900); // 0.7 s reveal fade
  const a = await page.getByTestId("towers-frame").screenshot();
  await page.waitForTimeout(1000);
  const b = await page.getByTestId("towers-frame").screenshot();
  // Allow ±2/255 rendering noise (GPU re-rasterising a scaled layer); real motion is far larger.
  const maxDiff = await page.evaluate(
    async ([x, y]) => {
      const load = async (b64: string) => {
        const img = new Image();
        img.src = `data:image/png;base64,${b64}`;
        await img.decode();
        const c = document.createElement("canvas");
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0, 0, c.width, c.height).data;
      };
      const [p, q] = await Promise.all([load(x), load(y)]);
      // Skip a 2px border: the frame height is fractional, so the screenshot's edge row
      // includes a sliver of the animated background just outside the frame.
      const img = new Image();
      img.src = `data:image/png;base64,${x}`;
      await img.decode();
      const w = img.width, h = img.height;
      let m = 0;
      for (let row = 2; row < h - 2; row++)
        for (let col = 2; col < w - 2; col++) {
          const i = (row * w + col) * 4;
          for (let k = 0; k < 3; k++) m = Math.max(m, Math.abs(p[i + k] - q[i + k]));
        }
      return m;
    },
    [a.toString("base64"), b.toString("base64")],
  );
  expect(maxDiff).toBeLessThanOrEqual(2);
});

test("counters land on the real numbers", async ({ page }) => {
  await page.goto("/");
  await page.getByText("Floors", { exact: true }).scrollIntoViewIfNeeded();
  await expect(page.locator("dd").filter({ hasText: /^\d+$/ })).toHaveText(["02", "24"], { timeout: 4000 });
});

test("reduced motion: no zoom", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  await scrollToTowers(page);
  const transform = await page.locator("[data-zoom]").evaluate((el) => getComputedStyle(el).transform);
  expect(transform).toBe("none");
  await ctx.close();
});
