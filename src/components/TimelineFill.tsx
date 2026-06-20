'use client';
import { useEffect, useRef } from 'react';

export default function TimelineFill() {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const sec = document.getElementById('experience');
      const fill = fillRef.current;
      if (!sec || !fill) return;
      const r = sec.getBoundingClientRect();
      const frac = (window.innerHeight * 0.55 - r.top) / r.height;
      fill.style.height = Math.max(0, Math.min(frac, 1)) * 100 + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      ref={fillRef}
      className="absolute top-1 w-[2px] h-0 transition-[height_.12s_linear]"
      style={{ left: 'clamp(6px,1.2vw,10px)', background: 'var(--accent)', boxShadow: '0 0 12px var(--accent)' }}
    />
  );
}
