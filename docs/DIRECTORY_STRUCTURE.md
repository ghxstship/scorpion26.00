# Directory Structure Reference

Complete directory structure of the Scorpion26.00 project.

## 📁 Root Level

```
Scorpion26.00/
├── app/                        # Next.js 14 App Router
├── components/                 # React components
├── lib/                        # Utilities & business logic
├── hooks/                      # Custom React hooks
├── types/                      # TypeScript definitions
├── config/                     # Configuration files
├── scripts/                    # Utility scripts
├── supabase/                   # Database configuration
├── docs/                       # Documentation
├── public/                     # Static assets
├── ARCHITECTURE.md             # Architecture overview
├── README.md                   # Main readme
├── REORGANIZATION_SUMMARY.md   # Reorganization details
└── [config files]              # Next.js, TypeScript, etc.
```

## 🗂️ Detailed Structure

### `/app` - Application Routes

```
app/
├── (public)/                   # Public pages
│   ├── about/                  # About page
│   ├── brand-demo/             # Brand demo
│   ├── community/              # Community page
│   ├── contact/                # Contact page
│   ├── content/                # Content hub
│   ├── programs/               # Programs pages
│   ├── results/                # Results/testimonials
│   └── shop/                   # E-commerce shop
├── admin/                      # Admin dashboard
│   ├── analytics/              # Analytics dashboard
│   ├── audit-logs/             # Audit logs
│   ├── blog/                   # Blog management
│   ├── brand-config/           # Brand configuration
│   ├── collaborators/          # Collaborator management
│   ├── content/                # Content management
│   ├── dashboard/              # Main dashboard
│   ├── members/                # Member management
│   ├── notifications/          # Notifications
│   ├── programs/               # Program management
│   ├── settings/               # Settings
│   ├── shop/                   # Shop management
│   ├── support/                # Support tickets
│   ├── team/                   # Team management
│   └── users/                  # User management
├── collaborator/               # Collaborator portal
│   ├── analytics/              # Collaborator analytics
│   ├── dashboard/              # Collaborator dashboard
│   ├── earnings/               # Earnings tracking
│   ├── profile/                # Profile management
│   └── resources/              # Resources
├── api/                        # API routes
│   ├── admin/                  # Admin APIs
│   ├── auth/                   # Authentication
│   ├── brand-config/           # Brand config API
│   ├── collaborators/          # Collaborator APIs
│   ├── community/              # Community APIs
│   ├── content/                # Content APIs
│   ├── members/                # Member APIs
│   ├── notifications/          # Notification APIs
│   ├── programs/               # Program APIs
│   ├── shop/                   # Shop APIs
│   ├── stripe/                 # Stripe integration
│   └── users/                  # User APIs
├── guest/                      # Guest user routes
├── member/                     # Member portal
└── team/                       # Team portal
```

### `/components` - React Components

```
components/
├── atoms/                      # Atomic design - atoms
│   ├── heading.tsx
│   ├── icon.tsx
│   ├── rating.tsx
│   └── text.tsx
├── molecules/                  # Atomic design - molecules
├── ui/                         # shadcn/ui components
├── about/                      # About page components
├── auth/                       # Authentication components
├── branding/                   # Brand system components
├── cart/                       # Shopping cart
├── community/                  # Community components
├── contact/                    # Contact components
├── content/                    # Content components
├── dashboard/                  # Dashboard widgets
├── faq/                        # FAQ components
├── join/                       # Join/signup components
├── layout/                     # Layout components
├── layouts/                    # Page layouts
├── login/                      # Login components
├── notifications/              # Notification components
├── programs/                   # Program components
├── results/                    # Results/testimonials
├── sections/                   # Page sections
├── shared/                     # Shared components
├── shop/                       # Shop components
└── widgets/                    # Reusable widgets
```

### `/lib` - Utilities & Business Logic

```
lib/
├── api/                        # API utilities
│   ├── auth-middleware.ts
│   ├── middleware.ts
│   └── rate-limit.ts
├── auth/                       # Authentication
│   ├── demo-auth.ts
│   ├── rbac-types.ts
│   └── rbac-utils.ts
├── branding/                   # Brand system
│   ├── presets/                # Brand presets
│   ├── brand-config.ts
│   ├── brand-context.tsx
│   └── brand-utils.ts
├── supabase/                   # Database client
│   ├── client.ts
│   ├── server.ts
│   └── queries.ts
├── audit/                      # Audit logging
├── cache/                      # Caching utilities
├── constants/                  # Constants
├── email/                      # Email utilities
├── navigation/                 # Navigation helpers
├── products/                   # Product utilities
├── security/                   # Security utilities
├── shopify/                    # Shopify integration
├── storage/                    # Storage utilities
├── store/                      # State management
├── stripe/                     # Stripe integration
├── utils/                      # General utilities
├── validation/                 # Validation schemas
└── widgets/                    # Widget utilities
```

### `/hooks` - Custom React Hooks

```
hooks/
├── use-community.ts            # Community data
├── use-programs.ts             # Programs data
├── use-progress.ts             # Progress tracking
├── use-reduced-motion.ts       # Accessibility
├── use-toast.ts                # Toast notifications
└── use-user.ts                 # User data
```

### `/config` - Configuration Files

```
config/
├── sentry.client.config.ts     # Client-side error tracking
├── sentry.edge.config.ts       # Edge runtime error tracking
└── sentry.server.config.ts     # Server-side error tracking
```

### `/scripts` - Utility Scripts

```
scripts/
├── check-demo-users.sql        # Check demo users
├── create-demo-users.js        # Create demo users
├── deploy-to-github.sh         # Deployment script
├── seed-demo-data.sql          # Seed demo data
├── setup-storage.sql           # Setup storage
└── supabase-schema.sql         # Database schema
```

### `/supabase` - Database Configuration

```
supabase/
├── .temp/                      # Temporary CLI files (gitignored)
└── migrations/                 # Database migrations
    ├── 20251104000828_initial_schema.sql
    └── 20251104010000_extended_schema.sql
```

### `/docs` - Documentation

```
docs/
├── architecture/               # System architecture
│   ├── ANIMATION_IMPLEMENTATION_SUMMARY.md
│   ├── ATOMIC_DESIGN_100_PERCENT_COMPLETE.md
│   ├── ATOMIC_DESIGN_REMEDIATION_COMPLETE.md
│   ├── CODEBASE_ORGANIZATION_SUMMARY.md
│   ├── DEMO_DATA_IMPLEMENTATION_SUMMARY.md
│   ├── ENTERPRISE_IMPLEMENTATION_SUMMARY.md
│   ├── FINAL_MIGRATION_STATUS.md
│   ├── MIGRATION_SUCCESS.md
│   └── SUPABASE_INTEGRATION_COMPLETE.md
├── guides/                     # User guides
│   ├── BRAND_QUICKSTART.md
│   ├── DASHBOARD_QUICKSTART.md
│   ├── DEMO_CREDENTIALS_CARD.md
│   ├── DEMO_DATA_SETUP.md
│   ├── DEMO_LOGIN_README.md
│   ├── DEMO_LOGIN_TEST_GUIDE.md
│   ├── DEMO_USER_CREATION_GUIDE.md
│   ├── NEXT_STEPS.md
│   ├── PROGRAMS_USAGE_GUIDE.md
│   ├── QUICK_DEPLOY.md
│   ├── QUICK_REFERENCE.md
│   ├── QUICK_START_ATOMIC_DESIGN.md
│   ├── QUICK_START_ENTERPRISE.md
│   ├── QUICK_START_GUIDE.md
│   ├── RBAC_QUICK_START.md
│   ├── SETUP_INSTRUCTIONS.md
│   └── SHOP_QUICKSTART.md
├── implementation/             # Technical docs
│   ├── ACCESSIBILITY_COMPLIANCE.md
│   ├── ANIMATION_SYSTEM_GUIDE.md
│   ├── ATOMIC_DESIGN_IMPLEMENTATION_GUIDE.md
│   ├── BRAND_SYSTEM_README.md
│   ├── BRAND_WHITE_LABEL_SYSTEM.md
│   ├── DASHBOARD_IMPLEMENTATION_SUMMARY.md
│   ├── DASHBOARD_SYSTEM.md
│   ├── GYM_COLOR_ZONES_IMPLEMENTATION.md
│   ├── PROGRAMS_STRUCTURE.md
│   ├── RBAC_IMPLEMENTATION_SUMMARY.md
│   ├── RBAC_README.md
│   ├── RBAC_SYSTEM.md
│   ├── README_UI_UX_SYSTEM.md
│   ├── RESPONSIVE_DESIGN_SYSTEM.md
│   ├── RESPONSIVE_TESTING_GUIDE.md
│   ├── SHOP_CHECKLIST.md
│   ├── SHOP_IMPLEMENTATION.md
│   └── TESTING_GUIDE.md
├── reports/                    # Audit & validation
│   ├── 404_REMEDIATION_REPORT.md
│   ├── API_ROUTES_VERIFICATION_REPORT.md
│   ├── ATOMIC_DESIGN_AUDIT_CHECKLIST.md
│   ├── ATOMIC_DESIGN_AUDIT_RESULTS.md
│   ├── COMPLETE_REMEDIATION_STATUS.md
│   ├── FINAL_REMEDIATION_REPORT.md
│   ├── FULL_STACK_AUDIT_REPORT.md
│   ├── PAGE_IMPLEMENTATION_VERIFICATION.md
│   ├── PRODUCTION_VALIDATION_REPORT.md
│   ├── REMEDIATION_FINAL_STATUS.md
│   ├── REMEDIATION_PROGRESS_SUMMARY.md
│   ├── RESPONSIVE_OPTIMIZATION_REPORT.md
│   ├── SUPABASE_AUDIT_REPORT.md
│   └── [validation reports...]
├── deployment/                 # Deployment guides
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── DEPLOYMENT_COMPLETE.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── DEPLOYMENT_READINESS.md
├── API_DOCUMENTATION.md        # API reference
├── DIRECTORY_STRUCTURE.md      # This file
├── INDEX.md                    # Documentation index
└── README.md                   # Documentation overview
```

### `/types` - TypeScript Definitions

```
types/
└── shop.ts                     # Shop type definitions
```

## 🔍 Quick Reference

### Finding Files

**Documentation:**
- Main index: `docs/INDEX.md`
- Quick start: `docs/guides/QUICK_START_GUIDE.md`
- Architecture: `ARCHITECTURE.md`

**Configuration:**
- Environment: `.env.example`, `.env.local`
- Sentry: `config/sentry.*.config.ts`
- Next.js: `next.config.js`
- TypeScript: `tsconfig.json`
- Tailwind: `tailwind.config.ts`

**Scripts:**
- Database: `scripts/supabase-schema.sql`
- Demo data: `scripts/seed-demo-data.sql`
- Deployment: `scripts/deploy-to-github.sh`

**Components:**
- Atoms: `components/atoms/`
- UI library: `components/ui/`
- Shop: `components/shop/`
- Dashboard: `components/dashboard/`

**Business Logic:**
- Auth: `lib/auth/`
- API: `lib/api/`
- Database: `lib/supabase/`
- Branding: `lib/branding/`

## 📊 Statistics

- **Total Directories:** 60+
- **Documentation Files:** 70+
- **Component Categories:** 23
- **Library Modules:** 15
- **API Routes:** 12+

## 🎯 Organization Principles

1. **Feature-Based:** Related functionality grouped together
2. **Atomic Design:** Components organized by complexity
3. **Separation of Concerns:** Clear boundaries between layers
4. **Scalability:** Structure supports growth
5. **Discoverability:** Intuitive file locations

---

**Last Updated:** November 4, 2025

For navigation help, see [INDEX.md](./INDEX.md)
