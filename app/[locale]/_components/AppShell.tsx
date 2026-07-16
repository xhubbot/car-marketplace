'use client';

import { type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '../_context/ThemeContext';
import Footer from '@/components/Footer';

interface AppShellProps {
  children: ReactNode;
  locale: string;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isDashboard = /^\/[^/]+\/(admin|dealer)(\/|$)/.test(pathname ?? '');

  return (
    <SessionProvider>
      <ThemeProvider>
        {children}
        {!isDashboard && <Footer />}
      </ThemeProvider>
    </SessionProvider>
  );
}
