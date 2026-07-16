import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

interface WorkingHourInput {
  fromDay: number
  toDay: number
  fromHour: number | null
  fromMin: number | null
  toHour: number | null
  toMin: number | null
  note: string
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

async function saveImage(file: File, dir: string, baseName: string): Promise<string> {
  const rawExt = path.extname(file.name).toLowerCase()
  const ext = ALLOWED_IMAGE_EXTENSIONS.includes(rawExt) ? rawExt : '.jpg'
  const filename = `${baseName}${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(dir, filename), buffer)
  return filename
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
    const homepage = (formData.get('homepage') as string) || ''
    const address = (formData.get('address') as string) || ''
    const locationId = toIntOrNull(formData.get('locationId'))
    const countryId = toIntOrNull(formData.get('countryId'))
    const postcode = (formData.get('postcode') as string) || ''
    const phone = (formData.get('phone') as string) || ''
    const fax = (formData.get('fax') as string) || ''
    const email = (formData.get('email') as string) || ''
    const logo = formData.get('logo') as File | null
    const coverImage = formData.get('coverImage') as File | null
    const workingHoursJson = (formData.get('workingHours') as string) || '[]'

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
        websiteUrl: homepage ? homepage.slice(0, 255) : null,
      },
    })

    // Save logo / cover image to disk and record their paths
    if (logo || coverImage) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'dealers', dealer.id.toString())
      await mkdir(uploadDir, { recursive: true })

      const updateData: { logoPath?: string; coverImagePath?: string } = {}
      if (logo) {
        const filename = await saveImage(logo, uploadDir, 'logo')
        updateData.logoPath = `/uploads/dealers/${dealer.id}/${filename}`
      }
      if (coverImage) {
        const filename = await saveImage(coverImage, uploadDir, 'cover')
        updateData.coverImagePath = `/uploads/dealers/${dealer.id}/${filename}`
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
        phone: phone ? phone.slice(0, 30) : null,
        fax: fax ? fax.slice(0, 30) : null,
        email: email ? email.slice(0, 150) : null,
        isPrimary: true,
      },
    })

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
    console.error('Dealer register error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
