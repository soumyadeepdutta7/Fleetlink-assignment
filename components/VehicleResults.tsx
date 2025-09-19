'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AvailableVehicle } from '@/types'
import { Truck, Weight, ShipWheel as Wheel, Clock } from 'lucide-react'

interface VehicleResultsProps {
  vehicles: AvailableVehicle[]
  onBook: (vehicleId: string) => void
}

export default function VehicleResults({ vehicles, onBook }: VehicleResultsProps) {
  if (vehicles.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No vehicles available for the selected criteria.</p>
            <p className="text-sm mt-2">Try adjusting your search parameters.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Available Vehicles ({vehicles.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <Card key={vehicle._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-blue-600" />
                <span>{vehicle.name}</span>
              </CardTitle>
              <CardDescription>
                Available for booking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Weight className="h-4 w-4 text-gray-500" />
                  <span>Capacity: {vehicle.capacityKg} KG</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Wheel className="h-4 w-4 text-gray-500" />
                  <span>Tyres: {vehicle.tyres}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Estimated Duration: {vehicle.estimatedRideDurationHours}h</span>
                </div>
              </div>
              <Button 
                onClick={() => onBook(vehicle._id!)} 
                className="w-full"
              >
                Book Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}