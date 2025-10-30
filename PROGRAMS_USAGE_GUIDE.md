# Programs Usage Guide

## Quick Start

The Programs page now features a comprehensive fitness transformation system with:
- **35 individual programs** (7 tracks × 5 levels)
- **7 bundled packages** (5 tier bundles + 2 track bundles)
- **Flexible pricing** (Weekly, Monthly, Annual)
- **Advanced filtering** (By track and level)
- **Color-coded zones** matching gym brand colors

## Page Structure

### 1. Hero Section
- Overview of the 7 tracks with icons
- Quick navigation to programs and bundles
- Pricing information

### 2. Programs Grid Section
**Features:**
- Pricing period toggle (Weekly/Monthly/Annual)
- Track filter buttons (All Tracks + 7 individual tracks)
- Level filter buttons (All Levels + 5 individual levels)
- Responsive grid (1-4 columns based on screen size)
- Color-coded cards matching gym zones

**Interactions:**
- Click track buttons to filter by specialty
- Click level buttons to filter by access type
- Toggle pricing to see weekly/monthly/annual rates
- Hover cards for enhanced visual effects
- Click "Get Started" to purchase (disabled for invite-only)
- Click "Learn More" to view program details

### 3. Bundles Section
**Two Bundle Types:**

**All Tracks - Single Level:**
- Access all 7 tracks at one level
- 5 options: Open, Advanced, Pro, Fancy, Elite
- Savings: 20-40% off individual programs

**Single Track - All Levels:**
- Complete journey through one track
- Progressive access: Open → Advanced → Pro → Fancy → Elite
- Savings: 45% off individual programs
- Currently showing: Strength and Performance bundles

### 4. FAQ Section
- 10 comprehensive FAQs covering:
  - Track explanations
  - Level differences
  - Pricing structure
  - Bundle benefits
  - Elite qualification
  - Level switching
  - Features by level
  - Access and guarantees

## Color Coding

Each track has a unique color scheme matching the gym zones:

| Track | Color | Zone |
|-------|-------|------|
| Strength & Conditioning | Red (#8B0000) | Main Brand |
| Performance Training | Orange (#A0522D) | VIP Performance |
| Cardio & Core | Yellow (#8B7500) | Core Training |
| Nutrition | Green (#2F4538) | Nutrition Center |
| Mental Stamina | Blue (#1C2841) | Intelligence Lab |
| Recovery | Purple (#3E2347) | Recovery Sanctuary |
| Team Sports | Pink (#8B2252) | Community |

## Pricing Examples

### Individual Programs (Monthly)
- **Open Level**: $29-$59/month
- **Advanced Level**: $69-$129/month (Most Popular)
- **Pro Level**: $139-$249/month
- **Fancy Level**: $279-$499/month
- **Elite Level**: $549-$999/month (Invite Only)

### Bundles (Monthly)
- **Open Access Pass**: $199/month (40% savings)
- **Advanced All-Access**: $449/month (35% savings) ⭐
- **Pro Complete**: $899/month (30% savings)
- **Private Training Complete**: $1,799/month (25% savings)
- **Elite Mastery**: $3,599/month (20% savings) 🔒

### Annual Pricing
- All programs and bundles offer 17% savings on annual plans
- Effectively 2 months free

## User Flows

### New Member Flow
1. Land on hero → See 7 track overview
2. Click "Explore Programs" → Scroll to grid
3. Filter by track (e.g., "Strength & Conditioning")
4. Filter by level (e.g., "Open")
5. Toggle to annual pricing (17% savings)
6. Click "Get Started" → Purchase flow

### Bundle Buyer Flow
1. Land on hero → Click "View Bundles"
2. Review "All Tracks" bundles
3. See "Most Popular" badge on Advanced All-Access
4. Review savings (35% + 17% annual)
5. Click "Get This Bundle" → Purchase flow

### Elite Aspirant Flow
1. Browse programs → See "Invite Only" badges
2. Read FAQ about Elite qualification
3. Start with Pro level
4. Receive invitation after demonstrating results
5. Upgrade to Elite

## Technical Implementation

### Adding New Programs
1. Add to `PROGRAMS` array in `/lib/programs-list.ts`
2. Follow existing structure with track, level, pricing, features
3. Program automatically appears in grid with correct filtering

### Adding New Bundles
1. Add to `BUNDLES` array in `/lib/programs-list.ts`
2. Specify type: 'single-tier-all-tracks' or 'single-track-all-tiers'
3. Bundle automatically appears in correct section

### Modifying Tracks or Levels
1. Update definitions in `/lib/programs-data.ts`
2. Update `TRACKS` for track changes
3. Update `LEVELS` for level changes
4. Changes propagate throughout the system

### Customizing Colors
1. Colors are defined in `/lib/gym-colors.ts`
2. Also available in Tailwind config at `/tailwind.config.ts`
3. Use `zone-{color}-{property}` classes in Tailwind
4. Or use inline styles with `gymZones[zone].colors`

## Best Practices

### For Users
- Start with Open or Advanced level
- Consider bundles for 35%+ savings
- Use annual pricing for additional 17% savings
- Filter by your primary goal (track)
- Review FAQ before purchasing

### For Admins
- Keep Elite programs exclusive (8-12 members)
- Update pricing seasonally
- Add testimonials by level
- Monitor bundle conversion rates
- Highlight "Most Popular" options

### For Developers
- Maintain color consistency across zones
- Test filtering combinations
- Ensure responsive design on all devices
- Optimize images and animations
- Monitor page load performance

## Future Enhancements

### Short Term
- Individual program detail pages
- Bundle detail pages
- Member testimonials
- Progress tracking dashboard

### Medium Term
- Level upgrade flow
- Elite application process
- Referral program
- Gift subscriptions

### Long Term
- AI-powered program recommendations
- Custom bundle builder
- Corporate team packages
- International pricing

## Support

For questions or issues:
- Check FAQ section first
- Review this guide
- Contact support team
- Join community forum

## Analytics to Track

- Most filtered track
- Most filtered level
- Pricing period preference (weekly/monthly/annual)
- Bundle vs individual conversion
- Elite application rate
- Upgrade frequency by level
- Most popular program combinations
