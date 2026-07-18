'use client'

import { useState } from 'react'
import Select from 'react-select'
import { decodeVin } from 'chassi'
import { CreateListingFormData, ListingType } from '@/hooks/useCreateListingForm'
import { useMakes } from '@/hooks/useMakes'
import { useModels } from '@/hooks/useModels'
import { useLookups, type LookupOption, type LocationGroup } from '@/hooks/useLookups'

interface NhtsaVinDecodeResponse {
  success: boolean
  message?: string
  // False when NHTSA itself flags the VIN as having unrecognized/bad positions (its
  // Error Code is something other than clean or a check-digit mismatch) — in that case
  // model/year/trim/specs are unset server-side because NHTSA had to guess and can be
  // outright wrong (e.g. a real Volvo S60 coming back as a 1981 Volvo "740 Series").
  // `make` is still safe to use since it only depends on the WMI (positions 1-3).
  reliable?: boolean
  make?: string | null
  model?: string | null
  modelYear?: number | null
  trim?: string | null
  doors?: number | null
  engineKw?: number | null
  engineHp?: number | null
  fuelTypeId?: number | null
  transmissionId?: number | null
  driveTypeId?: number | null
}

// Resolves a decoded model name to this make's model id by querying the same
// endpoint the Model <Select> uses, independent of that select's own load state
// (avoids racing the reactive models list, which may still reflect a stale make).
async function resolveModelId(makeId: number, modelName: string): Promise<number | null> {
  try {
    const res = await fetch(`/api/models?makeId=${makeId}`)
    if (!res.ok) return null
    const list: Array<{ id: number; name: string }> = await res.json()
    const normalized = modelName.toLowerCase()
    const exact = list.find(m => m.name.toLowerCase() === normalized)
    if (exact) return exact.id
    const partial = list.find(m => m.name.toLowerCase().includes(normalized) || normalized.includes(m.name.toLowerCase()))
    return partial?.id ?? null
  } catch {
    return null
  }
}

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

const LISTING_TYPE_OPTIONS: { value: ListingType; label: string }[] = [
  { value: 'sell', label: 'Sell a Car' },
  { value: 'buy', label: 'Looking to Buy' },
  { value: 'rentWanted', label: 'I Want to Rent' },
  { value: 'rentOffer', label: 'I Rent to Others' },
]

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

  // VIN decoding — chassi runs offline first for an instant make/year guess, then NHTSA
  // vPIC is queried and takes priority whenever it returns data: it covers far more
  // manufacturers/models and is the only source here for fuel type, transmission,
  // drive type, doors and engine power. Everything is resolved before a single onUpdate
  // call, rather than trickled in via reactive effects, so there's no race against the
  // Model <Select>'s own (independent) models fetch.
  const [vinDecodeState, setVinDecodeState] = useState<{ status: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    status: 'idle',
    message: '',
  })

  const matchMakeByName = (name: string | null | undefined): LookupOption | undefined => {
    if (!name) return undefined
    const normalized = name.toLowerCase()
    return (
      makes.find(m => m.label.toLowerCase() === normalized) ??
      makes.find(m => m.label.toLowerCase().includes(normalized) || normalized.includes(m.label.toLowerCase()))
    )
  }

  const handleDecodeVin = async () => {
    const vin = data.vinCode.trim().toUpperCase()
    if (vin.length !== 17) {
      setVinDecodeState({ status: 'error', message: 'VIN must be exactly 17 characters' })
      return
    }

    setVinDecodeState({ status: 'loading', message: 'Decoding VIN…' })

    // 1) Offline pass via chassi — instant, but only covers a small set of WMIs for model inference
    const chassiResult = decodeVin(vin)
    let make = matchMakeByName(chassiResult.manufacturer)
    let modelName = chassiResult.model ?? null
    let year = chassiResult.year ?? null

    // 2) NHTSA vPIC — broader coverage; overrides chassi's guess whenever it has data
    let nhtsa: NhtsaVinDecodeResponse | null = null
    let nhtsaFailed = false
    try {
      const res = await fetch(`/api/vin-decode?vin=${encodeURIComponent(vin)}`)
      const json = (await res.json()) as NhtsaVinDecodeResponse
      if (res.ok && json.success) {
        nhtsa = json
      } else {
        nhtsaFailed = true
      }
    } catch {
      nhtsaFailed = true
    }

    if (nhtsa) {
      // Make comes from the WMI alone (positions 1-3), which decodes fine even when the
      // rest of the VIN doesn't — safe to use regardless of `reliable`.
      make = matchMakeByName(nhtsa.make) ?? make
      // Model/year come from the VDS/year-code, which is exactly what `reliable: false`
      // warns about — only trust NHTSA's version when it says the decode was clean.
      if (nhtsa.reliable) {
        modelName = nhtsa.model ?? modelName
        year = nhtsa.modelYear ?? year
      }
    }

    const updates: Partial<CreateListingFormData> = {}
    const filled: string[] = []

    if (year) updates.yearManufactured = year
    if (make) {
      updates.makeId = make.value
      updates.modelId = modelName ? await resolveModelId(make.value, modelName) : null
      if (updates.modelId) filled.push('model')
    }
    if (nhtsa?.trim && !data.modelTrim) {
      updates.modelTrim = nhtsa.trim
      filled.push('trim')
    }
    if (nhtsa?.fuelTypeId) {
      updates.fuelTypeId = nhtsa.fuelTypeId
      filled.push('fuel type')
    }
    if (nhtsa?.transmissionId) {
      updates.transmissionId = nhtsa.transmissionId
      filled.push('transmission')
    }
    if (nhtsa?.driveTypeId) {
      updates.driveTypeId = nhtsa.driveTypeId
      filled.push('drive type')
    }
    if (nhtsa?.doors) {
      updates.doors = nhtsa.doors
      filled.push('doors')
    }
    if (nhtsa?.engineKw) {
      updates.enginePowerKw = nhtsa.engineKw
      updates.enginePowerHp = nhtsa.engineHp ?? null
      filled.push('engine power')
    }

    if (Object.keys(updates).length > 0) onUpdate(updates)

    const parts: string[] = []
    if (make) parts.push(make.label)
    else if (nhtsa?.make ?? chassiResult.manufacturer) parts.push(`${nhtsa?.make ?? chassiResult.manufacturer} (not in make list)`)
    if (modelName) parts.push(modelName)
    if (year) parts.push(String(year))

    const caveat = nhtsaFailed
      ? ' — NHTSA lookup failed, some fields may be incomplete'
      : nhtsa && !nhtsa.reliable
        ? ' — NHTSA flagged this VIN as low-confidence, used offline data only for model/year'
        : ''

    setVinDecodeState({
      status: parts.length ? 'success' : 'error',
      message: parts.length
        ? `Decoded: ${parts.join(' · ')}${filled.length ? ` (also filled ${filled.join(', ')})` : ''}${caveat}`
        : 'Could not decode this VIN — fill the fields in manually',
    })
  }

  return (
    <div className="space-y-6">

      {/* VIN & Reg */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">VIN Code</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="vinCode"
              value={data.vinCode ?? ''}
              onChange={(e) => {
                handleInputChange(e)
                setVinDecodeState({ status: 'idle', message: '' })
              }}
              placeholder="17-char VIN"
              maxLength={17}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
            />
            <button
              type="button"
              onClick={handleDecodeVin}
              disabled={data.vinCode.trim().length !== 17 || vinDecodeState.status === 'loading'}
              className="shrink-0 px-3 py-2 rounded-lg border border-blue-600 text-blue-700 text-sm font-medium hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              {vinDecodeState.status === 'loading' ? 'Decoding…' : 'Decode'}
            </button>
          </div>
          {vinDecodeState.status !== 'idle' && (
            <p
              className={`mt-1 text-xs ${
                vinDecodeState.status === 'success'
                  ? 'text-green-700'
                  : vinDecodeState.status === 'loading'
                    ? 'text-neutral-500'
                    : 'text-amber-700'
              }`}
            >
              {vinDecodeState.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Registration Number</label>
          <input
            type="text"
            name="regNr"
            value={data.regNr ?? ''}
            onChange={handleInputChange}
            placeholder="e.g. ABC123"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Listing Type */}
      <div>
        <label className="block text-sm font-medium mb-1">Listing Type *</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {LISTING_TYPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onUpdate({ listingType: option.value })}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                data.listingType === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-neutral-300 text-neutral-700 hover:border-blue-400'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

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
          value={data.modelTrim ?? ''}
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
            value={data.price ?? ''}
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

    </div>
  )
}