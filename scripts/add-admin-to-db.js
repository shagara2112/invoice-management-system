// 🚀 Add Admin User to Database Script
// This script will add an admin user to the public.users table using Supabase API

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

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

async function addAdminToDb() {
  log('🚀 Adding Admin User to Database', 'bright');
  log('================================', 'bright');
  log('');
  
  const adminEmail = 'admin@invoice-app.com';
  const adminPassword = 'admin123';
  const adminName = 'Admin User';
  const adminRole = 'SUPER_ADMIN';
  
  try {
    // Hash password for database
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    // Check if user already exists in public.users
    log('Step 1: Checking if user exists in database...', 'blue');
    
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', adminEmail)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }
    
    if (existingUser) {
      log('⚠️ User already exists, updating user data...', 'yellow');
      
      // Update existing user
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          name: adminName,
          password: hashedPassword,
          role: adminRole,
          updated_at: new Date().toISOString()
        })
        .eq('email', adminEmail)
        .select()
        .single();
      
      if (updateError) {
        throw updateError;
      }
      
      log('✓ User updated successfully in database', 'green');
    } else {
      log('✓ User does not exist, creating new user...', 'yellow');
      
      // Get user ID from auth.users
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserByEmail(adminEmail);
      
      if (authError) {
        throw authError;
      }
      
      // Create new user in public.users
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          id: authUser.user.id,
          email: adminEmail,
          name: adminName,
          password: hashedPassword,
          role: adminRole,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (insertError) {
        throw insertError;
      }
      
      log('✓ User created successfully in database', 'green');
    }
    
    log('');
    log('🎉 Admin user added to database successfully!', 'green');
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
    log(`❌ Error adding admin user to database: ${error.message}`, 'red');
    if (error.details) {
      log(`Details: ${error.details}`, 'red');
    }
    process.exit(1);
  }
}

// Run the script
addAdminToDb();