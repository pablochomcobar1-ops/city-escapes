import Link from "next/link";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Reveal } from "@/components/motion/Reveal";

export function CtaBand({ label = "08 / Visit" }: { label?: string }) {
  return (
    <section aria-labelledby="cta-title" className="border-t border-border-subtle">
      <div className="mx-auto max-w-site px-gutter py-section text-center">
        <p className="text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">{label}</p>
        <Reveal>
          <h2 id="cta-title" className="mx-auto mt-6 max-w-4xl font-display text-hero02 text-foreground">
            Visit on <em className="text-brand">your terms.</em>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mx-auto mt-6 max-w-md text-body01 text-foreground-secondary">
            Pick a weekday or weekend, morning or evening. Walk the sample flat at your pace. No pushy calls
            afterwards.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            <MagneticButton href="/contact">Book a visit</MagneticButton>
            <Link
              href="/tour"
              className="text-caption01 font-medium tracking-[0.06em] text-foreground underline decoration-border underline-offset-[6px] transition-colors hover:decoration-brand"
            >
              Or take the tour first
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
