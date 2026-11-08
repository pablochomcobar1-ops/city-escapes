import { test, expect, type Page } from "@playwright/test";

/** Collects every CSP violation the page reports, from both the DOM event and the console. */
async function watchCsp(page: Page) {
  const violations: string[] = [];
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (e) => {
      console.error(`CSP-VIOLATION ${e.violatedDirective} ${e.blockedURI}`);
    });
  });
  page.on("console", (msg) => {
    const t = msg.text();
    if (t.includes("CSP-VIOLATION") || t.includes("Content Security Policy")) violations.push(t);
  });
  return violations;
}

test.describe("security headers", () => {
  test("every page sends the hardening headers", async ({ request }) => {
    for (const path of ["/", "/about", "/contact", "/tour", "/does-not-exist"]) {
      const res = await request.get(path);
      const h = res.headers();
      const csp = h["content-security-policy"];
      expect(csp, path).toContain("default-src 'self'");
      expect(csp).toContain("object-src 'none'");
      expect(csp).toContain("frame-ancestors 'none'");
      expect(csp).toContain("base-uri 'self'");
      expect(csp).not.toContain("unsafe-eval"); // production build only
      expect(h["strict-transport-security"]).toContain("max-age=63072000");
      expect(h["x-content-type-options"]).toBe("nosniff");
      expect(h["x-frame-options"]).toBe("DENY");
      expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
      expect(h["permissions-policy"]).toContain("camera=()");
      expect(h["x-powered-by"]).toBeUndefined();
    }
  });

  test("media is cached long-term", async ({ request }) => {
    const res = await request.get("/media/grain.png");
    expect(res.status()).toBe(200);
    expect(res.headers()["cache-control"]).toContain("immutable");
  });
});

test.describe("no page breaks the Content-Security-Policy", () => {
  for (const path of ["/", "/about", "/contact"]) {
    test(path, async ({ page }) => {
      const violations = await watchCsp(page);
      await page.goto(path);
      // Scroll the whole page so lazy images, videos and the shader all load.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
      });
      await page.waitForTimeout(800);
      expect(violations).toEqual([]);
    });
  }

  test("/tour (3D textures load)", async ({ page, isMobile }) => {
    test.skip(isMobile, "3D tests run on desktop only");
    const violations = await watchCsp(page);
    await page.goto("/tour");
    await expect(page.locator("canvas[data-tour]")).toBeAttached({ timeout: 30_000 });
    await expect(page.getByRole("button", { name: /Click to step inside/ })).toBeVisible({ timeout: 30_000 });
    await page.waitForTimeout(500);
    expect(violations).toEqual([]);
  });

  test("the WhatsApp link stays allowed (it is a plain link, not a request)", async ({ page }) => {
    await page.goto("/contact");
    const wa = page.getByRole("link", { name: /WhatsApp/i }).first();
    await expect(wa).toHaveAttribute("href", /^https:\/\/wa\.me\//);
  });
});

test.describe("404 and crawler files", () => {
  test("unknown routes show the styled 404 with a way back", async ({ page }) => {
    const res = await page.goto("/no-such-room");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/This room\s+doesn.t exist\./);
    await expect(page.getByRole("main").getByRole("link", { name: "Book a visit" })).toHaveAttribute("href", "/contact");
    await expect(page.getByRole("main").getByRole("link", { name: "Back to the home page" })).toHaveAttribute("href", "/");
  });

  test("robots.txt and sitemap.xml", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Allow: /");
    expect(robots).toContain("/sitemap.xml");
    const sitemap = await (await request.get("/sitemap.xml")).text();
    for (const p of ["/tour", "/about", "/contact"]) expect(sitemap).toContain(`${p}</loc>`);
  });

  test("share preview tags point at the image", async ({ page }) => {
    await page.goto("/");
    const og = page.locator('meta[property="og:image"]');
    await expect(og).toHaveAttribute("content", /opengraph-image/);
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    const img = await page.request.get(new URL((await og.getAttribute("content"))!).pathname);
    expect(img.status()).toBe(200);
    expect(img.headers()["content-type"]).toContain("image/jpeg");
  });
});
