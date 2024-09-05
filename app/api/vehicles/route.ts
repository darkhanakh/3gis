import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function GET() {
  try {
    const vehicles = await prisma.car.findMany();

    const formattedVehicles = vehicles.map((vehicle) => ({
      id: vehicle.id,
      driver: vehicle.driver,
      fuelAmount: vehicle.fuelAmount,
      position: [vehicle.latitude, vehicle.longitude],
      startPoint: [vehicle.startLat, vehicle.startLon],
      endPoint: [vehicle.endLat, vehicle.endLon],
    }));

    return NextResponse.json(formattedVehicles);
  } catch (error) {
    console.error('Failed to fetch vehicles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
}
