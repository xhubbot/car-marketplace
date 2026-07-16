'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { Home } from 'lucide-react';

export default function NavbarNavLinks() {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;

  const homeHref = `/${locale}`;
  const dealersHref = `/${locale}/dealer-register`;

  const isHomeActive = pathname === homeHref;
  const isDealersActive = pathname?.startsWith(dealersHref);

  return (
    <div className="hidden md:flex items-center gap-1.5 rounded-full border border-neutral-200 p-1 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
      <Link
        href={homeHref}
        className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 ${
          isHomeActive
            ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white'
            : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
        }`}
      >
        <Home className="h-3.5 w-3.5" />
        Home
      </Link>

      <Link
        href={dealersHref}
        className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 ${
          isDealersActive
            ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white'
            : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
        }`}
      >
        Dealers
      </Link>
    </div>
  );
}
