import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Building2, MapPin, Phone, Mail, Globe, ExternalLink, MessageCircle, Send, Clock } from 'lucide-react'
import Navbar from '@/components/Navbar'
import prisma from '@/lib/prisma'
import type { DealerContactType } from '@/generated/prisma/client'

interface DealerDetailPageProps {
  params: Promise<{ locale: string; slug: string }>
}

const DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const

const CONTACT_ICON: Record<DealerContactType, typeof Phone> = {
  phone: Phone,
  email: Mail,
  website: Globe,
  facebook: ExternalLink,
  instagram: ExternalLink,
  whatsapp: MessageCircle,
  telegram: Send,
  linkedin: ExternalLink,
  youtube: ExternalLink,
  other: Globe,
}

function contactHref(type: DealerContactType, value: string): string {
  if (type === 'phone' || type === 'whatsapp') return `tel:${value}`
  if (type === 'email') return `mailto:${value}`
  return value.startsWith('http') ? value : `https://${value}`
}

function formatTime(date: Date | null): string | null {
  if (!date) return null
  return `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`
}

const INTL_LOCALE: Record<string, string> = { en: 'en-US', et: 'et-EE', ru: 'ru-RU' }

function formatPrice(price: unknown, currency: string, locale: string): string {
  const amount = Number(price)
  return new Intl.NumberFormat(INTL_LOCALE[locale] ?? locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
}

export default async function DealerDetailPage({ params }: DealerDetailPageProps) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'dealer.detail' })
  const tDays = await getTranslations({ locale, namespace: 'dealer.days' })
  const tContact = await getTranslations({ locale, namespace: 'dealer.contactTypes' })

  const dealer = await prisma.dealer.findFirst({
    where: { slug, status: 'active' },
    select: {
      id: true,
      companyName: true,
      registryCode: true,
      vatNumber: true,
      logoPath: true,
      coverImagePath: true,
      locations: {
        where: { isPrimary: true },
        take: 1,
        select: {
          addressLine: true,
          postalCode: true,
          location: { select: { id: true, fallbackName: true } },
          country: { select: { id: true, fallbackName: true } },
          workingHours: { orderBy: { dayOfWeek: 'asc' }, select: { dayOfWeek: true, opensAt: true, closesAt: true, isClosed: true, note: true } },
        },
      },
      contacts: { orderBy: { sortOrder: 'asc' }, select: { type: true, value: true } },
      categories: { select: { category: { select: { id: true, fallbackName: true } } } },
      makes: { select: { make: { select: { id: true, name: true } } } },
      listings: {
        where: { status: 'active' },
        orderBy: { createdAt: 'desc' },
        take: 24,
        select: {
          id: true,
          modelTrim: true,
          yearManufactured: true,
          mileage: true,
          price: true,
          currency: true,
          make: { select: { name: true } },
          model: { select: { name: true } },
          fuelType: { select: { technicalName: true } },
          images: { orderBy: { sortOrder: 'asc' }, take: 1, select: { imagePath: true } },
        },
      },
    },
  })

  if (!dealer) notFound()

  const primaryLocation = dealer.locations[0]

  // Localize category/location names in one batch, same pattern as /api/lookups and /api/dealers
  const categoryRefIds = dealer.categories.map(c => c.category.id)
  const locationRefIds = primaryLocation?.location ? [primaryLocation.location.id] : []
  const translations = categoryRefIds.length + locationRefIds.length > 0
    ? await prisma.translation.findMany({
        where: {
          languageCode: locale,
          OR: [
            { category: 'dealer_category', refId: { in: categoryRefIds } },
            { category: 'location', refId: { in: locationRefIds } },
          ],
        },
        select: { category: true, refId: true, name: true },
      })
    : []
  const byCategory = new Map<string, Map<number, string>>()
  for (const t of translations) {
    if (!byCategory.has(t.category)) byCategory.set(t.category, new Map())
    byCategory.get(t.category)!.set(t.refId, t.name)
  }
  const label = (category: string, id: number, fallback: string) => byCategory.get(category)?.get(id) ?? fallback

  const categoryNames = dealer.categories.map(c => label('dealer_category', c.category.id, c.category.fallbackName))
  const makeNames = dealer.makes.map(m => m.make.name)
  const locationLabel = primaryLocation?.location
    ? label('location', primaryLocation.location.id, primaryLocation.location.fallbackName)
    : null

  return (
    <>
      <Navbar />

      {/* Cover + logo */}
      <div className="relative h-48 sm:h-64 bg-neutral-200">
        {dealer.coverImagePath && (
          <img src={dealer.coverImagePath} alt="" className="w-full h-full object-cover" />
        )}
        <div className="absolute -bottom-10 left-4 sm:left-8">
          {dealer.logoPath ? (
            <img
              src={dealer.logoPath}
              alt={`${dealer.companyName} logo`}
              className="h-20 w-20 rounded-xl object-cover border-4 border-white shadow-sm bg-white"
            />
          ) : (
            <div className="h-20 w-20 rounded-xl bg-white border-4 border-white shadow-sm flex items-center justify-center">
              <Building2 className="h-8 w-8 text-neutral-400" />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-14 pb-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">{dealer.companyName}</h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-neutral-500">
            {dealer.registryCode && <span>{t('registryCodeLabel', { code: dealer.registryCode })}</span>}
            {dealer.vatNumber && <span>{t('taxNumberLabel', { number: dealer.vatNumber })}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: address, contacts, hours */}
          <div className="lg:col-span-1 space-y-6">
            {primaryLocation && (
              <div className="bg-white rounded-lg shadow-sm p-5 space-y-2">
                <h2 className="font-bold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  {t('address')}
                </h2>
                <p className="text-sm text-neutral-600">
                  {primaryLocation.addressLine}
                  {primaryLocation.postalCode && `, ${primaryLocation.postalCode}`}
                  {locationLabel && <>, {locationLabel}</>}
                  {primaryLocation.country && <>, {primaryLocation.country.fallbackName}</>}
                </p>
              </div>
            )}

            {dealer.contacts.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-5 space-y-3">
                <h2 className="font-bold">{t('contacts')}</h2>
                <ul className="space-y-2">
                  {dealer.contacts.map((contact, i) => {
                    const Icon = CONTACT_ICON[contact.type]
                    return (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Icon className="h-4 w-4 text-neutral-400 shrink-0" />
                        <a
                          href={contactHref(contact.type, contact.value)}
                          target={contact.type === 'phone' || contact.type === 'email' ? undefined : '_blank'}
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-all"
                        >
                          {contact.value}
                        </a>
                        <span className="text-xs text-neutral-400">({tContact(contact.type)})</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {primaryLocation && primaryLocation.workingHours.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-5 space-y-3">
                <h2 className="font-bold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  {t('workingHours')}
                </h2>
                <ul className="text-sm text-neutral-600 space-y-1">
                  {primaryLocation.workingHours.map((wh, i) => (
                    <li key={i} className="flex justify-between gap-2">
                      <span className="font-medium">{tDays(DAY_KEYS[wh.dayOfWeek])}</span>
                      <span>
                        {wh.isClosed
                          ? t('closed')
                          : wh.opensAt && wh.closesAt
                            ? `${formatTime(wh.opensAt)}–${formatTime(wh.closesAt)}`
                            : wh.note || '—'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right column: categories, makes */}
          <div className="lg:col-span-2 space-y-6">
            {categoryNames.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-5 space-y-3">
                <h2 className="font-bold">{t('categories')}</h2>
                <div className="flex flex-wrap gap-1.5">
                  {categoryNames.map(name => (
                    <span key={name} className="inline-block px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {makeNames.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-5 space-y-3">
                <h2 className="font-bold">{t('makes')}</h2>
                <div className="flex flex-wrap gap-1.5">
                  {makeNames.map(name => (
                    <span key={name} className="inline-block px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Listings */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">
            {t('listings')} <span className="text-neutral-400 font-normal">({dealer.listings.length})</span>
          </h2>

          {dealer.listings.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 bg-white rounded-lg shadow-sm">
              {t('noListings')}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dealer.listings.map(listing => (
                <Link
                  key={listing.id.toString()}
                  href={`/${locale}/listings/${listing.id}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {listing.images[0] ? (
                    <img
                      src={listing.images[0].imagePath}
                      alt={`${listing.make.name} ${listing.model.name}`}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-neutral-100 flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-neutral-300" />
                    </div>
                  )}
                  <div className="p-4 space-y-1">
                    <h3 className="font-bold truncate">
                      {listing.make.name} {listing.model.name}{listing.modelTrim ? ` ${listing.modelTrim}` : ''}
                    </h3>
                    <p className="text-lg font-bold text-blue-600">{formatPrice(listing.price, listing.currency, locale)}</p>
                    <p className="text-xs text-neutral-500">
                      {listing.yearManufactured} · {listing.mileage.toLocaleString(INTL_LOCALE[locale] ?? locale)} km · {listing.fuelType.technicalName}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
