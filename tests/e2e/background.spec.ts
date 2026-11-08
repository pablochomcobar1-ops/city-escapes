import { test, expect } from "@playwright/test";
import { clickThemeToggle } from "./helpers";

test("shader canvas runs behind the page and switches palette with the theme", async ({ page }) => {
  await page.goto("/");
  const canvas = page.locator("canvas[data-state]");
  await expect(canvas).toHaveAttribute("data-state", "running");

  // Rendered at half resolution for performance.
  const size = await canvas.evaluate((c: HTMLCanvasElement) => ({ w: c.width, iw: innerWidth }));
  expect(size.w).toBe(Math.round(size.iw * 0.5));

  // Behind content, never catches clicks.
  const z = await canvas.evaluate((c) => getComputedStyle(c).zIndex);
  expect(z).toBe("-10");
  await expect(canvas).toHaveCSS("pointer-events", "none");

  // Read the real rendered brightness of the background alone: hide page content and
  // grain for the screenshot so only the html colour + shader are measured.
  const brightness = async () => {
    const vp = page.viewportSize()!;
    await page.addStyleTag({ content: "header,main,footer,svg[aria-hidden]{visibility:hidden!important}" });
    const png = await page.screenshot({ clip: { x: 0, y: vp.height * 0.5, width: vp.width, height: 40 } });
    await page.evaluate(() => document.head.lastElementChild?.remove());
    return page.evaluate(async (b64) => {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, c.width, c.height).data;
      let sum = 0;
      for (let i = 0; i < d.length; i += 4) sum += (d[i] + d[i + 1] + d[i + 2]) / 3;
      return sum / (d.length / 4);
    }, png.toString("base64"));
  };

  const night = await brightness();
  expect(night).toBeLessThan(60);
  await clickThemeToggle(page, "Switch to day");
  await page.waitForTimeout(1600); // 1.2 s palette fade
  if (await page.getByRole("dialog").isVisible()) await page.keyboard.press("Escape");
  const day = await brightness();
  expect(day).toBeGreaterThan(190);
});

test("reduced motion: shader draws one still frame and stops", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.locator("canvas[data-state]")).toHaveAttribute("data-state", "static");
  await ctx.close();
});
