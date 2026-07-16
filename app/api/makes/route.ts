import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const makes = await prisma.carMake.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(makes)
  } catch (error) {
    console.error('[GET /api/makes]', error)
    return NextResponse.json({ message: 'Failed to fetch makes' }, { status: 500 })
  }
}
