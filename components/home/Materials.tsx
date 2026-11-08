import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { MATERIALS, SPECS } from "@/lib/home";

export function Materials({ label = "06 / Built to last" }: { label?: string }) {
  return (
    <section aria-labelledby="materials-title" className="mx-auto max-w-site px-gutter py-section">
      <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-end">
        <div>
          <p className="text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">{label}</p>
          <h2 id="materials-title" className="mt-5 font-display text-heading01 text-foreground">
            Materials that <em className="text-brand">age well.</em>
          </h2>
        </div>
        <p className="max-w-lg text-body01 text-foreground-secondary md:justify-self-end">
          What you touch every day is real: oak, stone and brass. What you never see, like waterproofing and
          structure, is specified just as carefully.
        </p>
      </div>

      <ul className="mt-14 grid gap-6 sm:grid-cols-3">
        {MATERIALS.map((m, i) => (
          <Reveal as="li" key={m.name} delay={i * 100}>
            <Reveal variant="image" className="relative aspect-square overflow-hidden bg-background-secondary">
              <Image src={m.img} alt={`${m.name} close-up`} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
            </Reveal>
            <h3 className="mt-5 font-display text-heading02 text-foreground">{m.name}</h3>
            <p className="mt-1 text-body02 text-foreground-secondary">{m.where}</p>
          </Reveal>
        ))}
      </ul>

      <dl className="mt-16 grid gap-x-8 gap-y-6 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-4">
        {SPECS.map(([k, v]) => (
          <div key={k}>
            <dt className="text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">{k}</dt>
            <dd className="mt-2 text-body02 text-foreground">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
