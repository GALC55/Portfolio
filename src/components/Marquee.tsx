const TECH = ['React','React Native','TypeScript','Node.js','PostgreSQL','Next.js','Expo','Python','Machine Learning','AdonisJS','Prisma','Google Cloud','Swift','Kotlin','Tailwind'];

export default function Marquee() {
  return (
    <div className="overflow-hidden border-t border-b border-white/[0.06] py-5 bg-white/[0.012]">
      <div className="flex w-max items-center animate-marquee">
        {[...TECH, ...TECH].map((item, i) => (
          <span key={i} className="inline-flex items-center font-mono text-[clamp(16px,2.4vw,26px)] font-medium text-[rgba(244,244,243,0.34)] whitespace-nowrap">
            {item}
            <span className="inline-block w-[7px] h-[7px] rounded-full mx-[clamp(20px,3vw,44px)] opacity-80" style={{ background: 'var(--accent)' }} />
          </span>
        ))}
      </div>
    </div>
  );
}
