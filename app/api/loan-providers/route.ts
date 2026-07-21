import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export interface LoanProviderOption {
  id: number
  name: string
  isDefault: boolean
  interestRateAnnual: number
  minTermMonths: number
  maxTermMonths: number
  minDownpaymentPercent: number
}

export async function GET() {
  try {
    const providers = await prisma.loanProvider.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
        isDefault: true,
        interestRateAnnual: true,
        minTermMonths: true,
        maxTermMonths: true,
        minDownpaymentPercent: true,
      },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    })

    const result: LoanProviderOption[] = providers.map((p) => ({
      id: p.id,
      name: p.name,
      isDefault: p.isDefault,
      interestRateAnnual: Number(p.interestRateAnnual),
      minTermMonths: p.minTermMonths,
      maxTermMonths: p.maxTermMonths,
      minDownpaymentPercent: Number(p.minDownpaymentPercent),
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('[GET /api/loan-providers]', error)
    return NextResponse.json({ message: 'Failed to fetch loan providers' }, { status: 500 })
  }
}
