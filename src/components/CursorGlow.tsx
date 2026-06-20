'use client';
import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer:coarse)').matches) return;
    const glow = glowRef.current;
    if (!glow) return;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    let raf: number | null = null;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX; ty = e.clientY;
      glow.style.opacity = '1';
      if (!raf) {
        const run = () => {
          cx += (tx - cx) * 0.16;
          cy += (ty - cy) * 0.16;
          glow.style.transform = `translate(${cx}px,${cy}px)`;
          if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) {
            raf = requestAnimationFrame(run);
          } else {
            raf = null;
          }
        };
        raf = requestAnimationFrame(run);
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 w-[480px] h-[480px] -mt-60 -ml-60 rounded-full pointer-events-none z-[1] opacity-0 transition-opacity duration-[400ms]"
      style={{
        background: 'radial-gradient(circle, color-mix(in oklab, var(--accent) 22%, transparent) 0%, transparent 60%)',
        mixBlendMode: 'screen',
      }}
    />
  );
}
