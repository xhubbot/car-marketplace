'use client'

interface StepFeaturesProps {
  selectedFeatures: number[]
  onUpdate: (featureIds: number[]) => void
}

const FEATURE_GROUPS = [
  {
    name: 'Safety',
    features: [
      { id: 1, name: 'ABS' },
      { id: 2, name: 'ESP' },
      { id: 3, name: 'Airbags (front)' },
      { id: 4, name: 'Airbags (side)' },
      { id: 7, name: 'Parking sensors (front)' },
      { id: 8, name: 'Parking sensors (rear)' },
      { id: 9, name: 'Reversing camera' },
      { id: 10, name: '360° camera' },
      { id: 14, name: 'Automatic emergency braking' },
    ],
  },
  {
    name: 'Comfort',
    features: [
      { id: 20, name: 'Air conditioning' },
      { id: 21, name: 'Climate control' },
      { id: 23, name: 'Heated front seats' },
      { id: 24, name: 'Heated rear seats' },
      { id: 29, name: 'Cruise control' },
      { id: 30, name: 'Adaptive cruise control' },
      { id: 32, name: 'Keyless entry & start' },
    ],
  },
  {
    name: 'Entertainment',
    features: [
      { id: 50, name: 'Radio' },
      { id: 52, name: 'Navigation' },
      { id: 53, name: 'Bluetooth' },
      { id: 54, name: 'Apple CarPlay' },
      { id: 55, name: 'Android Auto' },
      { id: 57, name: 'USB' },
      { id: 59, name: 'Wi-Fi / Hotspot' },
    ],
  },
  {
    name: 'Exterior',
    features: [
      { id: 70, name: 'Alloy wheels' },
      { id: 71, name: 'Panoramic roof' },
      { id: 72, name: 'Sunroof / Moonroof' },
      { id: 73, name: 'Roof rails' },
      { id: 75, name: 'Sport package' },
    ],
  },
  {
    name: 'Lighting',
    features: [
      { id: 90, name: 'LED headlights' },
      { id: 91, name: 'Xenon / HID headlights' },
      { id: 93, name: 'LED daytime running lights' },
      { id: 95, name: 'Fog lights' },
    ],
  },
  {
    name: 'Interior',
    features: [
      { id: 80, name: 'Leather upholstery' },
      { id: 83, name: 'Ambient lighting' },
      { id: 84, name: 'Digital instrument cluster' },
    ],
  },
]

export function StepFeatures({ selectedFeatures, onUpdate }: StepFeaturesProps) {
  const toggleFeature = (featureId: number) => {
    const updated = selectedFeatures.includes(featureId)
      ? selectedFeatures.filter(id => id !== featureId)
      : [...selectedFeatures, featureId]
    onUpdate(updated)
  }

  return (
    <div className="space-y-8">
      {FEATURE_GROUPS.map((group) => (
        <div key={group.name}>
          <h3 className="font-semibold mb-4">{group.name}</h3>
          <div className="grid grid-cols-2 gap-3">
            {group.features.map((feature) => (
              <label
                key={feature.id}
                className="flex items-center p-3 border border-neutral-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  checked={selectedFeatures.includes(feature.id)}
                  onChange={() => toggleFeature(feature.id)}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="ml-3 text-sm">{feature.name}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-neutral-100 rounded-lg p-4">
        <p className="text-sm text-neutral-700">
          ✓ {selectedFeatures.length} feature{selectedFeatures.length !== 1 ? 's' : ''} selected
        </p>
      </div>
    </div>
  )
}
