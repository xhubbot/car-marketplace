import type { MonthlyCost } from '@/lib/listingCost'

// Real, DB-backed listing shape shared by the homepage cards, the details
// page, and their child components — replaces the old hardcoded mock
// `CarListing`/`CarExpenses` types from lib/types.ts (deleted). Fields that
// had no real schema equivalent (lifestyle tag, truth score, highlights,
// owner review, seller rating) are intentionally not part of this type.
export interface RealListing {
  id: number
  make: string
  model: string
  modelTrim: string | null
  year: number
  price: number
  currency: string
  image: string | null
  images: string[]
  color: string | null
  specs: {
    engine: string | null
    power: string | null
    acceleration: string | null
    fuelEfficiency: number
    fuelTypeTechnicalName: string
    isElectric: boolean
    transmission: string | null
    driveType: string | null
  }
  monthlyCost: MonthlyCost
}

export interface ListingRow {
  id: bigint
  modelTrim: string | null
  yearManufactured: number
  price: unknown // Prisma Decimal
  currency: string
  engineDisplacementCc: number | null
  enginePowerKw: number | null
  enginePowerHp: number | null
  engineInfo: string | null
  acceleration0100: unknown // Prisma Decimal | null
  fuelConsumptionMixed: unknown // Prisma Decimal | null
  fuelTypeId: number
  makeId: number
  modelId: number
  make: { name: string }
  model: { name: string }
  fuelType: { technicalName: string; isElectric: boolean }
  transmission: { technicalName: string } | null
  driveType: { technicalName: string } | null
  color: { technicalName: string } | null
  colorFinish: string | null
  images: { imagePath: string }[]
}

function formatPower(hp: number | null, kw: number | null): string | null {
  if (hp) return `${hp} hp`
  if (kw) return `${kw} kW`
  return null
}

function formatEngine(info: string | null, displacementCc: number | null): string | null {
  if (info) return info
  if (displacementCc) return `${(displacementCc / 1000).toFixed(1)}L`
  return null
}

export function toRealListing(row: ListingRow, monthlyCost: MonthlyCost): RealListing {
  return {
    id: Number(row.id),
    make: row.make.name,
    model: row.model.name,
    modelTrim: row.modelTrim,
    year: row.yearManufactured,
    price: Number(row.price),
    currency: row.currency,
    image: row.images[0]?.imagePath ?? null,
    images: row.images.map((i) => i.imagePath),
    color: row.color ? `${row.color.technicalName}${row.colorFinish ? ` ${row.colorFinish}` : ''}` : null,
    specs: {
      engine: formatEngine(row.engineInfo, row.engineDisplacementCc),
      power: formatPower(row.enginePowerHp, row.enginePowerKw),
      acceleration: row.acceleration0100 ? `${Number(row.acceleration0100)}s (0-100 km/h)` : null,
      fuelEfficiency: row.fuelConsumptionMixed ? Number(row.fuelConsumptionMixed) : 0,
      fuelTypeTechnicalName: row.fuelType.technicalName,
      isElectric: row.fuelType.isElectric,
      transmission: row.transmission?.technicalName ?? null,
      driveType: row.driveType?.technicalName ?? null,
    },
    monthlyCost,
  }
}

export const listingSelect = {
  id: true,
  modelTrim: true,
  yearManufactured: true,
  price: true,
  currency: true,
  engineDisplacementCc: true,
  enginePowerKw: true,
  enginePowerHp: true,
  engineInfo: true,
  acceleration0100: true,
  fuelConsumptionMixed: true,
  fuelTypeId: true,
  makeId: true,
  modelId: true,
  make: { select: { name: true } },
  model: { select: { name: true } },
  fuelType: { select: { technicalName: true, isElectric: true } },
  transmission: { select: { technicalName: true } },
  driveType: { select: { technicalName: true } },
  color: { select: { technicalName: true } },
  colorFinish: true,
  images: { orderBy: { sortOrder: 'asc' as const }, select: { imagePath: true } },
} as const
