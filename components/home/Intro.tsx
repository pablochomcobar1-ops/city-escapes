import { Reveal } from "@/components/motion/Reveal";

export function Intro() {
  return (
    <section aria-label="About City Escapes" className="mx-auto max-w-site px-gutter py-section">
      <Reveal>
        <p className="max-w-5xl font-display text-hero02 text-foreground">
          Ahmedabad keeps moving. <em className="text-brand">Here, it slows down.</em>
        </p>
      </Reveal>
      <Reveal delay={120} className="mt-10 grid gap-8 md:ml-auto md:max-w-2xl md:grid-cols-2">
        <p className="text-body01 text-foreground-secondary">
          City Escapes is two quiet towers on SG Highway: 3 and 4 BHK homes planned around light, stillness
          and a little distance from the street.
        </p>
        <p className="text-body01 text-foreground-secondary">
          Fewer homes per floor, deep balconies, and materials chosen to age well. Everything you need is
          close; nothing you don&apos;t is allowed in.
        </p>
      </Reveal>
    </section>
  );
}
