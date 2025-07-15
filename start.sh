#!/bin/bash

echo "🚀 Starting Omaha Drain KPI Dashboard..."

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Installing Node.js 18..."
    nvm install 18
    nvm use 18
fi

echo "✅ Using Node.js $(node --version)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
echo "🌐 Starting development server..."
echo "   The application will be available at: http://localhost:3000"
echo "   Press Ctrl+C to stop the server"
echo ""

npm run dev 