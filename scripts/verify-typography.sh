#!/bin/bash

# Scorpion Typography Verification Script
# Use in CI/CD to enforce zero-tolerance typography policy

set -e

echo "🔍 Scorpion Typography Verification"
echo "===================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

VIOLATIONS=0

# Check 1: No font-montserrat usage
echo "Checking for font-montserrat usage..."
MONTSERRAT_COUNT=$(grep -r 'font-montserrat' app/ components/ --include='*.tsx' 2>/dev/null | wc -l | tr -d ' ')
if [ "$MONTSERRAT_COUNT" -gt 0 ]; then
  echo "${RED}✗ FAIL: Found $MONTSERRAT_COUNT instances of font-montserrat${NC}"
  grep -r 'font-montserrat' app/ components/ --include='*.tsx'
  VIOLATIONS=$((VIOLATIONS + 1))
else
  echo "${GREEN}✓ PASS: No font-montserrat usage${NC}"
fi

# Check 2: No Inter imports
echo "Checking for Inter font imports..."
INTER_COUNT=$(grep -r 'Inter.*from.*next/font' app/ --include='*.tsx' 2>/dev/null | wc -l | tr -d ' ')
if [ "$INTER_COUNT" -gt 0 ]; then
  echo "${RED}✗ FAIL: Found $INTER_COUNT Inter font imports${NC}"
  grep -r 'Inter.*from.*next/font' app/ --include='*.tsx'
  VIOLATIONS=$((VIOLATIONS + 1))
else
  echo "${GREEN}✓ PASS: No Inter imports${NC}"
fi

# Check 3: No Montserrat imports
echo "Checking for Montserrat font imports..."
MONT_IMPORT_COUNT=$(grep -r 'Montserrat.*from.*next/font' app/ --include='*.tsx' 2>/dev/null | wc -l | tr -d ' ')
if [ "$MONT_IMPORT_COUNT" -gt 0 ]; then
  echo "${RED}✗ FAIL: Found $MONT_IMPORT_COUNT Montserrat font imports${NC}"
  grep -r 'Montserrat.*from.*next/font' app/ --include='*.tsx'
  VIOLATIONS=$((VIOLATIONS + 1))
else
  echo "${GREEN}✓ PASS: No Montserrat imports${NC}"
fi

# Check 4: font-body in layout.tsx
echo "Checking for font-body in layout.tsx..."
FONT_BODY_COUNT=$(grep -c 'font-body' app/layout.tsx 2>/dev/null || echo '0')
if [ "$FONT_BODY_COUNT" -eq 0 ]; then
  echo "${RED}✗ FAIL: font-body not found in layout.tsx${NC}"
  VIOLATIONS=$((VIOLATIONS + 1))
else
  echo "${GREEN}✓ PASS: font-body found in layout.tsx${NC}"
fi

# Check 5: No font-sans in layout.tsx body
echo "Checking for font-sans in layout.tsx body..."
FONT_SANS_COUNT=$(grep 'className.*font-sans' app/layout.tsx 2>/dev/null | wc -l | tr -d ' ')
if [ "$FONT_SANS_COUNT" -gt 0 ]; then
  echo "${RED}✗ FAIL: font-sans found in layout.tsx body${NC}"
  VIOLATIONS=$((VIOLATIONS + 1))
else
  echo "${GREEN}✓ PASS: No font-sans in layout.tsx body${NC}"
fi

# Check 6: Scorpion fonts in tailwind.config.ts
echo "Checking Tailwind config for Scorpion fonts..."
if grep -q "title:.*--font-title" tailwind.config.ts && \
   grep -q "heading:.*--font-heading-1" tailwind.config.ts && \
   grep -q "body:.*--font-body" tailwind.config.ts; then
  echo "${GREEN}✓ PASS: Scorpion fonts configured in Tailwind${NC}"
else
  echo "${RED}✗ FAIL: Scorpion fonts not properly configured in Tailwind${NC}"
  VIOLATIONS=$((VIOLATIONS + 1))
fi

echo ""
echo "===================================="
if [ $VIOLATIONS -eq 0 ]; then
  echo "${GREEN}✅ ALL CHECKS PASSED${NC}"
  echo "Zero-tolerance typography policy: COMPLIANT"
  exit 0
else
  echo "${RED}❌ $VIOLATIONS VIOLATIONS FOUND${NC}"
  echo "Zero-tolerance typography policy: FAILED"
  echo ""
  echo "Fix violations and run again."
  exit 1
fi
