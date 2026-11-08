export const RESIDENCES = [
  {
    id: "3bhk",
    name: "3 BHK",
    area: "2,450 sq ft",
    points: ["Three bedrooms, each with its own balcony", "Living and dining facing two sides", "Private lift lobby"],
    img: "/media/images/residence-3bhk.webp",
    alt: "Open living and dining area of a 3 BHK residence with a round travertine table",
  },
  {
    id: "4bhk",
    name: "4 BHK",
    area: "3,380 sq ft",
    points: ["Double-height living room", "Four bedrooms, staff room and study", "Wrap-around terrace"],
    // Placeholder until residence-4bhk.webp is supplied: the double-height hero room fits the brief.
    img: "/media/video/hero-night-poster.webp",
    alt: "Double-height living room of a 4 BHK residence at dusk with city lights below",
  },
] as const;

export const MATERIALS = [
  {
    name: "Smoked oak",
    where: "Wide-plank floors in every room",
    img: "/media/images/material-oak.webp",
  },
  {
    name: "Honed travertine",
    where: "Kitchen island, feature walls, bath vanities",
    img: "/media/images/material-travertine.webp",
  },
  {
    name: "Brushed brass",
    where: "Taps, handles and light fittings",
    img: "/media/images/material-brass.webp",
  },
] as const;

export const SPECS = [
  ["Structure", "RCC frame designed for seismic zone III"],
  ["Waterproofing", "Crystalline + membrane, 10-year warranty"],
  ["Windows", "Double-glazed, acoustic, full height"],
  ["Power", "100% backup for every home"],
] as const;

export type Milestone = { name: string; when: string; state: "done" | "now" | "next" };

export const MILESTONES: Milestone[] = [
  { name: "Foundation", when: "Mar 2025", state: "done" },
  { name: "Structure", when: "Sep 2026", state: "done" },
  { name: "Facade", when: "In progress", state: "now" },
  { name: "Interiors", when: "2027–28", state: "next" },
  { name: "Possession", when: "Dec 2028", state: "next" },
];
