import './globals.css'
import { Inter } from 'next/font/google'
import Header from '@/components/layout/Header'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FleetLink - Logistics Vehicle Booking System',
  description: 'Manage and book logistics vehicles for B2B clients',
  keywords: ['logistics', 'vehicle booking', 'B2B', 'fleet management', 'transportation'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}