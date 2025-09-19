// app/api/vehicles/available/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { calculateRideDuration } from '@/lib/utils'
import { Vehicle, Booking, AvailableVehicle } from '@/types'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const capacityRequired = parseInt(searchParams.get('capacityRequired') || '0')
    const fromPincode = searchParams.get('fromPincode')
    const toPincode = searchParams.get('toPincode')
    const startTimeStr = searchParams.get('startTime')

    if (!capacityRequired || capacityRequired <= 0) {
      return NextResponse.json(
        { message: 'Valid capacityRequired is required' },
        { status: 400 }
      )
    }

    if (!fromPincode || !toPincode) {
      return NextResponse.json(
        { message: 'fromPincode and toPincode are required' },
        { status: 400 }
      )
    }

    if (!startTimeStr) {
      return NextResponse.json(
        { message: 'startTime is required' },
        { status: 400 }
      )
    }

    const startTime = new Date(startTimeStr)
    if (isNaN(startTime.getTime())) {
      return NextResponse.json(
        { message: 'Invalid startTime format' },
        { status: 400 }
      )
    }

    const estimatedRideDurationHours = calculateRideDuration(fromPincode, toPincode)
    const endTime = new Date(startTime.getTime() + estimatedRideDurationHours * 60 * 60 * 1000)

    const db = await getDatabase()
    const vehiclesCollection = db.collection<Vehicle>('vehicles')
    const bookingsCollection = db.collection<Booking>('bookings')

    const suitableVehicles = await vehiclesCollection
      .find({ capacityKg: { $gte: capacityRequired } })
      .toArray()

    if (suitableVehicles.length === 0) {
      return NextResponse.json([])
    }

    const conflictingBookings = await bookingsCollection
      .find({
        vehicleId: { $in: suitableVehicles.map(v => v._id!.toString()) },
        $or: [
          { startTime: { $gte: startTime, $lt: endTime } },
          { endTime: { $gt: startTime, $lte: endTime } },
          { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
        ]
      })
      .toArray()

    const conflictingVehicleIds = new Set(
      conflictingBookings.map(booking => booking.vehicleId)
    )

    // ✅ FIX: Explicitly convert _id to string
    const availableVehicles: AvailableVehicle[] = suitableVehicles
      .filter(vehicle => !conflictingVehicleIds.has(vehicle._id!.toString()))
      .map(vehicle => ({
        ...vehicle,
        _id: vehicle._id!.toString(), // ← Critical fix
        estimatedRideDurationHours
      }))

    return NextResponse.json(availableVehicles)
  } catch (error) {
    console.error('Error finding available vehicles:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}