import {
  getDefaultLoanProvider,
  getDefaultInsuranceProvider,
  getLoanProviderById,
  getInsuranceProviderById,
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

// Resolves the cost breakdown for a batch of listings in one pass:
// loan/insurance/repair come from the car_ownership_costs cache (via
// resolveOwnershipCostBundles, which computes and write-through caches any
// combo not already cached), fuel is always computed live for the given
// monthlyKm (defaults to FinanceAssumption.defaultMonthlyMileageKm) since it
// depends on a value the buyer chooses, never a cached snapshot.
// loanProviderId/insuranceProviderId let a caller price a specific provider
// combo (e.g. a search filter); omitted, they fall back to the defaults.
export async function getMonthlyCostsForListings(
  listings: ListingForCost[],
  monthlyKm?: number,
  loanProviderId?: number,
  insuranceProviderId?: number
): Promise<Map<string, MonthlyCost>> {
  const result = new Map<string, MonthlyCost>()
  if (listings.length === 0) return result

  const [loanProviderOverride, insuranceProviderOverride, defaultLoanProvider, defaultInsuranceProvider, financeAssumption, fuelPriceMap] =
    await Promise.all([
      loanProviderId ? getLoanProviderById(loanProviderId) : Promise.resolve(null),
      insuranceProviderId ? getInsuranceProviderById(insuranceProviderId) : Promise.resolve(null),
      getDefaultLoanProvider(),
      getDefaultInsuranceProvider(),
      getFinanceAssumption(),
      getFuelPriceMap(),
    ])
  const loanProvider = loanProviderOverride ?? defaultLoanProvider
  const insuranceProvider = insuranceProviderOverride ?? defaultInsuranceProvider
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
