#!/usr/bin/env node

/**
 * Video Streaming Setup Verification Script
 * Checks if all required components are properly configured
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkmark() {
  return `${colors.green}✓${colors.reset}`;
}

function crossmark() {
  return `${colors.red}✗${colors.reset}`;
}

function warning() {
  return `${colors.yellow}⚠${colors.reset}`;
}

// Check if file exists
function fileExists(filePath) {
  return fs.existsSync(path.join(__dirname, '..', filePath));
}

// Check if environment variable is set
function checkEnvVar(varName) {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    return false;
  }
  const envContent = fs.readFileSync(envPath, 'utf8');
  return envContent.includes(varName) && !envContent.includes(`${varName}=your_`);
}

// Main verification
async function verify() {
  log('\n🎥 Video Streaming Setup Verification\n', colors.cyan);
  log('═'.repeat(50), colors.blue);
  
  let allPassed = true;
  let warnings = 0;

  // 1. Check required files
  log('\n📁 Checking Required Files...', colors.blue);
  
  const requiredFiles = [
    'components/workout/video-player.tsx',
    'components/workout/video-controls.tsx',
    'components/workout/video-progress-bar.tsx',
    'components/workout/caption-selector.tsx',
    'components/workout/download-button.tsx',
    'components/admin/video-upload.tsx',
    'lib/video/cloudflare-stream.ts',
    'lib/video/video-utils.ts',
    'app/api/workouts/[id]/progress/route.ts',
    'app/api/workouts/[id]/stream/route.ts',
    'app/api/video/upload/route.ts',
    'supabase/migrations/20251104040000_video_streaming_system.sql',
  ];

  requiredFiles.forEach(file => {
    if (fileExists(file)) {
      log(`  ${checkmark()} ${file}`);
    } else {
      log(`  ${crossmark()} ${file} - MISSING`, colors.red);
      allPassed = false;
    }
  });

  // 2. Check package.json dependencies
  log('\n📦 Checking Dependencies...', colors.blue);
  
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const deps = packageJson.dependencies || {};
    
    const requiredDeps = [
      'hls.js',
      '@radix-ui/react-progress',
      '@radix-ui/react-slider',
    ];

    requiredDeps.forEach(dep => {
      if (deps[dep]) {
        log(`  ${checkmark()} ${dep} (${deps[dep]})`);
      } else {
        log(`  ${crossmark()} ${dep} - NOT INSTALLED`, colors.red);
        allPassed = false;
      }
    });
  } else {
    log(`  ${crossmark()} package.json not found`, colors.red);
    allPassed = false;
  }

  // 3. Check environment variables
  log('\n🔐 Checking Environment Variables...', colors.blue);
  
  const envVars = [
    'CLOUDFLARE_ACCOUNT_ID',
    'CLOUDFLARE_STREAM_API_TOKEN',
  ];

  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    log(`  ${warning()} .env.local not found - create from .env.example`, colors.yellow);
    warnings++;
  } else {
    envVars.forEach(varName => {
      if (checkEnvVar(varName)) {
        log(`  ${checkmark()} ${varName}`);
      } else {
        log(`  ${warning()} ${varName} - NOT CONFIGURED`, colors.yellow);
        warnings++;
      }
    });
  }

  // 4. Check documentation
  log('\n📚 Checking Documentation...', colors.blue);
  
  const docs = [
    'docs/VIDEO_STREAMING_GUIDE.md',
    'docs/VIDEO_STREAMING_QUICKSTART.md',
    'docs/VIDEO_STREAMING_IMPLEMENTATION_SUMMARY.md',
    'README_VIDEO_STREAMING.md',
  ];

  docs.forEach(doc => {
    if (fileExists(doc)) {
      log(`  ${checkmark()} ${doc}`);
    } else {
      log(`  ${warning()} ${doc} - MISSING`, colors.yellow);
      warnings++;
    }
  });

  // 5. Check UI components
  log('\n🎨 Checking UI Components...', colors.blue);
  
  const uiComponents = [
    'components/ui/slider.tsx',
    'components/ui/progress.tsx',
  ];

  uiComponents.forEach(comp => {
    if (fileExists(comp)) {
      log(`  ${checkmark()} ${comp}`);
    } else {
      log(`  ${crossmark()} ${comp} - MISSING`, colors.red);
      allPassed = false;
    }
  });

  // Summary
  log('\n' + '═'.repeat(50), colors.blue);
  log('\n📊 Verification Summary\n', colors.cyan);

  if (allPassed && warnings === 0) {
    log(`${checkmark()} All checks passed! Video streaming is ready to use.`, colors.green);
    log('\n🚀 Next Steps:', colors.cyan);
    log('  1. Configure Cloudflare Stream credentials in .env.local');
    log('  2. Run: npm run dev');
    log('  3. Visit: http://localhost:3000/admin/workouts');
    log('  4. Upload a test video');
    log('\n📖 Documentation: ./docs/VIDEO_STREAMING_QUICKSTART.md\n');
  } else if (allPassed && warnings > 0) {
    log(`${warning()} Setup complete with ${warnings} warning(s).`, colors.yellow);
    log('\n⚠️  Warnings:', colors.yellow);
    log('  - Configure environment variables in .env.local');
    log('  - See .env.example for required variables');
    log('\n📖 Documentation: ./docs/VIDEO_STREAMING_QUICKSTART.md\n');
  } else {
    log(`${crossmark()} Setup incomplete. ${warnings} warning(s) found.`, colors.red);
    log('\n❌ Critical Issues:', colors.red);
    log('  - Some required files are missing');
    log('  - Run: npm install');
    log('  - Check file structure');
    log('\n📖 Documentation: ./docs/VIDEO_STREAMING_QUICKSTART.md\n');
  }

  process.exit(allPassed ? 0 : 1);
}

// Run verification
verify().catch(error => {
  log(`\n${crossmark()} Verification failed: ${error.message}`, colors.red);
  process.exit(1);
});
