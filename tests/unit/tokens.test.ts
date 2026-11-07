import { readFileSync } from "node:fs";
import path from "node:path";

const css = readFileSync(path.resolve(__dirname, "../../app/globals.css"), "utf8");

function block(selector: string) {
  const i = css.indexOf(`${selector} {`);
  return css.slice(i, css.indexOf("}", i));
}

describe("design tokens", () => {
  it("night palette matches DESIGN-TOKENS.md", () => {
    const night = block('[data-theme="night"]');
    expect(night).toContain("--ce-bg: #0e0d0b");
    expect(night).toContain("--ce-fg: #ede6da");
    expect(night).toContain("--ce-brand: #b8935a");
  });

  it("day palette matches the plan's Global Constraints", () => {
    const day = block('[data-theme="day"]');
    expect(day).toContain("--ce-bg: #f3ede3");
    expect(day).toContain("--ce-fg: #1a1714");
    expect(day).toContain("--ce-brand: #7e6034");
    expect(day).toContain("--ce-brand-accent: #8f5818");
  });

  it("type scale is defined in the --text-* namespace", () => {
    for (const t of ["hero01", "hero02", "heading01", "body01", "caption02"]) {
      expect(css).toContain(`--text-${t}:`);
    }
  });
});
