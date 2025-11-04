# Scorpion26.00 - Enterprise Fitness Platform

A comprehensive, white-label fitness platform built with Next.js 14, featuring AI-powered personalization, gamification, social features, and Apple Watch integration.

## 🚀 Features

### Core Platform
- **Multi-Role Dashboard** - Admin, Collaborator, and Member portals
- **AI Personalization** - Adaptive workout plans and coaching chatbot
- **Gamification System** - Achievements, leaderboards, and rewards
- **Social Features** - Community engagement and social sharing
- **Video Streaming** - HLS-based workout video delivery
- **E-commerce Integration** - Shopify-powered merchandise store

### Health & Wearables
- **Apple Watch App** - Native watchOS companion app
- **Health Kit Integration** - Comprehensive health data tracking
- **Activity Tracking** - Real-time workout and progress monitoring

### Technical Excellence
- **White-Label Branding** - Fully customizable brand system
- **Enterprise Security** - RBAC, RLS, and comprehensive auth
- **Responsive Design** - Mobile-first, accessible UI
- **Performance Optimized** - SSR, code splitting, image optimization

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Stripe account (for payments)
- Shopify store (for e-commerce)
- OpenAI API key (for AI features)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ghxstship/scorpion26.00.git
   cd scorpion26.00
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your credentials:
   - Supabase URL and keys
   - Stripe keys
   - Shopify credentials
   - OpenAI API key
   - Other service credentials

4. **Set up the database**
   ```bash
   npm run supabase:migrate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/              # Next.js 14 App Router
│   ├── (public)/     # Public pages
│   ├── admin/        # Admin dashboard
│   ├── collaborator/ # Collaborator portal
│   ├── member/       # Member dashboard
│   └── api/          # API routes
├── components/       # React components (Atomic Design)
│   ├── atoms/        # Basic UI elements
│   ├── molecules/    # Component combinations
│   ├── organisms/    # Complex sections
│   └── ui/           # shadcn/ui components
├── lib/              # Utilities and business logic
│   ├── ai/           # AI personalization
│   ├── auth/         # Authentication & RBAC
│   ├── supabase/     # Database client
│   └── utils/        # Helper functions
├── hooks/            # Custom React hooks
├── types/            # TypeScript definitions
├── docs/             # Comprehensive documentation
└── supabase/         # Database migrations
```

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[Architecture Guide](./ARCHITECTURE.md)** - System architecture overview
- **[Documentation Index](./docs/INDEX.md)** - Complete documentation navigation
- **[Deployment Guide](./docs/deployment/DEPLOYMENT_GUIDE.md)** - Production deployment
- **[API Documentation](./docs/API_DOCUMENTATION.md)** - API reference
- **[Apple Watch Guide](./docs/APPLE_WATCH_APP_GUIDE.md)** - Wearable integration

### Quick Start Guides
- [Dashboard Quick Start](./docs/guides/DASHBOARD_QUICKSTART.md)
- [Brand Quick Start](./docs/guides/BRAND_QUICKSTART.md)
- [Gamification Quick Start](./docs/GAMIFICATION_QUICKSTART.md)
- [Health Features Quick Start](./docs/HEALTH_QUICK_START.md)

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build verification
npm run build
```

## 🚢 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

See [Deployment Guide](./docs/deployment/DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🔐 Security

- Row-Level Security (RLS) on all database tables
- Role-Based Access Control (RBAC)
- Secure API routes with middleware
- Environment variable protection
- Rate limiting on sensitive endpoints

## 🎨 Customization

### White-Label Branding

The platform supports complete white-labeling:

1. Configure brand settings in `/lib/branding/brand-config.ts`
2. Update design tokens in `/lib/design-tokens.ts`
3. Customize theme in `tailwind.config.ts`
4. Upload brand assets to Supabase Storage

See [Brand Quick Start](./docs/guides/BRAND_QUICKSTART.md) for details.

## 🤝 Contributing

This is a private enterprise project. For internal contributions:

1. Create a feature branch
2. Make your changes
3. Submit a pull request
4. Ensure all tests pass

## 📄 License

See [LICENSE](./LICENSE) file for details.

## 🆘 Support

For technical support and documentation:
- Review the [Documentation Index](./docs/INDEX.md)
- Check implementation guides in `/docs/implementation`
- Refer to troubleshooting sections in relevant guides

## 🏗️ Built With

- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS + shadcn/ui
- **Authentication:** Supabase Auth
- **Payments:** Stripe
- **E-commerce:** Shopify
- **AI:** OpenAI GPT-4
- **Video:** HLS.js
- **Analytics:** Custom implementation
- **Monitoring:** Sentry

---

**Version:** 1.0.0  
**Last Updated:** November 4, 2025
