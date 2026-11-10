import type { Page } from "@playwright/test";

/** The theme toggle lives in the nav on desktop and inside the menu on phones. */
export async function clickThemeToggle(page: Page, name: "Switch to day" | "Switch to night") {
  const menu = page.getByRole("button", { name: "Menu" });
  if (await menu.isVisible()) await menu.click();
  await page.getByRole("button", { name: new RegExp(name, "i") }).click();
}
