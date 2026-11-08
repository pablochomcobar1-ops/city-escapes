import { test, expect, type Page } from "@playwright/test";

const sectionTop = (page: Page) =>
  page.locator("#day").evaluate((el) => el.getBoundingClientRect().top + window.scrollY);

async function scrollToY(page: Page, y: number) {
  await page.evaluate((to) => {
    const l = (window as unknown as { __lenis?: { scrollTo: (y: number, o: object) => void } }).__lenis;
    if (l) l.scrollTo(to, { immediate: true });
    else window.scrollTo(0, to);
  }, y);
  await page.waitForTimeout(1600); // scrub: 1 catch-up
}

test("desktop: pins and slides sideways to the 4th room; the clock follows", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop only");
  await page.goto("/");
  await expect(page.locator(".pin-spacer #day, .pin-spacer:has(#day)").first()).toBeAttached();

  const top = await sectionTop(page);
  const vw = page.viewportSize()!.width;
  const panels = page.getByTestId("story-panel");

  // While pinned, the section stays at the top of the viewport.
  await scrollToY(page, top + vw * 1.5);
  expect(Math.abs(await page.locator("#day").evaluate((el) => el.getBoundingClientRect().top))).toBeLessThan(2);

  // At the end, the balcony panel fills the view and the clock says 9:00 pm.
  await scrollToY(page, top + vw * 3);
  const box = await panels.nth(3).boundingBox();
  expect(Math.abs(box!.x)).toBeLessThan(4);
  await expect(page.locator("#day [aria-hidden] .text-foreground").first()).toHaveText("9:00 pm");
  expect(Number(await page.locator("#day").getAttribute("data-progress"))).toBeGreaterThan(0.97);

  // After the story, the page continues normally.
  await scrollToY(page, top + vw * 3 + 900);
  expect(await page.locator("#day").evaluate((el) => el.getBoundingClientRect().bottom)).toBeLessThan(
    page.viewportSize()!.height,
  );
});

test("phone: no pin, rooms stack vertically", async ({ page, isMobile }) => {
  test.skip(!isMobile, "phone only");
  await page.goto("/");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  const panels = page.getByTestId("story-panel");
  await expect(panels).toHaveCount(4);
  const boxes = await Promise.all([0, 1, 2, 3].map((i) => panels.nth(i).boundingBox()));
  for (let i = 1; i < 4; i++) {
    expect(boxes[i]!.y).toBeGreaterThan(boxes[i - 1]!.y + boxes[i - 1]!.height - 2);
    expect(Math.abs(boxes[i]!.x)).toBeLessThan(2);
  }
});

test("reduced motion on desktop: no pin, stacked rooms", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  const panels = page.getByTestId("story-panel");
  const a = await panels.nth(0).boundingBox();
  const b = await panels.nth(1).boundingBox();
  expect(b!.y).toBeGreaterThan(a!.y + a!.height - 2);
  await ctx.close();
});

test("no horizontal page scrollbar anywhere", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
