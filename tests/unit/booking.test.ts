import { validateBooking, isoDate, addDays, normalisePhone } from "@/lib/booking";
import { buildWhatsAppUrl, cleanWhatsAppNumber, bookingMessage } from "@/lib/whatsapp";

const TODAY = new Date(2026, 10, 8); // 8 Nov 2026, local
const ok = { name: "Aarav Shah", phone: "98250 12345", day: "2026-11-14", slot: "morning", flat: "3bhk" };
const err = (input: Record<string, unknown>) => {
  const r = validateBooking(input, TODAY);
  return r.ok ? {} : r.errors;
};

describe("bookingSchema", () => {
  it("accepts a valid booking and normalises the phone", () => {
    const r = validateBooking(ok, TODAY);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.phone).toBe("9825012345");
  });

  it.each([
    ["empty name", { name: "" }, "name", "Enter your name (at least 2 letters)."],
    ["digits in name", { name: "R2D2" }, "name", "Use letters only for your name."],
    ["2,000-char name", { name: "a".repeat(2000) }, "name", "Keep your name under 60 characters."],
    ["letters in phone", { phone: "98250abcde" }, "phone", "Enter a 10-digit Indian mobile number."],
    ["landline-style phone", { phone: "0792345678" }, "phone", "Enter a 10-digit Indian mobile number."],
    ["9-digit phone", { phone: "982501234" }, "phone", "Enter a 10-digit Indian mobile number."],
    ["past date", { day: "2026-11-07" }, "day", "Pick today or a later date."],
    ["too far ahead", { day: "2027-01-08" }, "day", "Pick a date within the next 60 days."],
    ["garbage date", { day: "next tuesday" }, "day", "Pick a date for your visit."],
    ["no slot", { slot: "" }, "slot", "Choose morning or evening."],
    ["bad flat", { flat: "penthouse" }, "flat", "Choose 3 BHK or 4 BHK."],
  ])("%s", (_label, patch, field, message) => {
    expect(err({ ...ok, ...patch })[field as keyof ReturnType<typeof err>]).toBe(message);
  });

  it("accepts edge cases: today, +60 days, +91 prefix, accented names", () => {
    expect(validateBooking({ ...ok, day: isoDate(TODAY) }, TODAY).ok).toBe(true);
    expect(validateBooking({ ...ok, day: isoDate(addDays(TODAY, 60)) }, TODAY).ok).toBe(true);
    expect(validateBooking({ ...ok, phone: "+91 98250-12345" }, TODAY).ok).toBe(true);
    expect(validateBooking({ ...ok, name: "Zoë D'Souza" }, TODAY).ok).toBe(true);
  });

  it("reports all problems of an empty form at once", () => {
    expect(Object.keys(err({}))).toEqual(expect.arrayContaining(["name", "phone", "day", "slot", "flat"]));
  });

  it("isoDate uses the local calendar day", () => {
    expect(isoDate(new Date(2026, 0, 5, 1, 30))).toBe("2026-01-05");
    expect(normalisePhone(" 98250-12 345 ")).toBe("9825012345");
  });
});

describe("whatsapp", () => {
  it("treats the .env.example placeholder as unset", () => {
    expect(cleanWhatsAppNumber("91XXXXXXXXXX")).toBeNull();
    expect(cleanWhatsAppNumber(undefined)).toBeNull();
    expect(cleanWhatsAppNumber("+91 98250 12345")).toBe("919825012345");
  });

  it("builds a wa.me link with the number, or the share picker without one", () => {
    expect(buildWhatsAppUrl("919825012345")).toMatch(/^https:\/\/wa\.me\/919825012345\?text=/);
    expect(buildWhatsAppUrl("91XXXXXXXXXX")).toMatch(/^https:\/\/wa\.me\/\?text=/);
  });

  it("encodes the message safely (&, #, newlines, quotes)", () => {
    const url = buildWhatsAppUrl("919825012345", { name: "A & B #1 'x'", flat: "4bhk", day: "2026-11-14", slot: "evening" });
    const text = new URL(url).searchParams.get("text")!;
    expect(text).toBe(bookingMessage({ name: "A & B #1 'x'", flat: "4bhk", day: "2026-11-14", slot: "evening" }));
    expect(url.split("?text=")[1]).not.toMatch(/[\n#& ]/); // nothing raw that could break the URL
    expect(text).toContain("Residence: 4 BHK");
    expect(text).toContain("Time: Evening, 4 pm – 7 pm");
    expect(text.split("\n")).toHaveLength(5);
  });
});
