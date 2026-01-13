# Setup Instructions

## Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/artista-salon
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

4. Make sure MongoDB is running on your system, or use MongoDB Atlas connection string.

5. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## Frontend Setup

1. Install dependencies (from project root):
```bash
npm install
```

2. Create a `.env` file in the project root:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Initial Admin Setup

1. Navigate to `/admin/login`
2. Click "Don't have an account? Register"
3. Create your admin account with username and password
4. You'll be automatically logged in and redirected to the dashboard

## Database Seeding (Optional)

You may want to seed initial data for branches, services, and staff. You can do this through the admin dashboard:

1. Go to Settings to add branches
2. Go to Services to add services
3. Go to Staff to add staff members

## Features

- **Booking System**: Customers can book appointments through the booking page (no payment processing)
- **Admin Dashboard**: Real-time booking alerts with sound notifications
- **Bookings Management**: View, filter, update status, send WhatsApp confirmations, and call customers
- **Services Management**: CRUD operations for services
- **Staff Management**: Manage staff members and assign them to branches
- **Attendance Management**: Track staff attendance with default present status
- **Analytics**: View booking statistics and trends
- **Settings**: Manage branches and WhatsApp numbers

## Note on Payment Functionality

This version of the application does not include payment processing. Bookings are created without payment method selection. All payment-related features (Razorpay integration, payment tracking, etc.) have been removed.

## Production Deployment

1. Build the frontend:
```bash
npm run build
```

2. Set environment variables in your hosting platform
3. Deploy backend to a Node.js hosting service (e.g., Heroku, Railway, Render)
4. Deploy frontend to a static hosting service (e.g., Vercel, Netlify)
5. Update CORS settings in backend to allow your frontend domain

## Notes

- The notification sound file should be placed in `public/notification.mp3` for booking alerts
- Make sure MongoDB is accessible from your backend server
- Update JWT_SECRET to a strong random string in production

