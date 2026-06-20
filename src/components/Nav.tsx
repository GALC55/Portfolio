'use client';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const pillActive = 'border-0 cursor-pointer px-[13px] py-[6px] rounded-full font-mono text-xs font-semibold tracking-[.04em] transition-all bg-[var(--accent)] text-[#09090b]';
const pillBase   = 'border-0 cursor-pointer px-[13px] py-[6px] rounded-full font-mono text-xs font-medium tracking-[.04em] transition-all bg-transparent text-[rgba(244,244,243,0.5)]';

export default function Nav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width:760px)');
    setWide(mq.matches);
    const handler = (e: MediaQueryListEvent) => setWide(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const switchLocale = (next: string) => {
    const segments = pathname.split('/');
    segments[1] = next;
    router.push(segments.join('/'));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[150] flex items-center justify-between px-[clamp(20px,5vw,64px)] py-[18px] backdrop-blur-[14px] bg-[rgba(9,9,11,0.55)] border-b border-white/[0.06]">
      <Link href={`/${locale}#top`} className="flex items-center gap-[10px] no-underline text-[#f4f4f3]">
        <span className="inline-flex items-center justify-center w-[34px] h-[34px] rounded-[9px] bg-[var(--accent)] text-[#09090b] font-mono font-bold text-[15px]">GL</span>
        <span className="font-mono text-[13px] tracking-[.06em] text-[rgba(244,244,243,0.7)]">gustavo.dev</span>
      </Link>
      <div className="flex items-center gap-[clamp(14px,2.4vw,32px)]">
        {wide && (
          <div className="flex gap-[clamp(14px,2.4vw,30px)] text-[14.5px]">
            {(['skills','exp','edu','contact'] as const).map((key) => (
              <Link
                key={key}
                href={`/${locale}#${key === 'exp' ? 'experience' : key === 'edu' ? 'education' : key}`}
                className="text-[rgba(244,244,243,0.66)] no-underline transition-colors hover:text-[#f4f4f3]"
              >
                {t(key)}
              </Link>
            ))}
          </div>
        )}
        <div className="flex items-center p-[3px] rounded-full border border-white/10 bg-white/[0.03] font-mono text-xs font-medium">
          <button onClick={() => switchLocale('es')} className={locale === 'es' ? pillActive : pillBase}>ES</button>
          <button onClick={() => switchLocale('en')} className={locale === 'en' ? pillActive : pillBase}>EN</button>
        </div>
      </div>
    </nav>
  );
}
