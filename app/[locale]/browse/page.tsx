import Link from 'next/link'
import { Building2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import prisma from '@/lib/prisma'
import { getMonthlyCostsForListings } from '@/lib/listingCost'

interface BrowsePageProps {
  params: Promise<{ locale: string }>
}

const INTL_LOCALE: Record<string, string> = { en: 'en-US', et: 'et-EE', ru: 'ru-RU' }

function formatPrice(price: unknown, currency: string, locale: string): string {
  const amount = Number(price)
  return new Intl.NumberFormat(INTL_LOCALE[locale] ?? locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
}

export default async function Browse({ params }: BrowsePageProps) {
  const { locale } = await params

  const listings = await prisma.carListing.findMany({
    where: { status: 'active' },
    orderBy: { createdAt: 'desc' },
    take: 60,
    select: {
      id: true,
      modelTrim: true,
      yearManufactured: true,
      mileage: true,
      price: true,
      currency: true,
      fuelTypeId: true,
      fuelConsumptionMixed: true,
      makeId: true,
      modelId: true,
      make: { select: { name: true } },
      model: { select: { name: true } },
      fuelType: { select: { technicalName: true } },
      images: { orderBy: { sortOrder: 'asc' }, take: 1, select: { imagePath: true } },
    },
  })

  const monthlyCosts = await getMonthlyCostsForListings(
    listings.map((listing) => ({
      id: listing.id,
      price: Number(listing.price),
      fuelTypeId: listing.fuelTypeId,
      fuelTypeTechnicalName: listing.fuelType.technicalName,
      fuelConsumptionMixed: listing.fuelConsumptionMixed ? Number(listing.fuelConsumptionMixed) : null,
      makeId: listing.makeId,
      modelId: listing.modelId,
    }))
  )

  return (
    <>
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-6 pb-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Browse Cars</h1>
          <p className="text-gray-600">{listings.length} cars available</p>
        </div>

        {listings.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 bg-white rounded-lg shadow-sm">
            No active listings right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => {
              const monthlyCost = monthlyCosts.get(listing.id.toString())
              return (
                <Link
                  key={listing.id.toString()}
                  href={`/${locale}/details/${listing.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
                >
                  {listing.images[0] ? (
                    <img
                      src={listing.images[0].imagePath}
                      alt={`${listing.make.name} ${listing.model.name}`}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-neutral-100 flex items-center justify-center">
                      <Building2 className="h-10 w-10 text-neutral-300" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold">
                      {listing.make.name} {listing.model.name}{listing.modelTrim ? ` ${listing.modelTrim}` : ''}
                    </h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                      {formatPrice(listing.price, listing.currency, locale)}
                    </p>
                    {monthlyCost && (
                      <p className="text-sm font-semibold text-emerald-600 mt-1">
                        ~{Math.round(monthlyCost.total).toLocaleString(INTL_LOCALE[locale] ?? locale)} {listing.currency}/mo real cost
                      </p>
                    )}

                    <div className="mt-4 text-sm text-gray-600 space-y-1">
                      <p>
                        {listing.yearManufactured} · {listing.mileage.toLocaleString(INTL_LOCALE[locale] ?? locale)} km · {listing.fuelType.technicalName}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
