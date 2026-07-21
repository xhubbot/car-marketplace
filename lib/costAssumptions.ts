import prisma from '@/lib/prisma'
import type { FinanceAssumption, LoanProvider, InsuranceProvider } from '@/generated/prisma/client'
import {
  DEFAULT_LOAN_TERM_MONTHS,
  clampLoanTermMonths,
  computeMonthlyLoan,
  computeMonthlyInsurance,
  computeMonthlyFuelCost as computeMonthlyFuelCostPure,
  computeMonthlyRepair,
  computeTotalMonthlyOwning,
} from '@/lib/ownershipFormulas'

// FinanceAssumption, the fuel price table, and the default providers all
// change rarely (an admin tunes them occasionally), but are read on every
// create-listing and every search request — cache them in-process for a
// minute instead of round-tripping to MySQL per request.
const CACHE_TTL_MS = 60_000

let financeCache: { value: FinanceAssumption; expiresAt: number } | null = null
let fuelPriceCache: { value: Map<number, number>; expiresAt: number } | null = null
let defaultLoanProviderCache: { value: LoanProvider; expiresAt: number } | null = null
let defaultInsuranceProviderCache: { value: InsuranceProvider; expiresAt: number } | null = null

export async function getFinanceAssumption(): Promise<FinanceAssumption> {
  if (financeCache && financeCache.expiresAt > Date.now()) return financeCache.value

  const value = await prisma.financeAssumption.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  })
  financeCache = { value, expiresAt: Date.now() + CACHE_TTL_MS }
  return value
}

// Map of fuelTypeId -> EUR price per unit (per liter, or per kWh when the
// fuel type is electric). Falls back to 0 for any fuel type without a row.
export async function getFuelPriceMap(): Promise<Map<number, number>> {
  if (fuelPriceCache && fuelPriceCache.expiresAt > Date.now()) return fuelPriceCache.value

  const rows = await prisma.fuelPriceAssumption.findMany({
    select: { fuelTypeId: true, pricePerUnit: true },
  })
  const value = new Map(rows.map((r) => [r.fuelTypeId, Number(r.pricePerUnit)]))
  fuelPriceCache = { value, expiresAt: Date.now() + CACHE_TTL_MS }
  return value
}

export async function getDefaultLoanProvider(): Promise<LoanProvider> {
  if (defaultLoanProviderCache && defaultLoanProviderCache.expiresAt > Date.now()) {
    return defaultLoanProviderCache.value
  }
  const value = await prisma.loanProvider.findFirst({
    where: { active: true, isDefault: true },
    orderBy: { id: 'asc' },
  })
  if (!value) throw new Error('No default loan provider configured — seed loan_providers with isDefault: true')
  defaultLoanProviderCache = { value, expiresAt: Date.now() + CACHE_TTL_MS }
  return value
}

export async function getDefaultInsuranceProvider(): Promise<InsuranceProvider> {
  if (defaultInsuranceProviderCache && defaultInsuranceProviderCache.expiresAt > Date.now()) {
    return defaultInsuranceProviderCache.value
  }
  const value = await prisma.insuranceProvider.findFirst({
    where: { active: true, isDefault: true },
    orderBy: { id: 'asc' },
  })
  if (!value) throw new Error('No default insurance provider configured — seed insurance_providers with isDefault: true')
  defaultInsuranceProviderCache = { value, expiresAt: Date.now() + CACHE_TTL_MS }
  return value
}

export async function getLoanProviderById(id: number): Promise<LoanProvider | null> {
  return prisma.loanProvider.findFirst({ where: { id, active: true } })
}

export async function getInsuranceProviderById(id: number): Promise<InsuranceProvider | null> {
  return prisma.insuranceProvider.findFirst({ where: { id, active: true } })
}

// 3-tier fallback: exact model match -> make-level (modelId null) -> global
// (makeId and modelId both null). Each tier orders by id ascending, since
// MySQL's unique index treats every NULL as distinct — nothing in the DB
// stops a duplicate fallback row from existing, so we deterministically pick
// the lowest id instead of an arbitrary one.
export async function getRepairCostEstimate(makeId: number, modelId: number): Promise<number> {
  const exact = await prisma.repairCostEstimate.findFirst({
    where: { makeId, modelId, active: true },
    orderBy: { id: 'asc' },
  })
  if (exact) return Number(exact.averageMonthlyCost)

  const makeLevel = await prisma.repairCostEstimate.findFirst({
    where: { makeId, modelId: null, active: true },
    orderBy: { id: 'asc' },
  })
  if (makeLevel) return Number(makeLevel.averageMonthlyCost)

  const global = await prisma.repairCostEstimate.findFirst({
    where: { makeId: null, modelId: null, active: true },
    orderBy: { id: 'asc' },
  })
  return global ? Number(global.averageMonthlyCost) : 0
}

export interface OwnershipCostBundle {
  monthlyLoanPayment: number
  monthlyInsurance: number
  monthlyRepair: number
  totalMonthlyOwning: number
}

// Computes the fuel-free bundle for one listing + one provider combo. Used at
// listing-create time (default combo) and by the search write-through cache
// (any combo).
export async function computeOwnershipCostBundle(params: {
  price: number
  fuelTypeTechnicalName: string
  makeId: number
  modelId: number
  loanProvider: LoanProvider
  insuranceProvider: InsuranceProvider
  loanTermMonths: number
  downPaymentPercent?: number
}): Promise<OwnershipCostBundle> {
  const downPaymentPercent = params.downPaymentPercent ?? Number(params.loanProvider.minDownpaymentPercent)
  const repairAverage = await getRepairCostEstimate(params.makeId, params.modelId)

  const monthlyLoanPayment = computeMonthlyLoan(
    params.price,
    downPaymentPercent,
    params.loanTermMonths,
    { interestRateAnnual: Number(params.loanProvider.interestRateAnnual) }
  )
  const monthlyInsurance = computeMonthlyInsurance(
    {
      baseRatePerYear: Number(params.insuranceProvider.baseRatePerYear),
      calculationRules: params.insuranceProvider.calculationRules as { multipliers?: Record<string, number> } | null,
    },
    params.fuelTypeTechnicalName
  )
  const monthlyRepair = computeMonthlyRepair(repairAverage)
  const totalMonthlyOwning = computeTotalMonthlyOwning(monthlyLoanPayment, monthlyInsurance, monthlyRepair)

  return { monthlyLoanPayment, monthlyInsurance, monthlyRepair, totalMonthlyOwning }
}

export interface OwnershipCandidate {
  id: bigint
  price: number
  fuelTypeTechnicalName: string
  makeId: number
  modelId: number
}

// Batches computeOwnershipCostBundle + a car_ownership_costs cache read/write
// for many listings at once. Reads whatever's already cached in one query,
// computes the misses (deduping repair-cost lookups by distinct make/model),
// then write-through upserts the misses so the next request for this combo
// is a full cache hit.
export async function resolveOwnershipCostBundles(
  listings: OwnershipCandidate[],
  loanProvider: LoanProvider,
  insuranceProvider: InsuranceProvider,
  loanTermMonths: number
): Promise<Map<string, OwnershipCostBundle>> {
  const result = new Map<string, OwnershipCostBundle>()
  if (listings.length === 0) return result

  const listingIds = listings.map((l) => l.id)
  const cached = await prisma.carOwnershipCost.findMany({
    where: {
      listingId: { in: listingIds },
      loanProviderId: loanProvider.id,
      insuranceProviderId: insuranceProvider.id,
      loanTermMonths,
    },
  })
  const cachedByListing = new Map(cached.map((row) => [row.listingId.toString(), row]))

  const misses: OwnershipCandidate[] = []
  for (const listing of listings) {
    const key = listing.id.toString()
    const row = cachedByListing.get(key)
    if (row) {
      result.set(key, {
        monthlyLoanPayment: Number(row.monthlyLoanPayment),
        monthlyInsurance: Number(row.monthlyInsurance),
        monthlyRepair: Number(row.monthlyRepair),
        totalMonthlyOwning: Number(row.totalMonthlyOwning),
      })
    } else {
      misses.push(listing)
    }
  }

  if (misses.length === 0) return result

  // Dedupe repair-cost lookups by distinct (makeId, modelId) so this isn't
  // N+1 against repair_cost_estimates.
  const repairCache = new Map<string, number>()
  const getRepair = async (makeId: number, modelId: number) => {
    const key = `${makeId}:${modelId}`
    if (repairCache.has(key)) return repairCache.get(key)!
    const value = await getRepairCostEstimate(makeId, modelId)
    repairCache.set(key, value)
    return value
  }

  const computedMisses: Array<{ listingId: bigint; bundle: OwnershipCostBundle }> = []
  for (const listing of misses) {
    const downPaymentPercent = Number(loanProvider.minDownpaymentPercent)
    const monthlyLoanPayment = computeMonthlyLoan(listing.price, downPaymentPercent, loanTermMonths, {
      interestRateAnnual: Number(loanProvider.interestRateAnnual),
    })
    const monthlyInsurance = computeMonthlyInsurance(
      {
        baseRatePerYear: Number(insuranceProvider.baseRatePerYear),
        calculationRules: insuranceProvider.calculationRules as { multipliers?: Record<string, number> } | null,
      },
      listing.fuelTypeTechnicalName
    )
    const monthlyRepair = computeMonthlyRepair(await getRepair(listing.makeId, listing.modelId))
    const totalMonthlyOwning = computeTotalMonthlyOwning(monthlyLoanPayment, monthlyInsurance, monthlyRepair)
    const bundle = { monthlyLoanPayment, monthlyInsurance, monthlyRepair, totalMonthlyOwning }
    result.set(listing.id.toString(), bundle)
    computedMisses.push({ listingId: listing.id, bundle })
  }

  // Write-through cache: monthlyFuel is left at 0 here (a snapshot at the
  // default mileage only — never read by the live search total, which always
  // adds fuel live for the buyer's chosen mileage).
  await Promise.all(
    computedMisses.map(({ listingId, bundle }) =>
      prisma.carOwnershipCost.upsert({
        where: {
          unique_listing_provider_combo: {
            listingId,
            loanProviderId: loanProvider.id,
            insuranceProviderId: insuranceProvider.id,
            loanTermMonths,
          },
        },
        update: {
          monthlyLoanPayment: bundle.monthlyLoanPayment,
          monthlyInsurance: bundle.monthlyInsurance,
          monthlyRepair: bundle.monthlyRepair,
          totalMonthlyOwning: bundle.totalMonthlyOwning,
        },
        create: {
          listingId,
          loanProviderId: loanProvider.id,
          insuranceProviderId: insuranceProvider.id,
          loanTermMonths,
          monthlyLoanPayment: bundle.monthlyLoanPayment,
          monthlyInsurance: bundle.monthlyInsurance,
          monthlyFuel: 0,
          monthlyRepair: bundle.monthlyRepair,
          totalMonthlyOwning: bundle.totalMonthlyOwning,
        },
      })
    )
  )

  return result
}

// Fuel cost is linear in mileage and depends on a value the buyer chooses at
// search time, so it's never cached at an arbitrary value — always computed
// for the requested monthlyKm against the live fuel price table.
export function computeMonthlyFuelCost(
  fuelConsumptionMixed: number | null,
  fuelTypeId: number,
  monthlyKm: number,
  fuelPriceMap: Map<number, number>
): number {
  const pricePerUnit = fuelPriceMap.get(fuelTypeId) ?? 0
  return computeMonthlyFuelCostPure(fuelConsumptionMixed, pricePerUnit, monthlyKm)
}

export { DEFAULT_LOAN_TERM_MONTHS, clampLoanTermMonths }
