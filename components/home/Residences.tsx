import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { RESIDENCES } from "@/lib/home";

export function Residences() {
  return (
    <section id="residences" aria-labelledby="residences-title" className="mx-auto max-w-site scroll-mt-24 px-gutter py-section">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">04 / Residences</p>
          <h2 id="residences-title" className="mt-5 font-display text-heading01 text-foreground">
            Two ways to <em className="text-brand">live here.</em>
          </h2>
        </div>
        <p className="max-w-sm text-body01 text-foreground-secondary">
          Every home faces at least two sides. Prices are shared on request, after a visit.
        </p>
      </div>

      <ul className="mt-14 grid gap-12 md:grid-cols-2 md:gap-8">
        {RESIDENCES.map((r, i) => (
          <Reveal as="li" key={r.id} delay={i * 120}>
            <article aria-labelledby={`res-${r.id}`} className="group">
              <Reveal variant="image" className="relative aspect-[4/5] overflow-hidden bg-background-secondary">
                <Image
                  src={r.img}
                  alt={r.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1400ms] ease-luxe group-hover:scale-[1.04]"
                />
              </Reveal>
              <div className="mt-6 flex items-baseline justify-between border-b border-border pb-4">
                <h3 id={`res-${r.id}`} className="font-display text-heading01 text-foreground">
                  {r.name}
                </h3>
                <span className="text-caption01 text-foreground-secondary">{r.area}</span>
              </div>
              <ul className="mt-4 space-y-2 text-body02 text-foreground-secondary">
                {r.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.7em] block h-px w-3 shrink-0 bg-brand" />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">Price on request</span>
                <Link
                  href={`/contact?flat=${r.id}`}
                  className="text-caption01 font-medium tracking-[0.06em] text-foreground underline decoration-border underline-offset-[6px] transition-colors hover:decoration-brand"
                >
                  Visit a {r.name}
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
