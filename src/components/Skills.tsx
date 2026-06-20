import { useTranslations } from 'next-intl';

export default function Skills() {
  const t = useTranslations();
  const groups = t.raw('skillGroups') as Array<{ label: string; items: string[] }>;

  return (
    <section id="skills" className="relative z-[2] max-w-[1120px] mx-auto px-[clamp(20px,5vw,64px)] py-[clamp(80px,12vw,140px)] scroll-mt-[90px]">
      <div data-reveal className="flex items-baseline gap-4 mb-[14px]">
        <span className="font-mono text-[14px]" style={{ color: 'var(--accent)' }}>01</span>
        <h2 className="text-[clamp(34px,5.5vw,64px)] font-semibold tracking-[-0.025em] m-0">{t('skillsTitle')}</h2>
      </div>
      <p data-reveal className="text-[rgba(244,244,243,0.55)] text-[clamp(15px,1.9vw,19px)] m-0 mb-12 max-w-[520px]">{t('skillsSub')}</p>

      <div className="grid gap-[18px]" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))' }}>
        {groups.map((group, gi) => (
          <div key={gi} data-reveal
            className="relative p-[26px] rounded-[18px] border border-white/[0.08] transition-[transform,border-color,box-shadow] duration-300 hover:border-[color-mix(in_oklab,var(--accent)_50%,transparent)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
            style={{ background: 'linear-gradient(160deg,rgba(255,255,255,.045),rgba(255,255,255,.012))' }}>
            <div className="font-mono text-[12px] tracking-[.08em] uppercase mb-4" style={{ color: 'var(--accent)' }}>{group.label}</div>
            <div className="flex flex-wrap gap-2">
              {group.items.map((chip, ci) => (
                <span key={ci}
                  className="px-[13px] py-[7px] rounded-lg text-[13.5px] text-[rgba(244,244,243,0.85)] border border-white/[0.07] bg-white/[0.05] transition-[background,color] hover:bg-[var(--accent)] hover:text-[#09090b] cursor-default">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
