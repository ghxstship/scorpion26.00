# Scorpion26 - Fitness Platform

A modern, full-featured fitness platform built with Next.js, Supabase, and Cloudflare Stream.

## 🚀 Features

### Core Platform
- ✅ **Multi-Role System** - Admin, Team, Collaborator, Member, Guest
- ✅ **Subscription Management** - Stripe integration with tiered plans
- ✅ **E-commerce** - Shopify integration for merchandise
- ✅ **Community Features** - Forums, discussions, social engagement
- ✅ **Progress Tracking** - Workout logs, achievements, analytics
- ✅ **Support System** - Ticketing and help desk

### 🎥 Video Streaming System
- ✅ **HLS Adaptive Streaming** - Automatic quality (360p-1080p)
- ✅ **Progress Tracking** - Resume from last position
- ✅ **Offline Downloads** - Watch without internet
- ✅ **Closed Captions** - Multi-language subtitles
- ✅ **Admin Upload** - Drag & drop interface
- ✅ **Mobile Optimized** - Touch controls
- ✅ **Keyboard Shortcuts** - Full navigation
- ✅ **Picture-in-Picture** - Multitask while watching

[📖 Video Streaming Documentation](./README_VIDEO_STREAMING.md)

### 🎮 Gamification System (NEW!)
- ✅ **54 Badges** - Across 5 categories (Workout, Streak, Distance, Social, Special)
- ✅ **XP & Leveling** - Progressive requirements with level-up celebrations
- ✅ **Streak Tracking** - Daily activity monitoring with milestones
- ✅ **Time-bound Challenges** - Competitions with real-time leaderboards
- ✅ **Global Leaderboards** - XP, Workouts (All-time, Monthly, Weekly)
- ✅ **Milestone Celebrations** - Confetti animations and notifications
- ✅ **Auto-Award Logic** - Badges earned automatically based on activity
- ✅ **Challenge System** - Join, track, and compete in fitness challenges

[📖 Gamification Documentation](./GAMIFICATION_README.md) | [🚀 Quick Start](./docs/GAMIFICATION_QUICKSTART.md) | [📊 Full Docs](./docs/GAMIFICATION_SYSTEM_COMPLETE.md)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Cloudflare account (for video streaming)
- Stripe account (for payments)
- Shopify store (optional, for e-commerce)

## 🛠️ Quick Start

### 1. Clone & Install

```bash
git clone <repository-url>
cd Scorpion26.00
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required variables:
- Supabase URL and keys
- Cloudflare Stream credentials (for video)
- Stripe keys (for payments)
- Shopify credentials (optional)

### 3. Database Setup

```bash
# Using Supabase CLI
supabase db push

# Or manually run migrations in Supabase dashboard
```

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## 📁 Project Structure

```
scorpion26/
├── app/                      # Next.js app directory
│   ├── (public)/            # Public pages (landing, about, etc.)
│   ├── admin/               # Admin dashboard
│   ├── member/              # Member portal
│   ├── collaborator/        # Collaborator dashboard
│   ├── api/                 # API routes
│   └── guest/               # Guest/trial pages
├── components/              # React components
│   ├── atoms/              # Atomic design - atoms
│   ├── molecules/          # Atomic design - molecules
│   ├── organisms/          # Atomic design - organisms
│   ├── admin/              # Admin-specific components
│   ├── workout/            # Workout & video components
│   └── ui/                 # shadcn/ui components
├── lib/                     # Utilities & helpers
│   ├── auth/               # Authentication & RBAC
│   ├── video/              # Video streaming utilities
│   ├── supabase/           # Supabase client
│   └── branding/           # Theme & branding
├── supabase/               # Database migrations
│   └── migrations/
├── docs/                    # Documentation
└── public/                  # Static assets
```

## 🎨 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui + Radix UI
- **Animations**: Framer Motion
- **State**: Zustand
- **Forms**: React Hook Form + Zod

### Backend
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **API**: Next.js API Routes
- **Video CDN**: Cloudflare Stream
- **Payments**: Stripe
- **E-commerce**: Shopify
- **Email**: Resend
- **Rate Limiting**: Upstash Redis

### Video Streaming
- **CDN**: Cloudflare Stream
- **Player**: HLS.js
- **Format**: HLS (HTTP Live Streaming)
- **Qualities**: 360p, 540p, 720p, 1080p (adaptive)

## 👥 User Roles

### Guest (Trial)
- Browse public content
- 3 sample workouts
- Read-only community access
- 7-day trial period

### Member (Paid)
- Full workout library access
- Progress tracking
- Community participation
- Download resources
- Video streaming

### Collaborator (3rd Party)
- Content creation
- Earnings dashboard
- Analytics access
- Limited admin features

### Team (Internal)
- Content management
- User support
- Analytics
- Moderate community

### Admin (Full Access)
- All platform features
- User management
- System configuration
- Financial reports

## 🎥 Video Streaming Setup

### Quick Setup (15 minutes)

1. **Install dependencies** (already done with `npm install`)

2. **Configure Cloudflare Stream**:
   - Sign up at https://dash.cloudflare.com
   - Get Account ID and API Token
   - Add to `.env.local`

3. **Run migration**:
   ```bash
   supabase db push
   ```

4. **Test upload**:
   - Go to `/admin/workouts`
   - Upload a test video
   - View at `/member/workouts`

[📖 Full Video Streaming Guide](./docs/VIDEO_STREAMING_QUICKSTART.md)

## 📚 Documentation

### General
- [Directory Structure](./docs/DIRECTORY_STRUCTURE.md)
- [Navigation & Features Audit](./docs/NAVIGATION_AND_FEATURES_AUDIT.md)
- [Implementation Complete](./docs/100_PERCENT_IMPLEMENTATION_COMPLETE.md)

### Video Streaming
- [Quick Start (15 min)](./docs/VIDEO_STREAMING_QUICKSTART.md)
- [Complete Guide](./docs/VIDEO_STREAMING_GUIDE.md)
- [Implementation Summary](./docs/VIDEO_STREAMING_IMPLEMENTATION_SUMMARY.md)
- [Video Streaming README](./README_VIDEO_STREAMING.md)

### Guides
- [Brand Quickstart](./docs/guides/BRAND_QUICKSTART.md)
- [Dashboard Quickstart](./docs/guides/DASHBOARD_QUICKSTART.md)
- [Demo Credentials](./docs/guides/DEMO_CREDENTIALS_CARD.md)

## 🧪 Testing

### Demo Users

The platform includes pre-configured demo users:

- **Admin**: admin@scorpion26.com
- **Team**: team@scorpion26.com
- **Collaborator**: collab@scorpion26.com
- **Member**: member@scorpion26.com
- **Guest**: guest@scorpion26.com

Password: `demo123` (for all demo accounts)

### Running Tests

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Environment Variables

Required for production:
- All Supabase credentials
- Cloudflare Stream credentials
- Stripe keys (production)
- Sentry DSN (optional, for error tracking)

## 💰 Cost Breakdown

### Monthly Estimates

**Small Platform** (100 workouts, 1,000 views/month):
- Supabase: $25 (Pro plan)
- Cloudflare Stream: $45
- Stripe: ~2.9% + $0.30 per transaction
- Vercel: $0 (Hobby) or $20 (Pro)
- **Total**: ~$70-90/month

**Medium Platform** (500 workouts, 5,000 views/month):
- Supabase: $25-100
- Cloudflare Stream: $225
- Stripe: Transaction fees
- Vercel: $20 (Pro)
- **Total**: ~$270-350/month

## 🔒 Security

- ✅ Row-level security (RLS) on all tables
- ✅ JWT-based authentication
- ✅ API rate limiting
- ✅ CORS configuration
- ✅ Environment variable protection
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ CSRF tokens

## 📊 Performance

- ✅ Server-side rendering (SSR)
- ✅ Static generation where possible
- ✅ Image optimization (Next.js Image)
- ✅ Code splitting
- ✅ Lazy loading
- ✅ CDN delivery (Cloudflare)
- ✅ Database indexing
- ✅ Query optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

All rights reserved - Scorpion26 Platform

## 🆘 Support

- **Documentation**: See `/docs` folder
- **Video Streaming**: See `README_VIDEO_STREAMING.md`
- **Issues**: Create a GitHub issue
- **Email**: support@scorpion26.com

## 🗺️ Roadmap

### Phase 1 (Complete) ✅
- Multi-role authentication
- Subscription management
- Workout library
- Community features
- Video streaming system

### Phase 2 (In Progress)
- [ ] Mobile app (React Native)
- [ ] Live streaming workouts
- [ ] Advanced analytics
- [ ] AI workout recommendations
- [ ] Social features expansion

### Phase 3 (Planned)
- [ ] Wearable device integration
- [ ] Nutrition tracking
- [ ] Marketplace for trainers
- [ ] White-label solution
- [ ] API for third-party integrations

---

**Version**: 1.0.0  
**Last Updated**: November 4, 2024  
**Status**: Production Ready 🚀

Built with ❤️ using Next.js, Supabase, and Cloudflare Stream
