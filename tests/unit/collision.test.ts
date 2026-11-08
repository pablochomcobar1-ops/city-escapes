import { clampToFlat, nextHotspot, doorPoint } from "@/lib/collision";
import { roomAt, FLAT } from "@/lib/flat-layout";

describe("clampToFlat", () => {
  it("leaves a point inside the living room unchanged", () => {
    expect(clampToFlat({ x: 0.5, z: -1 })).toEqual({ x: 0.5, z: -1 });
  });

  it("stops at the north glass, 0.3 m away (living room north wall is z = -2.75)", () => {
    const p = clampToFlat({ x: 0, z: -4 });
    expect(p.x).toBeCloseTo(0);
    expect(p.z).toBeCloseTo(-2.45);
  });

  it("slides along a wall instead of sticking (keeps the along-wall coordinate)", () => {
    const p = clampToFlat({ x: 1.2, z: -3.1 });
    expect(p).toEqual({ x: 1.2, z: expect.closeTo(-2.45, 5) });
  });

  it("blocks walking through the solid wall into the kitchen", () => {
    // x = 3.5 wall, z = 1.5 is outside the door gap (-1.9 … -0.3)
    const p = clampToFlat({ x: 3.6, z: 1.5 });
    expect(p.x).toBeLessThan(3.5);
  });

  it("allows passing through the kitchen door gap", () => {
    expect(clampToFlat({ x: 3.5, z: -1.1 })).toEqual({ x: 3.5, z: -1.1 });
    expect(clampToFlat({ x: 4.2, z: -1.1 })).toEqual({ x: 4.2, z: -1.1 });
  });

  it("allows stepping out onto the balcony through the sliding door", () => {
    expect(clampToFlat({ x: 0, z: 2.75 })).toEqual({ x: 0, z: 2.75 });
    expect(clampToFlat({ x: 0, z: 3.9 })).toEqual({ x: 0, z: 3.9 });
  });

  it("never lets you past the balcony railing", () => {
    expect(clampToFlat({ x: 0, z: 9 }).z).toBeCloseTo(4.95 - 0.3);
  });

  it("survives NaN / Infinity from a bad frame", () => {
    expect(clampToFlat({ x: NaN, z: 1 })).toEqual({ x: 0, z: 0 });
    expect(clampToFlat({ x: Infinity, z: 1 })).toEqual({ x: 0, z: 0 });
  });

  it("every room's spawn point is walkable and inside that room", () => {
    for (const r of FLAT) {
      const [x, , z] = r.spawn;
      expect(clampToFlat({ x, z })).toEqual({ x, z });
      expect(roomAt(x, z)).toBe(r.id);
    }
  });
});

describe("nextHotspot", () => {
  it("routes room to room through the living room hub", () => {
    expect(nextHotspot("living", "bedroom")).toEqual({ path: ["bedroom"] });
    expect(nextHotspot("kitchen", "living")).toEqual({ path: ["living"] });
    expect(nextHotspot("kitchen", "bedroom")).toEqual({ path: ["living", "bedroom"] });
    expect(nextHotspot("balcony", "balcony")).toEqual({ path: [] });
  });

  it("knows where each door is", () => {
    expect(doorPoint("living", "kitchen")).toEqual({ x: 3.5, z: expect.closeTo(-1.1, 6) });
    expect(doorPoint("balcony", "living")).toEqual({ x: 0, z: 2.75 });
    expect(doorPoint("kitchen", "bedroom")).toBeNull();
  });
});
