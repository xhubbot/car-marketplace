// The installed `chassi` package ships no .d.ts files despite declaring
// "types": "dist/index.d.ts" in its package.json, so we hand-write the
// subset of its API this project uses, per the documented README shape.
declare module 'chassi' {
  export interface DecodeVinOptions {
    strict?: boolean
    includeComponents?: boolean
  }

  export interface VinComponents {
    wmi: string
    vds: string
    vis: string
    yearCode: string
    plantCode: string
    sequentialNumber: string
  }

  export interface DecodeVinResult {
    vin: string
    valid: boolean
    manufacturer?: string
    country?: string
    countryCode?: string
    year?: number
    possibleYears: number[]
    model?: string
    confidence: number
    components?: VinComponents
    disclaimer: string
  }

  export interface ValidateVinOptions {
    strictCheckDigit?: boolean
  }

  export interface ValidateVinResult {
    valid: boolean
    vin: string
    normalizedVin: string
    errors: string[]
    details: {
      lengthValid: boolean
      charactersValid: boolean
      checkDigitValid: boolean
      checkDigitApplicable: boolean
      providedCheckDigit?: string
      calculatedCheckDigit?: string
    }
  }

  export function decodeVin(vin: string, options?: DecodeVinOptions): DecodeVinResult
  export function validateVin(vin: string, options?: ValidateVinOptions): ValidateVinResult
}
