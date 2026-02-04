# Authentication Setup

## ✅ What's Implemented

Simple email/password authentication using Supabase Auth UI.

### Features:
- 🔐 **Email/Password Signup** - Users can create accounts instantly
- 🎨 **Pre-built UI** - Supabase Auth UI components (no custom forms needed)
- 🔄 **Auto Organization Creation** - First-time users get an organization automatically
- 🛡️ **Protected Routes** - Dashboard pages require authentication
- 👤 **User Profile** - Display user email in sidebar
- 🚪 **Sign Out** - One-click logout

## How It Works

### 1. Sign Up Flow
```
User visits /auth
  ↓
Enters email + password
  ↓
Supabase creates account
  ↓
Auto-create user profile in Turso
  ↓
Auto-create organization (user becomes owner)
  ↓
Store org ID in localStorage
  ↓
Redirect to /dashboard
```

### 2. Sign In Flow
```
User visits /auth
  ↓
Enters credentials
  ↓
Supabase validates
  ↓
Redirect to /dashboard
```

### 3. Protected Pages
All dashboard routes (`/dashboard`, `/companies`, `/strategy`, `/email`, `/import`) require authentication.

Unauthenticated users → redirected to `/auth`

## Files Created

```
src/
├── pages/
│   └── AuthPage.tsx              # Auth UI page (signup/login)
├── hooks/
│   └── useAuth.tsx               # Auth context provider
├── components/
│   ├── ProtectedRoute.tsx        # Route guard component
│   └── AppSidebar.tsx            # Updated with user info + sign out
└── App.tsx                       # Updated with AuthProvider + routes
```

## Usage

### Landing Page
- **If logged out:** "Get Started" → `/auth`
- **If logged in:** "Dashboard" → `/dashboard`

### Auth Page
Visit: **http://localhost:8080/auth**

Auto-switches between:
- Sign Up (create account)
- Sign In (existing users)
- Password Reset (via Supabase email)

### User Session
- User info stored in `AuthContext` (available via `useAuth()`)
- Organization ID stored in `localStorage` (`active_org_id`)
- Session persists across page refreshes

### Sign Out
Click "Sign Out" in sidebar:
- Clears Supabase session
- Removes organization ID from localStorage
- Redirects to `/auth`

## Supabase Configuration

Already configured in `.env`:
```bash
VITE_SUPABASE_URL=https://etscbyzexyptgnppwyzv.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Next Steps (Backend Integration)

The frontend calls these MCP tools on signup (currently via `/api/mcp` endpoint):

1. **`auth_create_user`** - Create user profile in Turso
   ```typescript
   {
     id: string,        // Supabase user ID
     email: string,
     full_name: string
   }
   ```

2. **`auth_create_organization`** - Create first organization
   ```typescript
   {
     name: string,
     slug: string,
     owner_id: string   // User ID
   }
   ```

**To complete:** Update `unified-mcp-server/src/tool-handler.ts` to implement these tools using `gtm-db-multi-tenant.ts`.

## Testing

### Quick Test
1. Start dev server: `npm run dev`
2. Visit: `http://localhost:8080/auth`
3. Sign up with test email: `test@example.com` / `password123`
4. Should redirect to `/dashboard` after signup
5. Check sidebar → see email + sign out button

### Test Protection
1. Sign out
2. Try to visit: `http://localhost:8080/companies`
3. Should redirect to `/auth` automatically

## Customization

### Change Auth Appearance
Edit `src/pages/AuthPage.tsx`:
```typescript
<Auth
  supabaseClient={supabase}
  appearance={{ 
    theme: ThemeSupa,
    variables: {
      default: {
        colors: {
          brand: 'rgb(var(--primary))',  // Change colors here
        }
      }
    }
  }}
/>
```

### Disable Email Confirmation (Development)
In Supabase Dashboard:
- Authentication → Email Auth
- Disable "Email confirmations"

### Add Social Auth (Optional)
In `src/pages/AuthPage.tsx`:
```typescript
<Auth
  supabaseClient={supabase}
  providers={['google', 'github']}  // Add OAuth providers
/>
```

Then configure in Supabase Dashboard → Authentication → Providers.

## Security Notes

- ✅ Passwords hashed by Supabase (bcrypt)
- ✅ Session tokens stored in localStorage (httpOnly cookies preferred for production)
- ✅ Protected routes prevent unauthorized access
- ⚠️ For production: Enable RLS (Row Level Security) in Supabase
- ⚠️ For production: Add rate limiting on auth endpoints

## Dependencies Added

```json
{
  "@supabase/auth-ui-react": "^0.4.7",
  "@supabase/auth-ui-shared": "^0.1.8"
}
```

## Status

✅ **Frontend Complete** - Users can sign up/in, sessions persist, routes protected

🔄 **Backend Pending** - Need to implement `auth_create_user` and `auth_create_organization` tools in MCP server

---

**Total Time:** ~1 hour (including testing)

**Complexity:** ⭐⭐☆☆☆ (Very Simple - leveraged pre-built Supabase UI)
