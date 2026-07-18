import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Car, LayoutGrid, FileText, MessageSquare, BarChart2, Bell, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface DealerLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

function DealerHeader({ locale }: { locale: string }) {
  const t = useTranslations('dealer.admin');

  const navItems = [
    { label: t('nav.overview'),   href: `/${locale}/dealer/admin` },
    { label: t('nav.inventory'),  href: `/${locale}/dealer/admin/inventory` },
    { label: t('nav.leads'),      href: `/${locale}/dealer/admin/leads` },
    { label: t('nav.reports'),    href: `/${locale}/dealer/admin/reports` },
  ];

  return (
    <header className="border-b border-blue-100 bg-white shadow-sm shrink-0">
      {/* Top bar */}
      <div className="flex h-14 items-center justify-between px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <Car className="h-5 w-5 text-blue-600 shrink-0" />
          <div>
            <p className="text-sm font-extrabold text-neutral-900 tracking-tight leading-none">autod.pro</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 leading-none mt-0.5">
              {t('brand')}
            </p>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <button className="relative rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-500" />
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors">
            <span className="h-6 w-6 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">D</span>
            {t('topbar.dealerAccount')}
            <ChevronDown className="h-3 w-3 text-neutral-400" />
          </button>
        </div>
      </div>

      {/* Sub-nav */}
      <nav className="flex gap-0 px-6 lg:px-8 overflow-x-auto">
        {navItems.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="shrink-0 border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-neutral-500 hover:border-blue-500 hover:text-blue-600 transition-colors"
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export default async function DealerLayout({ children, params }: DealerLayoutProps) {
  const { locale } = await params;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-neutral-50 text-neutral-900 font-sans">
      <DealerHeader locale={locale} />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
