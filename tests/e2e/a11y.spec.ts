import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Automated WCAG 2.1 AA scan of every page in both themes.
 * Reduced motion is on so every reveal has finished and contrast is measured on final colours.
 */
const PAGES = ["/", "/about", "/contact", "/tour", "/no-such-room"];

for (const theme of ["night", "day"] as const) {
  test.describe(`accessibility (${theme})`, () => {
    test.use({ reducedMotion: "reduce" });

    for (const path of PAGES) {
      test(path, async ({ page }) => {
        await page.addInitScript((t) => localStorage.setItem("ce-theme", t), theme);
        await page.goto(path);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        // Visit the whole page so lazy sections render.
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 700) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 40));
          }
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(400);

        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          // The 3D canvas is decorative to axe; its controls are tested separately.
          .exclude("canvas")
          .analyze();

        const report = results.violations.map(
          (v) => `${v.impact} ${v.id}: ${v.help}\n` + v.nodes.slice(0, 4).map((n) => `   ${n.target.join(" ")} | ${n.failureSummary?.split("\n")[1] ?? ""}`).join("\n"),
        );
        expect(report, report.join("\n")).toEqual([]);
      });
    }
  });
}
