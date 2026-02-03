# Multi-Tenant Implementation Summary

## 🎯 What Was Done

Created a complete multi-tenant architecture for the GTM Intelligence Hub with:

1. **Organization-based data isolation**
2. **User authentication** (Supabase Auth integration)
3. **Role-based access control** (owner/admin/member)
4. **Team collaboration** (invite members, manage roles)
5. **Data scoping** (all GTM data belongs to an organization)

## 📁 New Files

### Database Layer
- **`unified-mcp-server/src/gtm-db-multi-tenant.ts`**
  - Complete multi-tenant database implementation
  - Organizations, users, members, companies, strategies, emails
  - Row-level security via organization_id filtering
  - Role-based permission checks

### Documentation
- **`unified-mcp-server/MIGRATION_MULTI_TENANT.md`**
  - Complete schema documentation
  - Migration steps for existing deployments
  - API changes and new tools
  - Security considerations

- **`MULTI_TENANT_IMPLEMENTATION.md`** (this file)
  - Implementation summary
  - Next steps for integration

## 🗄️ Database Schema

### Core Tables

#### 1. **users**
- `id` (TEXT, PK) - UUID from Supabase Auth
- `email` (TEXT, UNIQUE)
- `full_name` (TEXT)
- `avatar_url` (TEXT)

#### 2. **organizations**
- `id` (INTEGER, PK)
- `name` (TEXT)
- `slug` (TEXT, UNIQUE)
- `owner_id` (TEXT, FK → users)

#### 3. **organization_members**
- `organization_id` (INTEGER, FK)
- `user_id` (TEXT, FK)
- `role` ('owner' | 'admin' | 'member')
- `invited_by` (TEXT, FK → users)

#### 4. **companies** (updated)
- ➕ `organization_id` (INTEGER, FK)
- All existing fields remain
- UNIQUE constraint: (organization_id, name)

#### 5. **strategies** (new)
- Stores generated GTM strategies
- Linked to organization + company
- Tracks creator (`created_by`)

#### 6. **drafted_emails** (new)
- Stores drafted/sent emails
- Linked to organization + company + strategy
- Status tracking (draft/sent/scheduled)

## 🔐 Security Model

### Authentication Flow
```
1. User signs up via Supabase Auth
2. Create user profile in Turso (users table)
3. Auto-create first organization for new user
4. Add user as organization owner (organization_members)
5. All subsequent data is scoped to active organization
```

### Permission Levels
- **Owner**: Full access, can delete organization, manage all members
- **Admin**: Manage members, full data access, cannot delete organization
- **Member**: Read/write data access only, no admin privileges

### Data Isolation
Every query now requires an `AuthContext`:
```typescript
interface AuthContext {
  user_id: string;          // Who is making the request
  organization_id: number;  // Which org's data to access
  role: 'owner' | 'admin' | 'member';  // Permission level
}
```

All database operations filter by `organization_id` — **zero cross-org data leakage**.

## 🔄 Migration Path

### Option 1: Fresh Deployment (Recommended for Demo)
1. Drop existing Turso database
2. Create new database with multi-tenant schema
3. Deploy updated MCP server
4. Add Supabase Auth to frontend
5. Test signup → org creation → add companies flow

### Option 2: Migrate Existing Data
1. Run `gtm-db-multi-tenant.initialize()` (adds new tables)
2. Create a "Default Organization" for existing companies:
   ```sql
   INSERT INTO organizations (name, slug, owner_id) 
   VALUES ('Default Org', 'default', 'SYSTEM_USER_ID');
   ```
3. Add `organization_id` column to companies:
   ```sql
   ALTER TABLE companies ADD COLUMN organization_id INTEGER;
   UPDATE companies SET organization_id = 1; -- Default Org
   ```
4. Add foreign key constraint (if supported)
5. Update MCP server to use multi-tenant DB

## 🚀 Next Steps

### 1. **Frontend Changes**

#### Add Supabase Auth
```typescript
// src/lib/auth.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Login/Signup
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

#### Pass Auth Context to MCP
```typescript
// src/lib/mcp.ts
async function callMCP<T>(tool: string, params: Record<string, unknown> = {}): Promise<MCPResponse<T>> {
  const { data: { user } } = await supabase.auth.getUser();
  const organization_id = localStorage.getItem('active_org_id');

  const { data, error } = await supabase.functions.invoke('mcp-proxy', {
    body: { 
      tool, 
      params,
      context: {
        user_id: user?.id,
        organization_id: parseInt(organization_id || '0')
      }
    }
  });
  // ...
}
```

#### Add Organization Switcher
```tsx
// src/components/OrgSwitcher.tsx
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/auth';
import { Select } from '@/components/ui/select';

export function OrgSwitcher() {
  const [orgs, setOrgs] = useState([]);
  const [activeOrg, setActiveOrg] = useState(null);

  useEffect(() => {
    // Fetch user's organizations via MCP
    const fetchOrgs = async () => {
      const result = await callMCP('auth_list_organizations');
      setOrgs(result.data);
    };
    fetchOrgs();
  }, []);

  const handleSwitch = (orgId: number) => {
    localStorage.setItem('active_org_id', orgId.toString());
    setActiveOrg(orgId);
    window.location.reload(); // Refresh data
  };

  return (
    <Select value={activeOrg} onValueChange={handleSwitch}>
      {orgs.map(org => (
        <SelectItem key={org.id} value={org.id}>
          {org.name}
        </SelectItem>
      ))}
    </Select>
  );
}
```

### 2. **Backend Changes**

#### Update MCP Server
Replace `gtm-db.ts` usage with `gtm-db-multi-tenant.ts`:

```typescript
// unified-mcp-server/src/tool-handler.ts
import { GTMDatabaseMultiTenant, AuthContext } from './gtm-db-multi-tenant.js';

const gtmDb = new GTMDatabaseMultiTenant(
  process.env.TURSO_DATABASE_URL!,
  process.env.TURSO_AUTH_TOKEN!
);

export async function handleToolCall(params: { 
  name: string; 
  arguments?: any;
  context?: AuthContext;  // NEW: require context
}) {
  const { name, arguments: args, context } = params;

  if (!context) {
    return {
      content: [{ type: 'text', text: '❌ Authentication required' }],
      isError: true,
    };
  }

  // Now pass context to all DB operations
  const companies = await gtmDb.listCompanies(context);
  // ...
}
```

#### Add New Auth Tools
```typescript
case 'auth_create_user':
  await gtmDb.createUser({
    id: args.id,
    email: args.email,
    full_name: args.full_name
  });
  return { content: [{ type: 'text', text: '✅ User created' }] };

case 'auth_create_organization':
  const orgId = await gtmDb.createOrganization(
    args.name,
    args.slug,
    context.user_id
  );
  return { 
    content: [{ 
      type: 'text', 
      text: `✅ Organization "${args.name}" created (ID: ${orgId})` 
    }] 
  };

case 'auth_list_organizations':
  const orgs = await gtmDb.getUserOrganizations(context.user_id);
  return { content: [{ type: 'text', text: JSON.stringify(orgs) }] };
```

### 3. **Update Supabase Edge Function**

Modify `mcp-proxy` to pass context:

```typescript
// supabase/functions/mcp-proxy/index.ts
const { tool, params } = await req.json();

// Get user from auth header
const authHeader = req.headers.get('authorization');
const token = authHeader?.replace('Bearer ', '');

const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

if (authError || !user) {
  return new Response(
    JSON.stringify({ success: false, error: 'Unauthorized' }),
    { status: 401, headers: corsHeaders }
  );
}

// Extract organization_id from params or session
const organizationId = params._organization_id || getActiveOrg(user.id);

// Call MCP with context
const response = await fetch(MCP_SERVER_URL + '/tools/call', {
  method: 'POST',
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: '1',
    params: {
      name: tool,
      arguments: params,
      context: {
        user_id: user.id,
        organization_id: organizationId,
        role: await getUserRole(user.id, organizationId)
      }
    }
  })
});
```

### 4. **UI Components to Add**

- [ ] **Login/Signup page** with Supabase Auth
- [ ] **Organization switcher** in header/sidebar
- [ ] **Organization settings page** (manage members, invites)
- [ ] **Invite member form** (email-based invites)
- [ ] **Member list** with role badges (owner/admin/member)
- [ ] **First-time setup flow** (create org after signup)

### 5. **Testing Checklist**

- [ ] Sign up new user → auto-create organization
- [ ] Add company → verify it's scoped to organization
- [ ] List companies → only see org's companies
- [ ] Invite second user → they see same companies
- [ ] Switch to different org → see different data
- [ ] Try to access other org's data → blocked
- [ ] Delete company as member → permission denied
- [ ] Delete company as owner → success

## 🎬 Demo Flow

**For Utah Tech Week Demo:**

1. **Signup** → "Create your GTM Intelligence account"
2. **Auto-create org** → "Welcome to [Your Company]!"
3. **Import companies** → Use Chrome extension to capture leads
4. **Generate strategies** → Show AI-powered GTM strategies
5. **Invite team member** → "Share with your team"
6. **Show collaboration** → Both users see same companies/strategies

## 📊 Database Size Impact

**Before Multi-Tenancy:**
- 2 tables (companies, employees)
- ~50 rows for 12 companies

**After Multi-Tenancy:**
- 8 tables (users, orgs, members, companies, employees, strategies, emails, etc.)
- Still efficient with proper indexes
- Turso handles this easily (designed for scale)

## 🐛 Common Issues & Solutions

### Issue: "Organization mismatch" errors
**Solution**: Ensure `organization_id` in request matches user's active org

### Issue: User can't see any companies
**Solution**: Check `organization_members` table — user must be a member

### Issue: Cross-org data leakage
**Solution**: All queries MUST filter by `organization_id` — use `AuthContext` everywhere

### Issue: User stuck on login screen
**Solution**: Ensure first organization is auto-created after signup

## 🔗 References

- Multi-tenant schema: `unified-mcp-server/MIGRATION_MULTI_TENANT.md`
- Database implementation: `unified-mcp-server/src/gtm-db-multi-tenant.ts`
- Supabase Auth docs: https://supabase.com/docs/guides/auth
- Turso + multi-tenancy: https://turso.tech/blog/multi-tenant-databases

---

**Status**: ✅ Database layer complete, ready for frontend integration

**Estimated Integration Time**: 4-6 hours for full frontend + backend hookup

**Priority**: High (needed before demo for proper data isolation)
