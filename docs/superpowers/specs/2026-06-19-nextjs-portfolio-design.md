# Portfolio Next.js Migration — Design Spec
**Date:** 2026-06-19  
**Stack:** Next.js 15 App Router · TypeScript · Tailwind CSS v4 · next-intl · Cloudflare Pages

---

## 1. Overview

Migrate the single-file `index.html` portfolio to a Next.js 15 App Router project with:
- Static export (`output: 'export'`) for Cloudflare Pages
- i18n with separate routes `/es` and `/en` + language toggle in nav
- Tailwind CSS v4 for styling
- Minimal client JS — only where browser APIs are required

---

## 2. Project Structure

```
/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx        # HTML shell, fonts, metadata per locale
│   │   │   └── page.tsx          # Renders all sections in order
│   │   └── page.tsx              # Client redirect to /es or /en via navigator.language
│   ├── components/
│   │   ├── Nav.tsx               # 'use client' — lang toggle + responsive links
│   │   ├── Hero.tsx              # Server — static content wrapper
│   │   ├── HeroCanvas.tsx        # 'use client' — particle canvas
│   │   ├── RotatingWord.tsx      # 'use client' — setInterval word rotation
│   │   ├── Marquee.tsx           # Server — static tech strip
│   │   ├── Skills.tsx            # Server — skill cards grid
│   │   ├── Experience.tsx        # Server — timeline entries
│   │   ├── Education.tsx         # Server — education + language bars
│   │   ├── Contact.tsx           # Server — contact cards + references
│   │   └── Footer.tsx            # Server
│   ├── hooks/
│   │   └── useReveal.ts          # 'use client' — IntersectionObserver reveal
│   ├── messages/
│   │   ├── es.json               # All Spanish strings + data arrays
│   │   └── en.json               # All English strings + data arrays
│   └── i18n/
│       ├── routing.ts            # locales: ['es','en'], defaultLocale: 'es'
│       └── request.ts            # next-intl server config
├── public/
│   └── _redirects               # Cloudflare fallback: / → /es
├── next.config.ts               # output:'export', next-intl plugin, images unoptimized
├── tailwind.config.ts
└── middleware.ts                # next-intl middleware (dev only, no-op in static export)
```

---

## 3. i18n

**Routing:** `next-intl` with `locales: ['es', 'en']`, `defaultLocale: 'es'`.

**Language detection flow:**
1. User visits `gustavo.dev/`
2. `app/page.tsx` (client component) reads `navigator.language`, pushes to `/es` or `/en`
3. Cloudflare `_redirects` provides instant fallback: `/ /es 302`
4. Nav toggle calls `router.push('/en')` or `router.push('/es')`

**Translations:** `useTranslations('section')` in each component. Arrays (jobs, skillGroups, education, references) live in `messages/*.json` as typed objects.

**SEO:**
- `[locale]/layout.tsx` sets `<html lang={locale}>` and correct `metadata.alternates.languages`
- `hreflang` canonical links in `<head>`

---

## 4. Component Strategy

| Component | Type | Reason |
|---|---|---|
| Nav | `'use client'` | `useRouter` for lang switch, `usePathname`, responsive matchMedia |
| HeroCanvas | `'use client'` | `canvas`, `requestAnimationFrame`, `window` |
| RotatingWord | `'use client'` | `setInterval`, state |
| All section wrappers | Server | Pure HTML output, no browser APIs |
| useReveal hook | `'use client'` | `IntersectionObserver`, `data-reveal` pattern |

Client wrappers are leaf nodes — they receive translated strings as props from server parents, keeping the server/client boundary clean.

---

## 5. Styling

- **Tailwind CSS v4** — utility classes replace all inline styles from `index.html`
- CSS variables for accent color (`--accent: #ff5c38`) on `:root`
- Custom animations defined in `tailwind.config.ts` (fadeUp, wordIn, marquee, floatGlow, bobDown)
- `@layer base` for scrollbar, `::selection`, `[data-reveal]` transition styles

---

## 6. Animations (preserved from index.html)

All animations from the original implementation are preserved:
- Particle canvas (hero background)
- Scroll progress bar
- Timeline fill (experience section)
- IntersectionObserver reveals with `data-reveal`
- Count-up stats
- Rotating word (hero)
- Tilt effect on skill cards
- Cursor glow
- Language bar fill animation
- Marquee strip

---

## 7. Deploy — Cloudflare Pages

**Build:**
```
Build command:  npm run build
Output dir:     out
Node version:   20
```

**next.config.ts:**
```ts
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
}
```

**`public/_redirects`:**
```
/  /es  302
```

**CI:** GitHub → Cloudflare Pages auto-deploy on push to `main`.

---

## 8. Out of Scope (for now)

- Blog / CMS
- Contact form backend
- Project case studies
- Dark/light theme toggle
- Analytics
