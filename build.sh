#!/bin/bash
# Build script for Render deployment

set -e  # Exit on error

echo "Installing server dependencies..."
cd server
npm install
cd ..

echo "Installing frontend dependencies (including dev dependencies)..."
npm install --include=dev

echo "Building frontend..."
npm run build

echo "Build completed successfully!"
