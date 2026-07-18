'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Select from 'react-select'
import { DollarSign, Sparkles, Building2, Sliders, Info } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useMakes } from '@/hooks/useMakes'
import { useModels } from '@/hooks/useModels'
import { useLookups } from '@/hooks/useLookups'
import { buildClassifiedUrl } from '@/lib/seo/slug'
import type { SearchListingResult, SearchResponse } from '@/app/api/listings/search/route'

type SearchMode = 'price' | 'ownership'

const INTL_LOCALE: Record<string, string> = { en: 'en-US', et: 'et-EE', ru: 'ru-RU' }

const selectStyles = {
  control: (base: object, state: { isFocused: boolean }) => ({
    ...base,
    borderColor: state.isFocused ? '#10b981' : '#d4d4d4',
    boxShadow: state.isFocused ? '0 0 0 2px #a7f3d0' : 'none',
    borderRadius: '0.5rem',
    minHeight: '38px',
    '&:hover': { borderColor: '#10b981' },
  }),
  option: (base: object, state: { isSelected: boolean; isFocused: boolean }) => ({
    ...base,
    backgroundColor: state.isSelected ? '#10b981' : state.isFocused ? '#ecfdf5' : 'white',
    color: state.isSelected ? 'white' : '#111827',
  }),
}

function formatMoney(amount: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale] ?? locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function ClassifiedSearchPage() {
  const params = useParams()
  const locale = (params.locale as string) ?? 'en'

  const [mode, setMode] = useState<SearchMode>('price')

  // Filters shared across both modes
  const [makeId, setMakeId] = useState<number | null>(null)
  const [modelId, setModelId] = useState<number | null>(null)
  const [fuelTypeId, setFuelTypeId] = useState<number | null>(null)
  const [transmissionId, setTransmissionId] = useState<number | null>(null)

  // Mode-specific range filters
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [ownershipMin, setOwnershipMin] = useState('')
  const [ownershipMax, setOwnershipMax] = useState('')
  const [monthlyKm, setMonthlyKm] = useState(1500)

  const [page, setPage] = useState(1)
  const [result, setResult] = useState<SearchResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { makes, isLoading: makesLoading } = useMakes()
  const { models, isLoading: modelsLoading } = useModels(makeId)
  const { fuelTypes, transmissions, isLoading: lookupsLoading } = useLookups(locale)

  // Any filter change (other than page itself) restarts pagination at page 1.
  // Adjusted during render (React's documented pattern for resetting state in
  // response to a changing "key") rather than in an effect, so it applies
  // before the fetch effect below ever sees the stale page number.
  const filtersKey = JSON.stringify([mode, makeId, modelId, fuelTypeId, transmissionId, priceMin, priceMax, ownershipMin, ownershipMax, monthlyKm])
  const [prevFiltersKey, setPrevFiltersKey] = useState(filtersKey)
  if (filtersKey !== prevFiltersKey) {
    setPrevFiltersKey(filtersKey)
    setPage(1)
  }

  useEffect(() => {
    const query = new URLSearchParams({ mode, locale, page: String(page), monthlyKm: String(monthlyKm) })
    if (makeId) query.set('makeId', String(makeId))
    if (modelId) query.set('modelId', String(modelId))
    if (fuelTypeId) query.set('fuelTypeId', String(fuelTypeId))
    if (transmissionId) query.set('transmissionId', String(transmissionId))
    if (mode === 'price') {
      if (priceMin) query.set('priceMin', priceMin)
      if (priceMax) query.set('priceMax', priceMax)
    } else {
      if (ownershipMin) query.set('ownershipMin', ownershipMin)
      if (ownershipMax) query.set('ownershipMax', ownershipMax)
    }

    let cancelled = false
    setIsLoading(true)
    fetch(`/api/listings/search?${query.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Search failed')
        return res.json() as Promise<SearchResponse>
      })
      .then((data) => {
        if (!cancelled) {
          setResult(data)
          setError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [mode, locale, page, monthlyKm, makeId, modelId, fuelTypeId, transmissionId, priceMin, priceMax, ownershipMin, ownershipMax])

  const selectedMake = useMemo(() => makes.find((m) => m.value === makeId) ?? null, [makes, makeId])
  const selectedModel = useMemo(() => models.find((m) => m.value === modelId) ?? null, [models, modelId])
  const selectedFuelType = useMemo(() => fuelTypes.find((f) => f.value === fuelTypeId) ?? null, [fuelTypes, fuelTypeId])
  const selectedTransmission = useMemo(
    () => transmissions.find((t) => t.value === transmissionId) ?? null,
    [transmissions, transmissionId]
  )

  return (
    <div className="min-h-screen bg-[#faf9f6] text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 font-sans">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Search Classifieds</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {result ? `${result.total} listing${result.total === 1 ? '' : 's'} found` : 'Loading…'}
          </p>
        </div>

        {/* Sticker / Ownership toggle */}
        <div className="mb-6 inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white p-1 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <button
            onClick={() => setMode('price')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
              mode === 'price'
                ? 'bg-neutral-950 text-white dark:bg-neutral-100 dark:text-neutral-950'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <DollarSign className="h-3.5 w-3.5" />
            Sticker Price
          </button>
          <button
            onClick={() => setMode('ownership')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
              mode === 'ownership' ? 'bg-emerald-500 text-white' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Ownership Cost
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Filters */}
          <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900/60 space-y-4 shadow-xs">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">Make</label>
                <Select
                  instanceId="search-make"
                  options={makes}
                  value={selectedMake}
                  onChange={(o) => {
                    setMakeId(o?.value ?? null)
                    setModelId(null)
                  }}
                  isLoading={makesLoading}
                  placeholder="Any make…"
                  isClearable
                  styles={selectStyles}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">Model</label>
                <Select
                  instanceId="search-model"
                  options={models}
                  value={selectedModel}
                  onChange={(o) => setModelId(o?.value ?? null)}
                  isLoading={modelsLoading}
                  isDisabled={!makeId}
                  placeholder={makeId ? 'Any model…' : 'Select a make first'}
                  isClearable
                  styles={selectStyles}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">Fuel Type</label>
                <Select
                  instanceId="search-fuel"
                  options={fuelTypes}
                  value={selectedFuelType}
                  onChange={(o) => setFuelTypeId(o?.value ?? null)}
                  isLoading={lookupsLoading}
                  placeholder="Any fuel type…"
                  isClearable
                  styles={selectStyles}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">Transmission</label>
                <Select
                  instanceId="search-transmission"
                  options={transmissions}
                  value={selectedTransmission}
                  onChange={(o) => setTransmissionId(o?.value ?? null)}
                  isLoading={lookupsLoading}
                  placeholder="Any transmission…"
                  isClearable
                  styles={selectStyles}
                />
              </div>

              {mode === 'price' ? (
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">Price (EUR)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      placeholder="Min"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-neutral-700 dark:bg-neutral-900"
                    />
                    <span className="text-neutral-400">–</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="Max"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-neutral-700 dark:bg-neutral-900"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">Monthly Ownership Cost (EUR)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        placeholder="Min"
                        value={ownershipMin}
                        onChange={(e) => setOwnershipMin(e.target.value)}
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-neutral-700 dark:bg-neutral-900"
                      />
                      <span className="text-neutral-400">–</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="Max"
                        value={ownershipMax}
                        onChange={(e) => setOwnershipMax(e.target.value)}
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-neutral-700 dark:bg-neutral-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 rounded-xl bg-emerald-50/50 p-3 dark:bg-emerald-950/20">
                    <div className="flex items-center gap-2">
                      <Sliders className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-xs font-bold uppercase text-neutral-500">Monthly Mileage</span>
                      <span className="ml-auto font-mono text-xs font-bold text-emerald-600">{monthlyKm.toLocaleString()} km</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="4000"
                      step="100"
                      value={monthlyKm}
                      onChange={(e) => setMonthlyKm(Number(e.target.value))}
                      className="w-full accent-emerald-500 h-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 appearance-none cursor-ew-resize"
                    />
                    <div className="flex gap-1.5 text-[11px] text-emerald-800 dark:text-emerald-400">
                      <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span>Ownership cost = est. loan + insurance + maintenance + fuel/electricity at this mileage.</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </aside>

          {/* Results */}
          <div className="lg:col-span-8 space-y-4">
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
                {error}
              </div>
            )}

            {isLoading && (
              <div className="rounded-2xl border border-dashed border-neutral-300 py-16 text-center dark:border-neutral-800">
                <p className="text-sm text-neutral-500">Searching…</p>
              </div>
            )}

            {!isLoading && result && result.listings.length === 0 && (
              <div className="rounded-2xl border border-dashed border-neutral-300 py-16 text-center dark:border-neutral-800">
                <p className="text-sm text-neutral-500">No cars match these filters.</p>
              </div>
            )}

            {!isLoading && result && result.listings.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {result.listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} locale={locale} mode={mode} />
                ))}
              </div>
            )}

            {result && result.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-full border border-neutral-200 px-4 py-1.5 text-xs font-bold disabled:opacity-40 dark:border-neutral-800"
                >
                  Prev
                </button>
                <span className="text-xs font-semibold text-neutral-500">
                  Page {result.page} of {result.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(result.totalPages, p + 1))}
                  disabled={page >= result.totalPages}
                  className="rounded-full border border-neutral-200 px-4 py-1.5 text-xs font-bold disabled:opacity-40 dark:border-neutral-800"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function ListingCard({ listing, locale, mode }: { listing: SearchListingResult; locale: string; mode: SearchMode }) {
  const href = buildClassifiedUrl(locale, listing.id)
  const primary =
    mode === 'price'
      ? formatMoney(listing.price, listing.currency, locale)
      : `${formatMoney(listing.monthlyCost.total, listing.currency, locale)}/mo`
  const secondary =
    mode === 'price'
      ? `${formatMoney(listing.monthlyCost.total, listing.currency, locale)}/mo est. ownership`
      : `${formatMoney(listing.price, listing.currency, locale)} sticker price`

  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs transition-shadow hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/60"
    >
      {listing.image ? (
        <img src={listing.image} alt={listing.title} className="h-44 w-full object-cover" />
      ) : (
        <div className="flex h-44 w-full items-center justify-center bg-neutral-100 dark:bg-neutral-800">
          <Building2 className="h-10 w-10 text-neutral-300" />
        </div>
      )}
      <div className="p-4 space-y-2">
        <h3 className="font-sans text-base font-bold tracking-tight text-neutral-900 dark:text-white line-clamp-1">
          {listing.title}
          {listing.modelTrim ? ` ${listing.modelTrim}` : ''}
        </h3>
        <p className="text-xs text-neutral-500">
          {listing.year} &bull; {listing.mileage.toLocaleString()} km &bull; {listing.fuelType}
          {listing.transmission ? ` • ${listing.transmission}` : ''}
        </p>
        <div className="flex items-baseline justify-between pt-1">
          <span className="text-xl font-extrabold text-emerald-600">{primary}</span>
        </div>
        <p className="text-[11px] text-neutral-400">{secondary}</p>
      </div>
    </Link>
  )
}
