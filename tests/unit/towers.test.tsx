import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Towers } from "@/components/home/Towers";

beforeEach(() => {
  document.documentElement.dataset.theme = "night";
});

it("renders the facts, with final numbers for no-JS / server render", () => {
  render(<Towers />);
  for (const label of ["Towers", "Floors", "Residences", "Address"]) {
    expect(screen.getByText(label)).toBeInTheDocument();
  }
  expect(screen.getByText("3 & 4 BHK")).toBeInTheDocument();
  expect(screen.getByText("SG Highway")).toBeInTheDocument();
  expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Two towers. Twenty-four floors.");
});

it("has day, blue-hour and night layers; only the day photo is announced", () => {
  const { container } = render(<Towers />);
  expect(container.querySelector('[data-layer="day"]')).toHaveAttribute(
    "alt",
    "City Escapes, two stone towers on SG Highway in morning light",
  );
  expect(container.querySelector('[data-layer="bluehour"]')).toHaveAttribute("alt", "");
  expect(container.querySelector('[data-layer="night"]')).toHaveAttribute("alt", "");
});

it("the inline switch flips the theme and its label", async () => {
  const user = userEvent.setup();
  render(<Towers />);
  await user.click(screen.getByRole("button", { name: /See it by day/ }));
  expect(document.documentElement.dataset.theme).toBe("day");
  expect(screen.getByRole("button", { name: /See it at night/ })).toBeInTheDocument();
});
