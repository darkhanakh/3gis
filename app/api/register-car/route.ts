import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const car = await prisma.car.create({
      data: {
        vehicleModel: body.vehicleModel,
        licensePlate: body.licensePlate,
        trackerSerialNumber: body.trackerSerialNumber,
        tankCapacity: body.tankCapacity,
        fuelType: body.fuelType,
        currentLatitude: body.currentLatitude,
        currentLongitude: body.currentLongitude,
      },
    });
    return NextResponse.json(car);
  } catch (error) {
    console.error('Error registering car:', error);
    return NextResponse.json(
      { error: 'Error registering car' },
      { status: 500 }
    );
  }
}
