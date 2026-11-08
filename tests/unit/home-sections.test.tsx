import { render, screen, within } from "@testing-library/react";
import { Residences } from "@/components/home/Residences";
import { StepInside } from "@/components/home/StepInside";
import { Materials } from "@/components/home/Materials";
import { Progress } from "@/components/home/Progress";
import { CtaBand } from "@/components/home/CtaBand";
import { Intro } from "@/components/home/Intro";

it("Residences: 3 BHK and 4 BHK, price on request, booking links carry the flat type", () => {
  render(<Residences />);
  expect(screen.getByRole("heading", { level: 3, name: "3 BHK" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { level: 3, name: "4 BHK" })).toBeInTheDocument();
  expect(screen.getAllByText("Price on request")).toHaveLength(2);
  expect(screen.getByRole("link", { name: "Visit a 3 BHK" })).toHaveAttribute("href", "/contact?flat=3bhk");
  expect(screen.getByRole("link", { name: "Visit a 4 BHK" })).toHaveAttribute("href", "/contact?flat=4bhk");
  // 4 BHK uses a placeholder image until residence-4bhk is supplied, but still has real alt text.
  for (const img of screen.getAllByRole("img")) expect(img.getAttribute("alt")!.length).toBeGreaterThan(20);
});

it("StepInside links to the tour", () => {
  render(<StepInside />);
  expect(screen.getByRole("link", { name: "Start the tour" })).toHaveAttribute("href", "/tour");
});

it("Materials: oak, travertine, brass and four specs", () => {
  render(<Materials />);
  for (const m of ["Smoked oak", "Honed travertine", "Brushed brass"]) {
    expect(screen.getByRole("heading", { level: 3, name: m })).toBeInTheDocument();
  }
  expect(screen.getAllByRole("term")).toHaveLength(4);
});

it("Progress: five milestones, facade is current, possession Dec 2028, honest RERA note", () => {
  render(<Progress />);
  const items = within(screen.getByRole("list")).getAllByRole("listitem");
  expect(items.map((li) => li.querySelector("p")!.textContent)).toEqual([
    "Foundation",
    "Structure",
    "Facade",
    "Interiors",
    "Possession",
  ]);
  expect(items[2]).toHaveAttribute("aria-current", "step");
  expect(screen.getByText("Dec 2028")).toBeInTheDocument();
  expect(screen.getByText(/concept project, not registered/)).toBeInTheDocument();
});

it("CtaBand: visit on your terms, booking and tour links", () => {
  render(<CtaBand />);
  expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Visit on your terms.");
  expect(screen.getByRole("link", { name: "Book a visit" })).toHaveAttribute("href", "/contact");
  expect(screen.getByRole("link", { name: "Or take the tour first" })).toHaveAttribute("href", "/tour");
});

it("Intro statement", () => {
  render(<Intro />);
  expect(screen.getByText(/Ahmedabad keeps moving/)).toBeInTheDocument();
});
