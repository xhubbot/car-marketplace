export const DEFAULT_FUEL_PRICE = 1.65;
export const DEFAULT_ELECTRICITY_PRICE = 0.18;

export function calculateEnergyCost(
  monthlyMileage: number,
  fuelEfficiency: number,
  fuelType: string,
  fuelCostPerUnit: number,
): number {
  return Math.round((monthlyMileage * fuelEfficiency * fuelCostPerUnit) / 100);
}

export function calculateLoanPayment(
  price: number,
  downpayment: number,
  interestRate: number,
  loanTermYears: number,
): number {
  const principal = price - downpayment;
  if (principal <= 0) return 0;
  const monthlyRate = interestRate / 100 / 12;
  const totalPayments = loanTermYears * 12;
  if (monthlyRate === 0) return Math.round(principal / totalPayments);
  const pmt =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
    (Math.pow(1 + monthlyRate, totalPayments) - 1);
  return Math.round(pmt);
}

export function calculateTotalMonthlyTCO(
  loanPayment: number,
  repairs: number,
  insurance: number,
  depreciation: number,
  energyCost: number,
): number {
  return Math.round(loanPayment + repairs + insurance + depreciation + energyCost);
}

export function getClassAverageTCO(lifestyle: string): number {
  const map: Record<string, number> = { speed: 1900, adventure: 950, commute: 1100 };
  return map[lifestyle] ?? 750;
}

export function getValueCurvePoints(price: number): { year: number; value: number }[] {
  const rates = [1, 0.82, 0.7, 0.61, 0.54, 0.48];
  return rates.map((rate, i) => ({ year: i, value: Math.round(price * rate) }));
}
