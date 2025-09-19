import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Truck, Search, Plus, Shield, Clock, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
              <Truck className="mr-2 h-4 w-4" />
              Modern Logistics Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Streamline Your
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Fleet Operations</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              FleetLink revolutionizes logistics with intelligent vehicle management, real-time availability, 
              and seamless booking experiences designed for modern businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/add-vehicle" className="w-full sm:w-auto">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Vehicle
                </Button>
              </Link>
              <Link href="/search-book" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="border-gray-300 hover:bg-gray-50 px-8">
                  <Search className="mr-2 h-5 w-5" />
                  Search & Book
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your fleet efficiently and scale your logistics operations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Truck className="h-8 w-8 text-blue-600" />,
                title: "Intelligent Fleet Management",
                description: "Comprehensive vehicle tracking with detailed specs, maintenance logs, and real-time status updates."
              },
              {
                icon: <Search className="h-8 w-8 text-green-600" />,
                title: "Smart Search & Filters",
                description: "Find the perfect vehicle for your needs with advanced filtering by capacity, location, and availability."
              },
              {
                icon: <Clock className="h-8 w-8 text-orange-500" />,
                title: "Real-time Availability",
                description: "Live availability tracking with conflict detection and optimized route duration calculations."
              },
              {
                icon: <Shield className="h-8 w-8 text-red-500" />,
                title: "Secure Booking System",
                description: "Enterprise-grade booking with race condition prevention and data integrity safeguards."
              },
              {
                icon: <Users className="h-8 w-8 text-purple-600" />,
                title: "B2B Enterprise Ready",
                description: "Built for scale with multi-user access, role permissions, and business analytics."
              },
              {
                icon: <Plus className="h-8 w-8 text-indigo-600" />,
                title: "Seamless Integration",
                description: "Modern RESTful APIs and webhooks for easy integration with your existing tech stack."
              }
            ].map((feature, index) => (
              <div key={index} className="group">
                <Card className="h-full border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors duration-300">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Get Started Today</h2>
            <p className="text-blue-100 text-lg">
              Take control of your logistics operations with these quick actions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Link href="/add-vehicle" className="block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40">
                <Card className="bg-transparent border-0 shadow-none hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-6">
                      <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                        <Plus className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-xl text-white mb-2">Add New Vehicle</h3>
                        <p className="text-blue-100">
                          Register vehicles with detailed specifications and availability settings
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Link>

            <Link href="/search-book" className="block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40">
                <Card className="bg-transparent border-0 shadow-none hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-6">
                      <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                        <Search className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-xl text-white mb-2">Search & Book</h3>
                        <p className="text-blue-100">
                          Find available vehicles and book them in seconds with our intuitive interface
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}