#!/bin/bash

# Gamification System Deployment Script
# Run this script to deploy the complete gamification system

set -e

echo "🎮 Deploying Gamification System..."
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is not set"
    echo "Please set it with: export DATABASE_URL='your_supabase_connection_string'"
    exit 1
fi

echo "✅ Database connection configured"
echo ""

# Run migrations
echo "📊 Running database migrations..."
echo ""

echo "1/3 Creating gamification tables..."
psql "$DATABASE_URL" -f migrations/20251104040000_gamification_system.sql
echo "✅ Tables created"
echo ""

echo "2/3 Creating RPC functions..."
psql "$DATABASE_URL" -f migrations/20251104040001_gamification_functions.sql
echo "✅ Functions created"
echo ""

echo "3/3 Seeding badges..."
psql "$DATABASE_URL" -f migrations/20251104040002_gamification_seed_badges.sql
echo "✅ Badges seeded"
echo ""

# Initialize user stats for existing users
echo "👥 Initializing user stats for existing users..."
psql "$DATABASE_URL" -c "INSERT INTO user_stats (user_id) SELECT id FROM auth.users ON CONFLICT (user_id) DO NOTHING;"
echo "✅ User stats initialized"
echo ""

# Schedule leaderboard refresh (optional)
echo "📈 Setting up leaderboard refresh schedule..."
psql "$DATABASE_URL" -c "SELECT cron.schedule('refresh-leaderboards', '0 0 * * *', \$\$SELECT refresh_leaderboards()\$\$);" 2>/dev/null || echo "⚠️  Cron extension not available - leaderboards will need manual refresh"
echo ""

echo "🎉 Gamification system deployed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Visit /member/achievements to view badges and XP"
echo "2. Visit /member/challenges to browse challenges"
echo "3. Visit /member/leaderboard to see rankings"
echo ""
echo "📚 Documentation:"
echo "- Full docs: docs/GAMIFICATION_SYSTEM_COMPLETE.md"
echo "- Quick start: docs/GAMIFICATION_QUICKSTART.md"
echo ""
echo "✨ Happy gaming!"
