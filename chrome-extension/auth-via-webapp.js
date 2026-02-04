/**
 * Web App OAuth Integration
 * Opens kbyg.ai for authentication, then syncs session to extension
 */

async function signInViaWebApp() {
  try {
    console.log('[Auth] Opening web app for authentication...');
    
    // Open the web app's auth page in a new tab
    const authTab = await chrome.tabs.create({
      url: 'https://kbyg.ai/auth',
      active: true
    });
    
    console.log('[Auth] Waiting for authentication to complete...');
    
    // Poll for the session in Supabase
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(async () => {
        const session = await supabase.getStoredSession();
        
        if (session && session.user) {
          clearInterval(checkInterval);
          console.log('[Auth] Session detected! Closing auth tab...');
          
          // Close the auth tab
          chrome.tabs.remove(authTab.id);
          
          resolve({ data: session, error: null });
        }
      }, 1000); // Check every second
      
      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error('Authentication timeout'));
      }, 300000);
    });
    
  } catch (error) {
    console.error('[Auth] Web app OAuth error:', error);
    return { data: null, error };
  }
}

// Export for use in auth-handler
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { signInViaWebApp };
}
