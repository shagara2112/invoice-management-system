// 🚀 Add Admin User to Supabase Script
// This script will add an admin user to both auth.users and public.users tables

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

// Colors for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  log('❌ Missing Supabase environment variables', 'red');
  log('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set', 'red');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Prisma client
const prisma = new PrismaClient();

async function addAdminUser() {
  log('🚀 Adding Admin User to Supabase', 'bright');
  log('================================', 'bright');
  log('');
  
  const adminEmail = 'admin@invoice-app.com';
  const adminPassword = 'admin123';
  const adminName = 'Admin User';
  const adminRole = 'SUPER_ADMIN';
  
  try {
    // Step 1: Create user in auth.users
    log('Step 1: Creating user in auth.users...', 'blue');
    
    // Try to sign in with the user to check if it exists
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });
    
    let authUserId;
    
    if (signInError) {
      log('✓ User does not exist, creating new user...', 'yellow');
      
      // Create new user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          name: adminName,
          role: adminRole
        }
      });
      
      if (createError) {
        throw createError;
      }
      
      authUserId = newUser.user.id;
      log('✓ User created successfully in auth.users', 'green');
    } else {
      log('⚠️ User already exists, using existing user...', 'yellow');
      authUserId = signInData.user.id;
    }
    
    // Step 2: Add user to public.users table
    log('Step 2: Adding user to public.users table...', 'blue');
    
    // Hash password for public.users table
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    // Check if user already exists in public.users
    const existingPublicUser = await prisma.user.findUnique({
      where: { email: adminEmail }
    });
    
    if (existingPublicUser) {
      // Update existing user
      await prisma.user.update({
        where: { email: adminEmail },
        data: {
          name: adminName,
          password: hashedPassword,
          role: adminRole
        }
      });
      
      log('✓ User updated successfully in public.users', 'green');
    } else {
      // Create new user in public.users
      await prisma.user.create({
        data: {
          id: authUserId,
          email: adminEmail,
          name: adminName,
          password: hashedPassword,
          role: adminRole
        }
      });
      
      log('✓ User added successfully to public.users', 'green');
    }
    
    log('');
    log('🎉 Admin user added successfully!', 'green');
    log('');
    log('📋 Admin User Details:', 'cyan');
    log(`Email: ${adminEmail}`, 'cyan');
    log(`Password: ${adminPassword}`, 'cyan');
    log(`Name: ${adminName}`, 'cyan');
    log(`Role: ${adminRole}`, 'cyan');
    log('');
    log('You can now login with these credentials:', 'blue');
    log(`Email: ${adminEmail}`, 'blue');
    log(`Password: ${adminPassword}`, 'blue');
    
  } catch (error) {
    log(`❌ Error adding admin user: ${error.message}`, 'red');
    if (error.details) {
      log(`Details: ${error.details}`, 'red');
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addAdminUser();