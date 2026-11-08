import { render, screen } from "@testing-library/react";
import { STORY } from "@/lib/content";
import { DawnToDusk } from "@/components/home/DawnToDusk";

describe("story content", () => {
  it("has four rooms from dawn to night, with the plan's copy", () => {
    expect(STORY.map((s) => [s.time, s.room, s.line])).toEqual([
      ["6:40 am", "Living room", "Mornings, unhurried."],
      ["12:10 pm", "Kitchen", "Light, from three sides."],
      ["5:50 pm", "Master bedroom", "The day, slowing down."],
      ["9:00 pm", "Balcony", "The city stays outside."],
    ]);
    for (const s of STORY) expect(s.alt.length).toBeGreaterThan(20);
  });
});

describe("DawnToDusk", () => {
  it("renders four labelled panels with images and a section heading", () => {
    render(<DawnToDusk />);
    expect(screen.getByRole("heading", { level: 2, name: "A day at Residence 12A" })).toBeInTheDocument();
    const panels = screen.getAllByRole("article");
    expect(panels).toHaveLength(4);
    expect(panels[0]).toHaveAccessibleName("6:40 am, Living room");
    expect(screen.getAllByRole("img")).toHaveLength(4);
    expect(screen.getByRole("heading", { level: 3, name: "The city stays outside." })).toBeInTheDocument();
  });
});
