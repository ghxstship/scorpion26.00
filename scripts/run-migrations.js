#!/usr/bin/env node

/**
 * Run Gamification Migrations
 * Executes SQL migrations using Supabase client
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const SUPABASE_URL = 'https://bxciawidudkgtuxbonjf.supabase.co';
const SUPABASE_SERVICE_KEY = 'sb_secret_M_pP0g8LzfljvTtzrFBh-g_jKFibrSF';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function runMigration(filePath, description) {
  console.log(`\n📊 Running: ${description}...`);
  
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Split by statement (basic approach - may need refinement for complex SQL)
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`   Found ${statements.length} SQL statements`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      
      // Skip comments and empty statements
      if (statement.trim().startsWith('--') || statement.trim() === ';') {
        continue;
      }
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
        
        if (error) {
          console.error(`   ❌ Error in statement ${i + 1}:`, error.message);
          // Continue with other statements
        } else {
          process.stdout.write('.');
        }
      } catch (err) {
        console.error(`   ❌ Exception in statement ${i + 1}:`, err.message);
      }
    }
    
    console.log(`\n   ✅ ${description} completed`);
    return true;
  } catch (error) {
    console.error(`   ❌ Failed to run ${description}:`, error.message);
    return false;
  }
}

async function initializeUserStats() {
  console.log('\n👥 Initializing user stats for existing users...');
  
  try {
    // Get all users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('   ❌ Error fetching users:', usersError.message);
      return false;
    }
    
    console.log(`   Found ${users.users.length} users`);
    
    // Create user_stats for each user
    for (const user of users.users) {
      const { error } = await supabase
        .from('user_stats')
        .upsert({ user_id: user.id }, { onConflict: 'user_id' });
      
      if (error && !error.message.includes('already exists')) {
        console.error(`   ⚠️  Error for user ${user.id}:`, error.message);
      } else {
        process.stdout.write('.');
      }
    }
    
    console.log('\n   ✅ User stats initialized');
    return true;
  } catch (error) {
    console.error('   ❌ Failed to initialize user stats:', error.message);
    return false;
  }
}

async function main() {
  console.log('🎮 Gamification System Deployment\n');
  console.log('=' .repeat(50));
  
  const migrationsDir = path.join(__dirname, '..', 'migrations');
  
  const migrations = [
    {
      file: path.join(migrationsDir, '20251104040000_gamification_system.sql'),
      description: 'Gamification Tables'
    },
    {
      file: path.join(migrationsDir, '20251104040001_gamification_functions.sql'),
      description: 'RPC Functions'
    },
    {
      file: path.join(migrationsDir, '20251104040002_gamification_seed_badges.sql'),
      description: 'Badge Seed Data'
    }
  ];
  
  let allSuccess = true;
  
  for (const migration of migrations) {
    if (!fs.existsSync(migration.file)) {
      console.error(`❌ Migration file not found: ${migration.file}`);
      allSuccess = false;
      continue;
    }
    
    const success = await runMigration(migration.file, migration.description);
    if (!success) {
      allSuccess = false;
    }
  }
  
  // Initialize user stats
  await initializeUserStats();
  
  console.log('\n' + '='.repeat(50));
  
  if (allSuccess) {
    console.log('\n🎉 Deployment completed successfully!\n');
    console.log('📋 Next steps:');
    console.log('1. Visit /member/achievements to view badges and XP');
    console.log('2. Visit /member/challenges to browse challenges');
    console.log('3. Visit /member/leaderboard to see rankings\n');
    console.log('📚 Documentation:');
    console.log('- Quick start: docs/GAMIFICATION_QUICKSTART.md');
    console.log('- Full docs: docs/GAMIFICATION_SYSTEM_COMPLETE.md\n');
  } else {
    console.log('\n⚠️  Deployment completed with some errors.');
    console.log('Please check the output above for details.\n');
    console.log('💡 Tip: You may need to run migrations manually using Supabase SQL Editor');
    console.log('   Copy the SQL from migrations/ folder into the SQL Editor\n');
  }
}

main().catch(console.error);
