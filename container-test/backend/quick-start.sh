#!/bin/bash

echo "🚀 Quick Start for Todo Backend"
echo "================================"

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Copying env.example to .env..."
    cp env.example .env
    echo "✅ Please update .env with your database credentials before continuing"
    echo "   DATABASE_URL=\"postgresql://username:password@localhost:5432/todo_db?schema=public\""
    echo ""
    read -p "Press Enter after updating .env file..."
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Generating Prisma client..."
npm run db:generate

echo "🏗️  Building TypeScript..."
npm run build

echo "🎯 Starting development server..."
echo "   Server will be available at: http://localhost:3001"
echo "   Health check: http://localhost:3001/health"
echo "   Todo API: http://localhost:3001/api/todos"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev 