import { z } from "zod";

export const SLOTS = {
  morning: "Morning, 10 am – 1 pm",
  evening: "Evening, 4 pm – 7 pm",
} as const;
export const FLATS = { "3bhk": "3 BHK", "4bhk": "4 BHK" } as const;

export type Slot = keyof typeof SLOTS;
export type Flat = keyof typeof FLATS;

export const MAX_DAYS_AHEAD = 60;

/** Local calendar date as YYYY-MM-DD (not UTC: India is +5:30, so UTC can be "yesterday"). */
export function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

export function normalisePhone(raw: string): string {
  return raw.replace(/[\s\-()]/g, "");
}

/**
 * Booking schema. `today` is injectable so tests don't depend on the clock.
 * Every rule has its own human message, shown inline under the field.
 */
export function bookingSchema(today: Date = new Date()) {
  const min = isoDate(today);
  const max = isoDate(addDays(today, MAX_DAYS_AHEAD));
  return z.object({
    name: z
      .string()
      .trim()
      .min(2, "Enter your name (at least 2 letters).")
      .max(60, "Keep your name under 60 characters.")
      .regex(/^[\p{L}][\p{L} .'-]*$/u, "Use letters only for your name."),
    phone: z
      .string()
      .transform(normalisePhone)
      .pipe(z.string().regex(/^(\+91)?[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number.")),
    day: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date for your visit.")
      .refine((d) => d >= min, "Pick today or a later date.")
      .refine((d) => d <= max, `Pick a date within the next ${MAX_DAYS_AHEAD} days.`),
    slot: z.enum(["morning", "evening"], { error: "Choose morning or evening." }),
    flat: z.enum(["3bhk", "4bhk"], { error: "Choose 3 BHK or 4 BHK." }),
  });
}

export type Booking = z.output<ReturnType<typeof bookingSchema>>;
export type BookingField = keyof Booking;

/** Field → first error message, or an empty object when valid. */
export function validateBooking(
  input: Record<string, unknown>,
  today?: Date,
): { ok: true; data: Booking } | { ok: false; errors: Partial<Record<BookingField, string>> } {
  const r = bookingSchema(today).safeParse(input);
  if (r.success) return { ok: true, data: r.data };
  const errors: Partial<Record<BookingField, string>> = {};
  for (const issue of r.error.issues) {
    const k = issue.path[0] as BookingField;
    if (k && !errors[k]) errors[k] = issue.message;
  }
  return { ok: false, errors };
}

export function formatVisitDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

/** Real people take longer than this to fill five fields. */
export const MIN_FILL_MS = 2500;

/**
 * Spam guard: bots fill every field (including the hidden "website" trap)
 * and submit instantly. Treat either sign as a bot. When a backend is wired up,
 * run this check on the server too; a browser-only check can be skipped.
 */
export function looksLikeBot({ trap, startedAt, now }: { trap: string; startedAt: number; now: number }): boolean {
  return trap.trim() !== "" || now - startedAt < MIN_FILL_MS;
}
