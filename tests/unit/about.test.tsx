import { render, screen } from "@testing-library/react";
import AboutPage, { metadata } from "@/app/about/page";

it("renders one h1, three principles and all images with alt text", () => {
  render(<AboutPage />);
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  for (const p of ["Light first", "Fewer homes per floor", "Materials that age"]) {
    expect(screen.getByRole("heading", { level: 3, name: p })).toBeInTheDocument();
  }
  for (const img of screen.getAllByRole("img")) expect(img).toHaveAttribute("alt");
  expect(screen.getByText(/A home should be the/)).toBeInTheDocument();
});

it("has page metadata", () => {
  expect(metadata.title).toBe("About");
  expect(String(metadata.description)).toMatch(/SG Highway/);
});
