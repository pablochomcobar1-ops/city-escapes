"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SKY = {
  day: { top: "#8fb0cc", horizon: "#e9dfcf", fog: "#e2d8c8", block: "#b9b2a6" },
  night: { top: "#05070d", horizon: "#1a2131", fog: "#0c101a", block: "#0b0d12" },
};

const vert = /* glsl */ `
varying vec3 vPos;
void main() { vPos = (modelMatrix * vec4(position, 1.0)).xyz; gl_Position = projectionMatrix * viewMatrix * vec4(vPos, 1.0); }`;
const frag = /* glsl */ `
uniform vec3 uTop; uniform vec3 uHorizon; varying vec3 vPos;
void main() { float h = normalize(vPos).y; float t = smoothstep(-0.15, 0.55, h); gl_FragColor = vec4(mix(uHorizon, uTop, t), 1.0); }`;

/** Code-made sky dome + a city 60 m below (instanced blocks, lit windows at night). No downloads. */
export function Sky({ night }: { night: boolean }) {
  const c = night ? SKY.night : SKY.day;
  const uniforms = useMemo(
    () => ({ uTop: { value: new THREE.Color(c.top) }, uHorizon: { value: new THREE.Color(c.horizon) } }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  uniforms.uTop.value.set(c.top);
  uniforms.uHorizon.value.set(c.horizon);

  // Deterministic pseudo-random city (same every visit).
  const { matrices, lights } = useMemo(() => {
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const m: THREE.Matrix4[] = [];
    const pts: number[] = [];
    const o = new THREE.Object3D();
    for (let i = 0; i < 700; i++) {
      const a = rnd() * Math.PI * 2;
      const r = 25 + rnd() ** 0.7 * 230;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      const h = 6 + rnd() ** 2 * 55;
      const w = 6 + rnd() * 14;
      o.position.set(x, -62 + h / 2, z);
      o.scale.set(w, h, w * (0.6 + rnd() * 0.8));
      o.rotation.y = rnd() * Math.PI;
      o.updateMatrix();
      m.push(o.matrix.clone());
      // a few lit windows per block
      const n = Math.floor(rnd() * 10);
      for (let k = 0; k < n; k++) pts.push(x + (rnd() - 0.5) * w, -62 + rnd() * h, z + (rnd() - 0.5) * w);
    }
    // street-light glow on the ground
    for (let i = 0; i < 1600; i++) {
      const a = rnd() * Math.PI * 2;
      const r = 20 + rnd() * 260;
      pts.push(Math.cos(a) * r, -61.5, Math.sin(a) * r);
    }
    return { matrices: m, lights: new Float32Array(pts) };
  }, []);

  // Lit-window texture for the city blocks (generated once, glows only at night).
  const windows = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 256;
    const g = c.getContext("2d")!;
    g.fillStyle = "#000";
    g.fillRect(0, 0, 128, 256);
    let seed = 11;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let y = 3; y < 253; y += 6)
      for (let x = 3; x < 125; x += 6) {
        const r = rnd();
        if (r < 0.22) {
          g.fillStyle = r < 0.05 ? "#fff1d6" : r < 0.14 ? "#ffc27a" : "#d9823f";
          g.fillRect(x, y, 3, 3);
        }
      }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, []);

  // Box faces: +x, -x, +y (roof), -y, +z, -z. Windows on walls only.
  const blockMats = useMemo(() => {
    const wall = new THREE.MeshStandardMaterial({ roughness: 1, emissiveMap: windows });
    const roof = new THREE.MeshStandardMaterial({ roughness: 1 });
    return { wall, roof, list: [wall, wall, roof, roof, wall, wall] };
  }, [windows]);
  blockMats.wall.color.set(c.block);
  blockMats.roof.color.set(c.block);
  blockMats.wall.emissive.set(night ? "#ffb870" : "#000000");
  blockMats.wall.emissiveIntensity = night ? 0.85 : 0;

  const inst = useRef<THREE.InstancedMesh>(null);
  const set = useRef(false);
  useFrame(() => {
    if (set.current || !inst.current) return;
    matrices.forEach((mx, i) => inst.current!.setMatrixAt(i, mx));
    inst.current.instanceMatrix.needsUpdate = true;
    set.current = true;
  });

  return (
    <>
      <fog attach="fog" args={[c.fog, 40, 280]} />
      <mesh scale={400}>
        <sphereGeometry args={[1, 32, 16]} />
        <shaderMaterial side={THREE.BackSide} depthWrite={false} fog={false} uniforms={uniforms} vertexShader={vert} fragmentShader={frag} />
      </mesh>
      {/* ground */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -62, 0]}>
        <circleGeometry args={[400, 32]} />
        <meshStandardMaterial color={night ? "#07080b" : "#a59d90"} />
      </mesh>
      <instancedMesh
        ref={inst}
        args={[undefined, blockMats.list, matrices.length]}
        frustumCulled={false}
      >
        <boxGeometry />
      </instancedMesh>
      {night && (
        <points frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[lights, 3]} />
          </bufferGeometry>
          <pointsMaterial color="#ffc98a" size={2.6} sizeAttenuation={false} fog={false} transparent opacity={0.95} toneMapped={false} />
        </points>
      )}
      {/* the tower itself, below the flat */}
      <mesh position={[0, -31.2, 0]}>
        <boxGeometry args={[17, 62, 11]} />
        <meshStandardMaterial color={night ? "#1d1a16" : "#cfc6b6"} roughness={0.9} />
      </mesh>
    </>
  );
}
