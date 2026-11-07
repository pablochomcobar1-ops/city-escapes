"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CTA, NAV_LINKS } from "@/lib/site";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { TextScramble } from "@/components/motion/TextScramble";
import { MobileMenu } from "./MobileMenu";
import { Wordmark } from "./Wordmark";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 40);
        // hide when scrolling down past the hero edge, show on any scroll up
        if (Math.abs(y - last) > 6) setHidden(y > last && y > 240);
        last = y;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const solid = scrolled || menuOpen;

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50",
        "transition-[transform,background-color,border-color] duration-700 ease-luxe",
        hidden && !menuOpen ? "-translate-y-full" : "translate-y-0",
        solid && !menuOpen
          ? "border-b border-border-subtle bg-background/70 backdrop-blur-md"
          : "border-b border-transparent",
      ].join(" ")}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:bg-background focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-20 max-w-site items-center justify-between px-gutter">
        <Wordmark className="relative z-[60]" />

        <nav aria-label="Main" className="hidden items-center gap-10 md:flex">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-caption02 uppercase tracking-[0.18em] text-foreground-secondary transition-colors duration-300 hover:text-foreground"
                >
                  <TextScramble text={l.label} />
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <MagneticButton href={CTA.href}>{CTA.label}</MagneticButton>
          </div>
        </nav>

        <MobileMenu onOpenChange={setMenuOpen} />
      </div>
    </header>
  );
}
