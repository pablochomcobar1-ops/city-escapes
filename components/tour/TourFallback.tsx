import Image from "next/image";
import Link from "next/link";
import { STORY } from "@/lib/content";
import { FLAT } from "@/lib/flat-layout";

/** Shown when the device can't run WebGL: the same four rooms as photos. */
export function TourFallback() {
  return (
    <div data-testid="tour-fallback" className="mx-auto max-w-site px-gutter pb-section pt-40">
      <p className="text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">Residence 12A</p>
      <h1 className="mt-5 font-display text-hero02 text-foreground">
        The flat, <em className="text-brand">room by room.</em>
      </h1>
      <p className="mt-6 max-w-lg text-body01 text-foreground-secondary">
        Your browser can&apos;t show the 3D walkthrough, so here are the same four rooms as photographs.
      </p>
      <ul className="mt-14 grid gap-10 md:grid-cols-2">
        {FLAT.map((r, i) => (
          <li key={r.id}>
            <div className="relative aspect-[16/10] overflow-hidden bg-background-secondary">
              <Image src={STORY[i].img} alt={STORY[i].alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
            <h2 className="mt-5 font-display text-heading02 text-foreground">{r.info.title}</h2>
            <p className="mt-1 text-caption01 text-foreground-secondary">{r.info.size}</p>
          </li>
        ))}
      </ul>
      <Link
        href="/contact"
        className="mt-14 inline-flex h-11 items-center rounded-pill bg-brand px-6 text-caption01 font-medium text-background"
      >
        Book a visit to see it in person
      </Link>
    </div>
  );
}
