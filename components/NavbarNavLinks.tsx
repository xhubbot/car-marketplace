'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { Home, ChevronDown } from 'lucide-react';

export default function NavbarNavLinks() {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;

  const homeHref = `/${locale}`;
  const dealersSearchHref = `/${locale}/dealer/search`;
  const dealersRegisterHref = `/${locale}/dealer/register`;

  const isHomeActive = pathname === homeHref;
  const isDealersActive = pathname?.startsWith(`/${locale}/dealer`);

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

      {/* Dealers — clicking the pill itself goes straight to the search page; hovering reveals the submenu */}
      <div className="relative group">
        <Link
          href={dealersSearchHref}
          className={`flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 ${
            isDealersActive
              ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white'
              : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          Dealers
          <ChevronDown className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
        </Link>

        {/* pt-2 keeps the gap to the trigger inside this element's hit box, so hover doesn't drop while crossing it */}
        <div className="hidden group-hover:block absolute left-0 top-full pt-2 z-50">
          <div className="min-w-47.5 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
            <Link
              href={dealersSearchHref}
              className="block rounded-lg px-3 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
            >
              Dealers
            </Link>
            <Link
              href={dealersRegisterHref}
              className="block rounded-lg px-3 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
            >
              Register as Dealer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
