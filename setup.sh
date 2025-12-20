#!/bin/bash

echo "========================================"
echo "Landing Platform - Setup Script"
echo "========================================"
echo ""

echo "[1/5] Installing root dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install root dependencies"
    exit 1
fi

echo ""
echo "[2/5] Installing API dependencies..."
cd apps/api
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install API dependencies"
    exit 1
fi
cd ../..

echo ""
echo "[3/5] Installing Web dependencies..."
cd apps/web
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install Web dependencies"
    exit 1
fi
cd ../..

echo ""
echo "[4/5] Creating environment files..."
if [ ! -f "apps/api/.env" ]; then
    cp apps/api/.env.example apps/api/.env
    echo "✓ Created apps/api/.env from template"
else
    echo "ℹ apps/api/.env already exists, skipping..."
fi

if [ ! -f "apps/web/.env" ]; then
    cp apps/web/.env.example apps/web/.env
    echo "✓ Created apps/web/.env from template"
else
    echo "ℹ apps/web/.env already exists, skipping..."
fi

echo ""
echo "========================================"
echo "✓ Installation Complete!"
echo "========================================"
echo ""
echo "NEXT STEPS:"
echo ""
echo "1. Setup MySQL database:"
echo "   - Create database: landing_platform"
echo "   - Import: db/schema.sql"
echo "   - Import: db/seed.sql"
echo ""
echo "2. Configure environment:"
echo "   - Edit apps/api/.env with your database credentials"
echo "   - Edit apps/web/.env if needed (default is OK for local dev)"
echo ""
echo "3. Start development servers:"
echo "   Terminal 1: cd apps/api && npm run dev"
echo "   Terminal 2: cd apps/web && npm run dev"
echo ""
echo "4. Open browser:"
echo "   http://localhost:5173"
echo ""
echo "For detailed instructions, see QUICKSTART.md"
echo ""
