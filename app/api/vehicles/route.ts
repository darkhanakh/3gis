import { NextResponse } from 'next/server';
import * as z from 'zod';
import prisma from '@/prisma/prisma';

const vehicleSchema = z.object({
  driver: z.string().min(2),
  phoneNumber: z.string().min(10),
  vehicleType: z.enum(['Автомобиль', 'Фургон', 'Грузовик']),
  currentMission: z.string().optional(),
  location: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { driver, phoneNumber, vehicleType, currentMission, location } =
      vehicleSchema.parse(body);

    const newVehicle = await prisma.vehicle.create({
      data: {
        driver,
        phoneNumber,
        vehicleType,
        currentMission,
        location,
      },
    });

    return NextResponse.json(newVehicle, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany();
    return NextResponse.json(vehicles);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
