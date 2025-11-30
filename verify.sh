#!/bin/bash

# FormSS Installation Verification Script
# This script checks if all required files are present

echo "🔍 FormSS Installation Verification"
echo "===================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
TOTAL=0
PASSED=0
FAILED=0

# Function to check file
check_file() {
    TOTAL=$((TOTAL + 1))
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗${NC} $1 - MISSING"
        FAILED=$((FAILED + 1))
    fi
}

# Function to check directory
check_dir() {
    TOTAL=$((TOTAL + 1))
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗${NC} $1/ - MISSING"
        FAILED=$((FAILED + 1))
    fi
}

echo "📁 Checking Configuration Files..."
check_file "package.json"
check_file "tsconfig.json"
check_file "tailwind.config.ts"
check_file "next.config.js"
check_file "postcss.config.js"
check_file ".env.example"
check_file ".gitignore"
check_file "middleware.ts"
echo ""

echo "📚 Checking Documentation..."
check_file "README.md"
check_file "QUICKSTART.md"
check_file "DEVELOPMENT.md"
check_file "PROJECT_SUMMARY.md"
check_file "STRUCTURE.md"
check_file "setup.sh"
echo ""

echo "🗄️ Checking Database..."
check_file "prisma/schema.prisma"
echo ""

echo "📱 Checking App Structure..."
check_dir "app"
check_dir "app/api"
check_dir "app/dashboard"
check_dir "app/auth"
check_dir "app/form"
echo ""

echo "🎨 Checking Components..."
check_dir "components"
check_dir "components/ui"
check_dir "components/form-builder"
check_file "components/sidebar.tsx"
check_file "components/form-card.tsx"
check_file "components/providers.tsx"
echo ""

echo "🧩 Checking UI Components..."
check_file "components/ui/button.tsx"
check_file "components/ui/card.tsx"
check_file "components/ui/input.tsx"
check_file "components/ui/textarea.tsx"
check_file "components/ui/label.tsx"
check_file "components/ui/switch.tsx"
check_file "components/ui/select.tsx"
check_file "components/ui/checkbox.tsx"
check_file "components/ui/radio-group.tsx"
check_file "components/ui/tabs.tsx"
check_file "components/ui/toast.tsx"
check_file "components/ui/toaster.tsx"
echo ""

echo "🔌 Checking API Routes..."
check_file "app/api/auth/[...nextauth]/route.ts"
check_file "app/api/forms/route.ts"
check_file "app/api/forms/[id]/route.ts"
check_file "app/api/forms/[id]/questions/route.ts"
check_file "app/api/forms/[id]/analytics/route.ts"
check_file "app/api/forms/[id]/export/route.ts"
check_file "app/api/forms/[id]/responses/route.ts"
check_file "app/api/public/[publicId]/route.ts"
echo ""

echo "📄 Checking Pages..."
check_file "app/page.tsx"
check_file "app/layout.tsx"
check_file "app/auth/signin/page.tsx"
check_file "app/dashboard/page.tsx"
check_file "app/dashboard/layout.tsx"
check_file "app/dashboard/new/page.tsx"
check_file "app/dashboard/[formId]/builder/page.tsx"
check_file "app/dashboard/[formId]/analytics/page.tsx"
check_file "app/dashboard/[formId]/responses/page.tsx"
check_file "app/form/[publicFormId]/page.tsx"
echo ""

echo "🛠️ Checking Utilities..."
check_dir "lib"
check_file "lib/auth.ts"
check_file "lib/prisma.ts"
check_file "lib/utils.ts"
check_file "lib/constants.ts"
echo ""

echo "🎣 Checking Hooks..."
check_dir "hooks"
check_file "hooks/use-toast.ts"
echo ""

echo "📘 Checking Types..."
check_dir "types"
check_file "types/index.ts"
check_file "types/next-auth.d.ts"
echo ""

# Summary
echo "===================================="
echo "📊 Verification Summary"
echo "===================================="
echo "Total checks: $TOTAL"
echo -e "${GREEN}Passed: $PASSED${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}Failed: $FAILED${NC}"
else
    echo -e "${GREEN}Failed: $FAILED${NC}"
fi
echo ""

# Final result
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All files present! Installation verified.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Run: npm install"
    echo "2. Copy: cp .env.example .env"
    echo "3. Edit .env with your credentials"
    echo "4. Run: npm run db:generate"
    echo "5. Run: npm run db:push"
    echo "6. Run: npm run dev"
    exit 0
else
    echo -e "${RED}❌ Some files are missing!${NC}"
    echo ""
    echo "Please check the missing files above."
    exit 1
fi
