'use client'

import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { AvailableVehicle, SearchCriteria, BookingRequest } from '@/types'
import VehicleResults from '@/components/VehicleResults'
import { Search, MapPin, Truck, Calendar } from 'lucide-react'

export default function SearchBookForm() {
  const [isSearching, setIsSearching] = useState(false)
  const [availableVehicles, setAvailableVehicles] = useState<AvailableVehicle[]>([])
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria | null>(null)
  const { toast } = useToast()
  const { register, handleSubmit, formState: { errors }, reset } = useForm<SearchCriteria>()

  // Memoize the minimum datetime to prevent recalculation on every render
  const minDateTime = useMemo(() => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  }, [])

  const onSearch = async (data: SearchCriteria) => {
    setIsSearching(true)
    try {
      const params = new URLSearchParams({
        capacityRequired: data.capacityRequired.toString(),
        fromPincode: data.fromPincode,
        toPincode: data.toPincode,
        startTime: data.startTime,
      })

      const response = await fetch(`/api/vehicles/available?${params}`)
      
      if (response.ok) {
        const vehicles: AvailableVehicle[] = await response.json()
        setAvailableVehicles(vehicles)
        setSearchCriteria(data)
        toast({
          title: "Search Complete",
          description: `Found ${vehicles.length} available vehicle(s)`,
          className: "bg-green-500 text-white",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Search Error",
          description: error.message || "Failed to search vehicles",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const onBook = async (vehicleId: string) => {
    if (!searchCriteria) return

    try {
      const bookingData: BookingRequest = {
        vehicleId,
        customerId: 'customer-123',
        fromPincode: searchCriteria.fromPincode,
        toPincode: searchCriteria.toPincode,
        startTime: searchCriteria.startTime,
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      if (response.ok) {
        const booking = await response.json()
        toast({
          title: "Booking Successful!",
          description: "Your vehicle has been booked successfully.",
          className: "bg-green-500 text-white",
        })
        // Remove the booked vehicle from available vehicles
        setAvailableVehicles(prev => prev.filter(v => v._id !== vehicleId))
      } else {
        const error = await response.json()
        toast({
          title: "Booking Failed",
          description: error.message || "Failed to book vehicle",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
            <Search className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search & Book Vehicles</h1>
          <p className="text-gray-600">Search for available vehicles that match your logistics needs</p>
        </div>

        {/* Search Form Card */}
        <Card className="border-none shadow-xl hover:shadow-2xl transition-shadow duration-300 mb-8">
          <CardHeader className="text-center pb-6 border-b border-gray-100">
            <CardTitle className="text-2xl font-bold text-gray-900">Search Criteria</CardTitle>
            <CardDescription className="text-gray-600">
              Enter your requirements to find the perfect vehicle for your shipment
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-8">
            <form onSubmit={handleSubmit(onSearch)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label 
                    htmlFor="capacityRequired" 
                    className="text-sm font-semibold text-gray-700 flex items-center"
                  >
                    <Truck className="mr-2 h-4 w-4 text-blue-600" />
                    Required Capacity (KG)
                  </Label>
                  <div className="relative">
                    <Input
                      id="capacityRequired"
                      type="number"
                      {...register('capacityRequired', { 
                        required: 'Capacity is required',
                        min: { value: 1, message: 'Capacity must be at least 1 KG' },
                        valueAsNumber: true
                      })}
                      placeholder="e.g., 1000, 2500, 5000"
                      className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    />
                    {errors.capacityRequired && (
                      <div className="absolute -bottom-6 left-0">
                        <p className="text-sm text-red-600 font-medium flex items-center">
                          <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></span>
                          {errors.capacityRequired.message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label 
                    htmlFor="startTime" 
                    className="text-sm font-semibold text-gray-700 flex items-center"
                  >
                    <Calendar className="mr-2 h-4 w-4 text-blue-600" />
                    Start Date & Time
                  </Label>
                  <div className="relative">
                    <Input
                      id="startTime"
                      type="datetime-local"
                      {...register('startTime', { 
                        required: 'Start time is required'
                      })}
                      min={minDateTime}
                      className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    />
                    {errors.startTime && (
                      <div className="absolute -bottom-6 left-0">
                        <p className="text-sm text-red-600 font-medium flex items-center">
                          <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></span>
                          {errors.startTime.message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label 
                    htmlFor="fromPincode" 
                    className="text-sm font-semibold text-gray-700 flex items-center"
                  >
                    <MapPin className="mr-2 h-4 w-4 text-blue-600" />
                    From Pincode
                  </Label>
                  <div className="relative">
                    <Input
                      id="fromPincode"
                      {...register('fromPincode', { 
                        required: 'From pincode is required',
                        pattern: {
                          value: /^\d{6}$/,
                          message: 'Please enter a valid 6-digit pincode'
                        }
                      })}
                      placeholder="Enter origin pincode"
                      className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    />
                    {errors.fromPincode && (
                      <div className="absolute -bottom-6 left-0">
                        <p className="text-sm text-red-600 font-medium flex items-center">
                          <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></span>
                          {errors.fromPincode.message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label 
                    htmlFor="toPincode" 
                    className="text-sm font-semibold text-gray-700 flex items-center"
                  >
                    <MapPin className="mr-2 h-4 w-4 text-blue-600" />
                    To Pincode
                  </Label>
                  <div className="relative">
                    <Input
                      id="toPincode"
                      {...register('toPincode', { 
                        required: 'To pincode is required',
                        pattern: {
                          value: /^\d{6}$/,
                          message: 'Please enter a valid 6-digit pincode'
                        }
                      })}
                      placeholder="Enter destination pincode"
                      className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    />
                    {errors.toPincode && (
                      <div className="absolute -bottom-6 left-0">
                        <p className="text-sm text-red-600 font-medium flex items-center">
                          <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></span>
                          {errors.toPincode.message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isSearching}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isSearching ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching Vehicles...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Search className="mr-2 h-5 w-5" />
                    Find Available Vehicles
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        {availableVehicles.length > 0 && (
          <div className="mt-8">
            <VehicleResults vehicles={availableVehicles} onBook={onBook} />
          </div>
        )}

        {/* Empty State */}
        {searchCriteria && availableVehicles.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Truck className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Vehicles Available</h3>
            <p className="text-gray-600 mb-6">We couldn't find any vehicles matching your criteria.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                // Reset form when adjusting search criteria
                reset();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="border-gray-300 hover:bg-gray-50"
            >
              Adjust Search Criteria
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}