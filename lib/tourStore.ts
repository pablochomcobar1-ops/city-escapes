"use client";

import { useSyncExternalStore } from "react";
import type { RoomId } from "./flat-layout";

/** Shared state between the 3D canvas and the HTML HUD around it. */
type TourState = {
  room: RoomId; // room the camera is in now
  target: RoomId | null; // glide request from a hotspot or HUD button
  locked: boolean; // desktop pointer lock (walking mode)
  ready: boolean; // scene loaded and first frame drawn
  progress: number; // 0–100 while assets load (reported from inside the 3D chunk)
  lockHint: boolean; // the browser refused mouse capture (e.g. Chrome's ~1 s cooldown after Esc)
};

let state: TourState = { room: "living", target: null, locked: false, ready: false, progress: 0, lockHint: false };
const subs = new Set<() => void>();

export const tour = {
  get: () => state,
  set(patch: Partial<TourState>) {
    const next = { ...state, ...patch };
    if (Object.keys(patch).every((k) => next[k as keyof TourState] === state[k as keyof TourState])) return;
    state = next;
    subs.forEach((f) => f());
  },
  goto(room: RoomId) {
    if (room !== state.room || state.target) tour.set({ target: room });
  },
  reset() {
    state = { room: "living", target: null, locked: false, ready: false, progress: 0, lockHint: false };
    subs.forEach((f) => f());
  },
  subscribe(f: () => void) {
    subs.add(f);
    return () => subs.delete(f);
  },
};

export function useTour<T>(select: (s: TourState) => T): T {
  return useSyncExternalStore(
    tour.subscribe,
    () => select(state),
    () => select({ room: "living", target: null, locked: false, ready: false, progress: 0, lockHint: false }),
  );
}

/** Selector for the tour's WebGL canvas (Player marks it on mount). */
export const TOUR_CANVAS = "canvas[data-tour]";

/**
 * Desktop "walk mode": ask the browser to capture the mouse on the tour canvas.
 * Must be called from a click. If the browser refuses (it does for about a second
 * after Esc, or without a fresh click), show a "click again" hint instead of failing silently.
 */
let attempting = false;
/** True while requestWalk is trying (its first, optional attempt may fail by design). */
export const isWalkAttempt = () => attempting;

export async function requestWalk(): Promise<boolean> {
  const el = document.querySelector<HTMLCanvasElement>(TOUR_CANVAS);
  if (!el || typeof el.requestPointerLock !== "function") {
    tour.set({ lockHint: true });
    return false;
  }
  const req = el.requestPointerLock as unknown as (o?: { unadjustedMovement?: boolean }) => Promise<void> | void;
  attempting = true;
  try {
    // Raw mouse movement (no OS acceleration) where supported; plain lock otherwise
    // (Firefox, Safari and Linux Chrome reject the option, which is expected).
    await req.call(el, { unadjustedMovement: true });
    return true;
  } catch {
    try {
      await req.call(el);
      return true;
    } catch {
      tour.set({ lockHint: true });
      return false;
    }
  } finally {
    attempting = false;
  }
}
