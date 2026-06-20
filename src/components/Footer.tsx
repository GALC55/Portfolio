import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations();
  return (
    <footer className="relative z-[2] border-t border-white/[0.06] px-[clamp(20px,5vw,64px)] py-[30px] flex flex-wrap items-center justify-between gap-[14px]">
      <span className="font-mono text-[12.5px] text-[rgba(244,244,243,0.4)]">© 2026 Gustavo Lemos · {t('footer')}</span>
      <a href="#top" className="font-mono text-[12.5px] text-[rgba(244,244,243,0.55)] no-underline inline-flex items-center gap-[7px] transition-colors hover:text-[var(--accent)]">↑ top</a>
    </footer>
  );
}
