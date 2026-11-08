/**
 * Residence 12A floor plan, in metres. Top view: x → east, z → south. y is up.
 * Rooms are axis-aligned rectangles given by their centre (x, z) and size (w, d).
 */
export type RoomId = "living" | "kitchen" | "bedroom" | "balcony";

export type Room = {
  id: RoomId;
  x: number;
  z: number;
  w: number;
  d: number;
  height: number;
  spawn: [number, number, number]; // camera position when arriving: x, y(eye), z
  look: [number, number, number]; // where the camera faces on arrival
  info: { title: string; size: string; features: string[] };
};

export const EYE = 1.6;
export const WALL = 0.15;

export const FLAT: Room[] = [
  {
    id: "living",
    x: 0,
    z: 0,
    w: 7,
    d: 5.5,
    height: 6.4,
    spawn: [0, EYE, 1.8],
    look: [0, 2.2, -2.75],
    info: {
      title: "Living room",
      size: "7.0 × 5.5 m · double height",
      features: ["Floor-to-ceiling glass facing north", "Smoked oak floor", "Travertine feature wall"],
    },
  },
  {
    id: "kitchen",
    x: 5.5,
    z: -1,
    w: 4,
    d: 3.5,
    height: 3.2,
    spawn: [4.6, EYE, -0.2],
    look: [7.5, 1.4, -1.5],
    info: {
      title: "Kitchen",
      size: "4.0 × 3.5 m",
      features: ["Travertine island, 2.4 m", "Brushed brass fittings", "East light all morning"],
    },
  },
  {
    id: "bedroom",
    x: -5.75,
    z: -0.75,
    w: 4.5,
    d: 4,
    height: 3.2,
    spawn: [-4.4, EYE, 0.4],
    look: [-8, 1.3, -1.5],
    info: {
      title: "Master bedroom",
      size: "4.5 × 4.0 m",
      features: ["West-facing glass for golden hour", "Linen and oak", "Walk-in wardrobe beyond"],
    },
  },
  {
    id: "balcony",
    x: 0,
    z: 3.85,
    w: 6,
    d: 2.2,
    height: 0,
    spawn: [0, EYE, 3.2],
    look: [0, 1.0, 12],
    info: {
      title: "Balcony",
      size: "6.0 × 2.2 m · 20th floor",
      features: ["Glass railing", "Teak deck", "The city, at a distance"],
    },
  },
];

/** Openings you can walk through. `axis` is the wall they sit in: "x" = wall at constant x. */
export type Door = { a: RoomId; b: RoomId; axis: "x" | "z"; at: number; from: number; to: number };

export const DOORS: Door[] = [
  { a: "living", b: "kitchen", axis: "x", at: 3.5, from: -1.9, to: -0.3 },
  { a: "living", b: "bedroom", axis: "x", at: -3.5, from: -1.2, to: 0 },
  { a: "living", b: "balcony", axis: "z", at: 2.75, from: -1.6, to: 1.6 },
];

export const roomById = (id: RoomId) => FLAT.find((r) => r.id === id)!;

/** The room containing a floor point, or null. */
export function roomAt(x: number, z: number): RoomId | null {
  for (const r of FLAT) {
    if (Math.abs(x - r.x) <= r.w / 2 && Math.abs(z - r.z) <= r.d / 2) return r.id;
  }
  return null;
}
