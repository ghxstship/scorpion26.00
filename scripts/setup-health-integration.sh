#!/bin/bash

# Health Integration Setup Script
# This script helps set up the wearable and health data integration

set -e

echo "🏥 Setting up Health Data Integration..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Creating .env.local from .env.example...${NC}"
    cp .env.example .env.local
    echo -e "${GREEN}✓ Created .env.local${NC}"
else
    echo -e "${GREEN}✓ .env.local already exists${NC}"
fi

echo ""
echo "📋 Checklist for Health Integration Setup:"
echo ""

# Check Node modules
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠ Dependencies not installed${NC}"
    echo "  Run: npm install"
fi

# Check for health integration dependencies
if [ -f "node_modules/@capacitor-community/health/package.json" ]; then
    echo -e "${GREEN}✓ Capacitor Health plugin installed${NC}"
else
    echo -e "${YELLOW}⚠ Capacitor Health plugin not installed${NC}"
    echo "  This will be installed when you run: npm install"
fi

echo ""
echo "🔧 Environment Variables to Configure:"
echo ""

# Check Google Fit credentials
if grep -q "NEXT_PUBLIC_GOOGLE_FIT_CLIENT_ID=your_" .env.local; then
    echo -e "${RED}✗ Google Fit credentials not configured${NC}"
    echo "  1. Go to: https://console.cloud.google.com/apis/credentials"
    echo "  2. Create OAuth 2.0 credentials"
    echo "  3. Add to .env.local:"
    echo "     NEXT_PUBLIC_GOOGLE_FIT_CLIENT_ID=your_client_id"
    echo "     GOOGLE_FIT_CLIENT_SECRET=your_client_secret"
else
    echo -e "${GREEN}✓ Google Fit credentials configured${NC}"
fi

echo ""

# Check Fitbit credentials
if grep -q "NEXT_PUBLIC_FITBIT_CLIENT_ID=your_" .env.local; then
    echo -e "${RED}✗ Fitbit credentials not configured${NC}"
    echo "  1. Go to: https://dev.fitbit.com/apps"
    echo "  2. Register a new application"
    echo "  3. Add to .env.local:"
    echo "     NEXT_PUBLIC_FITBIT_CLIENT_ID=your_client_id"
    echo "     FITBIT_CLIENT_SECRET=your_client_secret"
else
    echo -e "${GREEN}✓ Fitbit credentials configured${NC}"
fi

echo ""

# Check Supabase connection
if command -v supabase &> /dev/null; then
    echo -e "${GREEN}✓ Supabase CLI installed${NC}"
    
    # Check if migration exists
    if [ -f "supabase/migrations/20251104040000_health_data_schema.sql" ]; then
        echo -e "${GREEN}✓ Health data migration file exists${NC}"
        echo ""
        echo "📊 Database Migration:"
        echo "  Run: supabase db push"
        echo "  Or: supabase migration up"
    else
        echo -e "${RED}✗ Health data migration file not found${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Supabase CLI not installed${NC}"
    echo "  Install: npm install -g supabase"
fi

echo ""
echo "📱 OAuth Redirect URIs to Configure:"
echo ""
echo "Google Fit:"
echo "  http://localhost:3000/api/auth/google-fit/callback"
echo "  https://yourdomain.com/api/auth/google-fit/callback"
echo ""
echo "Fitbit:"
echo "  http://localhost:3000/api/auth/fitbit/callback"
echo "  https://yourdomain.com/api/auth/fitbit/callback"
echo ""

echo "🎯 Next Steps:"
echo ""
echo "1. Configure environment variables in .env.local"
echo "2. Run: npm install"
echo "3. Run database migration: supabase db push"
echo "4. Start dev server: npm run dev"
echo "5. Navigate to: http://localhost:3000/member/settings/connections"
echo "6. Connect your devices and test!"
echo ""

echo -e "${GREEN}Setup script complete!${NC}"
echo ""
echo "📚 For detailed instructions, see:"
echo "  - docs/WEARABLE_INTEGRATION_GUIDE.md"
echo "  - docs/WEARABLE_INTEGRATION_COMPLETE.md"
echo ""
