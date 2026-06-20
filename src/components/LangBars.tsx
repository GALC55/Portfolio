'use client';
import { useReveal } from '@/hooks/useReveal';

interface Lang { name: string; level: string; pct: number; }

export default function LangBars({ langs }: { langs: Lang[] }) {
  useReveal();

  return (
    <div className="flex flex-col gap-7">
      {langs.map((lng, i) => (
        <div key={i} data-reveal>
          <div className="flex justify-between items-baseline mb-[11px]">
            <span className="text-[clamp(17px,2.2vw,21px)] font-semibold">{lng.name}</span>
            <span className="font-mono text-[13px] text-[rgba(244,244,243,0.55)]">{lng.level}</span>
          </div>
          <div className="h-2 rounded-full bg-white/[0.07] overflow-hidden">
            <div
              data-bar={lng.pct}
              className="h-full w-0 rounded-full transition-[width_1.4s_cubic-bezier(.16,1,.3,1)]"
              style={{ background: 'linear-gradient(90deg,var(--accent),color-mix(in oklab,var(--accent) 60%,white))', boxShadow: '0 0 12px color-mix(in oklab,var(--accent) 50%,transparent)' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
