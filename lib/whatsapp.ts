import { FLATS, SLOTS, formatVisitDate, type Booking } from "./booking";

/** Digits only; a placeholder like "91XXXXXXXXXX" or anything too short counts as unset. */
export function cleanWhatsAppNumber(raw: string | undefined): string | null {
  const digits = (raw ?? "").replace(/\D/g, "");
  return digits.length >= 11 && digits.length <= 15 ? digits : null;
}

export function bookingMessage(b: Partial<Booking> = {}): string {
  const lines = ["Hi City Escapes, I'd like to book a site visit."];
  if (b.name) lines.push(`Name: ${b.name}`);
  if (b.flat && FLATS[b.flat]) lines.push(`Residence: ${FLATS[b.flat]}`);
  if (b.day) lines.push(`Date: ${formatVisitDate(b.day)}`);
  if (b.slot && SLOTS[b.slot]) lines.push(`Time: ${SLOTS[b.slot]}`);
  return lines.join("\n");
}

/**
 * wa.me link with a prefilled, fully encoded message. Without a configured number it
 * falls back to wa.me/?text=… which opens WhatsApp's own "send to…" picker.
 */
export function buildWhatsAppUrl(number: string | undefined, b?: Partial<Booking>): string {
  const n = cleanWhatsAppNumber(number);
  const text = encodeURIComponent(bookingMessage(b));
  return n ? `https://wa.me/${n}?text=${text}` : `https://wa.me/?text=${text}`;
}
