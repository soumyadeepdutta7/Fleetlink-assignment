# FleetLink - Logistics Vehicle Booking System

A comprehensive full-stack application for managing and booking logistics vehicles for B2B clients. Built with Next.js, MongoDB, and TypeScript.

## 🚀 Features

- **Vehicle Management**: Add and manage vehicles with capacity, tyres, and specifications
- **Smart Search**: Find available vehicles based on capacity, route, and time requirements
- **Real-time Availability**: Check vehicle availability with conflict detection
- **Secure Booking**: Race condition prevention and comprehensive validation
- **Responsive UI**: Modern, mobile-friendly interface built with Tailwind CSS
- **Comprehensive Testing**: Unit tests for critical backend logic

## 🛠 Tech Stack

- **Frontend**: Next.js 13, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB
- **Testing**: Jest
- **UI Components**: Radix UI, Lucide React
- **Form Handling**: React Hook Form with Zod validation

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fleetlink-logistics
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/fleetlink
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   # Using MongoDB Community Edition
   mongod

   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 📚 API Documentation

### Vehicles

#### POST /api/vehicles
Add a new vehicle to the fleet.

**Request Body:**
```json
{
  "name": "Truck 1",
  "capacityKg": 1000,
  "tyres": 4
}
```

**Response:** `201 Created`
```json
{
  "_id": "vehicle-id",
  "name": "Truck 1",
  "capacityKg": 1000,
  "tyres": 4,
  "createdAt": "2023-10-27T10:00:00Z"
}
```

#### GET /api/vehicles/available
Find available vehicles based on criteria.

**Query Parameters:**
- `capacityRequired`: Number (required)
- `fromPincode`: String (required)
- `toPincode`: String (required)
- `startTime`: ISO Date string (required)

**Example:**
```
GET /api/vehicles/available?capacityRequired=500&fromPincode=110001&toPincode=110002&startTime=2023-10-27T10:00:00Z
```

**Response:** `200 OK`
```json
[
  {
    "_id": "vehicle-id",
    "name": "Truck 1",
    "capacityKg": 1000,
    "tyres": 4,
    "estimatedRideDurationHours": 1
  }
]
```

### Bookings

#### POST /api/bookings
Book a vehicle for a specific time slot.

**Request Body:**
```json
{
  "vehicleId": "vehicle-id",
  "customerId": "customer-123",
  "fromPincode": "110001",
  "toPincode": "110002",
  "startTime": "2023-10-27T10:00:00Z"
}
```

**Response:** `201 Created`
```json
{
  "_id": "booking-id",
  "vehicleId": "vehicle-id",
  "customerId": "customer-123",
  "fromPincode": "110001",
  "toPincode": "110002",
  "startTime": "2023-10-27T10:00:00Z",
  "endTime": "2023-10-27T11:00:00Z",
  "estimatedRideDurationHours": 1,
  "createdAt": "2023-10-27T09:30:00Z"
}
```

**Error Responses:**
- `404 Not Found`: Vehicle doesn't exist
- `409 Conflict`: Vehicle already booked for the time slot

## 🧮 Core Logic

### Ride Duration Calculation
The system uses a simplified formula for calculating estimated ride duration:
```typescript
estimatedRideDurationHours = Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24
```

**Note:** This is a placeholder logic for demonstration purposes. In a production system, this would integrate with mapping services for accurate duration calculations.

### Availability Logic
The system checks for booking conflicts by finding overlapping time windows:
1. Bookings that start during the requested time window
2. Bookings that end during the requested time window  
3. Bookings that completely encompass the requested time window

### Race Condition Prevention
The booking endpoint re-verifies vehicle availability immediately before creating a booking to prevent race conditions between the search and book operations.

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Feedback**: Loading states, success/error messages
- **Form Validation**: Client-side and server-side validation
- **Intuitive Navigation**: Clear navigation between add vehicle and search/book pages
- **Professional Styling**: Clean, modern interface using Tailwind CSS

## 🏗 Project Structure

```
fleetlink-logistics/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── add-vehicle/       # Add vehicle page
│   ├── search-book/       # Search and book page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── lib/                  # Utility libraries
├── types/                # TypeScript type definitions
├── __tests__/            # Test files
└── hooks/                # Custom React hooks
```

## 🔒 Data Validation

- **Vehicle Creation**: Validates name, capacity (positive number), and tyres (minimum 2)
- **Booking Creation**: Validates all required fields and vehicle existence
- **Search Parameters**: Validates capacity, pincodes, and date format
- **Race Condition Prevention**: Re-validates availability before booking

## 🚀 Deployment

The application is ready for deployment on platforms like Vercel, Netlify, or any Node.js hosting service. Make sure to:

1. Set up your MongoDB database (MongoDB Atlas recommended for production)
2. Configure environment variables in your hosting platform
3. Run the build command: `npm run build`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.