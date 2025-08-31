#!/bin/bash

echo "🎯 Quick Start for Todo Frontend"
echo "================================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Copying env.example to .env..."
    cp env.example .env
    echo "✅ Please update .env with your backend API URL before continuing"
    echo "   VITE_API_BASE_URL=http://localhost:3001"
    echo ""
    read -p "Press Enter after updating .env file..."
fi

echo "📦 Installing dependencies..."
npm install

echo "🚀 Starting development server..."
echo "   Frontend will be available at: http://localhost:3000"
echo "   Make sure your backend is running at: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev 