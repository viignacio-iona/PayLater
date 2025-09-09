#!/bin/bash

# PayLater App - Deployment Script
# This script helps prepare and deploy the app to Vercel

echo "🚀 PayLater App - Deployment Script"
echo "=================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel:"
    vercel login
fi

echo "📦 Building the application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🌐 Deploying to Vercel..."
    echo ""
    echo "⚠️  IMPORTANT: Make sure you have set up:"
    echo "   1. Database (PostgreSQL) - Vercel Postgres or external provider"
    echo "   2. Environment variables in Vercel dashboard:"
    echo "      - DATABASE_URL"
    echo "      - APP_PASSWORD"
    echo "      - NEXTAUTH_SECRET"
    echo "      - NEXTAUTH_URL"
    echo ""
    echo "📋 See DEPLOYMENT_GUIDE.md for detailed instructions"
    echo ""
    read -p "Press Enter to continue with deployment..."
    
    vercel --prod
else
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi
