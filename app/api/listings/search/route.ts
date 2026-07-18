import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { computeMonthlyFuelCost, getFinanceAssumption, getFuelPriceMap } from '@/lib/costAssumptions'

type SearchMode = 'price' | 'ownership'

const MAX_LIMIT = 50
const DEFAULT_LIMIT = 20

function toInt(value: string | null): number | null {
  if (!value) return null
  const parsed = parseInt(value, 10)
  return Number.isNaN(parsed) ? null : parsed
}

function toFloat(value: string | null): number | null {
  if (!value) return null
  const parsed = parseFloat(value)
  return Number.isNaN(parsed) ? null : parsed
}

export interface SearchListingResult {
  id: number
  title: string
  make: string
  model: string
  modelTrim: string | null
  year: number
  mileage: number
  price: number
  currency: string
  image: string | null
  fuelType: string
  transmission: string | null
  monthlyCost: {
    loan: number
    insurance: number
    maintenance: number
    fuel: number
    total: number
  }
}

export interface SearchResponse {
  listings: SearchListingResult[]
  page: number
  limit: number
  total: number
  totalPages: number
  monthlyKm: number
}

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams
    const mode = (params.get('mode') === 'ownership' ? 'ownership' : 'price') as SearchMode
    const locale = params.get('locale') ?? 'en'

    const makeId = toInt(params.get('makeId'))
    const modelId = toInt(params.get('modelId'))
    const fuelTypeId = toInt(params.get('fuelTypeId'))
    const transmissionId = toInt(params.get('transmissionId'))
    const yearMin = toInt(params.get('yearMin'))
    const yearMax = toInt(params.get('yearMax'))
    const priceMin = toFloat(params.get('priceMin'))
    const priceMax = toFloat(params.get('priceMax'))
    const ownershipMin = toFloat(params.get('ownershipMin'))
    const ownershipMax = toFloat(params.get('ownershipMax'))

    const page = Math.max(1, toInt(params.get('page')) ?? 1)
    const limit = Math.min(MAX_LIMIT, Math.max(1, toInt(params.get('limit')) ?? DEFAULT_LIMIT))
    const skip = (page - 1) * limit

    const financeAssumption = await getFinanceAssumption()
    const monthlyKm = toInt(params.get('monthlyKm')) ?? financeAssumption.defaultMonthlyMileageKm
    const fuelPriceMap = await getFuelPriceMap()

    let orderedIds: bigint[]
    let total: number

    if (mode === 'ownership') {
      // Fuel cost depends on monthlyKm (a request-time parameter), so it can't
      // live behind a normal indexed WHERE — compute it in SQL against the
      // live fuel price table, filter/sort there, then hydrate the page of
      // matching rows through Prisma below. See lib/costAssumptions.ts.
      const conditions: Prisma.Sql[] = [Prisma.sql`c.status = 'active'`]
      if (makeId) conditions.push(Prisma.sql`c.make_id = ${makeId}`)
      if (modelId) conditions.push(Prisma.sql`c.model_id = ${modelId}`)
      if (fuelTypeId) conditions.push(Prisma.sql`c.fuel_type_id = ${fuelTypeId}`)
      if (transmissionId) conditions.push(Prisma.sql`c.transmission_id = ${transmissionId}`)
      if (yearMin != null) conditions.push(Prisma.sql`c.year_manufactured >= ${yearMin}`)
      if (yearMax != null) conditions.push(Prisma.sql`c.year_manufactured <= ${yearMax}`)
      const whereSql = Prisma.join(conditions, ' AND ')

      const ownershipExpr = Prisma.sql`(c.est_monthly_loan + c.est_monthly_insurance + c.est_monthly_maintenance +
        COALESCE(c.fuel_consumption_mixed, 0) / 100 * ${monthlyKm} * COALESCE(fpa.price_per_unit, 0))`

      const havingConditions: Prisma.Sql[] = []
      if (ownershipMin != null) havingConditions.push(Prisma.sql`ownership_cost >= ${ownershipMin}`)
      if (ownershipMax != null) havingConditions.push(Prisma.sql`ownership_cost <= ${ownershipMax}`)
      const havingSql = havingConditions.length
        ? Prisma.sql`HAVING ${Prisma.join(havingConditions, ' AND ')}`
        : Prisma.empty

      const rows = await prisma.$queryRaw<Array<{ id: bigint }>>`
        SELECT c.id AS id, ${ownershipExpr} AS ownership_cost
        FROM car_listings c
        LEFT JOIN fuel_price_assumptions fpa ON fpa.fuel_type_id = c.fuel_type_id
        WHERE ${whereSql}
        ${havingSql}
        ORDER BY ownership_cost ASC
        LIMIT ${limit} OFFSET ${skip}
      `
      const countRows = await prisma.$queryRaw<Array<{ total: bigint }>>`
        SELECT COUNT(*) AS total FROM (
          SELECT ${ownershipExpr} AS ownership_cost
          FROM car_listings c
          LEFT JOIN fuel_price_assumptions fpa ON fpa.fuel_type_id = c.fuel_type_id
          WHERE ${whereSql}
          ${havingSql}
        ) t
      `

      orderedIds = rows.map((r) => BigInt(r.id))
      total = Number(countRows[0]?.total ?? 0)
    } else {
      const where: Prisma.CarListingWhereInput = {
        status: 'active',
        ...(makeId ? { makeId } : {}),
        ...(modelId ? { modelId } : {}),
        ...(fuelTypeId ? { fuelTypeId } : {}),
        ...(transmissionId ? { transmissionId } : {}),
        ...(yearMin != null || yearMax != null
          ? { yearManufactured: { ...(yearMin != null ? { gte: yearMin } : {}), ...(yearMax != null ? { lte: yearMax } : {}) } }
          : {}),
        ...(priceMin != null || priceMax != null
          ? { price: { ...(priceMin != null ? { gte: priceMin } : {}), ...(priceMax != null ? { lte: priceMax } : {}) } }
          : {}),
      }

      const [rows, count] = await Promise.all([
        prisma.carListing.findMany({ where, select: { id: true }, orderBy: { price: 'asc' }, skip, take: limit }),
        prisma.carListing.count({ where }),
      ])
      orderedIds = rows.map((r) => r.id)
      total = count
    }

    const listings = await prisma.carListing.findMany({
      where: { id: { in: orderedIds } },
      select: {
        id: true,
        modelTrim: true,
        yearManufactured: true,
        mileage: true,
        price: true,
        currency: true,
        fuelTypeId: true,
        fuelConsumptionMixed: true,
        estMonthlyLoan: true,
        estMonthlyInsurance: true,
        estMonthlyMaintenance: true,
        make: { select: { name: true } },
        model: { select: { name: true } },
        fuelType: { select: { technicalName: true } },
        transmission: { select: { technicalName: true } },
        images: { where: { isMain: true }, take: 1, select: { imagePath: true } },
        translations: { where: { languageCode: locale }, take: 1, select: { title: true } },
      },
    })

    const byId = new Map(listings.map((l) => [l.id.toString(), l]))
    const results: SearchListingResult[] = orderedIds
      .map((id) => byId.get(id.toString()))
      .filter((l): l is NonNullable<typeof l> => Boolean(l))
      .map((l) => {
        const fuel = computeMonthlyFuelCost(
          l.fuelConsumptionMixed ? Number(l.fuelConsumptionMixed) : null,
          l.fuelTypeId,
          monthlyKm,
          fuelPriceMap
        )
        const loan = Number(l.estMonthlyLoan)
        const insurance = Number(l.estMonthlyInsurance)
        const maintenance = Number(l.estMonthlyMaintenance)

        return {
          id: Number(l.id),
          title: l.translations[0]?.title ?? `${l.make.name} ${l.model.name}`,
          make: l.make.name,
          model: l.model.name,
          modelTrim: l.modelTrim,
          year: l.yearManufactured,
          mileage: l.mileage,
          price: Number(l.price),
          currency: l.currency,
          image: l.images[0]?.imagePath ?? null,
          fuelType: l.fuelType.technicalName,
          transmission: l.transmission?.technicalName ?? null,
          monthlyCost: {
            loan: Math.round(loan * 100) / 100,
            insurance: Math.round(insurance * 100) / 100,
            maintenance: Math.round(maintenance * 100) / 100,
            fuel: Math.round(fuel * 100) / 100,
            total: Math.round((loan + insurance + maintenance + fuel) * 100) / 100,
          },
        }
      })

    return NextResponse.json({
      listings: results,
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      monthlyKm,
    } satisfies SearchResponse)
  } catch (error) {
    console.error('[GET /api/listings/search]', error)
    return NextResponse.json({ message: 'Failed to search listings' }, { status: 500 })
  }
}
