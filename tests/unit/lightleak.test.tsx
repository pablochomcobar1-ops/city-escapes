import { render } from "@testing-library/react";
import { LightLeak } from "@/components/bg/LightLeak";
import {
  hexToRgb,
  storyPalette,
  setLightLeakTime,
  getLightLeakTime,
  THEME_PALETTES,
} from "@/lib/lightLeak";

describe("LightLeak", () => {
  it("falls back to a CSS gradient when WebGL is unavailable", () => {
    const spy = vi
      .spyOn(HTMLCanvasElement.prototype, "getContext")
      .mockReturnValue(null as unknown as RenderingContext);
    const { container } = render(<LightLeak />);
    expect(container.querySelector('[data-fallback="gradient"]')).toBeInTheDocument();
    expect(container.querySelector("canvas")).not.toBeInTheDocument();
    spy.mockRestore();
  });

  it("falls back when getContext throws", () => {
    const spy = vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() => {
      throw new Error("blocked");
    });
    const { container } = render(<LightLeak />);
    expect(container.querySelector('[data-fallback="gradient"]')).toBeInTheDocument();
    spy.mockRestore();
  });
});

describe("palettes", () => {
  it("converts hex to 0–1 rgb", () => {
    expect(hexToRgb("#ffffff")).toEqual([1, 1, 1]);
    expect(hexToRgb("#0e0d0b").map((v) => Math.round(v * 255))).toEqual([14, 13, 11]);
  });

  it("theme base colours match the page background tokens", () => {
    expect(THEME_PALETTES.night.bg.map((v) => Math.round(v * 255))).toEqual([14, 13, 11]);
    expect(THEME_PALETTES.day.bg.map((v) => Math.round(v * 255))).toEqual([243, 237, 227]);
  });

  it("story palette goes warm at golden hour and clamps out-of-range input", () => {
    const golden = storyPalette(2 / 3).a.map((v) => Math.round(v * 255));
    expect(golden).toEqual([212, 148, 52]); // #d49434
    expect(storyPalette(-5)).toEqual(storyPalette(0));
    expect(storyPalette(9)).toEqual(storyPalette(1));
    expect(storyPalette(Number.NaN)).toEqual(storyPalette(0));
  });

  it("setLightLeakTime stores and clears story time", () => {
    setLightLeakTime(0.4);
    expect(getLightLeakTime()).toBe(0.4);
    setLightLeakTime(null);
    expect(getLightLeakTime()).toBeNull();
  });
});
