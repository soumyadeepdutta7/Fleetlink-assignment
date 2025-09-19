// app/api/bookings/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { calculateRideDuration } from '@/lib/utils'
import { Vehicle, Booking, BookingRequest } from '@/types'
import { ObjectId } from 'mongodb'
import { Filter } from 'mongodb' // ✅ Keep this

export async function POST(request: NextRequest) {
  try {
    const body: BookingRequest = await request.json()
    const {
      vehicleId,
      customerId,
      fromPincode,
      toPincode,
      startTime: startTimeStr,
    } = body

    // === VALIDATION ===

    if (!vehicleId || !customerId || !fromPincode || !toPincode || !startTimeStr) {
      return NextResponse.json(
        {
          message:
            'All fields are required: vehicleId, customerId, fromPincode, toPincode, startTime',
        },
        { status: 400 }
      )
    }

    // Validate vehicleId is a 24-char hex string (MongoDB ObjectId)
    if (typeof vehicleId !== 'string' || !/^[0-9a-fA-F]{24}$/.test(vehicleId)) {
      return NextResponse.json(
        {
          message: 'Invalid vehicleId format. Must be a 24-character hexadecimal string.',
        },
        { status: 400 }
      )
    }

    if (typeof customerId !== 'string' || customerId.trim().length === 0) {
      return NextResponse.json(
        {
          message: 'customerId must be a non-empty string.',
        },
        { status: 400 }
      )
    }

    if (typeof fromPincode !== 'string' || fromPincode.length !== 6 || isNaN(Number(fromPincode))) {
      return NextResponse.json(
        { message: 'fromPincode must be a 6-digit numeric string.' },
        { status: 400 }
      )
    }

    if (typeof toPincode !== 'string' || toPincode.length !== 6 || isNaN(Number(toPincode))) {
      return NextResponse.json(
        { message: 'toPincode must be a 6-digit numeric string.' },
        { status: 400 }
      )
    }

    const startTime = new Date(startTimeStr)
    if (isNaN(startTime.getTime())) {
      return NextResponse.json(
        { message: 'Invalid startTime format. Use ISO 8601 (e.g., "2025-04-01T10:00:00Z").' },
        { status: 400 }
      )
    }

    // === BUSINESS LOGIC ===

    const estimatedRideDurationHours = calculateRideDuration(fromPincode, toPincode)
    const bookingEndTime = new Date(startTime.getTime() + estimatedRideDurationHours * 60 * 60 * 1000)

    const db = await getDatabase()
    const vehiclesCollection = db.collection<Vehicle>('vehicles')
    const bookingsCollection = db.collection<Booking>('bookings')

    // ✅✅✅ FINAL FIX: Double-cast via unknown
    const vehicle = await vehiclesCollection.findOne({
      _id: new ObjectId(vehicleId),
    } as unknown as Filter<Vehicle>)

    if (!vehicle) {
      return NextResponse.json(
        { message: 'Vehicle not found' },
        { status: 404 }
      )
    }

    const conflictingBooking = await bookingsCollection.findOne({
      vehicleId, // ← string, matches Booking.vehicleId: string
      $or: [
        { startTime: { $gte: startTime, $lt: bookingEndTime } },
        { endTime: { $gt: startTime, $lte: bookingEndTime } },
        { startTime: { $lte: startTime }, endTime: { $gte: bookingEndTime } },
      ],
    })

    if (conflictingBooking) {
      return NextResponse.json(
        { message: 'Vehicle is already booked for the requested time slot' },
        { status: 409 }
      )
    }

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

    // Retrieve created booking — also double-cast here
    const createdBooking = await bookingsCollection.findOne({
      _id: result.insertedId,
    } as unknown as Filter<Booking>)

    // ✅ Convert _id to string before sending to frontend
    if (createdBooking) {
      createdBooking._id = createdBooking._id!.toString()
    }

    return NextResponse.json(createdBooking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}