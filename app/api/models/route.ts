import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const makeId = request.nextUrl.searchParams.get('makeId')

  if (!makeId || isNaN(Number(makeId))) {
    return NextResponse.json({ message: 'makeId is required' }, { status: 400 })
  }

  try {
    const models = await prisma.carModel.findMany({
      where: { makeId: Number(makeId) },
      select: { id: true, name: true, slug: true },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(models)
  } catch (error) {
    console.error('[GET /api/models]', error)
    return NextResponse.json({ message: 'Failed to fetch models' }, { status: 500 })
  }
}
