import {
  getDefaultLoanProvider,
  getDefaultInsuranceProvider,
  getFinanceAssumption,
  getFuelPriceMap,
  resolveOwnershipCostBundles,
  computeMonthlyFuelCost,
  clampLoanTermMonths,
  DEFAULT_LOAN_TERM_MONTHS,
  type OwnershipCandidate,
} from '@/lib/costAssumptions'

export interface MonthlyCost {
  loan: number
  insurance: number
  repair: number
  fuel: number
  total: number
}

export interface ListingForCost {
  id: bigint
  price: number
  fuelTypeId: number
  fuelTypeTechnicalName: string
  fuelConsumptionMixed: number | null
  makeId: number
  modelId: number
}

// Resolves the default-combo cost breakdown for a batch of listings in one
// pass: loan/insurance/repair come from the car_ownership_costs cache (via
// resolveOwnershipCostBundles), fuel is always computed live for the given
// monthlyKm (defaults to FinanceAssumption.defaultMonthlyMileageKm) since it
// depends on a value the buyer chooses, never a cached snapshot.
export async function getMonthlyCostsForListings(
  listings: ListingForCost[],
  monthlyKm?: number
): Promise<Map<string, MonthlyCost>> {
  const result = new Map<string, MonthlyCost>()
  if (listings.length === 0) return result

  const [loanProvider, insuranceProvider, financeAssumption, fuelPriceMap] = await Promise.all([
    getDefaultLoanProvider(),
    getDefaultInsuranceProvider(),
    getFinanceAssumption(),
    getFuelPriceMap(),
  ])
  const loanTermMonths = clampLoanTermMonths(DEFAULT_LOAN_TERM_MONTHS, loanProvider)
  const effectiveMonthlyKm = monthlyKm ?? financeAssumption.defaultMonthlyMileageKm

  const candidates: OwnershipCandidate[] = listings.map((l) => ({
    id: l.id,
    price: l.price,
    fuelTypeTechnicalName: l.fuelTypeTechnicalName,
    makeId: l.makeId,
    modelId: l.modelId,
  }))
  const bundles = await resolveOwnershipCostBundles(candidates, loanProvider, insuranceProvider, loanTermMonths)

  for (const listing of listings) {
    const key = listing.id.toString()
    const bundle = bundles.get(key)
    if (!bundle) continue
    const fuel = computeMonthlyFuelCost(listing.fuelConsumptionMixed, listing.fuelTypeId, effectiveMonthlyKm, fuelPriceMap)
    result.set(key, {
      loan: bundle.monthlyLoanPayment,
      insurance: bundle.monthlyInsurance,
      repair: bundle.monthlyRepair,
      fuel,
      total: bundle.totalMonthlyOwning + fuel,
    })
  }

  return result
}
