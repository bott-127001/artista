# Quick Render Deployment Guide (Single Service)

## Build & Start Commands for Render Dashboard:

**Build Command:**
```bash
npm install && cd server && npm install && cd .. && npm run build
```

**Start Command:**
```bash
cd server && npm start
```

## Environment Variables:

Set these in Render Dashboard → Your Service → Environment:

1. `NODE_ENV` = `production`
2. `PORT` = `10000` (or leave empty - Render sets automatically)
3. `MONGODB_URI` = `your_mongodb_connection_string`
4. `JWT_SECRET` = `bK0wot4oJqycHcUxOgVXb/kn8zhlCsFgkDN9TDJ+ENw=`
5. `FRONTEND_URL` = `https://your-app-name.onrender.com` (set after deployment)

## Notes:
- Install server dependencies BEFORE building frontend to avoid module errors
- The server will serve the built frontend from the `dist` directory in production
