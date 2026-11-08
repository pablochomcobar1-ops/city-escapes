import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { SplitWords } from "@/components/motion/SplitWords";
import { Materials } from "@/components/home/Materials";
import { Progress } from "@/components/home/Progress";
import { CtaBand } from "@/components/home/CtaBand";

export const metadata: Metadata = {
  title: "About",
  description:
    "The idea behind City Escapes: two quiet towers on SG Highway, planned around light, stillness and materials that age well.",
};

const PRINCIPLES = [
  ["Light first", "Every home faces at least two sides. Rooms were placed by where the sun falls, then sized."],
  ["Fewer homes per floor", "Two residences per landing, so the lift lobby, the corridor and the quiet are yours."],
  ["Materials that age", "Oak, stone and brass, chosen to look better in twenty years, not just on handover day."],
] as const;

export default function AboutPage() {
  return (
    <>
      {/* 01 · The idea */}
      <section aria-labelledby="about-title" className="mx-auto max-w-site px-gutter pb-section pt-40 md:pt-48">
        <p className="animate-[ce-rise_900ms_var(--ease-luxe)_backwards] text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">
          01 / About City Escapes
        </p>
        <h1 id="about-title" className="mt-6 font-display text-hero01 text-foreground">
          <SplitWords text="The idea" />
        </h1>
        <p
          className="mt-10 max-w-4xl font-display text-hero02 text-foreground"
          style={{ animation: "ce-rise 900ms var(--ease-luxe) 450ms backwards" }}
        >
          A home should be the <em className="text-brand">quietest room</em> in the city.
        </p>
        <Reveal className="mt-14 grid gap-8 md:ml-auto md:max-w-3xl md:grid-cols-3">
          <p className="text-body01 text-foreground-secondary">
            Ahmedabad is growing fast, and most new towers grow with it: more floors, more homes per landing,
            more noise carried in from the road.
          </p>
          <p className="text-body01 text-foreground-secondary">
            City Escapes starts from the opposite question. What would it take for the moment you close the
            door to feel like leaving the city, without leaving it?
          </p>
          <p className="text-body01 text-foreground-secondary">
            The answer became two slender towers, set back from SG Highway behind a garden, with fewer homes,
            deeper balconies and light from at least two sides.
          </p>
        </Reveal>
      </section>

      {/* 02 · Architecture and light */}
      <section aria-labelledby="arch-title" className="mx-auto max-w-site px-gutter py-section">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-20">
          <Reveal variant="image" className="relative aspect-[4/5] overflow-hidden bg-background-secondary">
            {/* Placeholder until about-architecture.webp is supplied */}
            <Image
              src="/media/images/towers-day.webp"
              alt="Pale stone fins on the City Escapes towers catching morning light"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-[30%_center]"
            />
          </Reveal>
          <div>
            <p className="text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">02 / Architecture and light</p>
            <h2 id="arch-title" className="mt-5 font-display text-heading01 text-foreground">
              Stone fins, deep balconies, <em className="text-brand">light from three sides.</em>
            </h2>
            <p className="mt-6 text-body01 text-foreground-secondary">
              The vertical fins are the building&apos;s quiet trick: they shade the glass from the harsh afternoon
              sun and pull soft, reflected light deep into every room.
            </p>
            <ol className="mt-10 space-y-6 border-t border-border pt-8">
              {PRINCIPLES.map(([title, text], i) => (
                <li key={title} className="grid grid-cols-[2.5rem_1fr] gap-4">
                  <span className="font-display text-heading03 text-brand">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-heading02 text-foreground">{title}</h3>
                    <p className="mt-1 text-body02 text-foreground-secondary">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 03 · The site today */}
      <section aria-labelledby="site-title" className="mx-auto max-w-site px-gutter py-section">
        <p className="text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">03 / The site today</p>
        <h2 id="site-title" className="mt-5 max-w-3xl font-display text-heading01 text-foreground">
          Rising, <em className="text-brand">on schedule.</em>
        </h2>
        <Reveal variant="image" className="relative mt-12 aspect-[4/3] overflow-hidden bg-background-secondary md:aspect-[21/9]">
          <Image
            src="/media/images/about-construction.webp"
            alt="The City Escapes site at dawn: concrete frame of the towers rising beside a tower crane"
            fill
            sizes="(min-width: 1440px) 1344px, 100vw"
            className="object-cover"
          />
        </Reveal>
        <p className="mt-4 text-caption01 text-foreground-subtle">
          The site at dawn. Structure completed September 2026; facade work under way.
        </p>
      </section>

      <Materials label="04 / Materials" />
      <Progress label="05 / Progress" />
      <CtaBand label="06 / Visit" />
    </>
  );
}
