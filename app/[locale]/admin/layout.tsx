import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { LayoutDashboard, Users, Car, BarChart2, Settings, ShieldAlert, LogOut } from 'lucide-react';
import Link from 'next/link';

interface AdminLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

function AdminSidebar({ locale }: { locale: string }) {
  const t = useTranslations('admin');

  const navItems = [
    { icon: LayoutDashboard, label: t('nav.dashboard'), href: `/${locale}/admin` },
    { icon: Car,             label: t('nav.listings'),  href: `/${locale}/admin/listings` },
    { icon: Users,           label: t('nav.users'),     href: `/${locale}/admin/users` },
    { icon: BarChart2,       label: t('nav.analytics'), href: `/${locale}/admin/analytics` },
    { icon: Settings,        label: t('nav.settings'),  href: `/${locale}/admin/settings` },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col justify-between bg-neutral-950 border-r border-neutral-800 shrink-0">
      {/* Brand */}
      <div>
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-neutral-800">
          <ShieldAlert className="h-5 w-5 text-red-400 shrink-0" />
          <div>
            <p className="text-sm font-bold text-white tracking-tight">autod.pro</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-red-400">
              {t('brand')}
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="mt-4 px-3 space-y-0.5">
          {navItems.map(({ icon: Icon, label, href }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom */}
      <div className="px-3 pb-5 border-t border-neutral-800 pt-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-500 hover:bg-neutral-800 hover:text-white transition-colors">
          <LogOut className="h-4 w-4 shrink-0" />
          {t('nav.logout')}
        </button>
      </div>
    </aside>
  );
}

function AdminTopbar() {
  const t = useTranslations('admin');
  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 shrink-0">
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        {t('topbar.section')}
      </p>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-950/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-400">
          <ShieldAlert className="h-3 w-3" />
          {t('topbar.badge')}
        </span>
      </div>
    </header>
  );
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const { locale } = await params;

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-900 text-neutral-100 font-sans">
      <AdminSidebar locale={locale} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
