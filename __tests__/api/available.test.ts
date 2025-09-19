import { GET } from '@/app/api/vehicles/available/route'
import { NextRequest } from 'next/server'

// Mock MongoDB
const mockVehicles = [
  { _id: 'vehicle1', name: 'Truck 1', capacityKg: 1000, tyres: 4 },
  { _id: 'vehicle2', name: 'Truck 2', capacityKg: 2000, tyres: 6 }
]

const mockBookings = [
  {
    vehicleId: 'vehicle1',
    startTime: new Date('2023-10-27T10:00:00Z'),
    endTime: new Date('2023-10-27T14:00:00Z')
  }
]

jest.mock('@/lib/mongodb', () => ({
  getDatabase: jest.fn(() => ({
    collection: jest.fn((name) => {
      if (name === 'vehicles') {
        return {
          find: jest.fn(() => ({
            toArray: jest.fn(() => mockVehicles)
          }))
        }
      }
      if (name === 'bookings') {
        return {
          find: jest.fn(() => ({
            toArray: jest.fn(() => mockBookings)
          }))
        }
      }
    })
  }))
}))

describe('/api/vehicles/available GET', () => {
  it('should return available vehicles', async () => {
    const url = 'http://localhost:3000/api/vehicles/available?capacityRequired=500&fromPincode=110001&toPincode=110002&startTime=2023-10-27T08:00:00Z'
    const request = new NextRequest(url)

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBe(1) // Only vehicle2 should be available (vehicle1 has conflict)
    expect(data[0].name).toBe('Truck 2')
    expect(data[0].estimatedRideDurationHours).toBe(1) // |110002 - 110001| % 24 = 1
  })

  it('should return 400 for missing parameters', async () => {
    const url = 'http://localhost:3000/api/vehicles/available?capacityRequired=500'
    const request = new NextRequest(url)

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.message).toContain('fromPincode and toPincode are required')
  })

  it('should return 400 for invalid capacity', async () => {
    const url = 'http://localhost:3000/api/vehicles/available?capacityRequired=0&fromPincode=110001&toPincode=110002&startTime=2023-10-27T08:00:00Z'
    const request = new NextRequest(url)

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.message).toContain('Valid capacityRequired is required')
  })
})