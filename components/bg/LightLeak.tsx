"use client";

import { useEffect, useRef, useState } from "react";
import { currentTheme, THEME_EVENT } from "@/lib/theme";
import {
  getLightLeakTime,
  mixPalette,
  storyPalette,
  THEME_PALETTES,
  type Palette,
} from "@/lib/lightLeak";
import { FRAG, VERT } from "./lightLeak.frag";

const SCALE = 0.5; // render at half resolution: soft blobs don't need more
const THEME_FADE_MS = 1200;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
  return s;
}

/** Fixed, behind everything. Falls back to a CSS gradient without WebGL. */
export function LightLeak() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);
  const [state, setState] = useState<"idle" | "running" | "static">("idle");

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    let gl: WebGLRenderingContext | null = null;
    try {
      gl = el.getContext("webgl", {
        antialias: false,
        alpha: false,
        powerPreference: "low-power",
      });
    } catch {
      gl = null;
    }
    if (!gl) {
      setFallback(true);
      return;
    }

    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("link");
    } catch {
      setFallback(true);
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl!.getUniformLocation(prog, n);
    const uRes = u("uRes"), uTime = u("uTime"), uBg = u("uBg"), uA = u("uA"), uB = u("uB"), uC = u("uC"), uStrength = u("uStrength");

    const resize = () => {
      const w = Math.max(1, Math.round(window.innerWidth * SCALE));
      const h = Math.max(1, Math.round(window.innerHeight * SCALE));
      if (el.width !== w || el.height !== h) {
        el.width = w;
        el.height = h;
        gl!.viewport(0, 0, w, h);
      }
      gl!.uniform2f(uRes, w, h);
    };
    resize();

    // Theme crossfade: from → to over THEME_FADE_MS.
    let from: Palette = THEME_PALETTES[currentTheme()];
    let to: Palette = from;
    let fadeStart = 0;
    let current: Palette = from;
    const onTheme = () => {
      from = current;
      to = THEME_PALETTES[currentTheme()];
      fadeStart = performance.now();
      if (!running) draw(performance.now());
    };

    const draw = (now: number) => {
      const k = fadeStart ? Math.min(1, (now - fadeStart) / THEME_FADE_MS) : 1;
      const eased = 1 - Math.pow(1 - k, 3);
      current = mixPalette(from, to, eased);
      const story = getLightLeakTime();
      const p = story === null || currentTheme() === "day" ? current : storyPalette(story);
      gl!.uniform1f(uTime, now / 1000);
      gl!.uniform3fv(uBg, current.bg);
      gl!.uniform3fv(uA, p.a);
      gl!.uniform3fv(uB, p.b);
      gl!.uniform3fv(uC, p.c);
      gl!.uniform1f(uStrength, currentTheme() === "day" ? 0.8 : 1);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let running = false;
    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced.matches || document.hidden) return;
      running = true;
      setState("running");
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const sync = () => {
      if (reduced.matches || document.hidden) {
        stop();
        draw(performance.now());
        if (reduced.matches) setState("static");
      } else start();
    };

    window.addEventListener(THEME_EVENT, onTheme);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    sync();

    return () => {
      stop();
      window.removeEventListener(THEME_EVENT, onTheme);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
      gl!.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  if (fallback) {
    return (
      <div
        aria-hidden="true"
        data-fallback="gradient"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 18% 15%, color-mix(in srgb, var(--ce-brand) 22%, transparent), transparent 70%)," +
            "radial-gradient(55% 45% at 85% 70%, color-mix(in srgb, var(--ce-brand-accent) 12%, transparent), transparent 70%)",
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      data-state={state}
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
