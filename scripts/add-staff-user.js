// 🚀 Add Staff User to Supabase Script
// This script will add a staff user to the Supabase database

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

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

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  log('❌ Missing Supabase configuration in .env.local', 'red');
  log('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set', 'yellow');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Staff user data
const staffUser = {
  email: 'staff@invoice-app.com',
  password: 'staff123',
  name: 'Staff User',
  role: 'STAFF'
};

async function addStaffUser() {
  log('🚀 Adding Staff User to Supabase', 'bright');
  log('================================', 'bright');
  log('');
  
  try {
    // Step 1: Create user in auth.users
    log('Step 1: Creating user in auth.users...', 'blue');
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: staffUser.email,
      password: staffUser.password,
      email_confirm: true,
      user_metadata: {
        name: staffUser.name,
        role: staffUser.role
      }
    });
    
    if (authError) {
      // Check if user already exists
      if (authError.message.includes('already registered') || authError.message.includes('A user with this email address has already been registered')) {
        log('⚠️ User already exists, updating user data...', 'yellow');
        
        // Get existing user
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const existingUser = existingUsers.users.find(u => u.email === staffUser.email);
        
        if (existingUser) {
          // Update user metadata
          const { error: updateError } = await supabase.auth.admin.updateUserById(
            existingUser.id,
            {
              user_metadata: {
                name: staffUser.name,
                role: staffUser.role
              }
            }
          );
          
          if (updateError) {
            log(`❌ Error updating user: ${updateError.message}`, 'red');
            throw updateError;
          }
          
          log('✓ User metadata updated successfully', 'green');
        }
      } else {
        log(`❌ Error creating user: ${authError.message}`, 'red');
        throw authError;
      }
    } else {
      log('✓ User created successfully in auth.users', 'green');
    }
    
    // Get user from auth (either newly created or existing)
    const { data: userList } = await supabase.auth.admin.listUsers();
    const user = userList.users.find(u => u.email === staffUser.email);
    
    if (!user) {
      log('❌ User not found in auth.users', 'red');
      throw new Error('User not found in auth.users');
    }
    
    // Step 2: Add user to public.users table
    log('Step 2: Adding user to public.users table...', 'blue');
    
    if (!user) {
      log('❌ User not found in auth.users', 'red');
      throw new Error('User not found in auth.users');
    }
    
    // Insert into public.users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: staffUser.email,
        name: staffUser.name,
        password: staffUser.password,
        role: staffUser.role
      })
      .select();
    
    if (userError) {
      log(`❌ Error adding user to public.users: ${userError.message}`, 'red');
      throw userError;
    }
    
    log('✓ User added successfully to public.users', 'green');
    
    // Success
    log('', 'reset');
    log('🎉 Staff user added successfully!', 'green');
    log('', 'reset');
    log('📋 Staff User Details:', 'cyan');
    log(`Email: ${staffUser.email}`, 'cyan');
    log(`Password: ${staffUser.password}`, 'cyan');
    log(`Name: ${staffUser.name}`, 'cyan');
    log(`Role: ${staffUser.role}`, 'cyan');
    log('', 'reset');
    log('You can now login with these credentials:', 'blue');
    log(`Email: ${staffUser.email}`, 'blue');
    log(`Password: ${staffUser.password}`, 'blue');
    
  } catch (error) {
    log('', 'reset');
    log('❌ Failed to add staff user', 'red');
    log(`Error: ${error.message}`, 'red');
    log('', 'reset');
    log('Please check:', 'yellow');
    log('1. Your Supabase configuration in .env.local', 'yellow');
    log('2. Your database connection', 'yellow');
    log('3. The users and user_profiles tables exist', 'yellow');
    process.exit(1);
  }
}

// Run the script
addStaffUser();