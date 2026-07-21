import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export interface InsuranceProviderOption {
  id: number
  name: string
  isDefault: boolean
  baseRatePerYear: number
  // Exposed on purpose: the client needs the multiplier table to run
  // lib/ownershipFormulas.ts locally per provider without a round-trip.
  calculationRules: { multipliers?: Record<string, number> } | null
}

export async function GET() {
  try {
    const providers = await prisma.insuranceProvider.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
        isDefault: true,
        baseRatePerYear: true,
        calculationRules: true,
      },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    })

    const result: InsuranceProviderOption[] = providers.map((p) => ({
      id: p.id,
      name: p.name,
      isDefault: p.isDefault,
      baseRatePerYear: Number(p.baseRatePerYear),
      calculationRules: p.calculationRules as { multipliers?: Record<string, number> } | null,
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('[GET /api/insurance-providers]', error)
    return NextResponse.json({ message: 'Failed to fetch insurance providers' }, { status: 500 })
  }
}
