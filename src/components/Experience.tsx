import { useTranslations } from 'next-intl';
import TimelineFill from './TimelineFill';

export default function Experience() {
  const t = useTranslations();
  const jobs = t.raw('experience') as Array<{
    period: string; role: string; company: string; location: string; points: string[];
  }>;

  return (
    <section id="experience" className="relative z-[2] max-w-[1120px] mx-auto px-[clamp(20px,5vw,64px)] py-[clamp(40px,8vw,90px)] scroll-mt-[90px]">
      <div data-reveal className="flex items-baseline gap-4 mb-[14px]">
        <span className="font-mono text-[14px]" style={{ color: 'var(--accent)' }}>02</span>
        <h2 className="text-[clamp(34px,5.5vw,64px)] font-semibold tracking-[-0.025em] m-0">{t('expTitle')}</h2>
      </div>
      <p data-reveal className="text-[rgba(244,244,243,0.55)] text-[clamp(15px,1.9vw,19px)] m-0 mb-14 max-w-[520px]">{t('expSub')}</p>

      <div className="relative pl-[clamp(28px,5vw,52px)]">
        <div className="absolute top-1 bottom-1 w-[2px] bg-white/10" style={{ left: 'clamp(6px,1.2vw,10px)' }} />
        <TimelineFill />

        {jobs.map((job, i) => (
          <div key={i} data-reveal className="relative pb-[clamp(40px,5vw,56px)]">
            <span className="absolute top-[6px] w-3 h-3 rounded-full bg-[#09090b] border-2"
              style={{ left: 'calc(-1 * clamp(28px,5vw,52px) + clamp(2px,1vw,6px))', borderColor: 'var(--accent)', boxShadow: '0 0 0 4px rgba(255,92,56,.12)' }} />
            <div className="font-mono text-[12.5px] tracking-[.03em] mb-2" style={{ color: 'var(--accent)' }}>{job.period}</div>
            <h3 className="text-[clamp(20px,2.8vw,28px)] font-semibold tracking-[-0.01em] m-0 mb-1">{job.role}</h3>
            <div className="text-[15px] text-[rgba(244,244,243,0.7)] mb-4 font-medium">
              {job.company} <span className="text-[rgba(244,244,243,0.4)]">· {job.location}</span>
            </div>
            <ul className="m-0 p-0 list-none flex flex-col gap-[9px]">
              {job.points.map((pt, pi) => (
                <li key={pi} className="relative pl-[22px] text-[rgba(244,244,243,0.62)] text-[15px] leading-[1.55]">
                  <span className="absolute left-0 top-[0.55em] w-[6px] h-[6px] rounded-[2px]"
                    style={{ background: 'color-mix(in oklab, var(--accent) 70%, transparent)' }} />
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
