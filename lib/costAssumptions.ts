import prisma from '@/lib/prisma'
import type { FinanceAssumption } from '@/generated/prisma/client'

// Both the finance assumption row and the fuel price table change rarely (an
// admin tunes them occasionally), but are read on every create-listing and
// every search request — cache them in-process for a minute instead of
// round-tripping to MySQL per request.
const CACHE_TTL_MS = 60_000

let financeCache: { value: FinanceAssumption; expiresAt: number } | null = null
let fuelPriceCache: { value: Map<number, number>; expiresAt: number } | null = null

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

// Standard loan amortization payment. Falls back to a straight-line split
// when the rate is zero to avoid a 0/0 division.
export function computeMonthlyLoan(price: number, fa: FinanceAssumption): number {
  const loanAmount = price * (1 - Number(fa.downPaymentPct) / 100)
  const monthlyRate = Number(fa.annualInterestPct) / 100 / 12
  const termMonths = fa.loanTermMonths

  if (loanAmount <= 0 || termMonths <= 0) return 0
  if (monthlyRate === 0) return loanAmount / termMonths

  const payment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths))
  return Math.max(0, payment)
}

export function computeMonthlyInsurance(price: number, fa: FinanceAssumption): number {
  return (price * Number(fa.insuranceAnnualPctOfPrice)) / 100 / 12
}

export function computeMonthlyMaintenance(yearManufactured: number, fa: FinanceAssumption): number {
  const ageYears = Math.max(0, new Date().getFullYear() - yearManufactured)
  return Number(fa.maintenanceBaseMonthly) + ageYears * Number(fa.maintenancePerAgeYearMonthly)
}

// The three "fixed" monthly cost fields stored on CarListing — independent of
// how much the buyer plans to drive, unlike fuel cost below.
export function computeFixedCostEstimates(
  price: number,
  yearManufactured: number,
  fa: FinanceAssumption
): { estMonthlyLoan: number; estMonthlyInsurance: number; estMonthlyMaintenance: number } {
  return {
    estMonthlyLoan: computeMonthlyLoan(price, fa),
    estMonthlyInsurance: computeMonthlyInsurance(price, fa),
    estMonthlyMaintenance: computeMonthlyMaintenance(yearManufactured, fa),
  }
}

// Fuel cost is linear in mileage and depends on a value the buyer chooses at
// search time, so it's never stored — always computed for the requested
// monthlyKm against the live fuel price table.
export function computeMonthlyFuelCost(
  fuelConsumptionMixed: number | null,
  fuelTypeId: number,
  monthlyKm: number,
  fuelPriceMap: Map<number, number>
): number {
  if (!fuelConsumptionMixed) return 0
  const pricePerUnit = fuelPriceMap.get(fuelTypeId) ?? 0
  return (fuelConsumptionMixed / 100) * monthlyKm * pricePerUnit
}
