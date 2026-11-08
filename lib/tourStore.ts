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
};

let state: TourState = { room: "living", target: null, locked: false, ready: false, progress: 0 };
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
    state = { room: "living", target: null, locked: false, ready: false, progress: 0 };
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
    () => select({ room: "living", target: null, locked: false, ready: false, progress: 0 }),
  );
}
