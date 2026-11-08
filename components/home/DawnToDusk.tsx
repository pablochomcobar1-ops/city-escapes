"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { setLightLeakTime } from "@/lib/lightLeak";
import { STORY } from "@/lib/content";

const PIN_QUERY = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

/**
 * Desktop (motion allowed): the section pins and the four rooms slide sideways as you
 * scroll; the clock, the rail and the page's light-leak follow the time of day.
 * Phone or reduced motion: the rooms simply stack. Layout is chosen by CSS
 * (`md:motion-safe:`), so the first paint is right before any JS runs.
 */
export function DawnToDusk() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  const room = useRef<HTMLSpanElement>(null);
  const rail = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(PIN_QUERY, () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        let shown = -1;

        const slide = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (st) => {
              const p = st.progress;
              setLightLeakTime(p);
              section.current!.dataset.progress = p.toFixed(3);
              if (rail.current) rail.current.style.transform = `scaleX(${p})`;
              const i = Math.min(STORY.length - 1, Math.round(p * (STORY.length - 1)));
              if (i !== shown && clock.current && room.current) {
                shown = i;
                clock.current.textContent = STORY[i].time;
                room.current.textContent = STORY[i].room;
              }
            },
            onToggle: (st) => {
              if (!st.isActive) setLightLeakTime(null);
            },
          },
        });

        // Inner parallax: each photo drifts slightly against the slide.
        gsap.utils.toArray<HTMLElement>("[data-parallax]", el).forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -6 },
            {
              xPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: img.parentElement,
                containerAnimation: slide,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });

        return () => setLightLeakTime(null);
      });
      // Images can change the track width once loaded.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      return () => {
        window.removeEventListener("load", refresh);
        mm.revert();
      };
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      id="day"
      aria-labelledby="story-title"
      data-progress="0"
      className="relative md:motion-safe:h-screen md:motion-safe:overflow-hidden"
    >
      <h2 id="story-title" className="sr-only">
        A day at Residence 12A
      </h2>

      {/* Clock + rail (pinned desktop only) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden px-gutter pt-28 md:motion-safe:block"
      >
        <div className="mx-auto flex max-w-site items-baseline justify-between text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">
          <span>03 / A day at Residence 12A</span>
          <span>
            <span ref={clock} className="text-foreground">{STORY[0].time}</span>
            <span className="mx-3">·</span>
            <span ref={room}>{STORY[0].room}</span>
          </span>
        </div>
      </div>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-10 z-10 hidden px-gutter md:motion-safe:block">
        <div className="relative mx-auto h-px max-w-site bg-border">
          <span ref={rail} className="absolute inset-0 origin-left scale-x-0 bg-brand" />
          <div className="absolute inset-x-0 -top-6 flex justify-between text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">
            {STORY.map((s) => (
              <span key={s.time}>{s.time}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Phone / reduced-motion heading (the pinned view uses the clock bar instead) */}
      <div className="mx-auto max-w-site px-gutter pt-section md:motion-safe:hidden">
        <p className="text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">03 / A day at Residence 12A</p>
      </div>

      <div ref={track} data-testid="story-track" className="md:motion-safe:flex md:motion-safe:h-full md:motion-safe:w-max">
        {STORY.map((s, i) => (
          <article
            key={s.time}
            data-testid="story-panel"
            aria-label={`${s.time}, ${s.room}`}
            className={[
              "mx-auto grid max-w-site gap-8 px-gutter py-14",
              "md:grid-cols-[0.85fr_1.6fr] md:items-center md:gap-14",
              "md:motion-safe:mx-0 md:motion-safe:h-full md:motion-safe:w-screen md:motion-safe:max-w-none md:motion-safe:py-0 md:motion-safe:pt-16",
            ].join(" ")}
          >
            <div className="md:motion-safe:pl-[max(0px,calc((100vw-90rem)/2))]">
              <p className="text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">
                {String(i + 1).padStart(2, "0")} / 04 · {s.room}
              </p>
              <p className="mt-4 font-display text-hero02 text-foreground">{s.time}</p>
              <h3 className="mt-4 font-display text-heading01 italic text-brand">{s.line}</h3>
              <p className="mt-6 max-w-sm text-body01 text-foreground-secondary">{s.body}</p>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden bg-background-secondary sm:aspect-[16/10] md:motion-safe:aspect-auto md:motion-safe:h-[68vh]">
              <Image
                src={s.img}
                alt={s.alt}
                fill
                sizes="(min-width: 768px) 62vw, 100vw"
                data-parallax
                className="scale-[1.14] object-cover"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
