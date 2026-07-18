'use client'

import { useRouter, useParams } from 'next/navigation'
import { useCreateListingForm } from '@/hooks/useCreateListingForm'
import { StepMainInfo } from './StepMainInfo'
import { StepImages } from './StepImages'
import { StepFeatures } from './StepFeatures'

const STEP_TITLES: Record<1 | 2 | 3, string> = {
  1: 'Car Information',
  2: 'Images',
  3: 'Features & Finalize',
}

export function CreateListingWizard() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const {
    formData,
    currentStep,
    isSubmitting,
    updateMainInfo,
    addImages,
    removeImage,
    updateFeatures,
    nextStep,
    prevStep,
    submitListing,
  } = useCreateListingForm()

  const isStepValid = () => {
    if (currentStep === 1) {
      return (
        formData.makeId &&
        formData.modelId &&
        formData.yearManufactured &&
        formData.mileage !== null &&
        formData.fuelTypeId &&
        formData.price
      )
    }
    if (currentStep === 2) {
      return formData.images.length > 0
    }
    return true
  }

  const handleSubmit = async () => {
    if (!isStepValid()) return

    const result = await submitListing()
    if (result.success) {
      // No real listing detail page exists yet (only the mock-data one at
      // classified/details/[id]) — land on search, where the new listing shows up.
      router.push(`/${locale}/classified/search`)
    } else {
      alert(result.error || 'Failed to create listing')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Listing</h1>
          <p className="text-neutral-600">Step {currentStep} of 3: {STEP_TITLES[currentStep]}</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8 flex gap-2">
          {[1, 2, 3].map(step => (
            <div
              key={step}
              className={`flex-1 h-2 rounded-full transition ${
                step <= currentStep ? 'bg-blue-600' : 'bg-neutral-200'
              }`}
            />
          ))}
        </div>

        {/* Form content */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          {currentStep === 1 && <StepMainInfo data={formData} onUpdate={updateMainInfo} />}
          {currentStep === 2 && (
            <StepImages
              images={formData.images}
              onAddImages={addImages}
              onRemoveImage={removeImage}
            />
          )}
          {currentStep === 3 && (
            <StepFeatures selectedFeatures={formData.selectedFeatures} onUpdate={updateFeatures} />
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-4 justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-neutral-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition"
          >
            ← Previous
          </button>

          <div className="flex gap-4">
            {currentStep < 3 && (
              <button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="px-8 py-2 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
              >
                Next →
              </button>
            )}

            {currentStep === 3 && (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !isStepValid()}
                className="px-8 py-2 bg-green-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Listing'}
              </button>
            )}
          </div>
        </div>

        {/* Validation message */}
        {!isStepValid() && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              {currentStep === 1 && '⚠️ Please fill all required fields'}
              {currentStep === 2 && '⚠️ Please add at least one image'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
