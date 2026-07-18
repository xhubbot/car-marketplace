'use client'

import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Select from 'react-select'
import { Building2, MapPin } from 'lucide-react'
import { useLookups } from '@/hooks/useLookups'
import { useMakes } from '@/hooks/useMakes'
import { useDealersSearch } from '@/hooks/useDealersSearch'

const selectStyles = {
  control: (base: object, state: { isFocused: boolean }) => ({
    ...base,
    borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 2px #bfdbfe' : 'none',
    borderRadius: '0.5rem',
    minHeight: '42px',
    '&:hover': { borderColor: '#3b82f6' },
  }),
  option: (base: object, state: { isSelected: boolean; isFocused: boolean }) => ({
    ...base,
    backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#eff6ff' : 'white',
    color: state.isSelected ? 'white' : '#111827',
  }),
  groupHeading: (base: object) => ({
    ...base,
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    color: '#6b7280',
    paddingTop: '6px',
  }),
}

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
      {label}
    </span>
  )
}

export function DealersDirectory() {
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('dealer.search')
  const { dealerCategories, isLoading: lookupsLoading } = useLookups(locale)
  const { makes, isLoading: makesLoading } = useMakes()
  const { dealers, total, page, filters, isLoading, error, setFilters, setPage, clearFilters } = useDealersSearch(locale)

  const selectedCategories = dealerCategories
    .flatMap(g => g.options)
    .filter(o => filters.categoryIds.includes(o.value))
  const selectedMakes = makes.filter(m => filters.makeIds.includes(m.value))

  const pageCount = Math.max(1, Math.ceil(total / 20))
  const hasActiveFilters =
    filters.name || filters.registryCode || filters.vatNumber || filters.categoryIds.length > 0 || filters.makeIds.length > 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
        <p className="text-neutral-600">{t('subtitle')}</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('filters.name')}</label>
            <input
              type="text"
              value={filters.name}
              onChange={(e) => setFilters({ name: e.target.value })}
              placeholder={t('filters.namePlaceholder')}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('filters.registryCode')}</label>
            <input
              type="text"
              value={filters.registryCode}
              onChange={(e) => setFilters({ registryCode: e.target.value })}
              placeholder={t('filters.registryCodePlaceholder')}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('filters.vatNumber')}</label>
            <input
              type="text"
              value={filters.vatNumber}
              onChange={(e) => setFilters({ vatNumber: e.target.value })}
              placeholder={t('filters.vatNumberPlaceholder')}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('filters.category')}</label>
            <Select
              instanceId="filter-categories-select"
              options={dealerCategories}
              value={selectedCategories}
              onChange={(options) => setFilters({ categoryIds: options.map(o => o.value) })}
              isLoading={lookupsLoading}
              isMulti
              isClearable
              placeholder={t('filters.categoryPlaceholder')}
              styles={selectStyles}
              noOptionsMessage={() => t('filters.noCategoriesFound')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('filters.make')}</label>
            <Select
              instanceId="filter-makes-select"
              options={makes}
              value={selectedMakes}
              onChange={(options) => setFilters({ makeIds: options.map(o => o.value) })}
              isLoading={makesLoading}
              isMulti
              isClearable
              placeholder={t('filters.makePlaceholder')}
              styles={selectStyles}
              noOptionsMessage={() => t('filters.noMakesFound')}
            />
          </div>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            {t('filters.clear')}
          </button>
        )}
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          {isLoading ? t('searching') : t('resultsFound', { count: total })}
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
      )}

      {!isLoading && dealers.length === 0 && !error && (
        <div className="p-8 text-center text-neutral-500 bg-white rounded-lg shadow-sm">
          {t('noResults')}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dealers.map((dealer) => (
          <div key={dealer.id} className="bg-white rounded-lg shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-3">
              {dealer.logoPath ? (
                <img
                  src={dealer.logoPath}
                  alt={`${dealer.companyName} logo`}
                  className="h-12 w-12 rounded-lg object-cover border border-neutral-200 shrink-0"
                />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5 text-neutral-400" />
                </div>
              )}
              <div className="min-w-0">
                <h3 className="font-bold truncate">{dealer.companyName}</h3>
                {dealer.locationLabel && (
                  <p className="text-xs text-neutral-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{dealer.locationLabel}</span>
                  </p>
                )}
              </div>
            </div>

            {(dealer.registryCode || dealer.vatNumber) && (
              <div className="text-xs text-neutral-500 space-y-0.5">
                {dealer.registryCode && <p>{t('registryCodeLabel', { code: dealer.registryCode })}</p>}
                {dealer.vatNumber && <p>{t('taxNumberLabel', { number: dealer.vatNumber })}</p>}
              </div>
            )}

            {dealer.makes.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {dealer.makes.slice(0, 4).map(make => <Chip key={make} label={make} />)}
                {dealer.makes.length > 4 && (
                  <span className="text-xs text-neutral-400 self-center">{t('moreCount', { count: dealer.makes.length - 4 })}</span>
                )}
              </div>
            )}

            {dealer.categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {dealer.categories.slice(0, 3).map(cat => (
                  <span key={cat} className="inline-block px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-xs">
                    {cat}
                  </span>
                ))}
                {dealer.categories.length > 3 && (
                  <span className="text-xs text-neutral-400 self-center">{t('moreCount', { count: dealer.categories.length - 3 })}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            className="px-4 py-2 border border-neutral-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
          >
            {t('pagination.previous')}
          </button>
          <span className="text-sm text-neutral-500">{t('pagination.pageOf', { page, total: pageCount })}</span>
          <button
            type="button"
            onClick={() => setPage(page + 1)}
            disabled={page >= pageCount}
            className="px-4 py-2 border border-neutral-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
          >
            {t('pagination.next')}
          </button>
        </div>
      )}
    </div>
  )
}
