# Render Deployment Guide

This guide provides instructions for deploying the Artista Salon application to Render.

## Deployment Options

### Option 1: Separate Services (Recommended) ⭐

Deploy frontend and backend as separate services. This is the recommended approach for better scalability and separation of concerns.

#### Backend Service

1. **Create a new Web Service** in Render
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Name**: `artista-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Root Directory**: Leave empty (uses repository root)

4. **Environment Variables** (set in Render dashboard):
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_strong_random_secret_key
   FRONTEND_URL=https://your-frontend-url.onrender.com
   ```

#### Frontend Service

1. **Create a new Static Site** in Render
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Name**: `artista-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Environment Variables** (set in Render dashboard):
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

5. **After deployment**, update the backend's `FRONTEND_URL` environment variable with your frontend URL.

---

### Option 2: Single Service (All-in-One)

Deploy everything as a single service where the backend serves the frontend.

1. **Create a new Web Service** in Render
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Name**: `artista-app`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build && cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Root Directory**: Leave empty

4. **Environment Variables** (set in Render dashboard):
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_strong_random_secret_key
   FRONTEND_URL=https://your-app-url.onrender.com
   ```

**Note**: The server.js has been updated to serve the frontend static files in production mode.

---

## Quick Reference: Commands

### Option 1 (Separate Services)

**Backend:**
- Build: `cd server && npm install`
- Start: `cd server && npm start`

**Frontend:**
- Build: `npm install && npm run build`
- Publish: `dist` directory

### Option 2 (Single Service)

- Build: `npm install && npm run build && cd server && npm install`
- Start: `cd server && npm start`

---

## Environment Variables Required

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (Render sets this automatically) | `10000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-random-secret-key` |
| `FRONTEND_URL` | Frontend URL (for CORS) | `https://artista-frontend.onrender.com` |
| `VITE_API_URL` | Backend API URL (frontend only) | `https://artista-backend.onrender.com/api` |

---

## MongoDB Setup

1. Create a MongoDB database (MongoDB Atlas recommended)
2. Get your connection string
3. Add it to the `MONGODB_URI` environment variable in Render

---

## Post-Deployment Steps

1. **Access your admin panel**: `https://your-frontend-url.onrender.com/admin/login`
2. **Create an admin account** (first user will be admin)
3. **Configure your settings**:
   - Add branches
   - Add services
   - Add staff members
   - Configure WhatsApp numbers

---

## Troubleshooting

- **Build fails**: Check that all dependencies are in package.json
- **Server won't start**: Verify environment variables are set correctly
- **CORS errors**: Ensure `FRONTEND_URL` matches your frontend domain exactly
- **Database connection fails**: Verify `MONGODB_URI` is correct and MongoDB allows connections from Render's IPs

---

## Notes

- Render provides free SSL certificates automatically
- Free tier services spin down after 15 minutes of inactivity
- Consider upgrading to paid tier for production use
- The `uploads` directory for images will be ephemeral on free tier (consider using cloud storage like AWS S3 for production)
