import { useTranslations } from 'next-intl';
import { Car, TrendingUp, MessageSquare, Eye, PlusCircle, ArrowRight } from 'lucide-react';

function MetricCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm space-y-1">
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">{label}</p>
      <p className="text-2xl font-extrabold text-neutral-900">{value}</p>
      <p className="text-xs text-blue-500 font-medium">{trend}</p>
    </div>
  );
}

export default function DealerPage() {
  const t = useTranslations('dealer');

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page heading */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Car className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900">
              {t('page.title')}
            </h1>
          </div>
          <p className="text-sm text-neutral-500">{t('page.description')}</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-sm">
          <PlusCircle className="h-4 w-4" />
          {t('page.addListing')}
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label={t('metrics.activeListing')} value="—" trend={t('metrics.thisMonth')} />
        <MetricCard label={t('metrics.totalViews')}    value="—" trend={t('metrics.last7days')} />
        <MetricCard label={t('metrics.leads')}         value="—" trend={t('metrics.newLeads')} />
        <MetricCard label={t('metrics.sold')}          value="—" trend={t('metrics.thisMonth')} />
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Car,          label: t('actions.inventory'),  desc: t('actions.inventoryDesc'),  color: 'blue' },
          { icon: Eye,          label: t('actions.leads'),      desc: t('actions.leadsDesc'),      color: 'emerald' },
          { icon: TrendingUp,   label: t('actions.reports'),    desc: t('actions.reportsDesc'),    color: 'violet' },
        ].map(({ icon: Icon, label, desc, color }) => (
          <div
            key={label}
            className="group flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition-all cursor-pointer space-y-3"
          >
            <div className="space-y-1.5">
              <div className={`inline-flex items-center justify-center h-8 w-8 rounded-lg bg-blue-50`}>
                <Icon className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-sm font-bold text-neutral-900">{label}</p>
              <p className="text-xs text-neutral-500 leading-relaxed">{desc}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:gap-2 transition-all">
              {t('actions.open')} <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        ))}
      </div>

      {/* Info strip */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-5 py-4">
        <div className="flex items-start gap-3">
          <MessageSquare className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-blue-800">{t('info.title')}</p>
            <p className="text-xs text-blue-600/80 leading-relaxed">{t('info.body')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
