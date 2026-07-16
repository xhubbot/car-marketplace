import { useState, useCallback } from 'react'

export interface CreateListingFormData {
  // Main info
  makeId: number | null
  modelId: number | null
  modelTrim: string
  yearManufactured: number | null
  monthManufactured: number | null
  mileage: number | null
  fuelTypeId: number | null
  transmissionId: number | null
  driveTypeId: number | null
  doors: number | null
  seats: number | null
  vinCode: string
  regNr: string
  enginePowerKw: number | null
  enginePowerHp: number | null
  colorId: number | null
  price: string
  currency: string
  locationId: number | null

  // Images
  images: File[]

  // Features
  selectedFeatures: number[]
}

interface UseCreateListingFormResult {
  formData: CreateListingFormData
  currentStep: 1 | 2 | 3
  isSubmitting: boolean
  updateMainInfo: (data: Partial<CreateListingFormData>) => void
  addImages: (files: File[]) => void
  removeImage: (index: number) => void
  updateFeatures: (featureIds: number[]) => void
  goToStep: (step: 1 | 2 | 3) => void
  nextStep: () => void
  prevStep: () => void
  submitListing: () => Promise<{ success: boolean; listingId?: number; error?: string }>
  reset: () => void
}

const INITIAL_STATE: CreateListingFormData = {
  makeId: null,
  modelId: null,
  modelTrim: '',
  yearManufactured: null,
  monthManufactured: null,
  mileage: null,
  fuelTypeId: null,
  transmissionId: null,
  driveTypeId: null,
  doors: null,
  seats: null,
  vinCode: '',
  regNr: '',
  enginePowerKw: null,
  enginePowerHp: null,
  colorId: null,
  price: '',
  currency: 'EUR',
  locationId: null,
  images: [],
  selectedFeatures: [],
}

export function useCreateListingForm(): UseCreateListingFormResult {
  const [formData, setFormData] = useState<CreateListingFormData>(INITIAL_STATE)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateMainInfo = useCallback((data: Partial<CreateListingFormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }, [])

  const addImages = useCallback((files: File[]) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files],
    }))
  }, [])

  const removeImage = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }, [])

  const updateFeatures = useCallback((featureIds: number[]) => {
    setFormData(prev => ({
      ...prev,
      selectedFeatures: featureIds,
    }))
  }, [])

  const goToStep = useCallback((step: 1 | 2 | 3) => {
    setCurrentStep(step)
  }, [])

  const nextStep = useCallback(() => {
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3)
    }
  }, [currentStep])

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3)
    }
  }, [currentStep])

  const submitListing = useCallback(async () => {
    setIsSubmitting(true)
    try {
      const formDataObj = new FormData()

      // Add main info
      formDataObj.append('makeId', String(formData.makeId))
      formDataObj.append('modelId', String(formData.modelId))
      formDataObj.append('modelTrim', formData.modelTrim)
      formDataObj.append('yearManufactured', String(formData.yearManufactured))
      if (formData.monthManufactured) formDataObj.append('monthManufactured', String(formData.monthManufactured))
      formDataObj.append('mileage', String(formData.mileage))
      formDataObj.append('fuelTypeId', String(formData.fuelTypeId))
      if (formData.transmissionId) formDataObj.append('transmissionId', String(formData.transmissionId))
      if (formData.driveTypeId) formDataObj.append('driveTypeId', String(formData.driveTypeId))
      if (formData.doors) formDataObj.append('doors', String(formData.doors))
      if (formData.seats) formDataObj.append('seats', String(formData.seats))
      if (formData.vinCode) formDataObj.append('vinCode', formData.vinCode)
      if (formData.regNr) formDataObj.append('regNr', formData.regNr)
      if (formData.enginePowerKw) formDataObj.append('enginePowerKw', String(formData.enginePowerKw))
      if (formData.enginePowerHp) formDataObj.append('enginePowerHp', String(formData.enginePowerHp))
      if (formData.colorId) formDataObj.append('colorId', String(formData.colorId))
      formDataObj.append('price', formData.price)
      formDataObj.append('currency', formData.currency)
      if (formData.locationId) formDataObj.append('locationId', String(formData.locationId))

      // Add images
      formData.images.forEach((image, index) => {
        formDataObj.append(`image_${index}`, image)
      })

      // Add features
      formDataObj.append('features', JSON.stringify(formData.selectedFeatures))

      const response = await fetch('/api/listings/create', {
        method: 'POST',
        body: formDataObj,
      })

      if (!response.ok) {
        const error = await response.json()
        return { success: false, error: error.message || 'Failed to create listing' }
      }

      const result = await response.json()
      return { success: true, listingId: result.id }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    } finally {
      setIsSubmitting(false)
    }
  }, [formData])

  const reset = useCallback(() => {
    setFormData(INITIAL_STATE)
    setCurrentStep(1)
  }, [])

  return {
    formData,
    currentStep,
    isSubmitting,
    updateMainInfo,
    addImages,
    removeImage,
    updateFeatures,
    goToStep,
    nextStep,
    prevStep,
    submitListing,
    reset,
  }
}
