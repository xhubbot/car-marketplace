import { useEffect, useState } from 'react'

export interface CarModelOption {
  value: number
  label: string
  slug: string
}

interface UseModelsResult {
  models: CarModelOption[]
  isLoading: boolean
  error: string | null
}

export function useModels(makeId: number | null): UseModelsResult {
  const [models, setModels] = useState<CarModelOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!makeId) {
      setModels([])
      return
    }

    let cancelled = false

    setIsLoading(true)
    setModels([])
    fetch(`/api/models?makeId=${makeId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load models')
        return res.json()
      })
      .then((data: Array<{ id: number; name: string; slug: string }>) => {
        if (!cancelled) {
          setModels(data.map(m => ({ value: m.id, label: m.name, slug: m.slug })))
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
  }, [makeId])

  return { models, isLoading, error }
}
