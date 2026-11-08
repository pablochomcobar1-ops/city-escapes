"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";
import { EYE, roomAt, roomById, type RoomId } from "@/lib/flat-layout";
import { clampToFlat, doorPoint, nextHotspot } from "@/lib/collision";
import { tour } from "@/lib/tourStore";

const SPEED = 2.2; // m/s
const LEG_S = 1.4; // seconds per glide leg
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** A glide segment. Timed by the clock (`start`), not by frame count, so it takes the same
 *  time on a 20 fps phone as on a 120 fps laptop. */
type Leg = { from: THREE.Vector3; to: THREE.Vector3; qFrom: THREE.Quaternion; qTo: THREE.Quaternion; t: number; start: number | null };

function lookQuat(pos: THREE.Vector3, at: THREE.Vector3) {
  const m = new THREE.Matrix4().lookAt(pos, at, new THREE.Vector3(0, 1, 0));
  return new THREE.Quaternion().setFromRotationMatrix(m);
}

/** Builds the glide legs: through the connecting door(s), ending at the room's spawn, looking at its view. */
function buildLegs(cam: THREE.Camera, from: RoomId, to: RoomId): Leg[] {
  const legs: Leg[] = [];
  let pos = cam.position.clone();
  let q = cam.quaternion.clone();
  let cur = from;
  for (const next of nextHotspot(from, to).path) {
    const d = doorPoint(cur, next);
    const r = roomById(next);
    const stops: [THREE.Vector3, THREE.Vector3][] = [];
    if (d) {
      const door = new THREE.Vector3(d.x, EYE, d.z);
      stops.push([door, new THREE.Vector3(r.spawn[0], EYE, r.spawn[2])]);
    }
    const spawn = new THREE.Vector3(...r.spawn);
    stops.push([spawn, new THREE.Vector3(...r.look)]);
    for (const [to, look] of stops) {
      const qTo = lookQuat(to, look);
      legs.push({ from: pos, to, qFrom: q, qTo, t: 0, start: null });
      pos = to;
      q = qTo;
    }
    cur = next;
  }
  return legs;
}

export function Player({ fine }: { fine: boolean }) {
  const { camera, gl } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const legs = useRef<Leg[]>([]);
  const euler = useRef(new THREE.Euler(0, 0, 0, "YXZ"));
  const reduced = useRef(false);

  // Start in the living room, looking at the glass.
  useEffect(() => {
    const r = roomById("living");
    camera.position.set(...r.spawn);
    camera.quaternion.copy(lookQuat(camera.position, new THREE.Vector3(...r.look)));
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, [camera]);

  // Keyboard (desktop walking)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (!tour.get().locked) return;
      keys.current[e.code] = true;
    };
    const up = (e: KeyboardEvent) => (keys.current[e.code] = false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // Touch / pen: drag to look (desktop uses pointer lock instead).
  useEffect(() => {
    const el = gl.domElement;
    let last: { x: number; y: number } | null = null;
    const downH = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      last = { x: e.clientX, y: e.clientY };
    };
    const moveH = (e: PointerEvent) => {
      if (!last || legs.current.length) return;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      last = { x: e.clientX, y: e.clientY };
      euler.current.setFromQuaternion(camera.quaternion);
      euler.current.y += dx * 0.005;
      euler.current.x = THREE.MathUtils.clamp(euler.current.x + dy * 0.004, -1.2, 1.2);
      camera.quaternion.setFromEuler(euler.current);
    };
    const upH = () => (last = null);
    el.addEventListener("pointerdown", downH);
    window.addEventListener("pointermove", moveH);
    window.addEventListener("pointerup", upH);
    return () => {
      el.removeEventListener("pointerdown", downH);
      window.removeEventListener("pointermove", moveH);
      window.removeEventListener("pointerup", upH);
    };
  }, [camera, gl]);

  const fwd = new THREE.Vector3();
  const right = new THREE.Vector3();

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const s = tour.get();

    // New glide request (hotspot / HUD button)?
    if (s.target && !legs.current.length) {
      if (s.target === s.room) {
        tour.set({ target: null });
      } else {
        legs.current = buildLegs(camera, s.room, s.target);
        if (reduced.current) legs.current = legs.current.slice(-1).map((l) => ({ ...l, t: 1 }));
      }
    }

    if (legs.current.length) {
      const leg = legs.current[0];
      const now = performance.now();
      if (leg.start === null) leg.start = now - leg.t * LEG_S * 1000;
      leg.t = Math.min(1, (now - leg.start) / (LEG_S * 1000));
      const k = ease(leg.t);
      camera.position.lerpVectors(leg.from, leg.to, k);
      camera.quaternion.slerpQuaternions(leg.qFrom, leg.qTo, k);
      if (leg.t >= 1) {
        legs.current.shift();
        if (!legs.current.length) tour.set({ target: null });
      }
    } else if (s.locked) {
      const k = keys.current;
      const f = (k.KeyW || k.ArrowUp ? 1 : 0) - (k.KeyS || k.ArrowDown ? 1 : 0);
      const r = (k.KeyD || k.ArrowRight ? 1 : 0) - (k.KeyA || k.ArrowLeft ? 1 : 0);
      if (f || r) {
        camera.getWorldDirection(fwd);
        fwd.y = 0;
        fwd.normalize();
        right.crossVectors(fwd, camera.up).normalize();
        const step = SPEED * dt * (f && r ? Math.SQRT1_2 : 1);
        const next = clampToFlat({
          x: camera.position.x + (fwd.x * f + right.x * r) * step,
          z: camera.position.z + (fwd.z * f + right.z * r) * step,
        });
        camera.position.set(next.x, EYE, next.z);
      }
    }

    const room = roomAt(camera.position.x, camera.position.z);
    if (room && room !== s.room) tour.set({ room });
  });

  return fine ? (
    <PointerLockControls
      selector="#tour-start"
      onLock={() => tour.set({ locked: true })}
      onUnlock={() => {
        keys.current = {};
        tour.set({ locked: false });
      }}
    />
  ) : null;
}
