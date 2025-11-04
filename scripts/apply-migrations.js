#!/usr/bin/env node

/**
 * Apply Gamification Migrations to Remote Database
 * Uses Supabase Management API to execute SQL
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const SUPABASE_PROJECT_REF = 'bxciawidudkgtuxbonjf';
const SUPABASE_SERVICE_KEY = 'sb_secret_M_pP0g8LzfljvTtzrFBh-g_jKFibrSF';

async function executeSql(sql) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: sql });
    
    const options = {
      hostname: `${SUPABASE_PROJECT_REF}.supabase.co`,
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, body });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function runMigrationFile(filePath, description) {
  console.log(`\n📊 Running: ${description}...`);
  
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    
    console.log(`   File size: ${(sql.length / 1024).toFixed(2)} KB`);
    console.log(`   Executing SQL...`);
    
    await executeSql(sql);
    
    console.log(`   ✅ ${description} completed successfully`);
    return true;
  } catch (error) {
    console.error(`   ❌ Failed to run ${description}:`);
    console.error(`   Error: ${error.message}`);
    return false;
  }
}

async function verifyTables() {
  console.log('\n🔍 Verifying tables...');
  
  const checkSql = `
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN (
      'badges', 'user_badges', 'user_stats', 
      'challenges', 'challenge_participants', 
      'leaderboard_entries', 'xp_transactions', 
      'streak_history', 'milestones'
    )
    ORDER BY table_name;
  `;
  
  try {
    const result = await executeSql(checkSql);
    console.log('   ✅ Tables verified');
    return true;
  } catch (error) {
    console.error('   ❌ Verification failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🎮 Gamification System - Database Migration\n');
  console.log('=' .repeat(60));
  console.log(`Project: ${SUPABASE_PROJECT_REF}`);
  console.log(`URL: https://${SUPABASE_PROJECT_REF}.supabase.co`);
  console.log('=' .repeat(60));
  
  const migrationsDir = path.join(__dirname, '..', 'migrations');
  
  const migrations = [
    {
      file: path.join(migrationsDir, '20251104040000_gamification_system.sql'),
      description: 'Gamification Tables (9 tables)'
    },
    {
      file: path.join(migrationsDir, '20251104040001_gamification_functions.sql'),
      description: 'RPC Functions (5 functions)'
    },
    {
      file: path.join(migrationsDir, '20251104040002_gamification_seed_badges.sql'),
      description: 'Badge Seed Data (54 badges)'
    }
  ];
  
  let allSuccess = true;
  
  // Check if files exist
  for (const migration of migrations) {
    if (!fs.existsSync(migration.file)) {
      console.error(`\n❌ Migration file not found: ${migration.file}`);
      allSuccess = false;
    }
  }
  
  if (!allSuccess) {
    console.error('\n❌ Some migration files are missing. Aborting.');
    process.exit(1);
  }
  
  // Run migrations
  for (const migration of migrations) {
    const success = await runMigrationFile(migration.file, migration.description);
    if (!success) {
      allSuccess = false;
      console.log('\n⚠️  Migration failed. Continuing with next migration...');
    }
    
    // Wait a bit between migrations
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Verify installation
  await verifyTables();
  
  console.log('\n' + '='.repeat(60));
  
  if (allSuccess) {
    console.log('\n🎉 All migrations completed successfully!\n');
    console.log('📋 Next steps:');
    console.log('1. Visit https://supabase.com/dashboard/project/bxciawidudkgtuxbonjf/editor');
    console.log('2. Run: SELECT COUNT(*) FROM badges; (should return 54)');
    console.log('3. Test pages:');
    console.log('   - http://localhost:3000/member/achievements');
    console.log('   - http://localhost:3000/member/challenges');
    console.log('   - http://localhost:3000/member/leaderboard\n');
  } else {
    console.log('\n⚠️  Some migrations failed.\n');
    console.log('💡 Alternative: Use Supabase SQL Editor');
    console.log('   1. Go to: https://supabase.com/dashboard/project/bxciawidudkgtuxbonjf/sql');
    console.log('   2. Copy/paste each migration file');
    console.log('   3. Click "Run" for each one\n');
    console.log('📚 See DEPLOYMENT_INSTRUCTIONS.md for detailed steps\n');
  }
}

main().catch((error) => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});
