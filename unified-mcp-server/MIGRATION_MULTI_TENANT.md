# Multi-Tenant Schema Migration

## Overview
Add support for multiple organizations with sub-users.

## New Schema

### 1. Users Table
```sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, -- UUID from Supabase Auth
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Organizations Table
```sql
CREATE TABLE IF NOT EXISTS organizations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id TEXT NOT NULL, -- User who created the org
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 3. Organization Members Table (User-Org Junction)
```sql
CREATE TABLE IF NOT EXISTS organization_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member', -- owner, admin, member
  invited_by TEXT,
  joined_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(organization_id, user_id),
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (invited_by) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_org_members_org ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user ON organization_members(user_id);
```

### 4. Update Companies Table (Add organization_id)
```sql
-- Migration: Add organization_id to existing companies table
ALTER TABLE companies ADD COLUMN organization_id INTEGER;

-- For existing data, you'll need to create a default organization
-- or assign companies to organizations manually

-- Add foreign key (if supported by your Turso version)
-- For new installs:
CREATE TABLE IF NOT EXISTS companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  industry TEXT,
  context TEXT,
  recent_activity TEXT,
  enriched_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(organization_id, name),
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_companies_org ON companies(organization_id);
```

### 5. Strategies Table (Store Generated Strategies)
```sql
CREATE TABLE IF NOT EXISTS strategies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  company_id INTEGER NOT NULL,
  your_company TEXT NOT NULL,
  your_product TEXT NOT NULL,
  target_personas TEXT,
  target_industries TEXT,
  value_alignment TEXT,
  key_topics TEXT, -- JSON array
  tone_and_voice TEXT,
  product_positioning TEXT,
  talking_points TEXT, -- JSON array
  opening_line TEXT,
  what_to_avoid TEXT, -- JSON array
  created_by TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_strategies_org ON strategies(organization_id);
CREATE INDEX IF NOT EXISTS idx_strategies_company ON strategies(company_id);
```

### 6. Emails Table (Store Drafted Emails)
```sql
CREATE TABLE IF NOT EXISTS drafted_emails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  company_id INTEGER NOT NULL,
  strategy_id INTEGER,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  from_name TEXT NOT NULL,
  to_email TEXT,
  status TEXT DEFAULT 'draft', -- draft, sent, scheduled
  created_by TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  sent_at TEXT,
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (strategy_id) REFERENCES strategies(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_emails_org ON drafted_emails(organization_id);
CREATE INDEX IF NOT EXISTS idx_emails_company ON drafted_emails(company_id);
```

## Migration Steps

### For Existing Deployments:
1. Create new tables (users, organizations, organization_members)
2. Create a default organization for existing data
3. Add organization_id to companies table
4. Update all existing companies to belong to default organization
5. Create strategies and drafted_emails tables
6. Update MCP server to require organization context

### For New Deployments:
- Run full schema with all tables
- First user signup creates their organization automatically

## API Changes

### Authentication Context
All MCP tool calls now require an organization context:
```typescript
interface MCPContext {
  user_id: string;
  organization_id: number;
  role: 'owner' | 'admin' | 'member';
}
```

### New Tools
- `auth_create_user` - Create user profile
- `auth_create_organization` - Create new organization
- `auth_invite_member` - Invite user to organization
- `auth_switch_organization` - Switch active organization context
- `org_list_members` - List organization members
- `org_update_member_role` - Update member role

### Updated Tools (Add Organization Scoping)
All existing GTM tools now filter by organization_id:
- `gtm_add_company` → scoped to active organization
- `gtm_list_companies` → only show org's companies
- `gtm_get_company` → only if belongs to org
- `gtm_search_companies` → only within org
- `gtm_delete_company` → only if user has permission

### New Strategy/Email Tools
- `gtm_save_strategy` - Save generated strategy
- `gtm_list_strategies` - List saved strategies
- `gtm_get_strategy` - Get strategy by ID
- `gtm_save_email` - Save drafted email
- `gtm_list_emails` - List drafted emails
- `gtm_send_email` - Mark email as sent (or actually send via integration)

## Frontend Changes

### Supabase Integration
- Use Supabase Auth for user management
- Store user_id from Supabase Auth in users table
- Pass auth context with every MCP call

### Organization Switcher
- Show current organization in header
- Dropdown to switch between user's organizations
- "Create Organization" button

### Member Management Page
- List organization members
- Invite new members (email invite)
- Update member roles
- Remove members

### Data Isolation
- All data automatically filtered by active organization
- No cross-org data leakage
- Organization owner can export/delete all org data

## Security Considerations

1. **Row-Level Security**: All queries must filter by organization_id
2. **Role-Based Access Control**: 
   - `owner` - full access, can delete org
   - `admin` - manage members, full data access
   - `member` - read/write data, no admin access
3. **Audit Trail**: Track who created/modified records
4. **Data Isolation**: No shared data between organizations
5. **Invite System**: Email-based invites with expiring tokens

## Example Usage

```typescript
// User signs up via Supabase Auth
const user = await supabase.auth.signUp({ email, password });

// Create user profile in Turso
await mcp.call('auth_create_user', {
  id: user.id,
  email: user.email,
  full_name: user.user_metadata.full_name
});

// Auto-create first organization
await mcp.call('auth_create_organization', {
  user_id: user.id,
  name: "My Company",
  slug: "my-company"
});

// Now all GTM operations are scoped to this organization
await mcp.call('gtm_add_company', {
  organization_id: 1,
  name: "Prospect Corp",
  employees: [...]
});
```
