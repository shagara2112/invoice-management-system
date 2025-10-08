#!/bin/bash

echo "🚀 Deploying to Vercel..."

# Build the application
echo "🔨 Building application..."
./scripts/build.sh

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
npx vercel --prod

echo "✅ Deployment completed successfully!"