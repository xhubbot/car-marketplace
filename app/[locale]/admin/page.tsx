import { useTranslations } from 'next-intl';
import { ShieldAlert, Activity, Users, Car, AlertTriangle } from 'lucide-react';

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 space-y-1">
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">{label}</p>
      <p className="text-2xl font-extrabold text-white">{value}</p>
      <p className="text-xs text-neutral-500">{sub}</p>
    </div>
  );
}

export default function AdminPage() {
  const t = useTranslations('admin');

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page heading */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="h-6 w-6 text-red-400" />
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            {t('page.title')}
          </h1>
        </div>
        <p className="text-sm text-neutral-400">{t('page.description')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t('stats.listings')}  value="—" sub={t('stats.pending')} />
        <StatCard label={t('stats.users')}     value="—" sub={t('stats.registered')} />
        <StatCard label={t('stats.dealers')}   value="—" sub={t('stats.active')} />
        <StatCard label={t('stats.disputes')}  value="—" sub={t('stats.open')} />
      </div>

      {/* Notice banner */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-800/60 bg-amber-950/30 px-5 py-4">
        <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-amber-300">{t('notice.title')}</p>
          <p className="text-xs text-amber-500/80 leading-relaxed">{t('notice.body')}</p>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Car,      label: t('quick.listings'),  desc: t('quick.listingsDesc') },
          { icon: Users,    label: t('quick.users'),     desc: t('quick.usersDesc') },
          { icon: Activity, label: t('quick.analytics'), desc: t('quick.analyticsDesc') },
        ].map(({ icon: Icon, label, desc }) => (
          <div
            key={label}
            className="group rounded-xl border border-neutral-800 bg-neutral-900 p-5 hover:border-red-800/60 hover:bg-neutral-800/60 transition-colors cursor-pointer space-y-2"
          >
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-red-400" />
              <p className="text-sm font-bold text-white">{label}</p>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
