import Link from "next/link";
import { MagneticButton } from "@/components/motion/MagneticButton";

export default function NotFound() {
  return (
    <section aria-labelledby="nf-title" className="mx-auto flex min-h-[80svh] max-w-site flex-col justify-center px-gutter pb-section pt-40">
      <p className="text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">404 / Not on the plan</p>
      <h1 id="nf-title" className="mt-6 max-w-3xl font-display text-hero02 text-foreground">
        This room <em className="text-brand">doesn&apos;t exist.</em>
      </h1>
      <p className="mt-6 max-w-md text-body01 text-foreground-secondary">
        The page you were looking for isn&apos;t part of Residence 12A. The rest of the flat is just through here.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-6">
        <MagneticButton href="/contact">Book a visit</MagneticButton>
        <Link
          href="/"
          className="text-caption01 font-medium tracking-[0.06em] text-foreground underline decoration-border underline-offset-[6px] hover:decoration-brand"
        >
          Back to the home page
        </Link>
        <Link
          href="/tour"
          className="text-caption01 font-medium tracking-[0.06em] text-foreground underline decoration-border underline-offset-[6px] hover:decoration-brand"
        >
          Take the 3D tour
        </Link>
      </div>
    </section>
  );
}
