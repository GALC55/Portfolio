import { useTranslations } from 'next-intl';
import HeroCanvas from './HeroCanvas';
import RotatingWord from './RotatingWord';

export default function Hero() {
  const t = useTranslations();
  const stats = t.raw('stats') as Array<{ n: number; suf: string; l: string }>;

  return (
    <header className="relative min-h-screen flex items-center pt-[120px] pb-[90px] px-[clamp(20px,5vw,64px)] overflow-hidden">
      <HeroCanvas />

      {/* glow blobs */}
      <div className="absolute top-[8%] right-[-6%] w-[46vw] h-[46vw] max-w-[620px] max-h-[620px] rounded-full pointer-events-none z-0 animate-floatGlow blur-[30px]"
        style={{ background: 'radial-gradient(circle, color-mix(in oklab, var(--accent) 26%, transparent) 0%, transparent 62%)' }} />
      <div className="absolute bottom-[-10%] left-[-8%] w-[40vw] h-[40vw] max-w-[520px] max-h-[520px] rounded-full pointer-events-none z-0 animate-floatGlow2 blur-[40px]"
        style={{ background: 'radial-gradient(circle, rgba(90,80,255,.16) 0%, transparent 60%)' }} />

      <div className="relative z-[2] w-full max-w-[1120px] mx-auto">
        {/* available badge */}
        <div className="inline-flex items-center gap-[9px] px-[14px] py-[7px] rounded-full font-mono text-[12.5px] tracking-[.04em] animate-fadeUp"
          style={{ border: '1px solid color-mix(in oklab, var(--accent) 40%, transparent)', background: 'color-mix(in oklab, var(--accent) 9%, transparent)', color: 'color-mix(in oklab, var(--accent) 88%, white)' }}>
          <span className="w-2 h-2 rounded-full inline-block"
            style={{ background: 'var(--accent)', boxShadow: '0 0 0 4px color-mix(in oklab, var(--accent) 25%, transparent)' }} />
          {t('avail')}
        </div>

        <p className="font-mono text-[clamp(13px,1.5vw,15px)] tracking-[.04em] text-[rgba(244,244,243,0.55)] mt-[26px] mb-2 animate-fadeUp [animation-delay:.08s]">
          {t('kicker')}
        </p>

        <h1 className="text-[clamp(52px,10vw,128px)] leading-[.95] font-semibold tracking-[-0.03em] m-0 animate-fadeUp [animation-delay:.16s]">
          Gustavo<br /><span className="text-[#f4f4f3]">Lemos</span>
        </h1>

        <div className="text-[clamp(22px,3.4vw,42px)] font-normal tracking-[-0.01em] mt-6 text-[rgba(244,244,243,0.92)] animate-fadeUp [animation-delay:.26s]">
          {t('heroBuild')} <RotatingWord />
        </div>

        <p className="max-w-[560px] text-[clamp(15px,1.9vw,19px)] text-[rgba(244,244,243,0.6)] mt-[22px] leading-[1.6] animate-fadeUp [animation-delay:.34s]">
          {t('heroLead')}
        </p>

        <div className="flex flex-wrap gap-[14px] mt-9 animate-fadeUp [animation-delay:.42s]">
          <a href="#contact"
            className="inline-flex items-center gap-[9px] px-[26px] py-[15px] rounded-xl font-semibold text-[15.5px] no-underline text-[#09090b] transition-[transform,box-shadow] duration-[250ms]"
            style={{ background: 'var(--accent)', boxShadow: '0 8px 30px color-mix(in oklab, var(--accent) 40%, transparent)' }}>
            {t('ctaPrimary')} <span className="font-mono">→</span>
          </a>
          <a href="#experience"
            className="inline-flex items-center gap-[9px] px-[26px] py-[15px] rounded-xl font-medium text-[15.5px] no-underline text-[#f4f4f3] bg-white/[0.04] border border-white/[0.12] transition-[background,border-color] hover:bg-white/[0.08] hover:border-white/25">
            {t('ctaSecondary')}
          </a>
        </div>

        <div className="flex flex-wrap gap-[clamp(28px,5vw,64px)] mt-[54px] animate-fadeUp [animation-delay:.5s]">
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="text-[clamp(34px,5vw,52px)] font-semibold tracking-[-0.02em] leading-none font-sans">
                <span data-count={stat.n}>0</span>
                <span style={{ color: 'var(--accent)' }}>{stat.suf}</span>
              </div>
              <div className="font-mono text-[12.5px] tracking-[.03em] text-[rgba(244,244,243,0.5)] mt-2">{stat.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-[30px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[2] font-mono text-[11px] tracking-[.2em] text-[rgba(244,244,243,0.4)] animate-bobDown">
        {t('scroll')}
        <span className="w-px h-[30px]" style={{ background: 'linear-gradient(to bottom, rgba(244,244,243,.5), transparent)' }} />
      </div>
    </header>
  );
}
