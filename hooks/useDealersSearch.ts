import { useEffect, useState } from 'react'
import type { DealerSearchResult } from '@/app/api/dealers/route'

export interface DealersFilters {
  name: string
  registryCode: string
  vatNumber: string
  categoryIds: number[]
  makeIds: number[]
}

interface UseDealersSearchResult {
  dealers: DealerSearchResult[]
  total: number
  page: number
  filters: DealersFilters
  isLoading: boolean
  error: string | null
  setFilters: (filters: Partial<DealersFilters>) => void
  setPage: (page: number) => void
  clearFilters: () => void
}

export const EMPTY_FILTERS: DealersFilters = {
  name: '',
  registryCode: '',
  vatNumber: '',
  categoryIds: [],
  makeIds: [],
}

export function useDealersSearch(locale = 'en'): UseDealersSearchResult {
  const [filters, setFiltersState] = useState<DealersFilters>(EMPTY_FILTERS)
  const [page, setPage] = useState(1)
  const [dealers, setDealers] = useState<DealerSearchResult[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    // Debounce so free-text fields don't fire a request per keystroke
    const timer = setTimeout(() => {
      setIsLoading(true)
      const params = new URLSearchParams({ locale, page: String(page) })
      if (filters.name) params.set('name', filters.name)
      if (filters.registryCode) params.set('registryCode', filters.registryCode)
      if (filters.vatNumber) params.set('vatNumber', filters.vatNumber)
      if (filters.categoryIds.length) params.set('categoryIds', filters.categoryIds.join(','))
      if (filters.makeIds.length) params.set('makeIds', filters.makeIds.join(','))

      fetch(`/api/dealers?${params.toString()}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to load dealers')
          return res.json()
        })
        .then((data: { dealers: DealerSearchResult[]; total: number }) => {
          if (!cancelled) {
            setDealers(data.dealers)
            setTotal(data.total)
            setError(null)
          }
        })
        .catch(err => {
          if (!cancelled) setError(err.message)
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false)
        })
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [locale, page, filters])

  const setFilters = (partial: Partial<DealersFilters>) => {
    setPage(1)
    setFiltersState(prev => ({ ...prev, ...partial }))
  }

  const clearFilters = () => {
    setPage(1)
    setFiltersState(EMPTY_FILTERS)
  }

  return { dealers, total, page, filters, isLoading, error, setFilters, setPage, clearFilters }
}
