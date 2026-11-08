"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CTA, NAV_LINKS } from "@/lib/site";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function MobileMenu({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) trigger.current?.focus();
  };

  useEffect(() => {
    onOpenChange?.(open);
    if (!open) return;
    window.__lenis?.stop();
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("a,button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || !panel.current) return;
      // keep focus inside the open menu
      const items = panel.current.querySelectorAll<HTMLElement>("a,button");
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.__lenis?.start();
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps -- close/onOpenChange are stable enough here

  const links = [...NAV_LINKS, CTA];

  return (
    <div className="md:hidden">
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="relative z-[60] inline-flex h-10 items-center gap-3 text-caption02 uppercase tracking-[0.18em]"
      >
        <span>{open ? "Close" : "Menu"}</span>
        <span aria-hidden="true" className="relative block h-2.5 w-6">
          <span className={`absolute left-0 h-px w-full bg-current transition-transform duration-500 ease-luxe ${open ? "top-1/2 rotate-45" : "top-0"}`} />
          <span className={`absolute left-0 h-px w-full bg-current transition-transform duration-500 ease-luxe ${open ? "top-1/2 -rotate-45" : "bottom-0"}`} />
        </span>
      </button>

      {open &&
        createPortal(
      // Portal to <body>: the header uses `transform`, which would otherwise trap this
      // fixed panel inside the 80px header box. z-40 keeps it under the header (z-50),
      // so the logo and Close button stay on top.
      <div
        ref={panel}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="fixed inset-0 z-40 flex flex-col justify-between bg-background px-gutter pb-10 pt-28 md:hidden"
      >
        <nav aria-label="Mobile">
          <ul className="space-y-2">
            {links.map((l, i) => (
              <li
                key={l.href}
                className="animate-[ce-rise_700ms_var(--ease-luxe)_backwards]"
                style={{ animationDelay: `${80 + i * 70}ms` }}
              >
                <Link
                  href={l.href}
                  onClick={() => close(false)}
                  className="block py-1 font-display text-heading01 text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center justify-between border-t border-border pt-6">
          <ThemeToggle />
          <span className="text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">
            SG Highway, Ahmedabad
          </span>
        </div>
      </div>,
          document.body,
        )}
    </div>
  );
}
