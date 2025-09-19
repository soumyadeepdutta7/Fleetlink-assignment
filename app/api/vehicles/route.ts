import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { Vehicle } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, capacityKg, tyres } = body

    // Validation
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { message: 'Name is required and must be a string' },
        { status: 400 }
      )
    }

    if (!capacityKg || typeof capacityKg !== 'number' || capacityKg <= 0) {
      return NextResponse.json(
        { message: 'CapacityKg is required and must be a positive number' },
        { status: 400 }
      )
    }

    if (!tyres || typeof tyres !== 'number' || tyres < 2) {
      return NextResponse.json(
        { message: 'Tyres is required and must be at least 2' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const vehiclesCollection = db.collection<Vehicle>('vehicles')

    const vehicle: Vehicle = {
      name,
      capacityKg,
      tyres,
      createdAt: new Date(),
    }

    const result = await vehiclesCollection.insertOne(vehicle)
    const createdVehicle = await vehiclesCollection.findOne({ _id: result.insertedId })

    return NextResponse.json(createdVehicle, { status: 201 })
  } catch (error) {
    console.error('Error creating vehicle:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}