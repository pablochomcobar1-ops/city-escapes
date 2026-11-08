"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FLAT } from "@/lib/flat-layout";
import { tour, useTour } from "@/lib/tourStore";

/** Glowing floor discs at each room's arrival point. Tap or click to glide there. */
export function Hotspots() {
  const current = useTour((s) => s.room);
  const rings = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    rings.current.forEach((m, i) => {
      if (!m) return;
      const k = (t * 0.6 + i * 0.25) % 1;
      m.scale.setScalar(1 + k * 0.9);
      (m.material as THREE.MeshBasicMaterial).opacity = 0.55 * (1 - k);
    });
  });

  return (
    <>
      {FLAT.map((r, i) =>
        r.id === current ? null : (
          <group
            key={r.id}
            position={[r.spawn[0], 0.02, r.spawn[2]]}
            onClick={(e) => {
              e.stopPropagation();
              if (!tour.get().locked) tour.goto(r.id);
            }}
            onPointerOver={() => (document.body.style.cursor = "pointer")}
            onPointerOut={() => (document.body.style.cursor = "")}
          >
            <mesh rotation-x={-Math.PI / 2}>
              <circleGeometry args={[0.32, 40]} />
              <meshBasicMaterial color="#d4b483" transparent opacity={0.85} toneMapped={false} />
            </mesh>
            <mesh rotation-x={-Math.PI / 2} ref={(el) => (rings.current[i] = el)}>
              <ringGeometry args={[0.34, 0.4, 48]} />
              <meshBasicMaterial color="#d4b483" transparent opacity={0.5} toneMapped={false} />
            </mesh>
            {/* bigger invisible hit area for fingers */}
            <mesh rotation-x={-Math.PI / 2}>
              <circleGeometry args={[0.7, 16]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
          </group>
        ),
      )}
    </>
  );
}
