"use client";

import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import { useTheme } from "@/components/theme/useTheme";
import { tour } from "@/lib/tourStore";
import { Flat } from "./Flat";
import { Sky } from "./Sky";
import { Player } from "./Player";
import { Hotspots } from "./Hotspots";

function Lights({ night }: { night: boolean }) {
  return night ? (
    <>
      <hemisphereLight args={["#3a4766", "#2a2018", 0.7]} />
      <ambientLight intensity={0.12} color="#ffd9b0" />
    </>
  ) : (
    <>
      <hemisphereLight args={["#e8eef4", "#9a8a72", 1.1]} />
      <directionalLight position={[6, 9, -10]} intensity={2.4} color="#fff2dc" />
      <directionalLight position={[-9, 5, 2]} intensity={0.6} color="#ffe2b8" />
    </>
  );
}

/** Reports asset loading progress to the HUD (which must not import three/drei). */
function Progress() {
  const { progress } = useProgress();
  useEffect(() => tour.set({ progress }), [progress]);
  return null;
}

/** Marks the tour ready once the scene (and its textures) has rendered a frame. */
function Ready() {
  const { gl } = useThree();
  useEffect(() => {
    const id = requestAnimationFrame(() => tour.set({ ready: true }));
    gl.domElement.dataset.ready = "true";
    return () => cancelAnimationFrame(id);
  }, [gl]);
  return null;
}

export default function TourCanvas({ fine }: { fine: boolean }) {
  const { theme } = useTheme();
  const night = theme === "night";

  useEffect(() => () => tour.reset(), []);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 70, near: 0.05, far: 900 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      aria-label="3D walkthrough of Residence 12A"
      role="img"
      className="!absolute inset-0 touch-none"
    >
      <color attach="background" args={[night ? "#05070d" : "#e9dfcf"]} />
      <Progress />
      <Lights night={night} />
      <Sky night={night} />
      <Suspense fallback={null}>
        <Flat night={night} />
        <Ready />
      </Suspense>
      <Hotspots />
      <Player fine={fine} />
    </Canvas>
  );
}
