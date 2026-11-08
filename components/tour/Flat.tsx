"use client";

import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { FLAT, WALL } from "@/lib/flat-layout";

type V2 = [number, number];

const COL = {
  wall: "#e9e2d6",
  wallNight: "#d9cfbf",
  ceiling: "#f2ede5",
  frame: "#2a2621",
  linen: "#d8cbb5",
  linenDark: "#b9a98f",
  oakDark: "#4a3a2c",
  stone: "#cfc2ad",
  brass: "#b8935a",
};

function useMaterials() {
  const [oak, trav] = useTexture(["/media/images/material-oak.webp", "/media/images/material-travertine.webp"]);
  return useMemo(() => {
    for (const t of [oak, trav]) {
      t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping;
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
    }
    const floorFor = (w: number, d: number, tint = "#ffffff") => {
      const t = oak.clone();
      t.repeat.set(w / 2.2, d / 2.2);
      t.needsUpdate = true;
      return new THREE.MeshStandardMaterial({ map: t, color: tint, roughness: 0.55 });
    };
    const travFor = (u: number, v: number) => {
      const t = trav.clone();
      t.repeat.set(u, v);
      t.needsUpdate = true;
      return new THREE.MeshStandardMaterial({ map: t, roughness: 0.85 });
    };
    return {
      floorFor,
      travFor,
      wall: new THREE.MeshStandardMaterial({ color: COL.wall, roughness: 0.95 }),
      ceiling: new THREE.MeshStandardMaterial({ color: COL.ceiling, roughness: 1 }),
      frame: new THREE.MeshStandardMaterial({ color: COL.frame, roughness: 0.5, metalness: 0.4 }),
      glass: new THREE.MeshStandardMaterial({
        color: "#a9bccb",
        transparent: true,
        opacity: 0.1,
        roughness: 0.05,
        metalness: 0.2,
        depthWrite: false,
      }),
      linen: new THREE.MeshStandardMaterial({ color: COL.linen, roughness: 1 }),
      linenDark: new THREE.MeshStandardMaterial({ color: COL.linenDark, roughness: 1 }),
      oakDark: new THREE.MeshStandardMaterial({ color: COL.oakDark, roughness: 0.6 }),
      brass: new THREE.MeshStandardMaterial({ color: COL.brass, roughness: 0.32, metalness: 0.9 }),
      stone: travFor(1, 1),
    };
  }, [oak, trav]);
}

/** A straight wall segment from a to b (floor plan), height h, optionally starting at y0. */
function Wall({ a, b, h, y0 = 0, mat }: { a: V2; b: V2; h: number; y0?: number; mat: THREE.Material }) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  return (
    <mesh
      position={[(a[0] + b[0]) / 2, y0 + h / 2, (a[1] + b[1]) / 2]}
      rotation-y={-ang}
      material={mat}
    >
      <boxGeometry args={[len, h, WALL]} />
    </mesh>
  );
}

/** Floor-to-ceiling glass with slim dark mullions every ~1.6 m and a frame top and bottom. */
function Glazing({ a, b, h, m }: { a: V2; b: V2; h: number; m: ReturnType<typeof useMaterials> }) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const n = Math.max(1, Math.round(len / 1.6));
  return (
    <group position={[(a[0] + b[0]) / 2, 0, (a[1] + b[1]) / 2]} rotation-y={-ang}>
      <mesh position={[0, h / 2, 0]} material={m.glass}>
        <planeGeometry args={[len, h]} />
      </mesh>
      {Array.from({ length: n + 1 }, (_, i) => (
        <mesh key={i} position={[-len / 2 + (i * len) / n, h / 2, 0]} material={m.frame}>
          <boxGeometry args={[0.05, h, 0.08]} />
        </mesh>
      ))}
      {[0.03, h - 0.03].map((y) => (
        <mesh key={y} position={[0, y, 0]} material={m.frame}>
          <boxGeometry args={[len, 0.06, 0.1]} />
        </mesh>
      ))}
      {h > 4 && (
        <mesh position={[0, 3.2, 0]} material={m.frame}>
          <boxGeometry args={[len, 0.05, 0.08]} />
        </mesh>
      )}
    </group>
  );
}

function Lamp({ p, night, h = 1.55, light = true }: { p: [number, number, number]; night: boolean; h?: number; light?: boolean }) {
  return (
    <group position={p}>
      <mesh position={[0, h / 2, 0]}>
        <cylinderGeometry args={[0.012, 0.012, h, 8]} />
        <meshStandardMaterial color={COL.brass} metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[0, h, 0]}>
        <cylinderGeometry args={[0.1, 0.22, 0.26, 24, 1, true]} />
        <meshStandardMaterial
          color="#efe4cf"
          side={THREE.DoubleSide}
          emissive="#ffc27a"
          emissiveIntensity={night ? 1.6 : 0}
        />
      </mesh>
      {night && light && <pointLight position={[0, h - 0.1, 0]} color="#ffb36b" intensity={9} distance={8} decay={2} />}
    </group>
  );
}

function Pendant({ p, night, light = false }: { p: [number, number, number]; night: boolean; light?: boolean }) {
  return (
    <group position={p}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 1, 4]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.13, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={COL.brass} metalness={0.9} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.01, 0]} rotation-x={Math.PI / 2}>
        <circleGeometry args={[0.12, 24]} />
        <meshStandardMaterial color="#fff4e0" emissive="#ffd29a" emissiveIntensity={night ? 2.5 : 0.2} />
      </mesh>
      {night && light && <pointLight position={[0, 0.35, 0]} color="#ffbe7a" intensity={4.5} distance={6} decay={2} />}
    </group>
  );
}

export function Flat({ night }: { night: boolean }) {
  const m = useMaterials();
  const H = 3.2;
  const HH = 6.4;
  const floors = useMemo(
    () =>
      Object.fromEntries(
        FLAT.map((r) => [r.id, m.floorFor(r.w, r.d, r.id === "balcony" ? "#a08670" : "#ffffff")]),
      ),
    [m],
  );
  const travWall = useMemo(() => m.travFor(2.2, 4), [m]);

  return (
    <group>
      {/* floors */}
      {FLAT.map((r) => (
        <mesh key={r.id} rotation-x={-Math.PI / 2} position={[r.x, 0, r.z]} material={floors[r.id]}>
          <planeGeometry args={[r.w, r.d]} />
        </mesh>
      ))}
      {/* ceilings */}
      {FLAT.filter((r) => r.height > 0).map((r) => (
        <mesh key={r.id} rotation-x={Math.PI / 2} position={[r.x, r.height, r.z]} material={m.ceiling}>
          <planeGeometry args={[r.w, r.d]} />
        </mesh>
      ))}

      {/* LIVING (x −3.5…3.5, z −2.75…2.75, double height) */}
      <Glazing a={[-3.5, -2.75]} b={[3.5, -2.75]} h={HH} m={m} />
      {/* west: travertine feature wall with the bedroom door (z −1.2…0) */}
      <Wall a={[-3.5, -2.75]} b={[-3.5, -1.2]} h={HH} mat={travWall} />
      <Wall a={[-3.5, 0]} b={[-3.5, 2.75]} h={HH} mat={travWall} />
      <Wall a={[-3.5, -1.2]} b={[-3.5, 0]} h={HH - 2.3} y0={2.3} mat={travWall} />
      {/* east: kitchen door (z −1.9…−0.3) */}
      <Wall a={[3.5, -2.75]} b={[3.5, -1.9]} h={HH} mat={m.wall} />
      <Wall a={[3.5, -0.3]} b={[3.5, 2.75]} h={HH} mat={m.wall} />
      <Wall a={[3.5, -1.9]} b={[3.5, -0.3]} h={HH - 2.4} y0={2.4} mat={m.wall} />
      {/* south: sliding glass to the balcony (x −1.6…1.6) */}
      <Wall a={[-3.5, 2.75]} b={[-1.6, 2.75]} h={HH} mat={m.wall} />
      <Wall a={[1.6, 2.75]} b={[3.5, 2.75]} h={HH} mat={m.wall} />
      <Wall a={[-1.6, 2.75]} b={[1.6, 2.75]} h={HH - 2.6} y0={2.6} mat={m.wall} />
      {/* gallery edge at mid-height, a hint of the upper level */}
      <mesh position={[0, 3.25, 2.2]} material={m.oakDark}>
        <boxGeometry args={[7, 0.12, 1.1]} />
      </mesh>

      {/* KITCHEN (x 3.5…7.5, z −2.75…0.75) */}
      <Glazing a={[7.5, -2.75]} b={[7.5, 0.75]} h={H} m={m} />
      <Wall a={[3.5, -2.75]} b={[7.5, -2.75]} h={H} mat={m.wall} />
      <Wall a={[3.5, 0.75]} b={[7.5, 0.75]} h={H} mat={m.wall} />
      {/* BEDROOM (x −8…−3.5, z −2.75…1.25) */}
      <Glazing a={[-8, -2.75]} b={[-8, 1.25]} h={H} m={m} />
      <Wall a={[-8, -2.75]} b={[-3.5, -2.75]} h={H} mat={m.wall} />
      <Wall a={[-8, 1.25]} b={[-3.5, 1.25]} h={H} mat={m.wall} />
      {/* BALCONY railing (x −3…3, z 2.75…4.95) */}
      {(
        [
          [[-3, 2.75], [-3, 4.95]],
          [[3, 2.75], [3, 4.95]],
          [[-3, 4.95], [3, 4.95]],
        ] as [V2, V2][]
      ).map(([a, b], i) => (
        <Glazing key={i} a={a} b={b} h={1.1} m={m} />
      ))}

      {/* ---- Furniture ---- */}
      {/* living: rug, sofa, coffee table, lounge chair, lamp, plant */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.005, -0.4]}>
        <planeGeometry args={[4, 2.8]} />
        <meshStandardMaterial color={night ? "#5e5446" : "#b7a98f"} roughness={1} />
      </mesh>
      <group position={[0, 0, 0.75]}>
        <mesh position={[0, 0.22, 0]} material={m.linen}>
          <boxGeometry args={[2.8, 0.44, 0.95]} />
        </mesh>
        <mesh position={[0, 0.6, 0.38]} material={m.linen}>
          <boxGeometry args={[2.8, 0.45, 0.22]} />
        </mesh>
        {[-1.32, 1.32].map((x) => (
          <mesh key={x} position={[x, 0.42, 0]} material={m.linenDark}>
            <boxGeometry args={[0.18, 0.4, 0.95]} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, 0.2, -0.6]} material={m.oakDark}>
        <boxGeometry args={[1.3, 0.4, 0.75]} />
      </mesh>
      <mesh position={[0.25, 0.44, -0.6]} material={m.stone}>
        <cylinderGeometry args={[0.09, 0.11, 0.08, 24]} />
      </mesh>
      <group position={[-2.1, 0, -1.2]} rotation-y={0.6}>
        <mesh position={[0, 0.22, 0]} material={m.oakDark}>
          <boxGeometry args={[0.75, 0.44, 0.8]} />
        </mesh>
        <mesh position={[0, 0.62, 0.3]} rotation-x={-0.25} material={m.oakDark}>
          <boxGeometry args={[0.75, 0.6, 0.08]} />
        </mesh>
      </group>
      <Lamp p={[1.75, 0, 1.2]} night={night} />
      <group position={[-2.8, 0, -2.2]}>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.32, 0.26, 0.6, 24]} />
          <meshStandardMaterial color="#2b2622" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.45, 0]}>
          <icosahedronGeometry args={[0.65, 1]} />
          <meshStandardMaterial color={night ? "#1f2a1c" : "#3d5234"} roughness={1} flatShading />
        </mesh>
      </group>

      {/* kitchen: travertine island, pendants, tall oak cabinets */}
      <mesh position={[5.5, 0.46, -1.1]} material={m.stone}>
        <boxGeometry args={[2.4, 0.92, 0.95]} />
      </mesh>
      {[4.8, 5.5, 6.2].map((x) => (
        <Pendant key={x} p={[x, 2.15, -1.1]} night={night} light={x === 5.5} />
      ))}
      <mesh position={[5.5, 1.15, -2.45]} material={m.oakDark}>
        <boxGeometry args={[3.6, 2.3, 0.6]} />
      </mesh>
      <mesh position={[5.5, 1.15, -2.14]} material={m.brass}>
        <boxGeometry args={[3.2, 0.02, 0.02]} />
      </mesh>

      {/* bedroom: bed with linen, side tables, lamps, bench */}
      <group position={[-6.2, 0, -1.1]}>
        <mesh position={[0, 0.2, 0]} material={m.oakDark}>
          <boxGeometry args={[2.1, 0.4, 2.2]} />
        </mesh>
        <mesh position={[0, 0.5, 0.05]} material={m.linen}>
          <boxGeometry args={[2.0, 0.22, 2.0]} />
        </mesh>
        <mesh position={[0, 0.7, -0.75]} material={m.linenDark}>
          <boxGeometry args={[1.7, 0.18, 0.4]} />
        </mesh>
        <mesh position={[0, 0.9, -1.15]} material={m.oakDark}>
          <boxGeometry args={[2.3, 1.4, 0.08]} />
        </mesh>
        {[-1.4, 1.4].map((x) => (
          <group key={x}>
            <mesh position={[x, 0.25, -0.9]} material={m.stone}>
              <boxGeometry args={[0.5, 0.5, 0.45]} />
            </mesh>
            <Lamp p={[x, 0.5, -0.9]} night={night} h={0.45} light={false} />
          </group>
        ))}
      </group>

      {night && (
        <>
          {/* one light for both bedside lamps */}
          <pointLight position={[-6.2, 1.1, -1.7]} color="#ffb36b" intensity={7} distance={6} decay={2} />
          {/* soft glow in the double-height living room */}
          <pointLight position={[0, 4.2, -0.5]} color="#ffcf9a" intensity={22} distance={14} decay={2} />
          {/* wall-washer grazing the travertine feature wall */}
          <pointLight position={[-3.1, 2.6, 1.2]} color="#ffbf80" intensity={6} distance={5} decay={2} />
        </>
      )}

      {/* balcony: two loungers, side table, lantern */}
      {[-1.1, 0.9].map((x) => (
        <group key={x} position={[x, 0, 3.95]} rotation-y={Math.PI}>
          <mesh position={[0, 0.2, 0]} material={m.oakDark}>
            <boxGeometry args={[0.7, 0.4, 1.7]} />
          </mesh>
          <mesh position={[0, 0.48, 0.15]} material={m.linenDark}>
            <boxGeometry args={[0.66, 0.12, 1.4]} />
          </mesh>
        </group>
      ))}
      <mesh position={[-0.1, 0.22, 3.95]} material={m.stone}>
        <boxGeometry args={[0.4, 0.44, 0.4]} />
      </mesh>
      <group position={[2.4, 0, 4.5]}>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.24, 0.5, 0.24]} />
          <meshStandardMaterial color="#fff1d8" emissive="#ffb35c" emissiveIntensity={night ? 2 : 0} transparent opacity={0.9} />
        </mesh>
        {night && <pointLight position={[0, 0.4, 0]} color="#ffa04d" intensity={3} distance={4} decay={2} />}
      </group>
    </group>
  );
}
