import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import {
  getDefaultLoanProvider,
  getDefaultInsuranceProvider,
  getLoanProviderById,
  getInsuranceProviderById,
  getFinanceAssumption,
  clampLoanTermMonths,
  DEFAULT_LOAN_TERM_MONTHS,
} from '@/lib/costAssumptions'
import { getMonthlyCostsForListings } from '@/lib/listingCost'

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
    repair: number
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
    const repairMin = toFloat(params.get('repairMin'))
    const repairMax = toFloat(params.get('repairMax'))

    const page = Math.max(1, toInt(params.get('page')) ?? 1)
    const limit = Math.min(MAX_LIMIT, Math.max(1, toInt(params.get('limit')) ?? DEFAULT_LIMIT))
    const skip = (page - 1) * limit

    const requestedLoanProviderId = toInt(params.get('loanProviderId'))
    const requestedInsuranceProviderId = toInt(params.get('insuranceProviderId'))

    const [loanProviderOverride, insuranceProviderOverride, defaultLoanProvider, defaultInsuranceProvider, financeAssumption] =
      await Promise.all([
        requestedLoanProviderId ? getLoanProviderById(requestedLoanProviderId) : Promise.resolve(null),
        requestedInsuranceProviderId ? getInsuranceProviderById(requestedInsuranceProviderId) : Promise.resolve(null),
        getDefaultLoanProvider(),
        getDefaultInsuranceProvider(),
        getFinanceAssumption(),
      ])
    const loanProvider = loanProviderOverride ?? defaultLoanProvider
    const insuranceProvider = insuranceProviderOverride ?? defaultInsuranceProvider
    const isDefaultCombo = loanProvider.id === defaultLoanProvider.id && insuranceProvider.id === defaultInsuranceProvider.id
    const loanTermMonths = clampLoanTermMonths(DEFAULT_LOAN_TERM_MONTHS, loanProvider)
    // Repair cost only depends on make/model (never on loan/insurance
    // provider), so filtering by it can always use the default combo's cache
    // row — the only one guaranteed to exist for every listing.
    const defaultLoanTermMonths = clampLoanTermMonths(DEFAULT_LOAN_TERM_MONTHS, defaultLoanProvider)
    const monthlyKm = toInt(params.get('monthlyKm')) ?? financeAssumption.defaultMonthlyMileageKm

    let orderedIds: bigint[]
    let total: number

    if (mode === 'ownership' && isDefaultCombo) {
      // Fuel cost depends on monthlyKm (a request-time parameter), so it can't
      // live behind a normal indexed WHERE — compute it in SQL against the
      // live fuel price table, filter/sort there, then hydrate the page of
      // matching rows through Prisma below. Loan/insurance/repair come from
      // the default-combo car_ownership_costs cache row (populated at
      // listing-create time — see lib/costAssumptions.ts). This fast SQL path
      // only works for the default combo, since that's the only one every
      // listing is guaranteed to have a cache row for.
      const conditions: Prisma.Sql[] = [Prisma.sql`c.status = 'active'`]
      if (makeId) conditions.push(Prisma.sql`c.make_id = ${makeId}`)
      if (modelId) conditions.push(Prisma.sql`c.model_id = ${modelId}`)
      if (fuelTypeId) conditions.push(Prisma.sql`c.fuel_type_id = ${fuelTypeId}`)
      if (transmissionId) conditions.push(Prisma.sql`c.transmission_id = ${transmissionId}`)
      if (yearMin != null) conditions.push(Prisma.sql`c.year_manufactured >= ${yearMin}`)
      if (yearMax != null) conditions.push(Prisma.sql`c.year_manufactured <= ${yearMax}`)
      const whereSql = Prisma.join(conditions, ' AND ')

      const ownershipExpr = Prisma.sql`(COALESCE(coc.total_monthly_owning, 0) +
        COALESCE(c.fuel_consumption_mixed, 0) / 100 * ${monthlyKm} * COALESCE(fpa.price_per_unit, 0))`
      const repairExpr = Prisma.sql`COALESCE(coc.monthly_repair, 0)`

      const havingConditions: Prisma.Sql[] = []
      if (ownershipMin != null) havingConditions.push(Prisma.sql`ownership_cost >= ${ownershipMin}`)
      if (ownershipMax != null) havingConditions.push(Prisma.sql`ownership_cost <= ${ownershipMax}`)
      if (repairMin != null) havingConditions.push(Prisma.sql`repair_cost >= ${repairMin}`)
      if (repairMax != null) havingConditions.push(Prisma.sql`repair_cost <= ${repairMax}`)
      const havingSql = havingConditions.length
        ? Prisma.sql`HAVING ${Prisma.join(havingConditions, ' AND ')}`
        : Prisma.empty

      const joinSql = Prisma.sql`
        LEFT JOIN car_ownership_costs coc
          ON coc.listing_id = c.id
          AND coc.loan_provider_id = ${loanProvider.id}
          AND coc.insurance_provider_id = ${insuranceProvider.id}
          AND coc.loan_term_months = ${loanTermMonths}
        LEFT JOIN fuel_price_assumptions fpa ON fpa.fuel_type_id = c.fuel_type_id
      `

      const rows = await prisma.$queryRaw<Array<{ id: bigint }>>`
        SELECT c.id AS id, ${ownershipExpr} AS ownership_cost, ${repairExpr} AS repair_cost
        FROM car_listings c
        ${joinSql}
        WHERE ${whereSql}
        ${havingSql}
        ORDER BY ownership_cost ASC
        LIMIT ${limit} OFFSET ${skip}
      `
      const countRows = await prisma.$queryRaw<Array<{ total: bigint }>>`
        SELECT COUNT(*) AS total FROM (
          SELECT ${ownershipExpr} AS ownership_cost, ${repairExpr} AS repair_cost
          FROM car_listings c
          ${joinSql}
          WHERE ${whereSql}
          ${havingSql}
        ) t
      `

      orderedIds = rows.map((r) => BigInt(r.id))
      total = Number(countRows[0]?.total ?? 0)
    } else if (mode === 'ownership') {
      // Non-default provider combo: car_ownership_costs isn't guaranteed to
      // have a row for every listing under this combo yet, so it can't be
      // filtered/sorted at the SQL level. Fetch the non-cost-filtered
      // candidates, compute+cache the combo via resolveOwnershipCostBundles
      // (write-through — subsequent requests for this combo hit the fast
      // path above's underlying cache), then filter/sort/paginate in JS.
      const where: Prisma.CarListingWhereInput = {
        status: 'active',
        ...(makeId ? { makeId } : {}),
        ...(modelId ? { modelId } : {}),
        ...(fuelTypeId ? { fuelTypeId } : {}),
        ...(transmissionId ? { transmissionId } : {}),
        ...(yearMin != null || yearMax != null
          ? { yearManufactured: { ...(yearMin != null ? { gte: yearMin } : {}), ...(yearMax != null ? { lte: yearMax } : {}) } }
          : {}),
      }

      const candidates = await prisma.carListing.findMany({
        where,
        select: {
          id: true,
          price: true,
          fuelTypeId: true,
          fuelConsumptionMixed: true,
          makeId: true,
          modelId: true,
          fuelType: { select: { technicalName: true } },
        },
      })

      const monthlyCosts = await getMonthlyCostsForListings(
        candidates.map((c) => ({
          id: c.id,
          price: Number(c.price),
          fuelTypeId: c.fuelTypeId,
          fuelTypeTechnicalName: c.fuelType.technicalName,
          fuelConsumptionMixed: c.fuelConsumptionMixed ? Number(c.fuelConsumptionMixed) : null,
          makeId: c.makeId,
          modelId: c.modelId,
        })),
        monthlyKm,
        loanProvider.id,
        insuranceProvider.id
      )

      const scored = candidates
        .map((c) => {
          const cost = monthlyCosts.get(c.id.toString())
          return { id: c.id, total: cost?.total ?? 0, repair: cost?.repair ?? 0 }
        })
        .filter(
          (c) =>
            (ownershipMin == null || c.total >= ownershipMin) &&
            (ownershipMax == null || c.total <= ownershipMax) &&
            (repairMin == null || c.repair >= repairMin) &&
            (repairMax == null || c.repair <= repairMax)
        )
        .sort((a, b) => a.total - b.total)

      total = scored.length
      orderedIds = scored.slice(skip, skip + limit).map((c) => c.id)
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
        ...(repairMin != null || repairMax != null
          ? {
              ownershipCosts: {
                some: {
                  loanProviderId: defaultLoanProvider.id,
                  insuranceProviderId: defaultInsuranceProvider.id,
                  loanTermMonths: defaultLoanTermMonths,
                  monthlyRepair: {
                    ...(repairMin != null ? { gte: repairMin } : {}),
                    ...(repairMax != null ? { lte: repairMax } : {}),
                  },
                },
              },
            }
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
        makeId: true,
        modelId: true,
        make: { select: { name: true } },
        model: { select: { name: true } },
        fuelType: { select: { technicalName: true } },
        transmission: { select: { technicalName: true } },
        images: { where: { isMain: true }, take: 1, select: { imagePath: true } },
        translations: { where: { languageCode: locale }, take: 1, select: { title: true } },
      },
    })

    const monthlyCosts = await getMonthlyCostsForListings(
      listings.map((l) => ({
        id: l.id,
        price: Number(l.price),
        fuelTypeId: l.fuelTypeId,
        fuelTypeTechnicalName: l.fuelType.technicalName,
        fuelConsumptionMixed: l.fuelConsumptionMixed ? Number(l.fuelConsumptionMixed) : null,
        makeId: l.makeId,
        modelId: l.modelId,
      })),
      monthlyKm,
      loanProvider.id,
      insuranceProvider.id
    )

    const byId = new Map(listings.map((l) => [l.id.toString(), l]))
    const results: SearchListingResult[] = orderedIds
      .map((id) => byId.get(id.toString()))
      .filter((l): l is NonNullable<typeof l> => Boolean(l))
      .map((l) => {
        const monthlyCost = monthlyCosts.get(l.id.toString()) ?? { loan: 0, insurance: 0, repair: 0, fuel: 0, total: 0 }

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
            loan: Math.round(monthlyCost.loan * 100) / 100,
            insurance: Math.round(monthlyCost.insurance * 100) / 100,
            repair: Math.round(monthlyCost.repair * 100) / 100,
            fuel: Math.round(monthlyCost.fuel * 100) / 100,
            total: Math.round(monthlyCost.total * 100) / 100,
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
