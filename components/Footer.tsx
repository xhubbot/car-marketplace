'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Car } from 'lucide-react';

export default function Footer() {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <footer className="border-t border-neutral-200/80 bg-white dark:border-neutral-800/80 dark:bg-neutral-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4 text-emerald-500" />
          <span className="font-sans text-sm font-bold tracking-tight text-neutral-900 dark:text-white">
            autod<span className="text-emerald-500">.pro</span>
          </span>
        </div>

        <nav className="flex items-center gap-6 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          <Link href={`/${locale}`} className="hover:text-neutral-900 dark:hover:text-white">
            Home
          </Link>
          <Link href={`/${locale}/dealer/register`} className="hover:text-neutral-900 dark:hover:text-white">
            Dealers
          </Link>
          <Link href={`/${locale}/create`} className="hover:text-neutral-900 dark:hover:text-white">
            Sell Car
          </Link>
        </nav>

        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          &copy; {new Date().getFullYear()} autod.pro. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
