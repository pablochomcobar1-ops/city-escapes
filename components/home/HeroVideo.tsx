"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTheme } from "@/components/theme/useTheme";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { heroSources, PORTRAIT_QUERY } from "@/lib/content";

function usePortrait(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(PORTRAIT_QUERY);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(PORTRAIT_QUERY).matches,
    () => false,
  );
}

function Layer({ src, active, inView }: { src: string; active: boolean; inView: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active && inView) {
      // play() returns a promise in modern browsers, undefined in some older ones
      v.play()?.catch(() => {
        /* autoplay blocked (e.g. low-power mode): the poster underneath stays */
      });
    } else {
      v.pause();
    }
  }, [active, inView]);

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={() => setPlaying(true)}
      data-active={active}
      className={[
        "absolute inset-0 h-full w-full object-cover",
        "transition-opacity duration-1000 ease-cinema",
        active && playing ? "opacity-100" : "opacity-0",
      ].join(" ")}
    />
  );
}

/**
 * Plays the hero clip for the current theme and screen shape over the CSS posters.
 * Clips load only once they are needed; off-screen they pause. Reduced motion: no video.
 */
export function HeroVideo() {
  const { theme } = useTheme();
  const portrait = usePortrait();
  const reduced = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [seen, setSeen] = useState<string[]>([]);
  const active = heroSources(theme, portrait).mp4;

  if (!reduced && !seen.includes(active)) setSeen([...seen, active]);

  useEffect(() => {
    const el = box.current;
    if (!el || typeof IntersectionObserver === "undefined") return; // old browsers: just keep playing
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (reduced) return null;
  return (
    <div ref={box} className="absolute inset-0" data-testid="hero-videos">
      {seen.map((src) => (
        <Layer key={src} src={src} active={src === active} inView={inView} />
      ))}
    </div>
  );
}
