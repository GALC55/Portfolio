'use client';
import { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const sc = window.scrollY || doc.scrollTop;
      const max = (doc.scrollHeight - window.innerHeight) || 1;
      if (barRef.current) barRef.current.style.width = Math.min(sc / max * 100, 100) + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 h-[3px] w-0 z-[200]"
      style={{ background: 'var(--accent)', boxShadow: '0 0 12px var(--accent)' }}
    />
  );
}
