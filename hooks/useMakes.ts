import { useEffect, useState } from 'react'

export interface CarMakeOption {
  value: number
  label: string
  slug: string
}

interface UseMakesResult {
  makes: CarMakeOption[]
  isLoading: boolean
  error: string | null
}

export function useMakes(): UseMakesResult {
  const [makes, setMakes] = useState<CarMakeOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    setIsLoading(true)
    fetch('/api/makes')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load makes')
        return res.json()
      })
      .then((data: Array<{ id: number; name: string; slug: string }>) => {
        if (!cancelled) {
          setMakes(data.map(m => ({ value: m.id, label: m.name, slug: m.slug })))
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
  }, [])

  return { makes, isLoading, error }
}
