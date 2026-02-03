# Global Schema Design - CRM-like Architecture

## Overview

Redesign from organization-siloed data to global company/people tables with user associations.

## Current Schema (Multi-tenant, Siloed)

```
users (id, email, name...)
organizations (id, name, owner_id...)
organization_members (org_id, user_id, role...)
companies (id, organization_id, name...) ← SILOED
employees (id, company_id, name...) ← SILOED
```

**Problem:** Each org has separate company list. Same company appears multiple times across different orgs.

## New Schema (Global, CRM-like)

### Global Tables (Shared Across All Users)

#### 1. global_companies
```sql
CREATE TABLE global_companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  domain TEXT UNIQUE,  -- Company domain (acme.com)
  industry TEXT,
  description TEXT,
  website TEXT,
  linkedin_url TEXT,
  employee_count INTEGER,
  founded_year INTEGER,
  location TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT,  -- First user who added it
  UNIQUE(name, domain)
);
```

#### 2. global_people
```sql
CREATE TABLE global_people (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  title TEXT,
  company_id INTEGER,  -- FK to global_companies
  linkedin_url TEXT UNIQUE,
  phone TEXT,
  location TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT,  -- First user who added them
  FOREIGN KEY (company_id) REFERENCES global_companies(id) ON DELETE SET NULL
);

CREATE INDEX idx_people_company ON global_people(company_id);
CREATE INDEX idx_people_email ON global_people(email);
CREATE INDEX idx_people_linkedin ON global_people(linkedin_url);
```

### User Association Tables

#### 3. user_companies
```sql
CREATE TABLE user_companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  company_id INTEGER NOT NULL,
  tags TEXT,  -- JSON array: ["prospect", "customer", "partner"]
  notes TEXT,  -- User's private notes
  relationship TEXT,  -- "prospect", "customer", "partner", "competitor"
  priority INTEGER DEFAULT 0,  -- User's priority ranking
  last_contact_date TEXT,
  next_follow_up_date TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, company_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (company_id) REFERENCES global_companies(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_companies_user ON user_companies(user_id);
CREATE INDEX idx_user_companies_company ON user_companies(company_id);
```

#### 4. user_people
```sql
CREATE TABLE user_people (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  person_id INTEGER NOT NULL,
  relationship TEXT,  -- "prospect", "champion", "blocker", "decision_maker"
  tags TEXT,  -- JSON array
  notes TEXT,  -- User's private notes
  last_contact_date TEXT,
  next_follow_up_date TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, person_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (person_id) REFERENCES global_people(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_people_user ON user_people(user_id);
CREATE INDEX idx_user_people_person ON user_people(person_id);
```

### User-Specific Tables

#### 5. strategies (updated)
```sql
CREATE TABLE strategies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  company_id INTEGER NOT NULL,  -- FK to global_companies
  your_company TEXT NOT NULL,
  your_product TEXT NOT NULL,
  target_personas TEXT,
  target_industries TEXT,
  value_alignment TEXT,
  key_topics TEXT,  -- JSON array
  tone_and_voice TEXT,
  product_positioning TEXT,
  talking_points TEXT,  -- JSON array
  opening_line TEXT,
  what_to_avoid TEXT,  -- JSON array
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (company_id) REFERENCES global_companies(id) ON DELETE CASCADE
);
```

#### 6. drafted_emails (updated)
```sql
CREATE TABLE drafted_emails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  company_id INTEGER,
  person_id INTEGER,  -- FK to global_people (who it's to)
  strategy_id INTEGER,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT DEFAULT 'draft',  -- draft, sent, scheduled
  sent_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (company_id) REFERENCES global_companies(id) ON DELETE SET NULL,
  FOREIGN KEY (person_id) REFERENCES global_people(id) ON DELETE SET NULL,
  FOREIGN KEY (strategy_id) REFERENCES strategies(id) ON DELETE SET NULL
);
```

## Benefits

### 1. No Duplicates
- Each company exists once in global_companies
- Each person exists once in global_people
- Multiple users can "claim" the same company/person

### 2. Collaborative Intelligence
- If User A enriches Company X, User B sees the enriched data
- Network effects: more users = better data quality
- Prevent duplicate work

### 3. Relationship Tracking
- Each user maintains their own relationship with companies/people
- Private notes, tags, priorities
- Follow-up tracking

### 4. LinkedIn-like Model
- Same person at same company across all users
- When person changes jobs, update global record
- All users who follow that person see the update

## Migration Path

### Step 1: Create New Tables
Run schema migration to create global tables

### Step 2: Migrate Existing Data
```sql
-- Migrate companies (deduplicate by name)
INSERT INTO global_companies (name, domain, industry, description, created_by)
SELECT DISTINCT 
  name,
  LOWER(SUBSTRING(name FROM 1 FOR POSITION(' ' IN name)-1)) || '.com' as domain,
  industry,
  description,
  'SYSTEM' as created_by
FROM companies;

-- Create user associations for existing companies
INSERT INTO user_companies (user_id, company_id, created_at)
SELECT 
  om.user_id,
  gc.id,
  c.created_at
FROM companies c
JOIN organizations o ON c.organization_id = o.id
JOIN organization_members om ON o.id = om.organization_id
JOIN global_companies gc ON c.name = gc.name;

-- Migrate employees to global_people
INSERT INTO global_people (name, title, linkedin_url, company_id, created_by)
SELECT DISTINCT
  e.name,
  e.title,
  e.linkedin,
  gc.id,
  'SYSTEM' as created_by
FROM employees e
JOIN companies c ON e.company_id = c.id
JOIN global_companies gc ON c.name = gc.name;
```

### Step 3: Update API/MCP Server
- Change gtm_list_companies to query user_companies JOIN global_companies
- Update gtm_add_company to insert into global_companies + user_companies
- Add gtm_add_person to insert into global_people + user_people

### Step 4: Update Frontend
- Change queries to fetch from user_companies view
- Add "My Companies" vs "All Companies" views
- Add tagging/notes UI

## API Changes

### New Tools

#### `gtm_add_person`
Add person to global directory + associate with user
```typescript
{
  name: string;
  email?: string;
  title?: string;
  company_id: number;
  linkedin_url?: string;
  relationship?: string;
  tags?: string[];
  notes?: string;
}
```

#### `gtm_list_people`
List people user has access to
```typescript
{
  user_id: string;
  company_id?: number;  // Filter by company
}
```

#### `gtm_search_global_companies`
Search ALL companies (not just user's)
```typescript
{
  query: string;
  limit?: number;
}
```

#### `gtm_claim_company`
Associate user with existing global company
```typescript
{
  user_id: string;
  company_id: number;
  relationship?: string;
  tags?: string[];
}
```

### Updated Tools

#### `gtm_list_companies` (updated)
Now returns user's companies from user_companies JOIN global_companies

#### `gtm_add_company` (updated)
- First check if company exists in global_companies (by name/domain)
- If exists: create user_companies association
- If not: create global_companies + user_companies

## UI Changes

### Companies Page
```
[My Companies (23)] [All Companies (1,247)]

Search: [________________] [🔍]

My Companies:
- Acme Corp (Prospect) 🏷️ high-priority
- TechCo (Customer) 🏷️ enterprise
- StartupXYZ (Partner)

Filters: [Tag ▾] [Relationship ▾] [Priority ▾]
```

### Company Detail Page
```
Acme Corp
Industry: SaaS | 50-200 employees | San Francisco

[My Relationship]
  Relationship: Prospect
  Tags: high-priority, enterprise
  Notes: Met at conference, interested in Q2...
  Last Contact: 2026-01-15
  Next Follow-up: 2026-02-10

[People at Acme]
  - John Doe (CEO) - My Contact
  - Jane Smith (VP Sales) - Not contacted
  + Add Person

[Strategies (2)]
  - Email Strategy (2026-01-10)
  - Conference Follow-up (2026-01-15)
```

## Implementation Priority

1. ✅ Create new schema (global_companies, global_people, user_companies, user_people)
2. ✅ Migrate existing data
3. ✅ Update MCP server tools
4. ⏳ Update frontend queries
5. ⏳ Add tagging/notes UI
6. ⏳ Add "claim company" feature
7. ⏳ Add global search

---

**Status:** Design complete, ready to implement

**Estimated Time:** 
- Schema creation: 10 min
- Data migration: 10 min
- MCP server updates: 20 min
- Frontend updates: 30 min
- Testing: 20 min

**Total:** ~90 minutes
