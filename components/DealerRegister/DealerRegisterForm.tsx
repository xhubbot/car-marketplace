'use client'

import { useRouter } from 'next/navigation'
import Select from 'react-select'
import { useLookups, type LookupOption, type LocationGroup } from '@/hooks/useLookups'
import { useDealerRegisterForm } from '@/hooks/useDealerRegisterForm'

const DAY_OPTIONS = [
  { value: 0, label: 'Monday' },
  { value: 1, label: 'Tuesday' },
  { value: 2, label: 'Wednesday' },
  { value: 3, label: 'Thursday' },
  { value: 4, label: 'Friday' },
  { value: 5, label: 'Saturday' },
  { value: 6, label: 'Sunday' },
]

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

export function DealerRegisterForm() {
  const router = useRouter()
  const { locations, countries, isLoading: lookupsLoading } = useLookups()
  const {
    formData,
    isSubmitting,
    update,
    setLogo,
    setCoverImage,
    addWorkingHourRow,
    updateWorkingHourRow,
    removeWorkingHourRow,
    submitDealer,
  } = useDealerRegisterForm()

  const selectedLocation = findInGroups(locations, formData.locationId)
  const selectedCountry = countries.find(c => c.value === formData.countryId) ?? null

  const isValid = formData.companyName.trim() !== '' && formData.address.trim() !== ''

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    update({ [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    const result = await submitDealer()
    if (result.success) {
      router.push('/dealer')
    } else {
      alert(result.error || 'Failed to register dealer')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Register Your Dealership</h1>
        <p className="text-neutral-600">Tell us about your company so buyers can find and trust you.</p>
      </div>

      {/* Company info */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold">Company Information</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Company Name *</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Registry Code</label>
            <input
              type="text"
              name="registryCode"
              value={formData.registryCode}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">VAT Number</label>
            <input
              type="text"
              name="vatNumber"
              value={formData.vatNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Homepage</label>
          <input
            type="text"
            name="homepage"
            value={formData.homepage}
            onChange={handleInputChange}
            placeholder="http://www.example.com"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Address & contact */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold">Address & Contact</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Address *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">City / County</label>
            <Select
              instanceId="location-select"
              options={locations}
              value={selectedLocation}
              onChange={(option) => update({ locationId: option?.value ?? null })}
              isLoading={lookupsLoading}
              placeholder="Select location…"
              isClearable
              styles={selectStyles}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <Select
              instanceId="country-select"
              options={countries}
              value={selectedCountry}
              onChange={(option) => update({ countryId: option?.value ?? null })}
              isLoading={lookupsLoading}
              placeholder="Select country…"
              isClearable
              styles={selectStyles}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Postcode</label>
          <input
            type="text"
            name="postcode"
            value={formData.postcode}
            onChange={handleInputChange}
            className="w-full sm:w-1/3 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+372 xxx xxxx"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fax</label>
            <input
              type="text"
              name="fax"
              value={formData.fax}
              onChange={handleInputChange}
              placeholder="+372 xxx xxxx"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold">Images</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Company Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files?.[0] ?? null)}
              className="w-full text-sm"
            />
            {formData.logo && (
              <img
                src={URL.createObjectURL(formData.logo)}
                alt="Logo preview"
                className="mt-2 h-20 w-20 object-cover rounded-lg border border-neutral-200"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Company Building Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files?.[0] ?? null)}
              className="w-full text-sm"
            />
            {formData.coverImage && (
              <img
                src={URL.createObjectURL(formData.coverImage)}
                alt="Building preview"
                className="mt-2 h-20 w-32 object-cover rounded-lg border border-neutral-200"
              />
            )}
          </div>
        </div>
      </div>

      {/* Working hours */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold">Working Hours</h2>

        {formData.workingHours.map((row, index) => (
          <div key={index} className="border border-neutral-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <select
                value={row.fromDay ?? ''}
                onChange={(e) => updateWorkingHourRow(index, { fromDay: e.target.value ? Number(e.target.value) : null })}
                className="px-2 py-1.5 border border-neutral-300 rounded-lg text-sm"
              >
                <option value="">Day</option>
                {DAY_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
              <span className="text-sm text-neutral-500">to</span>
              <select
                value={row.toDay ?? ''}
                onChange={(e) => updateWorkingHourRow(index, { toDay: e.target.value ? Number(e.target.value) : null })}
                className="px-2 py-1.5 border border-neutral-300 rounded-lg text-sm"
              >
                <option value="">Day</option>
                {DAY_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>

              {formData.workingHours.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeWorkingHourRow(index)}
                  className="ml-auto text-xs text-red-600 hover:text-red-800 font-medium"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={row.fromHour ?? ''}
                onChange={(e) => updateWorkingHourRow(index, { fromHour: e.target.value ? Number(e.target.value) : null })}
                className="px-2 py-1.5 border border-neutral-300 rounded-lg text-sm"
              >
                <option value="">HH</option>
                {Array.from({ length: 24 }, (_, i) => i).map(h => <option key={h} value={h}>{String(h).padStart(2, '0')}</option>)}
              </select>
              <select
                value={row.fromMin ?? ''}
                onChange={(e) => updateWorkingHourRow(index, { fromMin: e.target.value ? Number(e.target.value) : null })}
                className="px-2 py-1.5 border border-neutral-300 rounded-lg text-sm"
              >
                <option value="">MM</option>
                {[0, 15, 30, 45].map(m => <option key={m} value={m}>{String(m).padStart(2, '0')}</option>)}
              </select>
              <span className="text-sm text-neutral-500">to</span>
              <select
                value={row.toHour ?? ''}
                onChange={(e) => updateWorkingHourRow(index, { toHour: e.target.value ? Number(e.target.value) : null })}
                className="px-2 py-1.5 border border-neutral-300 rounded-lg text-sm"
              >
                <option value="">HH</option>
                {Array.from({ length: 24 }, (_, i) => i).map(h => <option key={h} value={h}>{String(h).padStart(2, '0')}</option>)}
              </select>
              <select
                value={row.toMin ?? ''}
                onChange={(e) => updateWorkingHourRow(index, { toMin: e.target.value ? Number(e.target.value) : null })}
                className="px-2 py-1.5 border border-neutral-300 rounded-lg text-sm"
              >
                <option value="">MM</option>
                {[0, 15, 30, 45].map(m => <option key={m} value={m}>{String(m).padStart(2, '0')}</option>)}
              </select>

              <input
                type="text"
                value={row.note}
                onChange={(e) => updateWorkingHourRow(index, { note: e.target.value })}
                placeholder="Additional info"
                className="flex-1 min-w-40 px-3 py-1.5 border border-neutral-300 rounded-lg text-sm"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addWorkingHourRow}
          className="text-sm font-semibold text-blue-600 hover:text-blue-800"
        >
          + Add another row
        </button>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !isValid}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
      >
        {isSubmitting ? 'Submitting…' : 'Register Dealership'}
      </button>
    </form>
  )
}
