"use client";

import Link from "next/link";
import { FLAT, roomById } from "@/lib/flat-layout";
import { requestWalk, tour, useTour } from "@/lib/tourStore";

const SHORT: Record<string, string> = { living: "Living", kitchen: "Kitchen", bedroom: "Bedroom", balcony: "Balcony" };

export function TourHud({ fine }: { fine: boolean }) {
  const room = useTour((s) => s.room);
  const locked = useTour((s) => s.locked);
  const ready = useTour((s) => s.ready);
  const moving = useTour((s) => s.target !== null);
  const lockHint = useTour((s) => s.lockHint);
  // No 3D imports here: this file is in the /tour route chunk, which Next prefetches
  // from the home page. Progress comes from inside the lazily loaded canvas.
  const progress = useTour((s) => s.progress);
  const info = roomById(room).info;

  return (
    <>
      {/* Loading */}
      <div
        aria-live="polite"
        className={[
          "pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-background",
          "transition-opacity duration-700",
          ready ? "opacity-0" : "opacity-100",
        ].join(" ")}
      >
        {!ready && (
          <>
            <p className="font-display text-heading01 text-foreground">Residence 12A</p>
            <p className="mt-3 text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">
              Preparing the flat · <span data-testid="tour-progress">{Math.round(progress)}%</span>
            </p>
            <div className="mt-6 h-px w-48 bg-border">
              <div className="h-full bg-brand transition-[width] duration-300" style={{ width: `${progress}%` }} />
            </div>
          </>
        )}
      </div>

      {/* Room info */}
      <div className="pointer-events-none absolute left-gutter top-28 z-10 max-w-xs">
        <p className="text-caption02 uppercase tracking-[0.18em] text-[#ede6da]/70 [text-shadow:0_1px_8px_rgb(0_0_0/0.6)]">
          Residence 12A
        </p>
        <h1
          aria-live="polite"
          className="mt-2 font-display text-heading01 text-[#ede6da] [text-shadow:0_2px_16px_rgb(0_0_0/0.55)]"
        >
          {info.title}
        </h1>
        <div className="mt-4 bg-black/35 p-4 text-[#ede6da] backdrop-blur-md">
          <p className="text-caption01 text-[#ede6da]/80">{info.size}</p>
          <ul className="mt-3 space-y-1.5 text-caption01">
            {info.features.map((f) => (
              <li key={f} className="flex gap-2">
                <span aria-hidden="true" className="mt-[0.6em] h-px w-2.5 shrink-0 bg-[#d4b483]" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Start / paused overlay (desktop) */}
      {fine && ready && !locked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <button
            id="tour-start"
            type="button"
            onClick={() => void requestWalk()}
            className="group flex flex-col items-center gap-3 rounded-pill bg-black/45 px-8 py-5 text-[#ede6da] backdrop-blur-md transition-colors hover:bg-black/60"
          >
            <span className="font-display text-heading02">Click to step inside</span>
            <span className="text-caption01 text-[#ede6da]/75">W A S D to walk · mouse to look · Esc to pause</span>
            {lockHint && (
              <span role="status" className="text-caption01 text-[#d4b483]">
                Your browser needs one more click. Click again to look around.
              </span>
            )}
          </button>
        </div>
      )}

      {/* Rooms: also the keyboard-accessible way to move */}
      <nav
        aria-label="Rooms"
        className={[
          "absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-4 px-gutter pb-8",
          locked ? "opacity-0" : "opacity-100",
          "transition-opacity duration-500",
        ].join(" ")}
      >
        {!fine && ready && (
          <p className="text-caption01 text-[#ede6da]/80 [text-shadow:0_1px_8px_rgb(0_0_0/0.7)]">
            Drag to look around · tap a glowing spot to move
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-2 rounded-pill bg-black/40 p-1.5 backdrop-blur-md">
          {FLAT.map((r) => (
            <button
              key={r.id}
              type="button"
              aria-pressed={room === r.id}
              disabled={moving}
              onClick={() => tour.goto(r.id)}
              className={[
                "rounded-pill px-4 py-2 text-caption01 font-medium tracking-[0.04em] transition-colors",
                room === r.id ? "bg-[#d4b483] text-[#0e0d0b]" : "text-[#ede6da] hover:bg-white/10",
              ].join(" ")}
            >
              {SHORT[r.id]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-6 text-caption01">
          <Link
            href="/contact"
            className="inline-flex h-10 items-center rounded-pill bg-[#b8935a] px-5 font-medium text-[#0e0d0b] hover:bg-[#ede6da]"
          >
            Book a visit
          </Link>
          <Link href="/" className="text-[#ede6da]/80 underline underline-offset-4 hover:text-[#ede6da]">
            Exit tour
          </Link>
        </div>
      </nav>
    </>
  );
}
