import { test, expect, devices, type Page } from "@playwright/test";

/*
 * The test browser renders WebGL in software (~1 fps), and two 3D pages at once
 * starve each other. So the 3D tests run one at a time, on the desktop project only;
 * phone behaviour is covered by opening phone-emulated pages inside these tests.
 */
test.describe.configure({ mode: "serial", timeout: 150_000 });

const ready = (page: Page) =>
  page.waitForFunction(() => document.querySelector('canvas[data-ready="true"]'), null, { timeout: 90_000 });

test.describe("3D tour", () => {
  test.beforeEach(({ isMobile }) => test.skip(isMobile, "3D tests run sequentially in the desktop project"));

  test("loads with a progress screen, then starts in the living room", async ({ page }) => {
    await page.goto("/tour");
    await expect(page).toHaveTitle("Tour Residence 12A · City Escapes");
    await expect(page.getByTestId("tour-progress")).toBeAttached();
    await ready(page);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Living room");
    await expect(page.getByRole("button", { name: "Living", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: /Click to step inside/ })).toBeVisible();
  });

  test("room buttons reach every room (reduced motion: instant moves)", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.goto("/tour");
    await ready(page);
    for (const [btn, title] of [
      ["Bedroom", "Master bedroom"],
      ["Kitchen", "Kitchen"], // bedroom → kitchen routes through the living room
      ["Balcony", "Balcony"],
      ["Living", "Living room"],
    ] as const) {
      await page.getByRole("button", { name: btn, exact: true }).click();
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(title, { timeout: 40_000 });
      await expect(page.getByRole("button", { name: btn, exact: true })).toHaveAttribute("aria-pressed", "true");
    }
    await ctx.close();
  });

  test("with motion on, a glide animates through the door and arrives", async ({ page }) => {
    await page.goto("/tour");
    await ready(page);
    await page.getByRole("button", { name: "Kitchen", exact: true }).click();
    // While gliding, the room buttons are disabled so requests can't pile up.
    await expect(page.locator('nav[aria-label="Rooms"] button[disabled]').first()).toBeAttached();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Kitchen", { timeout: 60_000 });
    await expect(page.locator('nav[aria-label="Rooms"] button[disabled]')).toHaveCount(0, { timeout: 60_000 });
  });

  test("on a phone: drag/tap hint instead of the WASD prompt", async ({ browser }) => {
    const ctx = await browser.newContext({ ...devices["Pixel 7"] });
    const page = await ctx.newPage();
    await page.goto("/tour");
    await ready(page);
    await expect(page.getByText("Drag to look around · tap a glowing spot to move")).toBeVisible();
    await expect(page.locator("#tour-start")).toHaveCount(0);
    await ctx.close();
  });
});

test("without WebGL: photo fallback with all four rooms", async ({ page }) => {
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = function () {
      return null;
    } as typeof HTMLCanvasElement.prototype.getContext;
  });
  await page.goto("/tour");
  const fb = page.getByTestId("tour-fallback");
  await expect(fb).toBeVisible();
  for (const t of ["Living room", "Kitchen", "Master bedroom", "Balcony"]) {
    await expect(fb.getByRole("heading", { level: 2, name: t })).toBeVisible();
  }
  await expect(page.locator("canvas")).toHaveCount(0);
});

test("the home page never downloads the 3D engine, even via link prefetch", async ({ page }) => {
  const scripts: string[] = [];
  page.on("response", async (r) => {
    if (r.request().resourceType() === "script") scripts.push(await r.text().catch(() => ""));
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  // Prefetching of linked routes (like /tour) happens when the browser is idle.
  await page.getByRole("link", { name: /Step inside/ }).first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(3000);
  await page.waitForLoadState("networkidle");
  expect(scripts.length).toBeGreaterThan(0);
  expect(scripts.some((s) => s.includes("WebGLRenderer"))).toBe(false);
});
