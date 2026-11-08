import { test, expect } from "@playwright/test";

const inDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

test("contact page: title, one h1, form, expectations and map", async ({ page }) => {
  const res = await page.goto("/contact");
  expect(res?.status()).toBe(200);
  await expect(page).toHaveTitle("Book a visit · City Escapes");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("form", { name: "Book a site visit" })).toBeVisible();
  await expect(page.getByRole("img", { name: "Location sketch of City Escapes" })).toBeAttached();
  await expect(page.getByText("No pushy calls")).toBeVisible();
});

test("?flat=4bhk from the residence card preselects 4 BHK", async ({ page }) => {
  await page.goto("/contact?flat=4bhk");
  await expect(page.getByLabel("4 BHK")).toBeChecked();
});

test("junk input shows errors; a valid booking shows the demo confirmation and sends nothing", async ({ page }) => {
  const posts: string[] = [];
  page.on("request", (r) => {
    if (r.method() !== "GET") posts.push(r.url());
  });
  await page.goto("/contact");
  await page.waitForFunction(() => "__lenis" in window || matchMedia("(prefers-reduced-motion: reduce)").matches);

  await page.getByLabel("Your name").fill("x".repeat(2000));
  await page.getByLabel("Mobile number").fill("12345");
  await page.getByRole("button", { name: "Request a visit" }).click();
  await expect(page.getByText("Keep your name under 60 characters.")).toBeVisible();
  await expect(page.getByText("Enter a 10-digit Indian mobile number.")).toBeVisible();
  await expect(page.getByLabel("Your name")).toBeFocused();

  await page.getByLabel("Your name").fill("Aarav Shah");
  await page.getByLabel("Mobile number").fill("+91 98250 12345");
  await page.getByText("3 BHK", { exact: true }).click();
  await page.getByLabel("Date").fill(inDays(5));
  await page.getByText("Morning, 10 am – 1 pm").click();
  await page.getByRole("button", { name: "Request a visit" }).click();

  const status = page.getByRole("status");
  await expect(status).toContainText("This is a concept, so no request was sent.");
  await expect(status.getByRole("heading")).toBeFocused();
  const wa = await status.getByRole("link", { name: "Send on WhatsApp instead" }).getAttribute("href");
  expect(wa).toMatch(/^https:\/\/wa\.me\/(\d+)?\?text=/);
  expect(decodeURIComponent(wa!.split("text=")[1])).toContain("Name: Aarav Shah");
  expect(posts).toEqual([]);

  await status.getByRole("button", { name: "Book another visit" }).click();
  await expect(page.getByLabel("Your name")).toHaveValue("");
});

test("date picker limits: today to +60 days", async ({ page }) => {
  await page.goto("/contact");
  const date = page.getByLabel("Date");
  await expect(date).toHaveAttribute("min", inDays(0));
  await expect(date).toHaveAttribute("max", inDays(60));
});

test("residence card link leads to a preselected form", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Visit a 3 BHK" }).click();
  await expect(page).toHaveURL(/\/contact\?flat=3bhk$/);
  await expect(page.getByLabel("3 BHK")).toBeChecked();
});
