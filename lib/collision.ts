import { DOORS, FLAT, type RoomId } from "./flat-layout";

type Rect = { minX: number; maxX: number; minZ: number; maxZ: number };
type P = { x: number; z: number };

/** Walkable area = every room shrunk by the body radius, plus a corridor through each door. */
function walkable(r: number): Rect[] {
  const rooms = FLAT.map((room) => ({
    minX: room.x - room.w / 2 + r,
    maxX: room.x + room.w / 2 - r,
    minZ: room.z - room.d / 2 + r,
    maxZ: room.z + room.d / 2 - r,
  }));
  const doors = DOORS.map((d) =>
    d.axis === "x"
      ? { minX: d.at - r - 0.01, maxX: d.at + r + 0.01, minZ: d.from + r, maxZ: d.to - r }
      : { minX: d.from + r, maxX: d.to - r, minZ: d.at - r - 0.01, maxZ: d.at + r + 0.01 },
  );
  return [...rooms, ...doors];
}

const RECTS = new Map<number, Rect[]>();
const rectsFor = (r: number) => {
  if (!RECTS.has(r)) RECTS.set(r, walkable(r));
  return RECTS.get(r)!;
};

const inside = (p: P, q: Rect) => p.x >= q.minX && p.x <= q.maxX && p.z >= q.minZ && p.z <= q.maxZ;
const clampTo = (p: P, q: Rect): P => ({
  x: Math.min(q.maxX, Math.max(q.minX, p.x)),
  z: Math.min(q.maxZ, Math.max(q.minZ, p.z)),
});

/**
 * Keeps the player inside the flat. A point already walkable is returned unchanged;
 * otherwise it moves to the nearest walkable point, which makes you slide along walls.
 */
export function clampToFlat(p: P, r = 0.3): P {
  if (!Number.isFinite(p.x) || !Number.isFinite(p.z)) return { x: 0, z: 0 };
  const rects = rectsFor(r);
  if (rects.some((q) => inside(p, q))) return { x: p.x, z: p.z };
  let best = clampTo(p, rects[0]);
  let bestD = (best.x - p.x) ** 2 + (best.z - p.z) ** 2;
  for (const q of rects.slice(1)) {
    const c = clampTo(p, q);
    const d = (c.x - p.x) ** 2 + (c.z - p.z) ** 2;
    if (d < bestD) {
      best = c;
      bestD = d;
    }
  }
  return best;
}

/** Route between rooms. The living room is the hub every door opens onto. */
export function nextHotspot(current: RoomId, target: RoomId): { path: RoomId[] } {
  if (current === target) return { path: [] };
  if (current === "living" || target === "living") return { path: [target] };
  return { path: ["living", target] };
}

/** World position of the door between two rooms (for routing the camera through it). */
export function doorPoint(a: RoomId, b: RoomId): P | null {
  const d = DOORS.find((x) => (x.a === a && x.b === b) || (x.a === b && x.b === a));
  if (!d) return null;
  const mid = (d.from + d.to) / 2;
  return d.axis === "x" ? { x: d.at, z: mid } : { x: mid, z: d.at };
}
