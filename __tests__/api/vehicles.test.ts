import { POST } from '@/app/api/vehicles/route'
import { NextRequest } from 'next/server'

// Mock MongoDB
jest.mock('@/lib/mongodb', () => ({
  getDatabase: jest.fn(() => ({
    collection: jest.fn(() => ({
      insertOne: jest.fn(() => ({ insertedId: 'mock-id' })),
      findOne: jest.fn(() => ({
        _id: 'mock-id',
        name: 'Test Vehicle',
        capacityKg: 1000,
        tyres: 4,
        createdAt: new Date()
      }))
    }))
  }))
}))

describe('/api/vehicles POST', () => {
  it('should create a vehicle with valid data', async () => {
    const request = new NextRequest('http://localhost:3000/api/vehicles', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Vehicle',
        capacityKg: 1000,
        tyres: 4
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.name).toBe('Test Vehicle')
    expect(data.capacityKg).toBe(1000)
    expect(data.tyres).toBe(4)
  })

  it('should return 400 for missing name', async () => {
    const request = new NextRequest('http://localhost:3000/api/vehicles', {
      method: 'POST',
      body: JSON.stringify({
        capacityKg: 1000,
        tyres: 4
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.message).toContain('Name is required')
  })

  it('should return 400 for invalid capacity', async () => {
    const request = new NextRequest('http://localhost:3000/api/vehicles', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Vehicle',
        capacityKg: -100,
        tyres: 4
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.message).toContain('CapacityKg')
  })

  it('should return 400 for insufficient tyres', async () => {
    const request = new NextRequest('http://localhost:3000/api/vehicles', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Vehicle',
        capacityKg: 1000,
        tyres: 1
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.message).toContain('Tyres')
  })
})