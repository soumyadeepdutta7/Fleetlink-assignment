import Link from 'next/link'
import { Truck } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold">
            <Truck className="h-8 w-8" />
            <span>FleetLink</span>
          </Link>
          <nav className="flex space-x-6">
            <Link 
              href="/add-vehicle" 
              className="hover:text-blue-200 transition-colors"
            >
              Add Vehicle
            </Link>
            <Link 
              href="/search-book" 
              className="hover:text-blue-200 transition-colors"
            >
              Search & Book
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}