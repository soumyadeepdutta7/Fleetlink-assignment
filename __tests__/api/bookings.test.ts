import { POST } from '@/app/api/bookings/route'
import { NextRequest } from 'next/server'
import { ObjectId } from 'mongodb'

// Mock MongoDB
const mockVehicle = {
  _id: new ObjectId(),
  name: 'Test Vehicle',
  capacityKg: 1000,
  tyres: 4
}

jest.mock('@/lib/mongodb', () => ({
  getDatabase: jest.fn(() => ({
    collection: jest.fn((name) => {
      if (name === 'vehicles') {
        return {
          findOne: jest.fn(() => mockVehicle)
        }
      }
      if (name === 'bookings') {
        return {
          findOne: jest.fn(() => null), // No conflicting booking
          insertOne: jest.fn(() => ({ insertedId: 'booking-id' })),
          findOne: jest.fn(() => ({
            _id: 'booking-id',
            vehicleId: mockVehicle._id.toString(),
            customerId: 'customer-123',
            fromPincode: '110001',
            toPincode: '110002',
            startTime: new Date('2023-10-27T10:00:00Z'),
            endTime: new Date('2023-10-27T11:00:00Z'),
            estimatedRideDurationHours: 1,
            createdAt: new Date()
          }))
        }
      }
    })
  }))
}))

describe('/api/bookings POST', () => {
  it('should create a booking with valid data', async () => {
    const request = new NextRequest('http://localhost:3000/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        vehicleId: mockVehicle._id.toString(),
        customerId: 'customer-123',
        fromPincode: '110001',
        toPincode: '110002',
        startTime: '2023-10-27T10:00:00Z'
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.vehicleId).toBe(mockVehicle._id.toString())
    expect(data.customerId).toBe('customer-123')
    expect(data.estimatedRideDurationHours).toBe(1)
  })

  it('should return 400 for missing fields', async () => {
    const request = new NextRequest('http://localhost:3000/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        vehicleId: mockVehicle._id.toString(),
        customerId: 'customer-123'
        // Missing fromPincode, toPincode, startTime
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.message).toContain('All fields are required')
  })

  it('should return 404 for non-existent vehicle', async () => {
    // Mock vehicle not found
    jest.mocked(require('@/lib/mongodb').getDatabase).mockImplementation(() => ({
      collection: jest.fn((name) => {
        if (name === 'vehicles') {
          return {
            findOne: jest.fn(() => null) // Vehicle not found
          }
        }
        if (name === 'bookings') {
          return {
            findOne: jest.fn(() => null),
            insertOne: jest.fn(),
          }
        }
      })
    }))

    const request = new NextRequest('http://localhost:3000/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        vehicleId: 'non-existent-id',
        customerId: 'customer-123',
        fromPincode: '110001',
        toPincode: '110002',
        startTime: '2023-10-27T10:00:00Z'
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.message).toBe('Vehicle not found')
  })
})