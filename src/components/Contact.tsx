import { useTranslations } from 'next-intl';

export default function Contact() {
  const t = useTranslations();
  const refs = t.raw('references') as Array<{ name: string; email: string; phone: string }>;

  return (
    <section id="contact" className="relative z-[2] max-w-[1120px] mx-auto px-[clamp(20px,5vw,64px)] py-[clamp(60px,9vw,120px)] pb-[clamp(40px,6vw,70px)] scroll-mt-[90px]">
      <div data-reveal className="flex items-baseline gap-4 mb-[14px]">
        <span className="font-mono text-[14px]" style={{ color: 'var(--accent)' }}>05</span>
        <h2 className="text-[clamp(38px,7vw,82px)] font-semibold tracking-[-0.03em] m-0 leading-none">{t('contactTitle')}</h2>
      </div>
      <p data-reveal className="text-[rgba(244,244,243,0.6)] text-[clamp(16px,2.2vw,22px)] m-0 mb-11 max-w-[540px]">{t('contactSub')}</p>

      <div data-reveal className="grid gap-4 mb-14" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
        <a href="mailto:lemosgustavo113@gmail.com"
          className="block p-6 rounded-2xl bg-white/[0.025] border border-white/[0.08] no-underline text-[#f4f4f3] transition-[border-color,transform,background] hover:border-[color-mix(in_oklab,var(--accent)_55%,transparent)] hover:-translate-y-1 hover:bg-white/[0.05]">
          <div className="font-mono text-[12px] tracking-[.06em] uppercase text-[rgba(244,244,243,0.45)] mb-3">{t('email')}</div>
          <div className="text-[15.5px] font-medium break-all">lemosgustavo113@gmail.com</div>
        </a>
        <a href="tel:+593988655346"
          className="block p-6 rounded-2xl bg-white/[0.025] border border-white/[0.08] no-underline text-[#f4f4f3] transition-[border-color,transform,background] hover:border-[color-mix(in_oklab,var(--accent)_55%,transparent)] hover:-translate-y-1 hover:bg-white/[0.05]">
          <div className="font-mono text-[12px] tracking-[.06em] uppercase text-[rgba(244,244,243,0.45)] mb-3">{t('phone')}</div>
          <div className="text-[15.5px] font-medium">+593 98 865 5346</div>
        </a>
        <div className="p-6 rounded-2xl bg-white/[0.025] border border-white/[0.08]">
          <div className="font-mono text-[12px] tracking-[.06em] uppercase text-[rgba(244,244,243,0.45)] mb-3">{t('loc')}</div>
          <div className="text-[15.5px] font-medium">Guayaquil, Ecuador</div>
        </div>
      </div>

      <div data-reveal className="font-mono text-[12px] tracking-[.08em] uppercase text-[rgba(244,244,243,0.4)] mb-[18px]">{t('refTitle')}</div>
      <div data-reveal className="grid gap-[14px]" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
        {refs.map((ref, i) => (
          <div key={i} className="p-[18px_20px] rounded-[14px] border border-white/[0.06] bg-white/[0.015]">
            <div className="font-semibold text-[15px] mb-2">{ref.name}</div>
            <div className="text-[13px] text-[rgba(244,244,243,0.5)] break-all">{ref.email}</div>
            <div className="text-[13px] text-[rgba(244,244,243,0.5)] mt-[3px]">{ref.phone}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
