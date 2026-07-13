import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const car = await prisma.car.create({
      data: {
        make: data.make,
        model: data.model,
        year: parseInt(data.year),
        price: parseFloat(data.price),
        mileage: parseInt(data.mileage),
        location: data.location,
        description: data.description,
        image: data.image || null,
      },
    });

    return NextResponse.json({ success: true, car });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create car' }, { status: 500 });
  }
}