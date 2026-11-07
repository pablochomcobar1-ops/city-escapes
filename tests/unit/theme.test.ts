import { applyTheme, readStoredTheme, THEME_EVENT, THEME_KEY } from "@/lib/theme";

const mem = (value: string | null) => ({ getItem: () => value });

describe("readStoredTheme", () => {
  it("returns a valid stored value", () => {
    expect(readStoredTheme(mem("day"))).toBe("day");
    expect(readStoredTheme(mem("night"))).toBe("night");
  });

  it("falls back to night for missing or invalid values", () => {
    expect(readStoredTheme(mem(null))).toBe("night");
    expect(readStoredTheme(mem("DAY"))).toBe("night");
    expect(readStoredTheme(mem("<script>"))).toBe("night");
  });

  it("falls back to night when storage throws (blocked / private mode)", () => {
    const broken = {
      getItem: () => {
        throw new Error("SecurityError");
      },
    };
    expect(readStoredTheme(broken)).toBe("night");
  });
});

describe("applyTheme", () => {
  beforeEach(() => {
    document.documentElement.dataset.theme = "night";
    localStorage.clear();
  });

  it("sets <html data-theme>, saves it and fires ce:theme once", () => {
    const seen: string[] = [];
    const on = (e: Event) => seen.push((e as CustomEvent).detail);
    window.addEventListener(THEME_EVENT, on);

    applyTheme("day");
    applyTheme("day"); // no-op, no second event

    expect(document.documentElement.dataset.theme).toBe("day");
    expect(localStorage.getItem(THEME_KEY)).toBe("day");
    expect(seen).toEqual(["day"]);
    window.removeEventListener(THEME_EVENT, on);
  });
});
