export interface Vehicle {
  _id?: string
  name: string
  capacityKg: number
  tyres: number
  createdAt?: Date
}

export interface Booking {
  _id?: string
  vehicleId: string
  customerId: string
  fromPincode: string
  toPincode: string
  startTime: Date
  endTime: Date
  estimatedRideDurationHours: number
  createdAt?: Date
}

export interface AvailableVehicle extends Vehicle {
  estimatedRideDurationHours: number
}

export interface SearchCriteria {
  capacityRequired: number
  fromPincode: string
  toPincode: string
  startTime: string
}

export interface BookingRequest {
  vehicleId: string
  customerId: string
  fromPincode: string
  toPincode: string
  startTime: string
}