import { useState, useCallback } from 'react'

export interface WorkingHourRow {
  fromDay: number | null // 0=Monday … 6=Sunday
  toDay: number | null
  fromHour: number | null
  fromMin: number | null
  toHour: number | null
  toMin: number | null
  note: string
}

export interface DealerRegisterFormData {
  // Company
  companyName: string
  registryCode: string
  vatNumber: string
  homepage: string

  // Contact / address
  address: string
  locationId: number | null
  countryId: number | null
  postcode: string
  phone: string
  fax: string
  email: string

  // Images
  logo: File | null
  coverImage: File | null

  // Working hours
  workingHours: WorkingHourRow[]
}

interface UseDealerRegisterFormResult {
  formData: DealerRegisterFormData
  isSubmitting: boolean
  update: (data: Partial<DealerRegisterFormData>) => void
  setLogo: (file: File | null) => void
  setCoverImage: (file: File | null) => void
  addWorkingHourRow: () => void
  updateWorkingHourRow: (index: number, row: Partial<WorkingHourRow>) => void
  removeWorkingHourRow: (index: number) => void
  submitDealer: () => Promise<{ success: boolean; dealerId?: number; error?: string }>
}

const EMPTY_ROW: WorkingHourRow = {
  fromDay: null,
  toDay: null,
  fromHour: null,
  fromMin: null,
  toHour: null,
  toMin: null,
  note: '',
}

const INITIAL_STATE: DealerRegisterFormData = {
  companyName: '',
  registryCode: '',
  vatNumber: '',
  homepage: '',
  address: '',
  locationId: null,
  countryId: null,
  postcode: '',
  phone: '',
  fax: '',
  email: '',
  logo: null,
  coverImage: null,
  workingHours: [{ ...EMPTY_ROW }],
}

export function useDealerRegisterForm(): UseDealerRegisterFormResult {
  const [formData, setFormData] = useState<DealerRegisterFormData>(INITIAL_STATE)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const update = useCallback((data: Partial<DealerRegisterFormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }, [])

  const setLogo = useCallback((file: File | null) => {
    setFormData(prev => ({ ...prev, logo: file }))
  }, [])

  const setCoverImage = useCallback((file: File | null) => {
    setFormData(prev => ({ ...prev, coverImage: file }))
  }, [])

  const addWorkingHourRow = useCallback(() => {
    setFormData(prev => ({ ...prev, workingHours: [...prev.workingHours, { ...EMPTY_ROW }] }))
  }, [])

  const updateWorkingHourRow = useCallback((index: number, row: Partial<WorkingHourRow>) => {
    setFormData(prev => ({
      ...prev,
      workingHours: prev.workingHours.map((r, i) => (i === index ? { ...r, ...row } : r)),
    }))
  }, [])

  const removeWorkingHourRow = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      workingHours: prev.workingHours.filter((_, i) => i !== index),
    }))
  }, [])

  const submitDealer = useCallback(async () => {
    setIsSubmitting(true)
    try {
      const body = new FormData()
      body.append('companyName', formData.companyName)
      if (formData.registryCode) body.append('registryCode', formData.registryCode)
      if (formData.vatNumber) body.append('vatNumber', formData.vatNumber)
      if (formData.homepage) body.append('homepage', formData.homepage)
      body.append('address', formData.address)
      if (formData.locationId) body.append('locationId', String(formData.locationId))
      if (formData.countryId) body.append('countryId', String(formData.countryId))
      if (formData.postcode) body.append('postcode', formData.postcode)
      if (formData.phone) body.append('phone', formData.phone)
      if (formData.fax) body.append('fax', formData.fax)
      if (formData.email) body.append('email', formData.email)
      if (formData.logo) body.append('logo', formData.logo)
      if (formData.coverImage) body.append('coverImage', formData.coverImage)

      const workingHours = formData.workingHours.filter(
        row => row.fromDay !== null && row.toDay !== null
      )
      body.append('workingHours', JSON.stringify(workingHours))

      const response = await fetch('/api/dealer/register', {
        method: 'POST',
        body,
      })

      if (!response.ok) {
        const error = await response.json()
        return { success: false, error: error.message || 'Failed to register dealer' }
      }

      const result = await response.json()
      return { success: true, dealerId: result.id }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    } finally {
      setIsSubmitting(false)
    }
  }, [formData])

  return {
    formData,
    isSubmitting,
    update,
    setLogo,
    setCoverImage,
    addWorkingHourRow,
    updateWorkingHourRow,
    removeWorkingHourRow,
    submitDealer,
  }
}
