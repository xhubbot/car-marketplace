import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export interface LookupOption {
  value: number
  label: string
}

export interface LocationGroup {
  label: string
  options: LookupOption[]
}

export interface LookupsResponse {
  fuelTypes: LookupOption[]
  transmissions: LookupOption[]
  driveTypes: LookupOption[]
  colors: LookupOption[]
  locations: LocationGroup[]
  countries: LookupOption[]
}

export async function GET(request: NextRequest) {
  const locale = (request.nextUrl.searchParams.get('locale') ?? 'en') as string

  try {
    // Fetch all translations for the 5 categories in one query
    const translations = await prisma.translation.findMany({
      where: {
        languageCode: locale,
        category: { in: ['fuel_type', 'transmission', 'drive_type', 'color', 'location', 'country'] },
      },
      select: { category: true, refId: true, name: true },
    })

    // Index by category → refId for O(1) lookups
    const byCategory = new Map<string, Map<number, string>>()
    for (const t of translations) {
      if (!byCategory.has(t.category)) byCategory.set(t.category, new Map())
      byCategory.get(t.category)!.set(t.refId, t.name)
    }

    const label = (category: string, id: number, fallback: string) =>
      byCategory.get(category)?.get(id) ?? fallback

    // Fuel types
    const fuelRows = await prisma.fuelType.findMany({
      select: { id: true, technicalName: true },
      orderBy: { id: 'asc' },
    })
    const fuelTypes: LookupOption[] = fuelRows.map(r => ({
      value: r.id,
      label: label('fuel_type', r.id, r.technicalName),
    }))

    // Transmissions
    const transRows = await prisma.transmission.findMany({
      select: { id: true, technicalName: true },
      orderBy: { id: 'asc' },
    })
    const transmissions: LookupOption[] = transRows.map(r => ({
      value: r.id,
      label: label('transmission', r.id, r.technicalName),
    }))

    // Drive types
    const driveRows = await prisma.driveType.findMany({
      select: { id: true, technicalName: true },
      orderBy: { id: 'asc' },
    })
    const driveTypes: LookupOption[] = driveRows.map(r => ({
      value: r.id,
      label: label('drive_type', r.id, r.technicalName),
    }))

    // Colors
    const colorRows = await prisma.color.findMany({
      select: { id: true, technicalName: true },
      orderBy: { id: 'asc' },
    })
    const colors: LookupOption[] = colorRows.map(r => ({
      value: r.id,
      label: label('color', r.id, r.technicalName),
    }))

    // Locations — grouped: counties (parentId = null) as group headers,
    // cities (parentId != null) as options inside their county group
    const locationRows = await prisma.location.findMany({
      select: { id: true, parentId: true, fallbackName: true },
      orderBy: { id: 'asc' },
    })

    const counties = locationRows.filter(l => l.parentId === null)
    const cities = locationRows.filter(l => l.parentId !== null)

    const locations: LocationGroup[] = counties.map(county => ({
      label: label('location', county.id, county.fallbackName),
      options: cities
        .filter(c => c.parentId === county.id)
        .map(c => ({
          value: c.id,
          label: label('location', c.id, c.fallbackName),
        })),
    }))

    // Countries
    const countryRows = await prisma.country.findMany({
      select: { id: true, fallbackName: true },
      orderBy: { id: 'asc' },
    })
    const countries: LookupOption[] = countryRows.map(r => ({
      value: r.id,
      label: label('country', r.id, r.fallbackName),
    }))

    // Also add top-level county as a selectable option (prepend to each group)
    const locationsWithCounty: LocationGroup[] = locations.map(group => {
      const county = counties.find(c => label('location', c.id, c.fallbackName) === group.label)
      if (!county) return group
      return {
        ...group,
        options: [
          { value: county.id, label: `${group.label} (whole county)` },
          ...group.options,
        ],
      }
    })

    return NextResponse.json({
      fuelTypes,
      transmissions,
      driveTypes,
      colors,
      locations: locationsWithCounty,
      countries,
    } satisfies LookupsResponse)
  } catch (error) {
    console.error('[GET /api/lookups]', error)
    return NextResponse.json({ message: 'Failed to fetch lookups' }, { status: 500 })
  }
}
