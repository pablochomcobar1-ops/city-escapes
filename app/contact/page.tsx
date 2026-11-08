import type { Metadata } from "next";
import { SplitWords } from "@/components/motion/SplitWords";
import { BookingForm } from "@/components/contact/BookingForm";
import { LocationMap } from "@/components/contact/LocationMap";

export const metadata: Metadata = {
  title: "Book a visit",
  description:
    "Book a visit to the Residence 12A sample flat on SG Highway, Ahmedabad. Weekday or weekend, morning or evening.",
};

const EXPECT = [
  ["45 minutes", "A walk through the sample flat at your pace, with one person who knows it well."],
  ["No pushy calls", "We follow up once, by the channel you choose. That's all."],
  ["Open daily", "10 am – 7 pm, including weekends."],
] as const;

export default function ContactPage() {
  return (
    <section aria-labelledby="contact-title" className="mx-auto max-w-site px-gutter pb-section pt-40 md:pt-48">
      <p className="animate-[ce-rise_900ms_var(--ease-luxe)_backwards] text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">
        01 / Book a visit
      </p>
      <h1 id="contact-title" className="mt-6 font-display text-hero01 text-foreground">
        <SplitWords text="Visit on" />{" "}
        <em className="text-brand">
          <SplitWords text="your terms." startIndex={2} />
        </em>
      </h1>
      <p
        className="mt-8 max-w-xl text-body01 text-foreground-secondary"
        style={{ animation: "ce-rise 900ms var(--ease-luxe) 450ms backwards" }}
      >
        Pick a day and a time that suit you. You&apos;ll walk Residence 12A, see the materials up close and leave with
        everything in writing.
      </p>

      <div className="mt-16 grid items-start gap-16 lg:grid-cols-[1.35fr_1fr] lg:gap-24">
        <BookingForm />

        <aside aria-label="What to expect" className="space-y-12">
          <dl className="space-y-6">
            {EXPECT.map(([k, v]) => (
              <div key={k} className="border-t border-border pt-5">
                <dt className="font-display text-heading02 text-foreground">{k}</dt>
                <dd className="mt-1 text-body02 text-foreground-secondary">{v}</dd>
              </div>
            ))}
          </dl>
          <LocationMap />
        </aside>
      </div>
    </section>
  );
}
