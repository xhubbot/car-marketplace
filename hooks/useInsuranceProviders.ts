import { useEffect, useState } from 'react'
import type { InsuranceProviderOption } from '@/app/api/insurance-providers/route'

interface UseInsuranceProvidersResult {
  insuranceProviders: InsuranceProviderOption[]
  isLoading: boolean
  error: string | null
}

export function useInsuranceProviders(): UseInsuranceProvidersResult {
  const [insuranceProviders, setInsuranceProviders] = useState<InsuranceProviderOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    setIsLoading(true)
    fetch('/api/insurance-providers')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load insurance providers')
        return res.json()
      })
      .then((data: InsuranceProviderOption[]) => {
        if (!cancelled) {
          setInsuranceProviders(data)
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
  }, [])

  return { insuranceProviders, isLoading, error }
}
