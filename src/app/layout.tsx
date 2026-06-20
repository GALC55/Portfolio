import type { ReactNode } from 'react';

// Required by Next.js — html/body are rendered by [locale]/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
