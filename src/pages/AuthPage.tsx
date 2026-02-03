import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import kbygLogo from "@/assets/brand/logo-primary.png";
import { Zap } from "lucide-react";
import { createUser, createOrganization } from "@/lib/mcp";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // User just signed in - create organization if first time
        await handleFirstTimeUser(session.user.id, session.user.email || '');
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleFirstTimeUser = async (userId: string, email: string) => {
    try {
      // Create user profile in Turso via MCP
      await createUser({
        id: userId,
        email: email,
        full_name: email.split('@')[0] // Use email prefix as default name
      });

      // Create first organization
      const orgName = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').trim() + "'s Org";
      const orgSlug = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-');

      const orgResult = await createOrganization({
        name: orgName,
        slug: orgSlug,
        owner_id: userId
      });
      
      // Store active org in localStorage
      if (orgResult.success && orgResult.data?.id) {
        localStorage.setItem('active_org_id', orgResult.data.id.toString());
      }
    } catch (error) {
      console.error('Error setting up new user:', error);
      // Don't block login on failure - they can create org manually
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (error) {
        console.error("Google sign-in error:", error);
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Link 
        to="/" 
        className="mb-8 group hover:opacity-80 transition-opacity"
      >
        <img src={kbygLogo} alt="KBYG.ai" className="h-10" />
      </Link>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to start finding your next $100k contract
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Sign-In Button */}
          <Button
            variant="outline"
            className="w-full h-12 text-base font-medium"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </span>
            )}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          {/* Email/Password Auth */}
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'rgb(var(--primary))',
                    brandAccent: 'rgb(var(--primary))',
                  }
                }
              }
            }}
            providers={[]}
            redirectTo={window.location.origin}
          />
        </CardContent>
      </Card>
    </div>
  );
}