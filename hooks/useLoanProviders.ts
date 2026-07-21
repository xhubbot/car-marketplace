import { useEffect, useState } from 'react'
import type { LoanProviderOption } from '@/app/api/loan-providers/route'

interface UseLoanProvidersResult {
  loanProviders: LoanProviderOption[]
  isLoading: boolean
  error: string | null
}

export function useLoanProviders(): UseLoanProvidersResult {
  const [loanProviders, setLoanProviders] = useState<LoanProviderOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    setIsLoading(true)
    fetch('/api/loan-providers')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load loan providers')
        return res.json()
      })
      .then((data: LoanProviderOption[]) => {
        if (!cancelled) {
          setLoanProviders(data)
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

  return { loanProviders, isLoading, error }
}
