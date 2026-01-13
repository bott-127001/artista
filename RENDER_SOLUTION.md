# Render Deployment - Final Solution

## The Problem:
Render tries to validate the start command during build, causing `ERR_MODULE_NOT_FOUND` because server dependencies aren't installed yet.

## Solution: Use Build Script

### Option 1: Use the build script (Recommended)

**Build Command:**
```bash
chmod +x build.sh && ./build.sh
```

**Start Command:**
```bash
npm start
```

### Option 2: Use npm script

**Build Command:**
```bash
npm run build:render
```

**Start Command:**
```bash
npm start
```

### Option 3: Manual commands (if scripts don't work)

**Build Command:**
```bash
cd server && npm install --production && cd .. && npm install && npm run build
```

**Start Command:**
```bash
cd server && npm start
```

## Important Settings in Render Dashboard:

1. **Root Directory**: Leave EMPTY (don't set it to `server` or anything else)
2. **Environment**: `Node`
3. **Node Version**: `18.x` or `20.x` (Render will auto-detect)

## Environment Variables (Set in Render Dashboard):

```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=https://your-app-name.onrender.com
```

## Why This Works:

- The build script ensures server dependencies are installed BEFORE building
- This prevents Render from trying to validate server code before dependencies exist
- The `npm start` script in root package.json handles the server startup correctly

## If Still Failing:

1. Check Render logs for the exact error
2. Verify Root Directory is EMPTY in Render settings
3. Try Option 3 (manual commands) as a last resort
4. Make sure all environment variables are set correctly
