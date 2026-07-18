'use client'

import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Select from 'react-select'
import { useLookups, type LookupOption, type LocationGroup } from '@/hooks/useLookups'
import { useMakes } from '@/hooks/useMakes'
import { useDealerRegisterForm, type DealerContactType } from '@/hooks/useDealerRegisterForm'

const DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const
const CONTACT_TYPE_VALUES: DealerContactType[] = [
  'phone', 'email', 'website', 'facebook', 'instagram', 'whatsapp', 'telegram', 'linkedin', 'youtube', 'other',
]

const CONTACT_VALUE_PLACEHOLDER: Record<DealerContactType, string> = {
  phone: '+372 xxx xxxx',
  email: 'info@example.com',
  website: 'https://example.com',
  facebook: 'https://facebook.com/…',
  instagram: 'https://instagram.com/…',
  whatsapp: '+372 xxx xxxx',
  telegram: '@username',
  linkedin: 'https://linkedin.com/company/…',
  youtube: 'https://youtube.com/@…',
  other: '',
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

function findManyInGroups(groups: LocationGroup[], values: number[]): LookupOption[] {
  const all = groups.flatMap(g => g.options)
  return values
    .map(v => all.find(o => o.value === v))
    .filter((o): o is LookupOption => o !== undefined)
}

export function DealerRegisterForm() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('dealer.register')
  const tDays = useTranslations('dealer.days')
  const tContact = useTranslations('dealer.contactTypes')
  const { locations, countries, dealerCategories, isLoading: lookupsLoading } = useLookups(locale)
  const { makes, isLoading: makesLoading } = useMakes()
  const {
    formData,
    isSubmitting,
    update,
    setLogo,
    setCoverImage,
    addWorkingHourRow,
    updateWorkingHourRow,
    removeWorkingHourRow,
    addContactRow,
    updateContactRow,
    removeContactRow,
    submitDealer,
  } = useDealerRegisterForm()

  const selectedLocation = findInGroups(locations, formData.locationId)
  const selectedCountry = countries.find(c => c.value === formData.countryId) ?? null
  const selectedCategories = findManyInGroups(dealerCategories, formData.categoryIds)
  const selectedMakes = makes.filter(m => formData.makeIds.includes(m.value))

  const isValid = formData.companyName.trim() !== '' && formData.address.trim() !== ''

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    update({ [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    const result = await submitDealer()
    if (result.success) {
      router.push('/dealer/admin')
    } else {
      alert(result.error || t('errorFallback'))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
        <p className="text-neutral-600">{t('subtitle')}</p>
      </div>

      {/* Company info */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold">{t('companyInfo.heading')}</h2>

        <div>
          <label className="block text-sm font-medium mb-1">{t('companyInfo.companyName')}</label>
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
            <label className="block text-sm font-medium mb-1">{t('companyInfo.registryCode')}</label>
            <input
              type="text"
              name="registryCode"
              value={formData.registryCode}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('companyInfo.vatNumber')}</label>
            <input
              type="text"
              name="vatNumber"
              value={formData.vatNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Address & contact */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold">{t('addressContact.heading')}</h2>

        <div>
          <label className="block text-sm font-medium mb-1">{t('addressContact.address')}</label>
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
            <label className="block text-sm font-medium mb-1">{t('addressContact.cityCounty')}</label>
            <Select
              instanceId="location-select"
              options={locations}
              value={selectedLocation}
              onChange={(option) => update({ locationId: option?.value ?? null })}
              isLoading={lookupsLoading}
              placeholder={t('addressContact.selectLocation')}
              isClearable
              styles={selectStyles}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('addressContact.country')}</label>
            <Select
              instanceId="country-select"
              options={countries}
              value={selectedCountry}
              onChange={(option) => update({ countryId: option?.value ?? null })}
              isLoading={lookupsLoading}
              placeholder={t('addressContact.selectCountry')}
              isClearable
              styles={selectStyles}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('addressContact.postcode')}</label>
          <input
            type="text"
            name="postcode"
            value={formData.postcode}
            onChange={handleInputChange}
            className="w-full sm:w-1/3 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

      </div>

      {/* Contacts */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold">{t('contacts.heading')}</h2>

        {formData.contacts.map((row, index) => (
          <div key={index} className="flex items-center gap-2">
            <select
              value={row.type}
              onChange={(e) => updateContactRow(index, { type: e.target.value as DealerContactType })}
              className="px-2 py-2 border border-neutral-300 rounded-lg text-sm w-36 shrink-0"
            >
              {CONTACT_TYPE_VALUES.map(v => <option key={v} value={v}>{tContact(v)}</option>)}
            </select>
            <input
              type="text"
              value={row.value}
              onChange={(e) => updateContactRow(index, { value: e.target.value })}
              placeholder={CONTACT_VALUE_PLACEHOLDER[row.type]}
              className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.contacts.length > 1 && (
              <button
                type="button"
                onClick={() => removeContactRow(index)}
                className="shrink-0 text-xs text-red-600 hover:text-red-800 font-medium"
              >
                {t('contacts.remove')}
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addContactRow}
          className="text-sm font-semibold text-blue-600 hover:text-blue-800"
        >
          {t('contacts.addContact')}
        </button>
      </div>

      {/* Business categories */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold">{t('categories.heading')}</h2>
        <p className="text-sm text-neutral-500">{t('categories.description')}</p>
        <Select
          instanceId="categories-select"
          options={dealerCategories}
          value={selectedCategories}
          onChange={(options) => update({ categoryIds: options.map(o => o.value) })}
          isLoading={lookupsLoading}
          isMulti
          isClearable
          placeholder={t('categories.placeholder')}
          styles={selectStyles}
          noOptionsMessage={() => t('categories.noOptions')}
        />
      </div>

      {/* Makes sold */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold">{t('makes.heading')}</h2>
        <p className="text-sm text-neutral-500">{t('makes.description')}</p>
        <Select
          instanceId="makes-select"
          options={makes}
          value={selectedMakes}
          onChange={(options) => update({ makeIds: options.map(o => o.value) })}
          isLoading={makesLoading}
          isMulti
          isClearable
          placeholder={t('makes.placeholder')}
          styles={selectStyles}
          noOptionsMessage={() => t('makes.noOptions')}
        />
      </div>

      {/* Images */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold">{t('images.heading')}</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('images.logo')}</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files?.[0] ?? null)}
              className="text-sm text-neutral-500 cursor-pointer file:cursor-pointer file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:transition-colors"
            />
            {formData.logo && (
              <img
                src={URL.createObjectURL(formData.logo)}
                alt={t('images.logoPreviewAlt')}
                className="mt-2 h-20 w-20 object-cover rounded-lg border border-neutral-200"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('images.cover')}</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files?.[0] ?? null)}
              className="text-sm text-neutral-500 cursor-pointer file:cursor-pointer file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:transition-colors"
            />
            {formData.coverImage && (
              <img
                src={URL.createObjectURL(formData.coverImage)}
                alt={t('images.coverPreviewAlt')}
                className="mt-2 h-20 w-32 object-cover rounded-lg border border-neutral-200"
              />
            )}
          </div>
        </div>
      </div>

      {/* Working hours */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold">{t('workingHours.heading')}</h2>

        {formData.workingHours.map((row, index) => (
          <div key={index} className="border border-neutral-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <select
                value={row.fromDay ?? ''}
                onChange={(e) => updateWorkingHourRow(index, { fromDay: e.target.value ? Number(e.target.value) : null })}
                className="px-2 py-1.5 border border-neutral-300 rounded-lg text-sm"
              >
                <option value="">{t('workingHours.day')}</option>
                {DAY_KEYS.map((key, value) => <option key={key} value={value}>{tDays(key)}</option>)}
              </select>
              <span className="text-sm text-neutral-500">{t('workingHours.to')}</span>
              <select
                value={row.toDay ?? ''}
                onChange={(e) => updateWorkingHourRow(index, { toDay: e.target.value ? Number(e.target.value) : null })}
                className="px-2 py-1.5 border border-neutral-300 rounded-lg text-sm"
              >
                <option value="">{t('workingHours.day')}</option>
                {DAY_KEYS.map((key, value) => <option key={key} value={value}>{tDays(key)}</option>)}
              </select>

              {formData.workingHours.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeWorkingHourRow(index)}
                  className="ml-auto text-xs text-red-600 hover:text-red-800 font-medium"
                >
                  {t('workingHours.remove')}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={row.fromHour ?? ''}
                onChange={(e) => updateWorkingHourRow(index, { fromHour: e.target.value ? Number(e.target.value) : null })}
                className="px-2 py-1.5 border border-neutral-300 rounded-lg text-sm"
              >
                <option value="">{t('workingHours.hourPlaceholder')}</option>
                {Array.from({ length: 24 }, (_, i) => i).map(h => <option key={h} value={h}>{String(h).padStart(2, '0')}</option>)}
              </select>
              <select
                value={row.fromMin ?? ''}
                onChange={(e) => updateWorkingHourRow(index, { fromMin: e.target.value ? Number(e.target.value) : null })}
                className="px-2 py-1.5 border border-neutral-300 rounded-lg text-sm"
              >
                <option value="">{t('workingHours.minutePlaceholder')}</option>
                {[0, 15, 30, 45].map(m => <option key={m} value={m}>{String(m).padStart(2, '0')}</option>)}
              </select>
              <span className="text-sm text-neutral-500">{t('workingHours.to')}</span>
              <select
                value={row.toHour ?? ''}
                onChange={(e) => updateWorkingHourRow(index, { toHour: e.target.value ? Number(e.target.value) : null })}
                className="px-2 py-1.5 border border-neutral-300 rounded-lg text-sm"
              >
                <option value="">{t('workingHours.hourPlaceholder')}</option>
                {Array.from({ length: 24 }, (_, i) => i).map(h => <option key={h} value={h}>{String(h).padStart(2, '0')}</option>)}
              </select>
              <select
                value={row.toMin ?? ''}
                onChange={(e) => updateWorkingHourRow(index, { toMin: e.target.value ? Number(e.target.value) : null })}
                className="px-2 py-1.5 border border-neutral-300 rounded-lg text-sm"
              >
                <option value="">{t('workingHours.minutePlaceholder')}</option>
                {[0, 15, 30, 45].map(m => <option key={m} value={m}>{String(m).padStart(2, '0')}</option>)}
              </select>

              <input
                type="text"
                value={row.note}
                onChange={(e) => updateWorkingHourRow(index, { note: e.target.value })}
                placeholder={t('workingHours.notePlaceholder')}
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
          {t('workingHours.addRow')}
        </button>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !isValid}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
      >
        {isSubmitting ? t('submitting') : t('submit')}
      </button>
    </form>
  )
}
