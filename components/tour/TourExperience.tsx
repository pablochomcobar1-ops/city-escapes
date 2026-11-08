"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useFinePointer } from "@/lib/useReducedMotion";
import { TourHud } from "./TourHud";
import { TourFallback } from "./TourFallback";

// three.js only ever loads on this page.
const TourCanvas = dynamic(() => import("./TourCanvas"), { ssr: false });

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function TourExperience() {
  const [support, setSupport] = useState<"checking" | "ok" | "none">("checking");
  const fine = useFinePointer();

  useEffect(() => setSupport(hasWebGL() ? "ok" : "none"), []);

  if (support === "none") return <TourFallback />;

  return (
    <section aria-label="Residence 12A walkthrough" className="relative h-[100svh] min-h-[560px] overflow-hidden bg-black">
      {support === "ok" && <TourCanvas fine={fine} />}
      <TourHud fine={fine} />
    </section>
  );
}
