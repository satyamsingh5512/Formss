#!/bin/bash

echo "🚀 Setting up Formlytic - Modern Form Builder Platform"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Setup environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your credentials."
else
    echo "ℹ️  .env file already exists"
fi

echo ""
echo "🔑 Setup Google OAuth:"
echo "   1. Go to https://console.cloud.google.com/"
echo "   2. Create a new project or select existing"
echo "   3. Enable Google+ API"
echo "   4. Create OAuth 2.0 credentials"
echo "   5. Add redirect URI: http://localhost:3000/api/auth/callback/google"
echo "   6. Update GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env"
echo ""

# Generate Prisma Client
echo "🗄️  Setting up Prisma..."
npm run db:generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma Client"
    exit 1
fi

echo "✅ Prisma Client generated"
echo ""

echo "📊 Database setup:"
echo "   Make sure PostgreSQL is running"
echo "   Update DATABASE_URL in .env with your database credentials"
echo "   Then run: npm run db:push"
echo ""

echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "   1. Edit .env with your credentials"
echo "   2. Run: npm run db:push (after setting up database)"
echo "   3. Run: npm run dev"
echo "   4. Open: http://localhost:3000"
echo ""
echo "📚 See README.md for detailed documentation"
