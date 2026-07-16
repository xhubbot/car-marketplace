'use client'

import Select from 'react-select'
import { CreateListingFormData } from '@/hooks/useCreateListingForm'
import { useMakes } from '@/hooks/useMakes'
import { useModels } from '@/hooks/useModels'
import { useLookups, type LookupOption, type LocationGroup } from '@/hooks/useLookups'

interface StepMainInfoProps {
  data: CreateListingFormData
  onUpdate: (data: Partial<CreateListingFormData>) => void
}

const selectStyles = {
  control: (base: object, state: { isFocused: boolean }) => ({
    ...base,
    borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 2px #bfdbfe' : 'none',
    borderRadius: '0.5rem',
    minHeight: '42px',
    '&:hover': { borderColor: '#3b82f6' },
  }),
  option: (base: object, state: { isSelected: boolean; isFocused: boolean }) => ({
    ...base,
    backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#eff6ff' : 'white',
    color: state.isSelected ? 'white' : '#111827',
  }),
  groupHeading: (base: object) => ({
    ...base,
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    color: '#6b7280',
    paddingTop: '6px',
  }),
}

function findInGroups(groups: LocationGroup[], value: number | null): LookupOption | null {
  if (value === null) return null
  for (const group of groups) {
    const found = group.options.find(o => o.value === value)
    if (found) return found
  }
  return null
}

export function StepMainInfo({ data, onUpdate }: StepMainInfoProps) {
  const { makes, isLoading: makesLoading } = useMakes()
  const { models, isLoading: modelsLoading } = useModels(data.makeId)
  const {
    fuelTypes,
    transmissions,
    driveTypes,
    colors,
    locations,
    isLoading: lookupsLoading,
  } = useLookups()

  const selectedMake       = makes.find(m => m.value === data.makeId) ?? null
  const selectedModel      = models.find(m => m.value === data.modelId) ?? null
  const selectedFuelType   = fuelTypes.find(o => o.value === data.fuelTypeId) ?? null
  const selectedTransmission = transmissions.find(o => o.value === data.transmissionId) ?? null
  const selectedDriveType  = driveTypes.find(o => o.value === data.driveTypeId) ?? null
  const selectedColor      = colors.find(o => o.value === data.colorId) ?? null
  const selectedLocation   = findInGroups(locations, data.locationId)

  const handleMakeChange = (option: LookupOption | null) => {
    onUpdate({ makeId: option?.value ?? null, modelId: null })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.currentTarget
    const parsedValue = type === 'number' ? (value ? Number(value) : null) : value
    onUpdate({ [name]: parsedValue })
  }

  return (
    <div className="space-y-6">

      {/* Make & Model */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Make *</label>
          <Select
            instanceId="make-select"
            options={makes}
            value={selectedMake}
            onChange={handleMakeChange}
            isLoading={makesLoading}
            placeholder={makesLoading ? 'Loading…' : 'Search make…'}
            isClearable
            styles={selectStyles}
            noOptionsMessage={() => 'No makes found'}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Model *</label>
          <Select
            instanceId="model-select"
            options={models}
            value={selectedModel}
            onChange={(option) => onUpdate({ modelId: option?.value ?? null })}
            isLoading={modelsLoading}
            isDisabled={!data.makeId}
            placeholder={!data.makeId ? 'Select a make first' : modelsLoading ? 'Loading…' : 'Search model…'}
            isClearable
            styles={selectStyles}
            noOptionsMessage={() => (data.makeId ? 'No models found' : 'Select a make first')}
          />
        </div>
      </div>

      {/* Trim */}
      <div>
        <label className="block text-sm font-medium mb-1">Trim / Version</label>
        <input
          type="text"
          name="modelTrim"
          value={data.modelTrim}
          onChange={handleInputChange}
          placeholder="e.g. Sport, Luxury"
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Year / Month / Mileage */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Year *</label>
          <input
            type="number"
            name="yearManufactured"
            value={data.yearManufactured || ''}
            onChange={handleInputChange}
            placeholder="2020"
            min="1950"
            max={new Date().getFullYear()}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Month</label>
          <select
            name="monthManufactured"
            value={data.monthManufactured || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mileage (km) *</label>
          <input
            type="number"
            name="mileage"
            value={data.mileage || ''}
            onChange={handleInputChange}
            placeholder="50000"
            min="0"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      {/* Fuel / Transmission / Drive */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Fuel Type *</label>
          <Select
            instanceId="fuel-select"
            options={fuelTypes}
            value={selectedFuelType}
            onChange={(option) => onUpdate({ fuelTypeId: option?.value ?? null })}
            isLoading={lookupsLoading}
            placeholder="Select fuel…"
            isClearable
            styles={selectStyles}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Transmission</label>
          <Select
            instanceId="trans-select"
            options={transmissions}
            value={selectedTransmission}
            onChange={(option) => onUpdate({ transmissionId: option?.value ?? null })}
            isLoading={lookupsLoading}
            placeholder="Select…"
            isClearable
            styles={selectStyles}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Drive Type</label>
          <Select
            instanceId="drive-select"
            options={driveTypes}
            value={selectedDriveType}
            onChange={(option) => onUpdate({ driveTypeId: option?.value ?? null })}
            isLoading={lookupsLoading}
            placeholder="Select…"
            isClearable
            styles={selectStyles}
          />
        </div>
      </div>

      {/* Doors / Seats / Engine */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Doors</label>
          <input
            type="number"
            name="doors"
            value={data.doors || ''}
            onChange={handleInputChange}
            min="1"
            max="6"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Seats</label>
          <input
            type="number"
            name="seats"
            value={data.seats || ''}
            onChange={handleInputChange}
            min="1"
            max="9"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Engine Power (kW)</label>
          <input
            type="number"
            name="enginePowerKw"
            value={data.enginePowerKw || ''}
            onChange={handleInputChange}
            min="0"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Color */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Color</label>
          <Select
            instanceId="color-select"
            options={colors}
            value={selectedColor}
            onChange={(option) => onUpdate({ colorId: option?.value ?? null })}
            isLoading={lookupsLoading}
            placeholder="Select color…"
            isClearable
            styles={selectStyles}
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Price (EUR) *</label>
          <input
            type="number"
            name="price"
            value={data.price}
            onChange={handleInputChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <Select
          instanceId="location-select"
          options={locations}
          value={selectedLocation}
          onChange={(option) => onUpdate({ locationId: option?.value ?? null })}
          isLoading={lookupsLoading}
          placeholder="Select location…"
          isClearable
          styles={selectStyles}
        />
      </div>

      {/* VIN & Reg */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">VIN Code</label>
          <input
            type="text"
            name="vinCode"
            value={data.vinCode}
            onChange={handleInputChange}
            placeholder="17-char VIN"
            maxLength={17}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Registration Number</label>
          <input
            type="text"
            name="regNr"
            value={data.regNr}
            onChange={handleInputChange}
            placeholder="e.g. ABC123"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

    </div>
  )
}