import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();

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
      const createUserResponse = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'auth_create_user',
          params: {
            id: userId,
            email: email,
            full_name: email.split('@')[0] // Use email prefix as default name
          }
        })
      });

      // Create first organization
      const orgName = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').trim() + "'s Org";
      const orgSlug = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-');

      const createOrgResponse = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'auth_create_organization',
          params: {
            name: orgName,
            slug: orgSlug,
            owner_id: userId
          }
        })
      });

      const orgResult = await createOrgResponse.json();
      
      // Store active org in localStorage
      if (orgResult.data?.id) {
        localStorage.setItem('active_org_id', orgResult.data.id.toString());
      }
    } catch (error) {
      console.error('Error setting up new user:', error);
      // Don't block login on failure - they can create org manually
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Link 
        to="/" 
        className="flex items-center gap-2 mb-8 group"
      >
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-105 transition-transform">
          <Zap className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold group-hover:text-primary transition-colors">GTM Hub</span>
      </Link>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in or create an account to start capturing leads
          </CardDescription>
        </CardHeader>
        <CardContent>
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
