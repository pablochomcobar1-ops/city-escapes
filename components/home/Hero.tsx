import Link from "next/link";
import { SplitWords } from "@/components/motion/SplitWords";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { FACTS } from "@/lib/site";
import { PORTRAIT_QUERY } from "@/lib/content";
import { HeroVideo } from "./HeroVideo";

const V = "/media/video";

export function Hero() {
  return (
    <section aria-label="Introduction" className="relative h-[100svh] min-h-[620px] overflow-hidden">
      {/* Posters: chosen by CSS (theme + screen shape), so the first paint is always right */}
      <div className="absolute inset-0" aria-hidden="true">
        <picture className="absolute inset-0 opacity-100 transition-opacity duration-1000 ease-cinema day:opacity-0">
          <source media={PORTRAIT_QUERY} srcSet={`${V}/hero-night-vertical-poster.webp`} />
          <img
            src={`${V}/hero-night-poster.webp`}
            alt=""
            fetchPriority="high"
            className="h-full w-full object-cover"
          />
        </picture>
        <img
          src={`${V}/hero-day-poster.webp`}
          alt=""
          fetchPriority="low"
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-1000 ease-cinema day:opacity-100"
        />
        <HeroVideo />
      </div>

      {/* Scrims: keep the headline readable on any frame */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10"
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-background/55 to-transparent md:w-2/3"
      />

      <div className="relative mx-auto flex h-full max-w-site flex-col justify-end px-gutter pb-16 md:pb-20">
        <p className="animate-[ce-rise_900ms_var(--ease-luxe)_both] text-caption02 uppercase tracking-[0.18em] text-foreground-secondary">
          Residence 12A · Sample flat now open
        </p>

        <h1 className="mt-5 font-display text-hero01 text-foreground">
          <SplitWords text="Your escape," />
          <br />
          <em className="text-brand">
            <SplitWords text="within the city." startIndex={2} />
          </em>
        </h1>

        <div
          className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          style={{ animation: "ce-rise 900ms var(--ease-luxe) 750ms both" }}
        >
          <p className="max-w-md text-body01 text-foreground-secondary">
            {FACTS.homes} on {FACTS.location}. Two quiet towers, light from three sides, and the city
            kept at a distance.
          </p>
          <div className="flex items-center gap-4">
            <MagneticButton href="/contact">Book a visit</MagneticButton>
            <Link
              href="/tour"
              className="group inline-flex h-11 items-center gap-2 px-2 text-caption01 font-medium tracking-[0.06em] text-foreground"
            >
              Step inside
              <span aria-hidden="true" className="transition-transform duration-500 ease-luxe group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden="true"
        className="absolute bottom-6 right-gutter hidden items-center gap-4 text-caption02 uppercase tracking-[0.18em] text-foreground-subtle md:flex"
      >
        <span>Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-border">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[ce-scroll_2.2s_var(--ease-cinema)_infinite] bg-brand" />
        </span>
        <span>01 / 08</span>
      </div>
    </section>
  );
}
