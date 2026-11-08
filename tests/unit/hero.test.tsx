import { render, screen } from "@testing-library/react";
import { heroSources } from "@/lib/content";
import { Hero } from "@/components/home/Hero";

describe("heroSources", () => {
  it.each([
    ["night", false, "/media/video/hero-night.mp4", "/media/video/hero-night-poster.webp"],
    ["night", true, "/media/video/hero-night-vertical.mp4", "/media/video/hero-night-vertical-poster.webp"],
    ["day", false, "/media/video/hero-day.mp4", "/media/video/hero-day-poster.webp"],
    ["day", true, "/media/video/hero-day.mp4", "/media/video/hero-day-poster.webp"],
  ] as const)("%s, portrait=%s", (theme, portrait, mp4, poster) => {
    expect(heroSources(theme, portrait)).toEqual({ mp4, poster });
  });
});

describe("Hero", () => {
  it("renders the headline as one accessible heading and both CTAs", () => {
    render(<Hero />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent?.replace(/ /g, " ")).toBe("Your escape,within the city.");
    expect(screen.getByRole("link", { name: "Book a visit" })).toHaveAttribute("href", "/contact");
    expect(screen.getByRole("link", { name: /Step inside/ })).toHaveAttribute("href", "/tour");
    expect(screen.getByText(/3 & 4 BHK residences on SG Highway, Ahmedabad/)).toBeInTheDocument();
  });
});
