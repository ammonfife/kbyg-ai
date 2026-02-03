/**
 * Authentication Handler for Chrome Extension
 * Handles Supabase sign in/up/out
 */

// Initialize auth state on load
let currentUser = null;

async function initAuth() {
  await supabase.initialize();
  currentUser = supabase.getUser();
  
  updateAuthUI();
  
  // Set up event listeners
  setupAuthListeners();
}

function updateAuthUI() {
  const signedInSection = document.getElementById('auth-signed-in');
  const signedOutSection = document.getElementById('auth-signed-out');
  
  if (currentUser) {
    // Show signed in state
    signedInSection.classList.remove('hidden');
    signedOutSection.classList.add('hidden');
    
    // Update user details
    document.getElementById('user-email').textContent = currentUser.email;
    document.getElementById('user-id').textContent = `User ID: ${currentUser.id.substring(0, 8)}...`;
    document.getElementById('sync-status-text').textContent = 'Synced';
    document.getElementById('sync-status-icon').textContent = '🟢';
  } else {
    // Show signed out state
    signedInSection.classList.add('hidden');
    signedOutSection.classList.remove('hidden');
  }
}

function setupAuthListeners() {
  // Toggle between sign in and sign up forms
  document.getElementById('show-signin-btn')?.addEventListener('click', () => {
    document.getElementById('signin-form').classList.remove('hidden');
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('show-signin-btn').classList.add('active');
    document.getElementById('show-signup-btn').classList.remove('active');
  });
  
  document.getElementById('show-signup-btn')?.addEventListener('click', () => {
    document.getElementById('signin-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
    document.getElementById('show-signin-btn').classList.remove('active');
    document.getElementById('show-signup-btn').classList.add('active');
  });
  
  // Sign in
  document.getElementById('signin-btn')?.addEventListener('click', async () => {
    const email = document.getElementById('signin-email').value.trim();
    const password = document.getElementById('signin-password').value;
    
    if (!email || !password) {
      showError('signin-error', 'Please enter email and password');
      return;
    }
    
    const btn = document.getElementById('signin-btn');
    btn.disabled = true;
    btn.textContent = 'Signing in...';
    
    const { data, error } = await supabase.signInWithPassword(email, password);
    
    if (error) {
      showError('signin-error', error.message);
      btn.disabled = false;
      btn.textContent = 'Sign In';
    } else {
      currentUser = data.user;
      updateAuthUI();
      
      // Clear form
      document.getElementById('signin-email').value = '';
      document.getElementById('signin-password').value = '';
      
      // Reinitialize backend API with new user ID
      if (window.backendAPI) {
        await backendAPI.initialize();
      }
      
      // Show success message
      showSuccess('Successfully signed in! Your data will now sync across devices.');
    }
  });
  
  // Sign up
  document.getElementById('signup-btn')?.addEventListener('click', async () => {
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-password-confirm').value;
    
    if (!email || !password) {
      showError('signup-error', 'Please enter email and password');
      return;
    }
    
    if (password !== confirmPassword) {
      showError('signup-error', 'Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      showError('signup-error', 'Password must be at least 6 characters');
      return;
    }
    
    const btn = document.getElementById('signup-btn');
    btn.disabled = true;
    btn.textContent = 'Creating account...';
    
    const { data, error } = await supabase.signUp(email, password);
    
    if (error) {
      showError('signup-error', error.message);
      btn.disabled = false;
      btn.textContent = 'Create Account';
    } else {
      currentUser = data.user;
      updateAuthUI();
      
      // Clear form
      document.getElementById('signup-email').value = '';
      document.getElementById('signup-password').value = '';
      document.getElementById('signup-password-confirm').value = '';
      
      // Reinitialize backend API with new user ID
      if (window.backendAPI) {
        await backendAPI.initialize();
      }
      
      // Show success message
      showSuccess('Account created! Your data will now sync across devices.');
    }
  });
  
  // Sign out
  document.getElementById('signout-btn')?.addEventListener('click', async () => {
    const confirmed = confirm('Are you sure you want to sign out? Your local data will remain, but will not sync until you sign in again.');
    
    if (!confirmed) return;
    
    await supabase.signOut();
    currentUser = null;
    updateAuthUI();
    
    // Reinitialize backend API with anonymous ID
    if (window.backendAPI) {
      await backendAPI.initialize();
    }
    
    showSuccess('Signed out successfully. You are now in anonymous mode.');
  });
}

function showError(elementId, message) {
  const errorEl = document.getElementById(elementId);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
    setTimeout(() => {
      errorEl.classList.add('hidden');
    }, 5000);
  }
}

function showSuccess(message) {
  // You can implement a toast notification here
  console.log('[Auth] Success:', message);
  alert(message); // Simple for now
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuth);
} else {
  initAuth();
}
