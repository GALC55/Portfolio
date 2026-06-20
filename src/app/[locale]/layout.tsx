import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
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
  setRequestLocale(locale);
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
  // Required for static export: tells next-intl the locale without reading headers
  setRequestLocale(locale);
  // Static export: import messages directly instead of getMessages() which reads headers
  const messages = (await import(`@/messages/${locale}.json`)).default;
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
