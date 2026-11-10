"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  FLATS,
  SLOTS,
  MAX_DAYS_AHEAD,
  addDays,
  formatVisitDate,
  isoDate,
  looksLikeBot,
  validateBooking,
  type Booking,
  type BookingField,
  type Flat,
} from "@/lib/booking";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
type Values = { name: string; phone: string; day: string; slot: string; flat: string };
const EMPTY: Values = { name: "", phone: "", day: "", slot: "", flat: "" };
const ORDER: BookingField[] = ["name", "phone", "flat", "day", "slot"];

/** Whatever the visitor has filled so far, for the WhatsApp prefill (no phone: they're on WhatsApp). */
function partial(v: Values): Partial<Booking> {
  return {
    name: v.name.trim().slice(0, 60) || undefined,
    flat: v.flat in FLATS ? (v.flat as Flat) : undefined,
    day: /^\d{4}-\d{2}-\d{2}$/.test(v.day) ? v.day : undefined,
    slot: v.slot in SLOTS ? (v.slot as Booking["slot"]) : undefined,
  };
}

const inputCls = [
  "mt-2 block h-12 w-full border-0 border-b bg-transparent px-0 text-body01 text-foreground",
  "placeholder:text-foreground-subtle focus:outline-none focus:ring-0",
  "transition-colors duration-300",
].join(" ");

function Pills({
  name,
  legend,
  options,
  value,
  error,
  onChange,
}: {
  name: BookingField;
  legend: string;
  options: Record<string, string>;
  value: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  const id = useId();
  return (
    <fieldset aria-describedby={error ? `${id}-err` : undefined} aria-invalid={!!error || undefined}>
      <legend className="text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-3">
        {Object.entries(options).map(([v, label]) => (
          <label
            key={v}
            className={[
              "cursor-pointer rounded-pill border px-5 py-2.5 text-body02 transition-colors duration-300",
              "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus-ring",
              value === v ? "border-brand bg-brand text-background" : "border-border text-foreground hover:border-brand",
            ].join(" ")}
          >
            <input
              type="radio"
              name={name}
              value={v}
              checked={value === v}
              onChange={() => onChange(v)}
              className="sr-only"
              data-field={name}
            />
            {label}
          </label>
        ))}
      </div>
      {error && (
        <p id={`${id}-err`} className="mt-2 text-caption01 text-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function BookingForm() {
  const [v, setV] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<BookingField, string>>>({});
  const [done, setDone] = useState<Booking | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const trap = useRef<HTMLInputElement>(null);
  const startedAt = useRef(0);
  const ids = { name: useId(), phone: useId(), day: useId() };

  const today = new Date();
  const minDay = isoDate(today);
  const maxDay = isoDate(addDays(today, MAX_DAYS_AHEAD));

  // "Visit a 4 BHK" links arrive as /contact?flat=4bhk
  useEffect(() => {
    startedAt.current = Date.now();
    const flat = new URLSearchParams(window.location.search).get("flat");
    if (flat && flat in FLATS) setV((s) => ({ ...s, flat: flat as Flat }));
  }, []);

  useEffect(() => {
    if (done) successHeading.current?.focus();
  }, [done]);

  const set = (k: keyof Values) => (val: string) => {
    setV((s) => ({ ...s, [k]: val }));
    if (errors[k as BookingField]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = validateBooking(v);
    if (!r.ok) {
      setErrors(r.errors);
      const first = ORDER.find((k) => r.errors[k]);
      form.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    const bot = looksLikeBot({ trap: trap.current?.value ?? "", startedAt: startedAt.current, now: Date.now() });
    if (!bot) {
      // Concept site: nothing is sent anywhere. A real build would POST r.data to the server here.
    }
    // Bots see the same thank-you screen, so they can't tell they were caught.
    setDone(r.data);
  };

  if (done) {
    return (
      <div role="status" className="border border-border p-8 md:p-10">
        <p className="text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">Request noted</p>
        <h2 ref={successHeading} tabIndex={-1} className="mt-4 font-display text-heading01 text-foreground focus:outline-none">
          Thank you, <em className="text-brand">{done.name.split(" ")[0]}.</em>
        </h2>
        <p className="mt-4 text-body01 text-foreground-secondary">
          {FLATS[done.flat]} · {formatVisitDate(done.day)} · {SLOTS[done.slot]}
        </p>
        <p className="mt-6 border-l-2 border-brand pl-4 text-body02 text-foreground">
          This is a concept, so no request was sent.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <a
            href={buildWhatsAppUrl(WA, done)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center rounded-pill bg-brand px-6 text-caption01 font-medium tracking-[0.06em] text-background transition-colors hover:bg-foreground"
          >
            Send on WhatsApp instead
          </a>
          <button
            type="button"
            onClick={() => {
              setDone(null);
              setV(EMPTY);
            }}
            className="text-caption01 font-medium tracking-[0.06em] text-foreground underline decoration-border underline-offset-[6px] hover:decoration-brand"
          >
            Book another visit
          </button>
        </div>
      </div>
    );
  }

  const border = (k: BookingField) => (errors[k] ? "border-error" : "border-border focus:border-brand");

  return (
    <form ref={form} onSubmit={submit} noValidate aria-label="Book a site visit" className="space-y-10">
      {/* Spam trap: hidden from people and screen readers; bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input ref={trap} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <div className="grid gap-10 sm:grid-cols-2">
        <div>
          <label htmlFor={ids.name} className="text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">
            Your name
          </label>
          <input
            id={ids.name}
            data-field="name"
            name="name"
            autoComplete="name"
            maxLength={80}
            placeholder="Aarav Shah"
            value={v.name}
            onChange={(e) => set("name")(e.target.value)}
            aria-invalid={!!errors.name || undefined}
            aria-describedby={errors.name ? `${ids.name}-err` : undefined}
            className={`${inputCls} ${border("name")}`}
          />
          {errors.name && (
            <p id={`${ids.name}-err`} className="mt-2 text-caption01 text-error">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={ids.phone} className="text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">
            Mobile number
          </label>
          <input
            id={ids.phone}
            data-field="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={20}
            placeholder="98250 12345"
            value={v.phone}
            onChange={(e) => set("phone")(e.target.value)}
            aria-invalid={!!errors.phone || undefined}
            aria-describedby={errors.phone ? `${ids.phone}-err` : undefined}
            className={`${inputCls} ${border("phone")}`}
          />
          {errors.phone && (
            <p id={`${ids.phone}-err`} className="mt-2 text-caption01 text-error">
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      <Pills name="flat" legend="Residence" options={FLATS} value={v.flat} error={errors.flat} onChange={set("flat")} />

      <div className="grid gap-10 sm:grid-cols-[1fr_1.4fr]">
        <div>
          <label htmlFor={ids.day} className="text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">
            Date
          </label>
          <input
            id={ids.day}
            data-field="day"
            name="day"
            type="date"
            min={minDay}
            max={maxDay}
            value={v.day}
            onChange={(e) => set("day")(e.target.value)}
            aria-invalid={!!errors.day || undefined}
            aria-describedby={errors.day ? `${ids.day}-err` : undefined}
            className={`${inputCls} ${border("day")} [color-scheme:inherit]`}
          />
          {errors.day && (
            <p id={`${ids.day}-err`} className="mt-2 text-caption01 text-error">
              {errors.day}
            </p>
          )}
        </div>
        <Pills name="slot" legend="Time" options={SLOTS} value={v.slot} error={errors.slot} onChange={set("slot")} />
      </div>

      <div className="flex flex-wrap items-center gap-6 border-t border-border pt-8">
        <button
          type="submit"
          className="inline-flex h-12 items-center rounded-pill bg-brand px-8 text-caption01 font-medium tracking-[0.06em] text-background transition-colors duration-500 hover:bg-foreground"
        >
          Request a visit
        </button>
        <a
          href={buildWhatsAppUrl(WA, partial(v))}
          target="_blank"
          rel="noopener noreferrer"
          className="text-caption01 font-medium tracking-[0.06em] text-foreground underline decoration-border underline-offset-[6px] hover:decoration-brand"
        >
          Or chat on WhatsApp
        </a>
      </div>
    </form>
  );
}
