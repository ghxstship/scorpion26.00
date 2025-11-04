#!/usr/bin/env node

/**
 * Create Demo Users Script
 * This script creates the 5 demo users in Supabase using the Admin API
 * 
 * Usage: node scripts/create-demo-users.js
 */

const https = require('https');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Error: Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const DEMO_USERS = [
  { email: 'guest@scorpion26.com', password: 'guest123', role: 'guest' },
  { email: 'member@scorpion26.com', password: 'member123', role: 'member' },
  { email: 'collab@scorpion26.com', password: 'collab123', role: 'collaborator' },
  { email: 'team@scorpion26.com', password: 'team123', role: 'team' },
  { email: 'admin@scorpion26.com', password: 'admin123', role: 'admin' },
];

/**
 * Create a user via Supabase Admin API
 */
async function createUser(email, password) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/auth/v1/admin/users`);
    
    const data = JSON.stringify({
      email,
      password,
      email_confirm: true, // Auto-confirm the user
      user_metadata: {
        created_by: 'demo-setup-script'
      }
    });

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          
          if (res.statusCode === 200 || res.statusCode === 201) {
            resolve(response);
          } else if (res.statusCode === 422 && response.msg?.includes('already been registered')) {
            resolve({ existing: true, email });
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${body}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${body}`));
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

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Creating demo users in Supabase...\n');
  console.log(`Project: ${SUPABASE_URL}\n`);

  let created = 0;
  let existing = 0;
  let failed = 0;

  for (const user of DEMO_USERS) {
    try {
      console.log(`Creating user: ${user.email}...`);
      const result = await createUser(user.email, user.password);
      
      if (result.existing) {
        console.log(`  ⚠️  User already exists: ${user.email}`);
        existing++;
      } else {
        console.log(`  ✅ Created: ${user.email} (ID: ${result.id})`);
        created++;
      }
    } catch (error) {
      console.error(`  ❌ Failed: ${user.email}`);
      console.error(`     Error: ${error.message}`);
      failed++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`  ✅ Created: ${created}`);
  console.log(`  ⚠️  Already existed: ${existing}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  📝 Total: ${DEMO_USERS.length}`);

  if (created > 0 || existing === DEMO_USERS.length) {
    console.log('\n✨ Next step: Run the seed migration');
    console.log('   npx supabase db push');
  }

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
