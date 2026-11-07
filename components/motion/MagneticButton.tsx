"use client";

import Link from "next/link";
import { useRef } from "react";
import { useFinePointer, useReducedMotion } from "@/lib/useReducedMotion";

type Props = {
  href: string;
  children: React.ReactNode;
  strength?: number;
  variant?: "filled" | "outline";
  className?: string;
};

/** A pill link that leans toward the cursor (mouse only, off under reduced motion). */
export function MagneticButton({
  href,
  children,
  strength = 0.3,
  variant = "filled",
  className = "",
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const inner = useRef<HTMLSpanElement>(null);
  // Call both hooks every render (never inside && — that changes the hook count).
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const active = fine && !reduced;

  const move = (e: React.PointerEvent) => {
    if (!active || !ref.current || !inner.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
    inner.current.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
    if (inner.current) inner.current.style.transform = "";
  };

  return (
    <Link
      ref={ref}
      href={href}
      onPointerMove={move}
      onPointerLeave={reset}
      className={[
        "inline-flex h-11 items-center justify-center rounded-pill px-6",
        "text-caption01 font-medium tracking-[0.06em]",
        "transition-[transform,background-color,color,border-color] duration-500 ease-luxe",
        variant === "filled"
          ? "bg-brand text-background hover:bg-foreground"
          : "border border-border text-foreground hover:border-brand",
        className,
      ].join(" ")}
    >
      <span ref={inner} className="inline-block transition-transform duration-500 ease-luxe">
        {children}
      </span>
    </Link>
  );
}
