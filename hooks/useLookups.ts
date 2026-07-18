import { useEffect, useState } from 'react'
import type { LookupOption, LocationGroup, LookupsResponse } from '@/app/api/lookups/route'

export type { LookupOption, LocationGroup }

interface UseLookupsResult {
  fuelTypes: LookupOption[]
  transmissions: LookupOption[]
  driveTypes: LookupOption[]
  colors: LookupOption[]
  locations: LocationGroup[]
  countries: LookupOption[]
  dealerCategories: LocationGroup[]
  isLoading: boolean
  error: string | null
}

const EMPTY: LookupsResponse = {
  fuelTypes: [],
  transmissions: [],
  driveTypes: [],
  colors: [],
  locations: [],
  countries: [],
  dealerCategories: [],
}

export function useLookups(locale = 'en'): UseLookupsResult {
  const [data, setData] = useState<LookupsResponse>(EMPTY)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    setIsLoading(true)
    fetch(`/api/lookups?locale=${locale}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load options')
        return res.json() as Promise<LookupsResponse>
      })
      .then(json => {
        if (!cancelled) {
          setData(json)
          setError(null)
        }
      })
      .catch(err => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [locale])

  return { ...data, isLoading, error }
}
