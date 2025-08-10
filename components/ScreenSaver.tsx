"use client";

import { useEffect, useRef, useState } from "react";

type Props = { idleMs?: number };

export default function ScreenSaver({ idleMs = 7 * 60 * 1000 }: Props) {
  const [active, setActive] = useState(false);
  const raf = useRef<number | null>(null);
  const lastActivity = useRef<number>(Date.now());

  // Bouncer state
  const pos = useRef<{ x: number; y: number }>({ x: 100, y: 100 });
  const vel = useRef<{ vx: number; vy: number }>(() => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 120; // px/s
    return { vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed };
  }) as React.MutableRefObject<{ vx: number; vy: number }>;
  const lastTs = useRef<number>(performance.now());
  const boxSize = 64; // B box size

  const [tick, setTick] = useState(0); // trigger re-render for CSS transform

  useEffect(() => {
    const bump = () => {
      lastActivity.current = Date.now();
      if (active) setActive(false);
    };
    const events = ["mousemove", "keydown", "wheel", "touchstart"];
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }));

    const loop = (ts: number) => {
      if (Date.now() - lastActivity.current > idleMs) {
        if (!active) setActive(true);
      }
      if (active) {
        const dt = Math.min(0.05, (ts - lastTs.current) / 1000); // clamp dt
        lastTs.current = ts;
        const w = window.innerWidth;
        const h = window.innerHeight;
        const nx = pos.current.x + vel.current.vx * dt;
        const ny = pos.current.y + vel.current.vy * dt;

        // Bounce off edges
        if (nx <= 0) {
          pos.current.x = 0;
          vel.current.vx = Math.abs(vel.current.vx) * (0.95 + Math.random() * 0.1);
        } else if (nx + boxSize >= w) {
          pos.current.x = w - boxSize;
          vel.current.vx = -Math.abs(vel.current.vx) * (0.95 + Math.random() * 0.1);
        } else {
          pos.current.x = nx;
        }

        if (ny <= 0) {
          pos.current.y = 0;
          vel.current.vy = Math.abs(vel.current.vy) * (0.95 + Math.random() * 0.1);
        } else if (ny + boxSize >= h) {
          pos.current.y = h - boxSize;
          vel.current.vy = -Math.abs(vel.current.vy) * (0.95 + Math.random() * 0.1);
        } else {
          pos.current.y = ny;
        }

        // Occasionally tweak direction slightly
        if (Math.random() < 0.01) {
          const tweak = (Math.random() - 0.5) * 40; // deg
          const speed = Math.hypot(vel.current.vx, vel.current.vy);
          const angle = Math.atan2(vel.current.vy, vel.current.vx) + (tweak * Math.PI) / 180;
          vel.current.vx = Math.cos(angle) * speed;
          vel.current.vy = Math.sin(angle) * speed;
        }

        // Trigger render
        setTick((t) => (t + 1) % 1000000);
      } else {
        lastTs.current = ts;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      events.forEach((e) => window.removeEventListener(e, bump));
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [active, idleMs]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black" onClick={() => setActive(false)}>
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: boxSize,
          height: boxSize,
          transform: `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`
        }}
        className="rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-2xl"
      >
        <span className="text-white font-bold text-xl select-none">B</span>
      </div>
    </div>
  );
}

