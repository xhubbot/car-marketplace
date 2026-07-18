import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export interface DealerSearchResult {
  id: number
  slug: string
  companyName: string
  registryCode: string | null
  vatNumber: string | null
  logoPath: string | null
  locationLabel: string | null
  categories: string[]
  makes: string[]
}

export interface DealersSearchResponse {
  dealers: DealerSearchResult[]
  total: number
  page: number
  pageSize: number
}

const PAGE_SIZE = 20

function parseIds(raw: string | null): number[] {
  if (!raw) return []
  return raw
    .split(',')
    .map(s => parseInt(s.trim(), 10))
    .filter(n => Number.isInteger(n) && n > 0)
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const locale = params.get('locale') ?? 'en'
  const name = (params.get('name') ?? '').trim()
  const registryCode = (params.get('registryCode') ?? '').trim()
  const vatNumber = (params.get('vatNumber') ?? '').trim()
  const categoryIds = parseIds(params.get('categoryIds'))
  const makeIds = parseIds(params.get('makeIds'))
  const page = Math.max(1, parseInt(params.get('page') ?? '1', 10) || 1)

  try {
    const where = {
      status: 'active' as const,
      ...(name && { companyName: { contains: name } }),
      ...(registryCode && { registryCode: { contains: registryCode } }),
      ...(vatNumber && { vatNumber: { contains: vatNumber } }),
      ...(categoryIds.length > 0 && { categories: { some: { categoryId: { in: categoryIds } } } }),
      ...(makeIds.length > 0 && { makes: { some: { makeId: { in: makeIds } } } }),
    }

    const [dealers, total] = await Promise.all([
      prisma.dealer.findMany({
        where,
        select: {
          id: true,
          slug: true,
          companyName: true,
          registryCode: true,
          vatNumber: true,
          logoPath: true,
          locations: {
            where: { isPrimary: true },
            take: 1,
            select: { location: { select: { id: true, fallbackName: true } } },
          },
          categories: { select: { category: { select: { id: true, fallbackName: true } } } },
          makes: { select: { make: { select: { id: true, name: true } } } },
        },
        orderBy: { companyName: 'asc' },
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
      }),
      prisma.dealer.count({ where }),
    ])

    // Localize category/location names in one batch query, same pattern as /api/lookups
    const categoryRefIds = [...new Set(dealers.flatMap(d => d.categories.map(c => c.category.id)))]
    const locationRefIds = [...new Set(dealers.flatMap(d => (d.locations[0] ? [d.locations[0].location?.id] : [])).filter((id): id is number => id != null))]

    const translations = categoryRefIds.length + locationRefIds.length > 0
      ? await prisma.translation.findMany({
          where: {
            languageCode: locale,
            OR: [
              { category: 'dealer_category', refId: { in: categoryRefIds } },
              { category: 'location', refId: { in: locationRefIds } },
            ],
          },
          select: { category: true, refId: true, name: true },
        })
      : []

    const byCategory = new Map<string, Map<number, string>>()
    for (const t of translations) {
      if (!byCategory.has(t.category)) byCategory.set(t.category, new Map())
      byCategory.get(t.category)!.set(t.refId, t.name)
    }
    const label = (category: string, id: number, fallback: string) => byCategory.get(category)?.get(id) ?? fallback

    const results: DealerSearchResult[] = dealers.map(d => {
      const primaryLocation = d.locations[0]?.location
      return {
        id: d.id,
        slug: d.slug,
        companyName: d.companyName,
        registryCode: d.registryCode,
        vatNumber: d.vatNumber,
        logoPath: d.logoPath,
        locationLabel: primaryLocation ? label('location', primaryLocation.id, primaryLocation.fallbackName) : null,
        categories: d.categories.map(c => label('dealer_category', c.category.id, c.category.fallbackName)),
        makes: d.makes.map(m => m.make.name),
      }
    })

    return NextResponse.json({
      dealers: results,
      total,
      page,
      pageSize: PAGE_SIZE,
    } satisfies DealersSearchResponse)
  } catch (error) {
    console.error('[GET /api/dealers]', error)
    return NextResponse.json({ message: 'Failed to fetch dealers' }, { status: 500 })
  }
}
