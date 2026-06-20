# Portfolio Next.js Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the single-file `index.html` portfolio to a Next.js 15 App Router project with static export, i18n (`/es` / `/en`), Tailwind CSS v4, and Cloudflare Pages deploy.

**Architecture:** App Router with `[locale]` dynamic segment. `next-intl` handles routing and translation lookup. `output: 'export'` produces a static `out/` folder. Client components are leaf nodes only — server components pass translated strings as props.

**Tech Stack:** Next.js 15 · TypeScript 5 · Tailwind CSS v4 · next-intl 3 · Cloudflare Pages

## Global Constraints

- Node ≥ 20
- Next.js 15 App Router only — no Pages Router
- `output: 'export'` — no server-side runtime
- `images: { unoptimized: true }` — Cloudflare Pages has no image optimizer
- Accent color CSS variable: `--accent: #ff5c38`
- Fonts: Space Grotesk (weights 300/400/500/600/700) + JetBrains Mono (weights 400/500/700) via Google Fonts
- Locales: `['es', 'en']`, defaultLocale: `'es'`
- All translatable strings live in `src/messages/es.json` and `src/messages/en.json` — no hardcoded text in components
- `'use client'` only on leaf components that require browser APIs

---

## File Map

```
src/
├── app/
│   ├── page.tsx                        # Client redirect root → /es or /en
│   ├── [locale]/
│   │   ├── layout.tsx                  # HTML shell, fonts, metadata, hreflang
│   │   └── page.tsx                    # Assembles all section components
│   └── globals.css                     # Base styles, scrollbar, data-reveal, CSS vars
├── components/
│   ├── Nav.tsx                         # 'use client' — lang toggle, responsive links
│   ├── ScrollProgress.tsx              # 'use client' — fixed top progress bar
│   ├── CursorGlow.tsx                  # 'use client' — radial cursor follower
│   ├── Hero.tsx                        # Server — hero wrapper + static content
│   ├── HeroCanvas.tsx                  # 'use client' — particle canvas
│   ├── RotatingWord.tsx                # 'use client' — setInterval word rotation
│   ├── Marquee.tsx                     # Server — tech strip
│   ├── Skills.tsx                      # Server — skill cards grid
│   ├── Experience.tsx                  # Server — timeline entries wrapper
│   ├── TimelineFill.tsx                # 'use client' — scroll-driven timeline bar
│   ├── Education.tsx                   # Server — education cards + lang bars wrapper
│   ├── LangBars.tsx                    # 'use client' — animated language bars
│   ├── Contact.tsx                     # Server — contact cards + references
│   └── Footer.tsx                      # Server — footer
├── hooks/
│   └── useReveal.ts                    # 'use client' — IntersectionObserver reveal + count-up
├── messages/
│   ├── es.json                         # All Spanish strings + data arrays
│   └── en.json                         # All English strings + data arrays
└── i18n/
    ├── routing.ts                      # Locales config
    └── request.ts                      # next-intl server config

Root:
├── next.config.ts                      # output:'export', next-intl plugin, images
├── tailwind.config.ts                  # Custom animations, font families
├── middleware.ts                       # next-intl middleware (dev redirect)
└── public/
    └── _redirects                      # Cloudflare: / → /es 302
```

---

### Task 1: Project scaffold + next-intl config

**Files:**
- Create: `next.config.ts`
- Create: `middleware.ts`
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/request.ts`
- Create: `public/_redirects`
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: `routing` export from `src/i18n/routing.ts` consumed by middleware and all locale-aware components

- [ ] **Step 1: Scaffold Next.js project**

Run inside `/Users/galc55/Documents/Propios/Pagina_portfolio`:
```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir --no-turbopack --import-alias "@/*" --yes
```
Expected: project files created, `package.json` present.

- [ ] **Step 2: Install next-intl**

```bash
npm install next-intl
```

- [ ] **Step 3: Write `src/i18n/routing.ts`**

```ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
});
```

- [ ] **Step 4: Write `src/i18n/request.ts`**

```ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as 'es' | 'en')) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 5: Write `middleware.ts`**

```ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
```

- [ ] **Step 6: Write `next.config.ts`**

```ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 7: Write `public/_redirects`**

```
/  /es  302
```

- [ ] **Step 8: Write `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to:   { opacity: '1', transform: 'none' },
        },
        wordIn: {
          from: { opacity: '0', transform: 'translateY(16px) rotateX(-40deg)', filter: 'blur(6px)' },
          to:   { opacity: '1', transform: 'none', filter: 'blur(0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        floatGlow: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '50%':     { transform: 'translate(40px,-30px) scale(1.12)' },
        },
        floatGlow2: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '50%':     { transform: 'translate(-50px,40px) scale(1.18)' },
        },
        bobDown: {
          '0%,100%': { transform: 'translateY(0)', opacity: '0.6' },
          '50%':     { transform: 'translateY(9px)', opacity: '1' },
        },
      },
      animation: {
        fadeUp:    'fadeUp .8s cubic-bezier(.16,1,.3,1) both',
        wordIn:    'wordIn .6s cubic-bezier(.16,1,.3,1) both',
        marquee:   'marquee 34s linear infinite',
        floatGlow: 'floatGlow 14s ease-in-out infinite',
        floatGlow2:'floatGlow2 18s ease-in-out infinite',
        bobDown:   'bobDown 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 9: Write `src/app/globals.css`**

```css
@import "tailwindcss";

:root {
  --accent: #ff5c38;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; background: #09090b; }

::selection { background: var(--accent); color: #09090b; }

::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: #09090b; }
::-webkit-scrollbar-thumb { background: #2a2a2e; border-radius: 6px; border: 2px solid #09090b; }
::-webkit-scrollbar-thumb:hover { background: #3a3a40; }

[data-reveal] {
  opacity: 0;
  transform: translateY(34px);
  transition: opacity 1s cubic-bezier(.16,1,.3,1), transform 1s cubic-bezier(.16,1,.3,1);
}
[data-reveal].in {
  opacity: 1;
  transform: none;
}
```

- [ ] **Step 10: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors (or only missing-message-file errors — acceptable until Task 2).

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 15 + next-intl + Tailwind config"
```

---

### Task 2: Translation files (messages)

**Files:**
- Create: `src/messages/es.json`
- Create: `src/messages/en.json`

**Interfaces:**
- Produces: typed JSON consumed by `useTranslations()` in all components
- Shape: `{ nav, avail, kicker, heroBuild, heroLead, ctaPrimary, ctaSecondary, scroll, stats[], skillsTitle, skillsSub, skillGroups[], expTitle, expSub, experience[], eduTitle, langTitle, education[], languages[], contactTitle, contactSub, email, phone, loc, refTitle, references[], footer }`

- [ ] **Step 1: Write `src/messages/es.json`**

```json
{
  "nav": { "skills": "Skills", "exp": "Experiencia", "edu": "Educación", "contact": "Contacto" },
  "avail": "Disponible para proyectos",
  "kicker": "// Ingeniero de Software · Desarrollador Fullstack",
  "heroBuild": "Construyo con",
  "heroLead": "Más de 5 años creando aplicaciones web y móviles de alto rendimiento — del modelo de datos a la interfaz.",
  "ctaPrimary": "Contáctame",
  "ctaSecondary": "Ver experiencia",
  "scroll": "SCROLL",
  "stats": [
    { "n": 5, "suf": "+", "l": "Años de experiencia" },
    { "n": 4, "suf": "",  "l": "Empresas" },
    { "n": 20,"suf": "+", "l": "Tecnologías" }
  ],
  "skillsTitle": "Stack técnico",
  "skillsSub": "Las herramientas con las que construyo producto a diario.",
  "skillGroups": [
    { "label": "Lenguajes",       "items": ["Java","JavaScript","TypeScript","Python","SQL"] },
    { "label": "Frontend",        "items": ["React","Next.js","HTML","CSS","Tailwind CSS"] },
    { "label": "Mobile",          "items": ["React Native","Expo","Swift","Kotlin"] },
    { "label": "Backend",         "items": ["Node.js","AdonisJS","Koa","Prisma","Strapi"] },
    { "label": "Bases de Datos",  "items": ["PostgreSQL","SQL Server"] },
    { "label": "Datos & ML",      "items": ["Machine Learning","Análisis de Datos","Power BI"] },
    { "label": "Cloud & DevOps",  "items": ["Google Cloud","Git","CI/CD"] }
  ],
  "expTitle": "Experiencia",
  "expSub": "Una trayectoria construyendo producto real.",
  "experience": [
    {
      "period": "Feb 2026 — Presente",
      "role": "Desarrollador Fullstack Mobile",
      "company": "QOR DEV",
      "location": "Las Vegas, EE.UU.",
      "points": [
        "Apps móviles multiplataforma iOS / Android con React Native y Expo.",
        "APIs REST con Node.js y AdonisJS.",
        "Diseño y optimización de bases de datos PostgreSQL.",
        "Integración de servicios backend en entornos productivos."
      ]
    },
    {
      "period": "Dic 2024 — Dic 2025",
      "role": "Desarrollador Fullstack Mobile",
      "company": "Wayru",
      "location": "Guayaquil, Ecuador",
      "points": [
        "Apps iOS / Android con React Native.",
        "Módulos nativos en Swift y Kotlin.",
        "Backend con Prisma, Koa y Strapi.",
        "Gestión y mantenimiento de bases de datos PostgreSQL."
      ]
    },
    {
      "period": "Ene 2024 — Ene 2025",
      "role": "Desarrollador Fullstack",
      "company": "Navvi",
      "location": "Guayaquil, Ecuador",
      "points": [
        "Apps móviles iOS / Android.",
        "APIs para consumo y procesamiento de datos.",
        "Aplicaciones web orientadas a e-commerce.",
        "Integración de servicios externos y optimización de UX."
      ]
    },
    {
      "period": "Dic 2020 — Dic 2023",
      "role": "Desarrollador Fullstack",
      "company": "Universidad Ecotec",
      "location": "Samborondón, Ecuador",
      "points": [
        "Modelos de Machine Learning para análisis y predicción.",
        "APIs con modelos de ML desplegadas en Google Cloud.",
        "Dashboards y KPIs para la toma de decisiones.",
        "Proyectos de innovación y transformación digital."
      ]
    }
  ],
  "eduTitle": "Educación",
  "langTitle": "Idiomas",
  "education": [
    { "degree": "Maestría en Análisis de Datos",  "school": "Universidad Internacional de La Rioja (UNIR), España", "year": "2025" },
    { "degree": "Ingeniería de Software",          "school": "Universidad Ecotec, Ecuador",                          "year": "2023" }
  ],
  "languages": [
    { "name": "Español", "level": "Nativo",             "pct": 100 },
    { "name": "Inglés",  "level": "B2 · Intermedio alto","pct": 75  }
  ],
  "contactTitle": "Trabajemos juntos",
  "contactSub": "¿Tienes un proyecto en mente? Hablemos.",
  "email": "Email",
  "phone": "Teléfono",
  "loc": "Ubicación",
  "refTitle": "Referencias",
  "references": [
    { "name": "Ing. Alejandro Camacaro", "email": "alejandrocamacaro91@gmail.com", "phone": "+58 412 054 6320" },
    { "name": "Ing. Jorge Berrezueta",   "email": "jorge@navvi.studio",             "phone": "+593 96 978 7672" },
    { "name": "Ing. Daniel Velásquez",   "email": "danvelc6@gmail.com",             "phone": "+593 99 372 4012" }
  ],
  "footer": "Hecho con código y café"
}
```

- [ ] **Step 2: Write `src/messages/en.json`**

```json
{
  "nav": { "skills": "Skills", "exp": "Experience", "edu": "Education", "contact": "Contact" },
  "avail": "Available for projects",
  "kicker": "// Software Engineer · Fullstack Developer",
  "heroBuild": "I build with",
  "heroLead": "5+ years crafting high-performance web & mobile applications — from the data model all the way to the interface.",
  "ctaPrimary": "Get in touch",
  "ctaSecondary": "View experience",
  "scroll": "SCROLL",
  "stats": [
    { "n": 5, "suf": "+", "l": "Years of experience" },
    { "n": 4, "suf": "",  "l": "Companies" },
    { "n": 20,"suf": "+", "l": "Technologies" }
  ],
  "skillsTitle": "Tech stack",
  "skillsSub": "The tools I use to ship product every day.",
  "skillGroups": [
    { "label": "Languages",     "items": ["Java","JavaScript","TypeScript","Python","SQL"] },
    { "label": "Frontend",      "items": ["React","Next.js","HTML","CSS","Tailwind CSS"] },
    { "label": "Mobile",        "items": ["React Native","Expo","Swift","Kotlin"] },
    { "label": "Backend",       "items": ["Node.js","AdonisJS","Koa","Prisma","Strapi"] },
    { "label": "Databases",     "items": ["PostgreSQL","SQL Server"] },
    { "label": "Data & ML",     "items": ["Machine Learning","Data Analysis","Power BI"] },
    { "label": "Cloud & DevOps","items": ["Google Cloud","Git","CI/CD"] }
  ],
  "expTitle": "Experience",
  "expSub": "A track record of shipping real product.",
  "experience": [
    {
      "period": "Feb 2026 — Present",
      "role": "Fullstack Mobile Developer",
      "company": "QOR DEV",
      "location": "Las Vegas, USA",
      "points": [
        "Cross-platform iOS / Android apps with React Native & Expo.",
        "REST APIs with Node.js & AdonisJS.",
        "PostgreSQL database design & optimization.",
        "Backend service integration in production environments."
      ]
    },
    {
      "period": "Dec 2024 — Dec 2025",
      "role": "Fullstack Mobile Developer",
      "company": "Wayru",
      "location": "Guayaquil, Ecuador",
      "points": [
        "iOS / Android apps with React Native.",
        "Native modules in Swift & Kotlin.",
        "Backend with Prisma, Koa & Strapi.",
        "PostgreSQL database management & maintenance."
      ]
    },
    {
      "period": "Jan 2024 — Jan 2025",
      "role": "Fullstack Developer",
      "company": "Navvi",
      "location": "Guayaquil, Ecuador",
      "points": [
        "Mobile iOS / Android apps.",
        "APIs for data consumption & processing.",
        "Web applications for e-commerce.",
        "Third-party service integration & UX optimization."
      ]
    },
    {
      "period": "Dec 2020 — Dec 2023",
      "role": "Fullstack Developer",
      "company": "Universidad Ecotec",
      "location": "Samborondón, Ecuador",
      "points": [
        "Machine Learning models for analysis & prediction.",
        "APIs serving ML models deployed on Google Cloud.",
        "Dashboards & KPIs for decision-making.",
        "Innovation & digital transformation projects."
      ]
    }
  ],
  "eduTitle": "Education",
  "langTitle": "Languages",
  "education": [
    { "degree": "Master's in Data Analytics", "school": "Universidad Internacional de La Rioja (UNIR), Spain", "year": "2025" },
    { "degree": "Software Engineering",        "school": "Universidad Ecotec, Ecuador",                         "year": "2023" }
  ],
  "languages": [
    { "name": "Spanish", "level": "Native",              "pct": 100 },
    { "name": "English", "level": "B2 · Upper intermediate","pct": 75  }
  ],
  "contactTitle": "Let's work together",
  "contactSub": "Have a project in mind? Let's talk.",
  "email": "Email",
  "phone": "Phone",
  "loc": "Location",
  "refTitle": "References",
  "references": [
    { "name": "Alejandro Camacaro", "email": "alejandrocamacaro91@gmail.com", "phone": "+58 412 054 6320" },
    { "name": "Jorge Berrezueta",   "email": "jorge@navvi.studio",             "phone": "+593 96 978 7672" },
    { "name": "Daniel Velásquez",   "email": "danvelc6@gmail.com",             "phone": "+593 99 372 4012" }
  ],
  "footer": "Built with code and coffee"
}
```

- [ ] **Step 3: Verify TypeScript picks up messages**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/messages/
git commit -m "feat: add ES/EN translation files"
```

---

### Task 3: Root redirect + locale layout

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/app/[locale]/layout.tsx`

**Interfaces:**
- Consumes: `routing` from `src/i18n/routing.ts`
- Produces: `RootLayout` wrapping all locale pages with correct `<html lang>`, fonts, and metadata

- [ ] **Step 1: Write `src/app/page.tsx`**

```tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    const lang = navigator.language.startsWith('es') ? 'es' : 'en';
    router.replace(`/${lang}`);
  }, [router]);
  return null;
}
```

- [ ] **Step 2: Write `src/app/[locale]/layout.tsx`**

> **Important:** `NextIntlClientProvider` is required so that `useTranslations()` works inside `'use client'` components (`Nav`, `LangBars`, etc.). Without it, the hook throws at runtime.

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import '../globals.css';

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs
      ? 'Gustavo Lemos · Desarrollador Fullstack'
      : 'Gustavo Lemos · Fullstack Developer',
    description: isEs
      ? 'Desarrollador Fullstack con más de 5 años de experiencia en React Native, Node.js, TypeScript y PostgreSQL.'
      : 'Fullstack Developer with 5+ years of experience in React Native, Node.js, TypeScript and PostgreSQL.',
    alternates: {
      canonical: `https://gustavo.dev/${locale}`,
      languages: { es: 'https://gustavo.dev/es', en: 'https://gustavo.dev/en' },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'es' | 'en')) notFound();
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#09090b] text-[#f4f4f3] font-sans antialiased overflow-x-hidden">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify build compiles**

```bash
npm run build
```
Expected: build succeeds, `out/` generated with `es/index.html` and `en/index.html`.

- [ ] **Step 4: Commit**

```bash
git add src/app/
git commit -m "feat: root redirect + locale layout with metadata and hreflang"
```

---

### Task 4: Global client wrappers (ScrollProgress + CursorGlow)

**Files:**
- Create: `src/components/ScrollProgress.tsx`
- Create: `src/components/CursorGlow.tsx`

**Interfaces:**
- Produces: `<ScrollProgress />` and `<CursorGlow />` — drop into locale layout, no props

- [ ] **Step 1: Write `src/components/ScrollProgress.tsx`**

```tsx
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
```

- [ ] **Step 2: Write `src/components/CursorGlow.tsx`**

```tsx
'use client';
import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer:coarse)').matches) return;
    const glow = glowRef.current;
    if (!glow) return;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    let raf: number | null = null;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX; ty = e.clientY;
      glow.style.opacity = '1';
      if (!raf) {
        const run = () => {
          cx += (tx - cx) * 0.16;
          cy += (ty - cy) * 0.16;
          glow.style.transform = `translate(${cx}px,${cy}px)`;
          if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) {
            raf = requestAnimationFrame(run);
          } else {
            raf = null;
          }
        };
        raf = requestAnimationFrame(run);
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 w-[480px] h-[480px] -mt-60 -ml-60 rounded-full pointer-events-none z-[1] opacity-0 transition-opacity duration-[400ms]"
      style={{
        background: 'radial-gradient(circle, color-mix(in oklab, var(--accent) 22%, transparent) 0%, transparent 60%)',
        mixBlendMode: 'screen',
      }}
    />
  );
}
```

- [ ] **Step 3: Add both to `src/app/[locale]/layout.tsx` body**

In `LocaleLayout`, after `{children}`, add:
```tsx
import ScrollProgress from '@/components/ScrollProgress';
import CursorGlow from '@/components/CursorGlow';
// ...
<body ...>
  <ScrollProgress />
  <CursorGlow />
  {children}
</body>
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/ScrollProgress.tsx src/components/CursorGlow.tsx src/app/
git commit -m "feat: scroll progress bar + cursor glow client components"
```

---

### Task 5: useReveal hook

**Files:**
- Create: `src/hooks/useReveal.ts`

**Interfaces:**
- Produces: `useReveal(): void` — call once on mount; queries `[data-reveal]` elements, observes them, adds `.in` class, triggers `data-count` count-up and `data-bar` width animations on entry

- [ ] **Step 1: Write `src/hooks/useReveal.ts`**

```ts
'use client';
import { useEffect } from 'react';

function animateCount(el: HTMLElement) {
  if (el.dataset.done === '1') return;
  el.dataset.done = '1';
  const target = parseInt(el.dataset.count ?? '0', 10);
  const dur = 1400;
  const start = performance.now();
  const tick = (now: number) => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased).toString();
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]');

    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => {
        el.classList.add('in');
        el.querySelectorAll<HTMLElement>('[data-bar]').forEach((b) => {
          b.style.width = (b.dataset.bar ?? '0') + '%';
        });
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const target = en.target as HTMLElement;
          target.classList.add('in');
          target.querySelectorAll<HTMLElement>('[data-count]').forEach(animateCount);
          target.querySelectorAll<HTMLElement>('[data-bar]').forEach((b) => {
            b.style.width = (b.dataset.bar ?? '0') + '%';
          });
          io.unobserve(target);
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useReveal.ts
git commit -m "feat: useReveal hook with IntersectionObserver, count-up and bar animations"
```

---

### Task 6: Nav component

**Files:**
- Create: `src/components/Nav.tsx`

**Interfaces:**
- Consumes: `useTranslations('nav')` keys: `skills`, `exp`, `edu`, `contact`
- Produces: `<Nav />` — no props, reads locale from `useLocale()`

- [ ] **Step 1: Write `src/components/Nav.tsx`**

```tsx
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
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.tsx
git commit -m "feat: Nav component with locale toggle and responsive links"
```

---

### Task 7: Hero section (HeroCanvas + RotatingWord + Hero)

**Files:**
- Create: `src/components/HeroCanvas.tsx`
- Create: `src/components/RotatingWord.tsx`
- Create: `src/components/Hero.tsx`

**Interfaces:**
- `Hero` consumes: `useTranslations` keys `avail`, `kicker`, `heroBuild`, `heroLead`, `ctaPrimary`, `ctaSecondary`, `scroll`, `stats[]`
- `HeroCanvas` props: none
- `RotatingWord` props: none

- [ ] **Step 1: Write `src/components/HeroCanvas.tsx`**

```tsx
'use client';
import { useEffect, useRef } from 'react';

const WORDS = ['React Native','Node.js','PostgreSQL','TypeScript','Machine Learning','Next.js'];

interface Particle { x:number; y:number; vx:number; vy:number; r:number; }

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };
    let parts: Particle[] = [];
    let raf: number;
    let W = 0, H = 0;
    let alive = true;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const target = Math.min(86, Math.floor(W * H / 13000));
      parts = Array.from({ length: target }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .32, vy: (Math.random() - .5) * .32,
        r: Math.random() * 1.8 + .6,
      }));
    };
    window.addEventListener('resize', resize);
    resize();

    const onMove = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    const draw = () => {
      if (!alive) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 140 && d > 0) { const f = (140 - d) / 140 * 1.4; p.x += dx / d * f; p.y += dy / d * f; }
      }
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const a = parts[i], b = parts[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 124) {
            const al = (1 - dist / 124) * .5;
            ctx.strokeStyle = `rgba(255,92,56,${al.toFixed(3)})`;
            ctx.lineWidth = .7;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const p of parts) {
        const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = dm < 140 ? 'rgba(255,92,56,.9)' : 'rgba(244,244,243,.45)';
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0" />;
}

export { WORDS };
```

- [ ] **Step 2: Write `src/components/RotatingWord.tsx`**

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { WORDS } from './HeroCanvas';

export default function RotatingWord() {
  const [index, setIndex] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % WORDS.length);
      setKey((k) => k + 1);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      key={key}
      className="text-[var(--accent)] inline-block font-semibold whitespace-nowrap animate-wordIn"
    >
      {WORDS[index]}
    </span>
  );
}
```

- [ ] **Step 3: Write `src/components/Hero.tsx`**

```tsx
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
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/HeroCanvas.tsx src/components/RotatingWord.tsx src/components/Hero.tsx
git commit -m "feat: Hero section with particle canvas and rotating word"
```

---

### Task 8: Marquee + Skills

**Files:**
- Create: `src/components/Marquee.tsx`
- Create: `src/components/Skills.tsx`

**Interfaces:**
- `Marquee`: no props, static list
- `Skills` consumes: `useTranslations` keys `skillsTitle`, `skillsSub`, `skillGroups[]`

- [ ] **Step 1: Write `src/components/Marquee.tsx`**

```tsx
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
```

- [ ] **Step 2: Write `src/components/Skills.tsx`**

```tsx
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
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/Marquee.tsx src/components/Skills.tsx
git commit -m "feat: Marquee strip + Skills section"
```

---

### Task 9: Experience section + TimelineFill

**Files:**
- Create: `src/components/Experience.tsx`
- Create: `src/components/TimelineFill.tsx`

**Interfaces:**
- `TimelineFill`: no props — reads `#experience` section position on scroll
- `Experience` consumes: `useTranslations` keys `expTitle`, `expSub`, `experience[]`

- [ ] **Step 1: Write `src/components/TimelineFill.tsx`**

```tsx
'use client';
import { useEffect, useRef } from 'react';

export default function TimelineFill() {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const sec = document.getElementById('experience');
      const fill = fillRef.current;
      if (!sec || !fill) return;
      const r = sec.getBoundingClientRect();
      const frac = (window.innerHeight * 0.55 - r.top) / r.height;
      fill.style.height = Math.max(0, Math.min(frac, 1)) * 100 + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      ref={fillRef}
      className="absolute top-1 w-[2px] h-0 transition-[height_.12s_linear]"
      style={{ left: 'clamp(6px,1.2vw,10px)', background: 'var(--accent)', boxShadow: '0 0 12px var(--accent)' }}
    />
  );
}
```

- [ ] **Step 2: Write `src/components/Experience.tsx`**

```tsx
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
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/Experience.tsx src/components/TimelineFill.tsx
git commit -m "feat: Experience timeline + scroll-driven fill"
```

---

### Task 10: Education + LangBars

**Files:**
- Create: `src/components/LangBars.tsx`
- Create: `src/components/Education.tsx`

**Interfaces:**
- `LangBars` props: `langs: Array<{ name: string; level: string; pct: number }>`
- `Education` consumes: `useTranslations` keys `eduTitle`, `langTitle`, `education[]`, `languages[]`

- [ ] **Step 1: Write `src/components/LangBars.tsx`**

```tsx
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
```

- [ ] **Step 2: Write `src/components/Education.tsx`**

```tsx
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
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/Education.tsx src/components/LangBars.tsx
git commit -m "feat: Education + animated language bars"
```

---

### Task 11: Contact + Footer

**Files:**
- Create: `src/components/Contact.tsx`
- Create: `src/components/Footer.tsx`

**Interfaces:**
- `Contact` consumes: `useTranslations` keys `contactTitle`, `contactSub`, `email`, `phone`, `loc`, `refTitle`, `references[]`
- `Footer` consumes: `useTranslations` keys `footer`

- [ ] **Step 1: Write `src/components/Contact.tsx`**

```tsx
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
```

- [ ] **Step 2: Write `src/components/Footer.tsx`**

```tsx
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
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/Contact.tsx src/components/Footer.tsx
git commit -m "feat: Contact section + Footer"
```

---

### Task 12: Assemble main page + wire useReveal

**Files:**
- Modify: `src/app/[locale]/page.tsx`

**Interfaces:**
- Consumes: all components from Tasks 4–11
- `useReveal` must be called once at page level to observe all `[data-reveal]` elements

- [ ] **Step 1: Write `src/app/[locale]/page.tsx`**

```tsx
'use client';
import { useReveal } from '@/hooks/useReveal';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Education from '@/components/Education';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Page() {
  useReveal();
  return (
    <div id="top" className="relative bg-[#09090b] text-[#f4f4f3] font-sans text-[18px] leading-[1.5] overflow-x-hidden antialiased">
      <Nav />
      <Hero />
      <Marquee />
      <Skills />
      <Experience />
      <Education />
      <Contact />
      <Footer />
    </div>
  );
}
```

> **Note:** Making the page a client component to use `useReveal`. Server components (`Hero`, `Skills`, etc.) remain server-rendered — Next.js renders them on the server and hydrates the client wrapper.

- [ ] **Step 2: Remove auto-generated placeholder page if present**

Delete any auto-generated content inside `src/app/[locale]/page.tsx` that may conflict with Step 1.

- [ ] **Step 3: Full build + preview**

```bash
npm run build && npx serve out
```
Open `http://localhost:3000/es` and `http://localhost:3000/en`. Verify:
- All sections render
- Language toggle navigates between `/es` and `/en`
- Particles animate
- Scroll progress fills
- Reveals trigger on scroll
- Count-up stats animate
- Language bars fill on entry

- [ ] **Step 4: Commit**

```bash
git add src/app/
git commit -m "feat: assemble full page — all sections wired with useReveal"
```

---

### Task 13: Cloudflare Pages deploy

**Files:**
- Already created: `public/_redirects`

**Interfaces:**
- No code changes — configuration only

- [ ] **Step 1: Push repo to GitHub**

```bash
git remote add origin https://github.com/<your-username>/portfolio.git
git push -u origin main
```

- [ ] **Step 2: Create Cloudflare Pages project**

1. Go to Cloudflare Dashboard → Workers & Pages → Create
2. Connect GitHub repo
3. Set build settings:
   - **Framework preset:** Next.js (Static HTML Export)
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
   - **Node.js version:** `20`
4. Click **Save and Deploy**

- [ ] **Step 3: Verify deploy**

After build completes:
- Visit `<project>.pages.dev/` → should redirect to `/es`
- Visit `<project>.pages.dev/en` → English version
- Language toggle works

- [ ] **Step 4: Commit deploy confirmation**

```bash
git commit --allow-empty -m "chore: Cloudflare Pages deploy configured"
```
