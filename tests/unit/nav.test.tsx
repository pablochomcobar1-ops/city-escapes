import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

describe("Nav", () => {
  it("has the main links and the booking CTA", () => {
    render(<Nav />);
    const main = screen.getByRole("navigation", { name: "Main" });
    expect(within(main).getByRole("link", { name: "Residence" })).toHaveAttribute("href", "/#residences");
    expect(within(main).getByRole("link", { name: "Tour" })).toHaveAttribute("href", "/tour");
    expect(within(main).getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    expect(within(main).getByRole("link", { name: "Book a visit" })).toHaveAttribute("href", "/contact");
    expect(screen.getByRole("link", { name: "City Escapes, home" })).toHaveAttribute("href", "/");
  });

  it("mobile menu opens, closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<Nav />);
    const trigger = screen.getByRole("button", { name: "Menu" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const dialog = screen.getByRole("dialog", { name: "Menu" });
    expect(within(dialog).getByRole("link", { name: "Book a visit" })).toBeVisible();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("clicking a menu link closes the menu", async () => {
    const user = userEvent.setup();
    render(<Nav />);
    await user.click(screen.getByRole("button", { name: "Menu" }));
    await user.click(within(screen.getByRole("dialog")).getByRole("link", { name: "About" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("Footer", () => {
  it("shows the exact concept and AI credit line", () => {
    render(<Footer />);
    expect(
      screen.getByText(
        "Concept project by Pablo Chomcobar. Not a real development. Visuals generated with AI.",
      ),
    ).toBeInTheDocument();
  });
});
