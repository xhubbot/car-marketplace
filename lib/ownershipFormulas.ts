// Pure ownership-cost formulas — no Prisma import, safe to bundle for the
// client. Used server-side (wrapped with DB lookups in lib/costAssumptions.ts)
// and client-side (CarDetailsOwnershipSidebar recomputes on slider drag with
// zero network calls, using provider/fuel-price data fetched once on mount).

export const DEFAULT_LOAN_TERM_MONTHS = 60

export interface LoanProviderRateInput {
  interestRateAnnual: number
  minTermMonths: number
  maxTermMonths: number
}

export interface InsuranceProviderRateInput {
  baseRatePerYear: number
  calculationRules: { multipliers?: Record<string, number> } | null
}

export function clampLoanTermMonths(
  requested: number,
  provider: Pick<LoanProviderRateInput, 'minTermMonths' | 'maxTermMonths'>
): number {
  return Math.min(provider.maxTermMonths, Math.max(provider.minTermMonths, requested))
}

// Standard loan amortization payment. Falls back to a straight-line split
// when the rate is zero to avoid a 0/0 division.
export function computeMonthlyLoan(
  price: number,
  downPaymentPercent: number,
  termMonths: number,
  provider: Pick<LoanProviderRateInput, 'interestRateAnnual'>
): number {
  const loanAmount = price * (1 - downPaymentPercent / 100)
  const monthlyRate = provider.interestRateAnnual / 100 / 12

  if (loanAmount <= 0 || termMonths <= 0) return 0
  if (monthlyRate === 0) return loanAmount / termMonths

  const payment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths))
  return Math.max(0, payment)
}

// Flat annual rate scaled by a per-fuel-type multiplier (e.g. cheaper for
// electric), NOT a percentage of the car's price.
export function computeMonthlyInsurance(
  provider: InsuranceProviderRateInput,
  fuelTypeTechnicalName: string
): number {
  const multiplier = provider.calculationRules?.multipliers?.[fuelTypeTechnicalName] ?? 1
  return (provider.baseRatePerYear / 12) * multiplier
}

// Fuel cost is linear in mileage and depends on a value the buyer chooses,
// so it's never cached at an arbitrary value — always computed live.
export function computeMonthlyFuelCost(
  fuelConsumptionMixed: number | null,
  pricePerUnit: number,
  monthlyKm: number
): number {
  if (!fuelConsumptionMixed) return 0
  return (fuelConsumptionMixed / 100) * monthlyKm * pricePerUnit
}

// Repair cost is a direct lookup value (no formula) — kept as a function for
// call-site symmetry with the other compute* functions.
export function computeMonthlyRepair(averageMonthlyCost: number): number {
  return averageMonthlyCost
}

// Deliberately excludes fuel — matches the CarOwnershipCost.totalMonthlyOwning
// column, which is a snapshot at a fixed default mileage while fuel is always
// live. Callers displaying an on-screen total should add fuel separately.
export function computeTotalMonthlyOwning(loan: number, insurance: number, repair: number): number {
  return loan + insurance + repair
}

// Static 6-point resale-value ratio curve (years 0-5) applied to a listing's
// price. Not schema-backed — a rough depreciation illustration, not a
// recurring monthly cost.
export function getValueCurvePoints(price: number): { year: number; value: number }[] {
  const rates = [1, 0.82, 0.7, 0.61, 0.54, 0.48]
  return rates.map((rate, i) => ({ year: i, value: Math.round(price * rate) }))
}
