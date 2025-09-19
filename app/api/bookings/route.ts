import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { calculateRideDuration } from '@/lib/utils'
import { Vehicle, Booking } from '@/types'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vehicleId, customerId, fromPincode, toPincode, startTime: startTimeStr } = body

    // Validation
    if (!vehicleId || !customerId || !fromPincode || !toPincode || !startTimeStr) {
      return NextResponse.json(
        { message: 'All fields are required: vehicleId, customerId, fromPincode, toPincode, startTime' },
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

    // Calculate booking end time
    const estimatedRideDurationHours = calculateRideDuration(fromPincode, toPincode)
    const bookingEndTime = new Date(startTime.getTime() + estimatedRideDurationHours * 60 * 60 * 1000)

    const db = await getDatabase()
    const vehiclesCollection = db.collection<Vehicle>('vehicles')
    const bookingsCollection = db.collection<Booking>('bookings')

    // Verify vehicle exists
    const vehicle = await vehiclesCollection.findOne({ _id: new ObjectId(vehicleId) })
    if (!vehicle) {
      return NextResponse.json(
        { message: 'Vehicle not found' },
        { status: 404 }
      )
    }

    // Critical: Re-verify vehicle availability to prevent race conditions
    const conflictingBooking = await bookingsCollection.findOne({
      vehicleId: vehicleId,
      $or: [
        // Existing booking starts during our time window
        {
          startTime: { $gte: startTime, $lt: bookingEndTime }
        },
        // Existing booking ends during our time window
        {
          endTime: { $gt: startTime, $lte: bookingEndTime }
        },
        // Existing booking completely encompasses our time window
        {
          startTime: { $lte: startTime },
          endTime: { $gte: bookingEndTime }
        }
      ]
    })

    if (conflictingBooking) {
      return NextResponse.json(
        { message: 'Vehicle is already booked for the requested time slot' },
        { status: 409 }
      )
    }

    // Create the booking
    const booking: Booking = {
      vehicleId,
      customerId,
      fromPincode,
      toPincode,
      startTime,
      endTime: bookingEndTime,
      estimatedRideDurationHours,
      createdAt: new Date(),
    }

    const result = await bookingsCollection.insertOne(booking)
    const createdBooking = await bookingsCollection.findOne({ _id: result.insertedId })

    return NextResponse.json(createdBooking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}