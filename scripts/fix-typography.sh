#!/bin/bash

# Scorpion Typography Fix Script
# Automatically fixes typography violations across the codebase

echo "🔍 Scorpion Typography Fix Script"
echo "=================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for fixes
FIXES=0

echo "📋 Phase 1: Critical Fixes"
echo ""

# Fix 1: Replace font-montserrat with font-heading in components
echo "🔧 Replacing font-montserrat with font-heading in components..."
find components -name "*.tsx" -type f -exec sed -i '' 's/font-montserrat/font-heading/g' {} +
FIXES=$((FIXES + 1))
echo "${GREEN}✓${NC} Fixed font-montserrat in components/"

# Fix 2: Replace font-montserrat with font-heading in app
echo "🔧 Replacing font-montserrat with font-heading in app..."
find app -name "*.tsx" -type f -exec sed -i '' 's/font-montserrat/font-heading/g' {} +
FIXES=$((FIXES + 1))
echo "${GREEN}✓${NC} Fixed font-montserrat in app/"

echo ""
echo "📊 Summary"
echo "=========="
echo "${GREEN}✓ ${FIXES} automated fixes applied${NC}"
echo ""
echo "⚠️  Manual fixes still required:"
echo "  1. Update app/layout.tsx to remove Inter/Montserrat imports"
echo "  2. Change body className from 'font-sans' to 'font-body'"
echo "  3. Update tailwind.config.ts font-sans mapping"
echo ""
echo "🔍 Run verification:"
echo "  grep -r 'font-montserrat' app/ components/ --include='*.tsx'"
echo ""
echo "✅ Script complete!"
