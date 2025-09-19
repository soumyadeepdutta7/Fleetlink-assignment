"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Vehicle } from "@/types";
import { Truck, Plus } from "lucide-react";

interface VehicleFormData {
  name: string;
  capacityKg: number;
  tyres: number;
}

export default function AddVehicleForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormData>();

  const onSubmit = async (data: VehicleFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          capacityKg: Number(data.capacityKg),
          tyres: Number(data.tyres),
        }),
      });

      if (response.ok) {
        const vehicle: Vehicle = await response.json();
        toast({
          title: "Success!",
          description: `Vehicle "${vehicle.name}" has been added successfully.`,
          className: "bg-green-500 text-white",
        });
        reset();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to add vehicle",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
            <Truck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Vehicle</h1>
          <p className="text-gray-600">Register your vehicle to start managing your fleet</p>
        </div>
        
        <Card className="border-none shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <CardHeader className="text-center pb-6 border-b border-gray-100">
            <CardTitle className="text-2xl font-bold text-gray-900">Vehicle Registration</CardTitle>
            <CardDescription className="text-gray-600">
              Fill in the details below to add a new vehicle to your fleet
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-3">
                <Label 
                  htmlFor="name" 
                  className="text-sm font-semibold text-gray-700 flex items-center"
                >
                  <Truck className="mr-2 h-4 w-4 text-blue-600" />
                  Vehicle Name
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    {...register("name", { required: "Vehicle name is required" })}
                    placeholder="e.g., Truck-2024, Van-001"
                    className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                  {errors.name && (
                    <div className="absolute -bottom-6 left-0">
                      <p className="text-sm text-red-600 font-medium flex items-center">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></span>
                        {errors.name.message}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Label 
                  htmlFor="capacityKg" 
                  className="text-sm font-semibold text-gray-700 flex items-center"
                >
                  ⚖️ Capacity (KG)
                </Label>
                <div className="relative">
                  <Input
                    id="capacityKg"
                    type="number"
                    {...register("capacityKg", {
                      required: "Capacity is required",
                      min: { value: 1, message: "Capacity must be at least 1 KG" },
                    })}
                    placeholder="Enter maximum load capacity"
                    className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                  {errors.capacityKg && (
                    <div className="absolute -bottom-6 left-0">
                      <p className="text-sm text-red-600 font-medium flex items-center">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></span>
                        {errors.capacityKg.message}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Label 
                  htmlFor="tyres" 
                  className="text-sm font-semibold text-gray-700 flex items-center"
                >
                  🛞 Number of Tyres
                </Label>
                <div className="relative">
                  <Input
                    id="tyres"
                    type="number"
                    {...register("tyres", {
                      required: "Number of tyres is required",
                      min: { value: 2, message: "Must have at least 2 tyres" },
                    })}
                    placeholder="e.g., 4, 6, 8, 10"
                    className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                  {errors.tyres && (
                    <div className="absolute -bottom-6 left-0">
                      <p className="text-sm text-red-600 font-medium flex items-center">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></span>
                        {errors.tyres.message}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding Vehicle...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Plus className="mr-2 h-5 w-5" />
                    Add Vehicle to Fleet
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}