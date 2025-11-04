#!/bin/bash

# Social Features Setup Script
# Run this script to set up social features in your database

echo "🎮 Setting up Social Features & Activity Feed..."
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    echo "Please set it with: export DATABASE_URL='your-database-url'"
    exit 1
fi

echo "✅ Database URL found"
echo ""

# Run migration
echo "📦 Running database migration..."
psql $DATABASE_URL -f migrations/20251104050000_social_features.sql

if [ $? -eq 0 ]; then
    echo "✅ Migration completed successfully"
else
    echo "❌ Migration failed"
    exit 1
fi

echo ""
echo "🔍 Verifying tables..."

# Verify tables
TABLES=$(psql $DATABASE_URL -t -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('user_follows', 'activity_posts', 'post_kudos', 'post_comments', 'blocked_users');")

if [ -z "$TABLES" ]; then
    echo "❌ Tables not found. Migration may have failed."
    exit 1
else
    echo "✅ Tables created:"
    echo "$TABLES"
fi

echo ""
echo "🔐 Verifying RLS policies..."

# Verify RLS policies
POLICIES=$(psql $DATABASE_URL -t -c "SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('user_follows', 'activity_posts', 'post_kudos', 'post_comments', 'blocked_users');")

echo "✅ Found $POLICIES RLS policies"

echo ""
echo "🎉 Social Features setup complete!"
echo ""
echo "Next steps:"
echo "1. Visit /member/feed to see the activity feed"
echo "2. Visit /member/social to find friends"
echo "3. Visit /member/profile/[id] to view profiles"
echo ""
echo "📚 Documentation:"
echo "- Quick Start: docs/SOCIAL_FEATURES_README.md"
echo "- Full Guide: docs/SOCIAL_FEATURES_GUIDE.md"
echo "- Summary: docs/SOCIAL_FEATURES_IMPLEMENTATION_SUMMARY.md"
echo ""
