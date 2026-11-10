import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

beforeEach(() => {
  document.documentElement.dataset.theme = "night";
  localStorage.clear();
});

it("toggles night → day → night with labels that start with the visible word", async () => {
  const user = userEvent.setup();
  render(<ThemeToggle />);

  const btn = screen.getByRole("button", { name: "Night mode, switch to day" });
  expect(btn).toHaveTextContent("Night");

  await user.click(btn);
  expect(document.documentElement.dataset.theme).toBe("day");
  expect(screen.getByRole("button", { name: "Day mode, switch to night" })).toHaveTextContent("Day");

  await user.click(screen.getByRole("button"));
  expect(document.documentElement.dataset.theme).toBe("night");
});

it("works from the keyboard", async () => {
  const user = userEvent.setup();
  render(<ThemeToggle />);
  await user.tab();
  await user.keyboard("{Enter}");
  expect(document.documentElement.dataset.theme).toBe("day");
});
