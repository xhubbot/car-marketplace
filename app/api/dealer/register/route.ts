import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { dealerUploadDir, ImageValidationError, processAndSaveImage } from '@/lib/image-upload'
import type { DealerContactType } from '@/generated/prisma/client'

const VALID_CONTACT_TYPES: DealerContactType[] = [
  'phone', 'email', 'website', 'facebook', 'instagram', 'whatsapp', 'telegram', 'linkedin', 'youtube', 'other',
]

interface WorkingHourInput {
  fromDay: number
  toDay: number
  fromHour: number | null
  fromMin: number | null
  toHour: number | null
  toMin: number | null
  note: string
}

interface ContactInput {
  type: DealerContactType
  value: string
}

function toIntOrNull(value: FormDataEntryValue | null): number | null {
  if (!value) return null
  const parsed = parseInt(value as string, 10)
  return Number.isNaN(parsed) ? null : parsed
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 140) || 'dealer'
}

function timeOf(hour: number | null, min: number | null): Date | null {
  if (hour === null) return null
  return new Date(Date.UTC(1970, 0, 1, hour, min ?? 0, 0))
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'You must be signed in to register a dealership' }, { status: 401 })
    }
    const userId = parseInt(session.user.id, 10)

    const formData = await request.formData()

    const companyName = (formData.get('companyName') as string) || ''
    const registryCode = (formData.get('registryCode') as string) || ''
    const vatNumber = (formData.get('vatNumber') as string) || ''
    const address = (formData.get('address') as string) || ''
    const locationId = toIntOrNull(formData.get('locationId'))
    const countryId = toIntOrNull(formData.get('countryId'))
    const postcode = (formData.get('postcode') as string) || ''
    const logo = formData.get('logo') as File | null
    const coverImage = formData.get('coverImage') as File | null
    const workingHoursJson = (formData.get('workingHours') as string) || '[]'
    const contactsJson = (formData.get('contacts') as string) || '[]'
    const categoryIdsJson = (formData.get('categoryIds') as string) || '[]'
    const makeIdsJson = (formData.get('makeIds') as string) || '[]'

    if (!companyName.trim() || !address.trim()) {
      return NextResponse.json({ message: 'Company name and address are required' }, { status: 400 })
    }

    let workingHours: WorkingHourInput[] = []
    try {
      const parsed = JSON.parse(workingHoursJson)
      if (Array.isArray(parsed)) {
        workingHours = parsed.filter(
          (row): row is WorkingHourInput =>
            row && Number.isInteger(row.fromDay) && Number.isInteger(row.toDay) &&
            row.fromDay >= 0 && row.fromDay <= 6 && row.toDay >= 0 && row.toDay <= 6
        )
      }
    } catch {
      // ignore malformed input, treat as no working hours
    }

    let contacts: ContactInput[] = []
    try {
      const parsed = JSON.parse(contactsJson)
      if (Array.isArray(parsed)) {
        contacts = parsed.filter(
          (row): row is ContactInput =>
            row && VALID_CONTACT_TYPES.includes(row.type) && typeof row.value === 'string' && row.value.trim() !== ''
        )
      }
    } catch {
      // ignore malformed input, treat as no contacts
    }

    let categoryIds: number[] = []
    try {
      const parsed = JSON.parse(categoryIdsJson)
      if (Array.isArray(parsed)) {
        categoryIds = [...new Set(parsed.filter((id): id is number => Number.isInteger(id) && id > 0))]
      }
    } catch {
      // ignore malformed input, treat as no categories
    }

    let makeIds: number[] = []
    try {
      const parsed = JSON.parse(makeIdsJson)
      if (Array.isArray(parsed)) {
        makeIds = [...new Set(parsed.filter((id): id is number => Number.isInteger(id) && id > 0))]
      }
    } catch {
      // ignore malformed input, treat as no makes
    }

    // Generate a unique slug from the company name
    const baseSlug = slugify(companyName)
    let slug = baseSlug
    let suffix = 1
    while (await prisma.dealer.findUnique({ where: { slug } })) {
      suffix += 1
      slug = `${baseSlug}-${suffix}`
    }

    const dealer = await prisma.dealer.create({
      data: {
        userId,
        companyName: companyName.trim().slice(0, 150),
        slug,
        registryCode: registryCode ? registryCode.slice(0, 30) : null,
        vatNumber: vatNumber ? vatNumber.slice(0, 30) : null,
      },
    })

    // Save logo / cover image to disk (uploads/users/<userId>/dealer/) and record their paths
    if (logo || coverImage) {
      const uploadDir = dealerUploadDir(userId)

      const updateData: { logoPath?: string; coverImagePath?: string } = {}
      if (logo) {
        const filename = await processAndSaveImage(logo, uploadDir, 'logo', { maxDimension: 600 })
        updateData.logoPath = `/uploads/users/${userId}/dealer/${filename}`
      }
      if (coverImage) {
        const filename = await processAndSaveImage(coverImage, uploadDir, 'cover', { maxDimension: 1920 })
        updateData.coverImagePath = `/uploads/users/${userId}/dealer/${filename}`
      }
      await prisma.dealer.update({ where: { id: dealer.id }, data: updateData })
    }

    const location = await prisma.dealerLocation.create({
      data: {
        dealerId: dealer.id,
        addressLine: address.trim().slice(0, 255),
        locationId,
        countryId,
        postalCode: postcode ? postcode.slice(0, 20) : null,
        isPrimary: true,
      },
    })

    if (contacts.length > 0) {
      await prisma.dealerContact.createMany({
        data: contacts.map((c, i) => ({
          dealerId: dealer.id,
          type: c.type,
          value: c.value.trim().slice(0, 255),
          sortOrder: i,
        })),
      })
    }

    if (categoryIds.length > 0) {
      const validCategories = await prisma.dealerCategory.findMany({
        where: { id: { in: categoryIds } },
        select: { id: true },
      })
      if (validCategories.length > 0) {
        await prisma.dealerCategoryLink.createMany({
          data: validCategories.map(c => ({ dealerId: dealer.id, categoryId: c.id })),
        })
      }
    }

    if (makeIds.length > 0) {
      const validMakes = await prisma.carMake.findMany({
        where: { id: { in: makeIds } },
        select: { id: true },
      })
      if (validMakes.length > 0) {
        await prisma.dealerMakeLink.createMany({
          data: validMakes.map(m => ({ dealerId: dealer.id, makeId: m.id })),
        })
      }
    }

    // Expand each from/to day range into individual per-day rows.
    // Later rows win if two ranges both cover the same day (matches the unique index on [locationId, dayOfWeek]).
    const byDay = new Map<number, { locationId: number; dayOfWeek: number; opensAt: Date | null; closesAt: Date | null; note: string | null }>()
    for (const row of workingHours) {
      const [start, end] = row.fromDay <= row.toDay ? [row.fromDay, row.toDay] : [row.toDay, row.fromDay]
      for (let dayOfWeek = start; dayOfWeek <= end; dayOfWeek++) {
        byDay.set(dayOfWeek, {
          locationId: location.id,
          dayOfWeek,
          opensAt: timeOf(row.fromHour, row.fromMin),
          closesAt: timeOf(row.toHour, row.toMin),
          note: row.note ? row.note.slice(0, 255) : null,
        })
      }
    }

    if (byDay.size > 0) {
      await prisma.dealerWorkingHour.createMany({ data: Array.from(byDay.values()) })
    }

    return NextResponse.json(
      { id: dealer.id, message: 'Dealer registered successfully' },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof ImageValidationError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
    console.error('Dealer register error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
