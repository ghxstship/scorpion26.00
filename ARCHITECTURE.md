# Repository Architecture

This document describes the organization and structure of the Scorpion26.00 codebase.

## 📂 Directory Structure

### `/app` - Next.js Application
The main application using Next.js 14 App Router.

**Structure:**
- `(public)/` - Public-facing pages (about, community, brand-demo)
- `admin/` - Admin dashboard and management
- `collaborator/` - Collaborator portal
- `api/` - API routes and endpoints

**Key Features:**
- Server and Client Components
- Route groups for organization
- API routes for backend logic
- Middleware for authentication

### `/components` - React Components
Organized using Atomic Design principles.

**Structure:**
- `atoms/` - Basic building blocks (buttons, inputs, headings)
- `molecules/` - Simple component combinations
- `organisms/` - Complex UI sections
- `ui/` - shadcn/ui components
- `layout/` - Layout components (header, footer, sidebar)
- `dashboard/` - Dashboard-specific widgets
- `shop/` - E-commerce components
- `branding/` - Brand system components

**Design System:**
- Consistent styling with Tailwind CSS
- Reusable component patterns
- TypeScript for type safety
- Accessibility built-in

### `/lib` - Utilities & Business Logic
Core utilities and helper functions.

**Structure:**
- `api/` - API utilities, middleware, rate limiting
- `auth/` - Authentication, RBAC, demo auth
- `branding/` - Brand configuration and presets
- `supabase/` - Database client and queries
- `utils.ts` - General utility functions

**Key Features:**
- Type-safe utilities
- Centralized business logic
- Reusable helper functions
- Database abstractions

### `/hooks` - Custom React Hooks
Reusable React hooks for common functionality.

**Examples:**
- `use-community.ts` - Community data management
- `use-programs.ts` - Programs data
- `use-progress.ts` - Progress tracking
- `use-reduced-motion.ts` - Accessibility

### `/types` - TypeScript Definitions
Shared TypeScript types and interfaces.

**Purpose:**
- Type safety across the application
- Shared data models
- API response types
- Component prop types

### `/config` - Configuration Files
Application configuration and third-party integrations.

**Files:**
- `sentry.client.config.ts` - Client-side error tracking
- `sentry.edge.config.ts` - Edge runtime error tracking
- `sentry.server.config.ts` - Server-side error tracking

### `/scripts` - Utility Scripts
Database scripts and deployment utilities.

**Files:**
- `create-demo-users.js` - Demo user creation
- `seed-demo-data.sql` - Database seeding
- `supabase-schema.sql` - Database schema
- `setup-storage.sql` - Storage configuration
- `deploy-to-github.sh` - Deployment script

### `/supabase` - Database Configuration
Supabase configuration and migrations.

**Structure:**
- `migrations/` - Database migration files
- `.temp/` - Temporary CLI files (gitignored)

### `/docs` - Documentation
Comprehensive project documentation organized by category.

**Structure:**
- `architecture/` - System architecture and design decisions
- `guides/` - Quick start guides and tutorials
- `implementation/` - Technical implementation docs
- `reports/` - Audit reports and validation
- `deployment/` - Deployment guides and checklists
- `INDEX.md` - Documentation navigation
- `README.md` - Documentation overview

**See [docs/INDEX.md](./docs/INDEX.md) for complete documentation navigation.**

## 🏗️ Architecture Patterns

### Atomic Design
Components are organized using Atomic Design methodology:
1. **Atoms** - Basic UI elements
2. **Molecules** - Simple component groups
3. **Organisms** - Complex UI sections
4. **Templates** - Page layouts (in app/)
5. **Pages** - Complete pages (in app/)

### Feature-Based Organization
Related functionality is grouped together:
- Shop features in `/components/shop`
- Dashboard features in `/components/dashboard`
- Auth logic in `/lib/auth`

### Separation of Concerns
- **Components** - UI and presentation
- **Lib** - Business logic and utilities
- **Hooks** - Reusable stateful logic
- **Types** - Type definitions
- **API** - Backend endpoints

## 🔐 Security Architecture

### Authentication
- Demo authentication system
- Role-based access control (RBAC)
- Protected routes with middleware
- Session management

### Authorization
- Role-based permissions
- Route protection
- API endpoint security
- Data access control

## 🗄️ Database Architecture

### Supabase Integration
- PostgreSQL database
- Row-level security (RLS)
- Real-time subscriptions
- Storage for media files

### Schema Organization
- User management
- Content management
- E-commerce data
- Analytics tracking

## 🎨 Design System

### Styling
- Tailwind CSS for utility-first styling
- CSS variables for theming
- Dark mode support
- Responsive design patterns

### Branding
- White-label brand system
- Customizable themes
- Brand presets
- Dynamic configuration

## 📦 Build & Deployment

### Build Process
- Next.js production build
- TypeScript compilation
- CSS optimization
- Image optimization

### Deployment
- Vercel (recommended)
- Environment variables
- CI/CD ready
- Performance monitoring

## 🧪 Testing Strategy

### Testing Approach
- Component testing
- Integration testing
- E2E testing ready
- Accessibility testing

### Quality Assurance
- TypeScript for type safety
- ESLint for code quality
- Responsive testing
- Performance monitoring

## 📊 Performance Optimization

### Strategies
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies
- Server-side rendering

### Monitoring
- Sentry error tracking
- Performance metrics
- User analytics
- Real-time monitoring

## 🔄 Development Workflow

### Getting Started
1. Clone repository
2. Install dependencies
3. Configure environment
4. Run development server

### Code Organization
- Feature branches
- Pull request reviews
- Code quality checks
- Documentation updates

### Best Practices
- TypeScript strict mode
- Component composition
- Reusable utilities
- Clear documentation

## 📝 Documentation Standards

### Code Documentation
- JSDoc comments for functions
- README files for features
- Inline comments for complex logic
- Type definitions

### Project Documentation
- Architecture guides
- Implementation docs
- API documentation
- Deployment guides

## 🚀 Scalability

### Horizontal Scaling
- Stateless architecture
- API-first design
- Database optimization
- Caching layers

### Vertical Scaling
- Code optimization
- Performance tuning
- Resource management
- Load balancing ready

## 🔧 Maintenance

### Code Maintenance
- Regular dependency updates
- Security patches
- Performance optimization
- Technical debt management

### Documentation Maintenance
- Keep docs up-to-date
- Version documentation
- Archive old reports
- Update guides

## 📈 Future Considerations

### Planned Improvements
- Enhanced testing coverage
- Additional integrations
- Performance optimizations
- Feature expansions

### Extensibility
- Plugin architecture ready
- API extensibility
- Theme system
- Module system

---

**Last Updated:** November 4, 2025

For detailed documentation, see [docs/INDEX.md](./docs/INDEX.md)
