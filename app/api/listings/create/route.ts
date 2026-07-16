import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract main info
    const makeId = formData.get('makeId')
    const modelId = formData.get('modelId')
    const modelTrim = formData.get('modelTrim') as string
    const yearManufactured = formData.get('yearManufactured')
    const monthManufactured = formData.get('monthManufactured')
    const mileage = formData.get('mileage')
    const fuelTypeId = formData.get('fuelTypeId')
    const transmissionId = formData.get('transmissionId')
    const driveTypeId = formData.get('driveTypeId')
    const doors = formData.get('doors')
    const seats = formData.get('seats')
    const vinCode = formData.get('vinCode') as string
    const regNr = formData.get('regNr') as string
    const enginePowerKw = formData.get('enginePowerKw')
    const enginePowerHp = formData.get('enginePowerHp')
    const colorId = formData.get('colorId')
    const price = formData.get('price') as string
    const currency = formData.get('currency') as string
    const locationId = formData.get('locationId')
    const featuresJson = formData.get('features') as string
    const features = featuresJson ? JSON.parse(featuresJson) : []

    // Validate required fields
    if (!makeId || !modelId || !yearManufactured || !mileage || !fuelTypeId || !price) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
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
      return NextResponse.json(
        { message: 'At least one image is required' },
        { status: 400 }
      )
    }

    // TODO: Handle image uploads to storage
    // TODO: Create listing in database
    // TODO: Create feature associations
    // TODO: Save translations

    // Mock response - replace with actual implementation
    const listingId = Math.floor(Math.random() * 1000000)

    return NextResponse.json(
      {
        id: listingId,
        message: 'Listing created successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create listing error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
