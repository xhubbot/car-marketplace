import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import type { ListingType } from '@/generated/prisma/client'
import { classifiedUploadDir, ImageValidationError, processAndSaveImage } from '@/lib/image-upload'

const VALID_LISTING_TYPES: ListingType[] = ['sell', 'buy', 'rentWanted', 'rentOffer']

function toIntOrNull(value: FormDataEntryValue | null): number | null {
  if (!value) return null
  const parsed = parseInt(value as string, 10)
  return Number.isNaN(parsed) ? null : parsed
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'You must be signed in to create a listing' }, { status: 401 })
    }
    const userId = parseInt(session.user.id, 10)

    const formData = await request.formData()

    // Extract listing intent
    const listingType = formData.get('listingType') as string
    if (!VALID_LISTING_TYPES.includes(listingType as ListingType)) {
      return NextResponse.json({ message: 'Invalid listing type' }, { status: 400 })
    }

    // Extract main info
    const makeId = toIntOrNull(formData.get('makeId'))
    const modelId = toIntOrNull(formData.get('modelId'))
    const modelTrim = (formData.get('modelTrim') as string) || ''
    const yearManufactured = toIntOrNull(formData.get('yearManufactured'))
    const monthManufactured = toIntOrNull(formData.get('monthManufactured'))
    const mileage = toIntOrNull(formData.get('mileage'))
    const fuelTypeId = toIntOrNull(formData.get('fuelTypeId'))
    const transmissionId = toIntOrNull(formData.get('transmissionId'))
    const driveTypeId = toIntOrNull(formData.get('driveTypeId'))
    const doors = toIntOrNull(formData.get('doors'))
    const seats = toIntOrNull(formData.get('seats'))
    const vinCode = (formData.get('vinCode') as string) || ''
    const regNr = (formData.get('regNr') as string) || ''
    const enginePowerKw = toIntOrNull(formData.get('enginePowerKw'))
    const enginePowerHp = toIntOrNull(formData.get('enginePowerHp'))
    const colorId = toIntOrNull(formData.get('colorId'))
    const price = formData.get('price') as string
    const currency = (formData.get('currency') as string) || 'EUR'
    const locationId = toIntOrNull(formData.get('locationId'))
    const featuresJson = formData.get('features') as string
    const rawFeatures = featuresJson ? JSON.parse(featuresJson) : []
    const features: number[] = Array.isArray(rawFeatures)
      ? rawFeatures.map((id) => Number(id)).filter((id) => Number.isInteger(id))
      : []

    // Validate required fields
    if (!makeId || !modelId || !yearManufactured || !mileage || !fuelTypeId || !price) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }
    if (Number.isNaN(Number(price)) || Number(price) < 0) {
      return NextResponse.json({ message: 'Invalid price' }, { status: 400 })
    }

    // Extract image files
    const images: File[] = []
    let index = 0
    while (true) {
      const file = formData.get(`image_${index}`) as File | null
      if (!file) break
      images.push(file)
      index++
    }

    if (images.length === 0) {
      return NextResponse.json({ message: 'At least one image is required' }, { status: 400 })
    }

    const listing = await prisma.carListing.create({
      data: {
        userId,
        listingType: listingType as ListingType,
        makeId,
        modelId,
        modelTrim: modelTrim ? modelTrim.slice(0, 100) : null,
        yearManufactured,
        monthManufactured,
        mileage,
        fuelTypeId,
        transmissionId,
        driveTypeId,
        doors,
        seats,
        vinCode: vinCode ? vinCode.slice(0, 17) : null,
        regNr: regNr ? regNr.slice(0, 20) : null,
        enginePowerKw,
        enginePowerHp,
        colorId,
        price,
        currency,
        locationId,
        features: {
          create: features.map((featureId) => ({ featureId })),
        },
      },
    })

    // Store images on local disk (uploads/users/<userId>/classifieds/<listingId>/) and record them
    const uploadDir = classifiedUploadDir(userId, listing.id)

    const imageRecords = await Promise.all(
      images.map(async (file, i) => {
        const filename = await processAndSaveImage(file, uploadDir, i.toString())
        return {
          listingId: listing.id,
          imagePath: `/uploads/users/${userId}/classifieds/${listing.id}/${filename}`,
          isMain: i === 0,
          sortOrder: i,
        }
      })
    )

    await prisma.carImage.createMany({ data: imageRecords })

    return NextResponse.json(
      { id: Number(listing.id), message: 'Listing created successfully' },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof ImageValidationError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
    console.error('Create listing error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
