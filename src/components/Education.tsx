import { useTranslations } from 'next-intl';
import LangBars from './LangBars';

export default function Education() {
  const t = useTranslations();
  const education = t.raw('education') as Array<{ degree: string; school: string; year: string }>;
  const languages = t.raw('languages') as Array<{ name: string; level: string; pct: number }>;

  return (
    <section id="education" className="relative z-[2] max-w-[1120px] mx-auto px-[clamp(20px,5vw,64px)] py-[clamp(40px,8vw,90px)] scroll-mt-[90px]">
      <div className="grid gap-[clamp(40px,6vw,72px)]" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))' }}>

        <div>
          <div data-reveal className="flex items-baseline gap-4 mb-9">
            <span className="font-mono text-[14px]" style={{ color: 'var(--accent)' }}>03</span>
            <h2 className="text-[clamp(30px,4.5vw,48px)] font-semibold tracking-[-0.025em] m-0">{t('eduTitle')}</h2>
          </div>
          <div className="flex flex-col gap-4">
            {education.map((ed, i) => (
              <div key={i} data-reveal
                className="p-6 rounded-2xl bg-white/[0.025] border border-white/[0.08] transition-[border-color,transform] hover:border-[color-mix(in_oklab,var(--accent)_45%,transparent)] hover:-translate-y-[3px]">
                <div className="flex justify-between items-start gap-[14px]">
                  <h3 className="text-[clamp(17px,2.2vw,21px)] font-semibold m-0 mb-[6px] tracking-[-0.01em]">{ed.degree}</h3>
                  <span className="font-mono text-[13px] px-[10px] py-1 rounded-full whitespace-nowrap"
                    style={{ background: 'color-mix(in oklab,var(--accent) 12%,transparent)', color: 'var(--accent)' }}>
                    {ed.year}
                  </span>
                </div>
                <div className="text-[14.5px] text-[rgba(244,244,243,0.55)]">{ed.school}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div data-reveal className="flex items-baseline gap-4 mb-9">
            <span className="font-mono text-[14px]" style={{ color: 'var(--accent)' }}>04</span>
            <h2 className="text-[clamp(30px,4.5vw,48px)] font-semibold tracking-[-0.025em] m-0">{t('langTitle')}</h2>
          </div>
          <LangBars langs={languages} />
        </div>

      </div>
    </section>
  );
}
