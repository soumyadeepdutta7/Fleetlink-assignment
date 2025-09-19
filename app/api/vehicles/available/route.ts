import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { calculateRideDuration } from '@/lib/utils'
import { Vehicle, Booking, AvailableVehicle } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const capacityRequired = parseInt(searchParams.get('capacityRequired') || '0')
    const fromPincode = searchParams.get('fromPincode')
    const toPincode = searchParams.get('toPincode')
    const startTimeStr = searchParams.get('startTime')

    // Validation
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

    // Calculate estimated ride duration
    const estimatedRideDurationHours = calculateRideDuration(fromPincode, toPincode)
    const endTime = new Date(startTime.getTime() + estimatedRideDurationHours * 60 * 60 * 1000)

    const db = await getDatabase()
    const vehiclesCollection = db.collection<Vehicle>('vehicles')
    const bookingsCollection = db.collection<Booking>('bookings')

    // Find vehicles with sufficient capacity
    const suitableVehicles = await vehiclesCollection
      .find({ capacityKg: { $gte: capacityRequired } })
      .toArray()

    if (suitableVehicles.length === 0) {
      return NextResponse.json([])
    }

    // Get vehicle IDs that have conflicting bookings
    const conflictingBookings = await bookingsCollection
      .find({
        vehicleId: { $in: suitableVehicles.map(v => v._id!.toString()) },
        $or: [
          // Booking starts during our time window
          {
            startTime: { $gte: startTime, $lt: endTime }
          },
          // Booking ends during our time window
          {
            endTime: { $gt: startTime, $lte: endTime }
          },
          // Booking completely encompasses our time window
          {
            startTime: { $lte: startTime },
            endTime: { $gte: endTime }
          }
        ]
      })
      .toArray()

    const conflictingVehicleIds = new Set(
      conflictingBookings.map(booking => booking.vehicleId)
    )

    // Filter out vehicles with conflicts
    const availableVehicles: AvailableVehicle[] = suitableVehicles
      .filter(vehicle => !conflictingVehicleIds.has(vehicle._id!.toString()))
      .map(vehicle => ({
        ...vehicle,
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