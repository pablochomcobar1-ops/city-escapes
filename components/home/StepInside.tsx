import Image from "next/image";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Reveal } from "@/components/motion/Reveal";

export function StepInside() {
  return (
    <section aria-labelledby="tour-title" className="mx-auto max-w-site px-gutter py-section">
      <Reveal variant="image" className="relative isolate overflow-hidden">
        <Image
          src="/media/images/story-living-dawn.webp"
          alt=""
          fill
          sizes="(min-width: 1440px) 1344px, 100vw"
          className="-z-10 object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
        <div className="flex min-h-[70vh] flex-col justify-end p-8 text-[#ede6da] md:p-14">
          <p className="text-caption02 uppercase tracking-[0.18em] text-[#ede6da]/70">05 / Step inside</p>
          <h2 id="tour-title" className="mt-5 max-w-2xl font-display text-hero02">
            Walk through <em className="text-[#d4b483]">Residence 12A.</em>
          </h2>
          <p className="mt-6 max-w-md text-body01 text-[#ede6da]/80">
            The sample flat, room by room, from your screen. Living room, kitchen, master bedroom and the
            balcony, at any hour.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <MagneticButton href="/tour">Start the tour</MagneticButton>
            <span className="text-caption01 text-[#ede6da]/65">Desktop: WASD and mouse · Phone: tap to move</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
