# Lovable Prompt: Create Technical Architecture Page

## Objective
Create a `/technical` page that visualizes and explains the complete KBYG architecture, showing how data flows from the Chrome extension through MCP servers, frontend, backend, and databases.

## Page Route
Add route in `App.tsx`:
```tsx
<Route path="/technical" element={<TechnicalPage />} />
```

## Page Design (`src/pages/TechnicalPage.tsx`)

Create a comprehensive technical documentation page with:

### 1. Hero Section
```
Title: "KBYG Technical Architecture"
Subtitle: "Know Before You Go - System Architecture & Data Flow"
```

### 2. Architecture Overview Diagram

Create a visual flow diagram using cards and arrows showing:

**Components (use Shadcn cards with icons):**

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LAYER                              │
│  ┌──────────────────────┐                                       │
│  │  Chrome Extension    │  👤 User browses conference pages     │
│  │  - Event Analysis    │                                       │
│  │  - Local Storage     │                                       │
│  │  - Offline Support   │                                       │
│  └──────────┬───────────┘                                       │
│             │ HTTP/REST                                         │
└─────────────┼─────────────────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      INTELLIGENCE LAYER                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Unified MCP Server (TypeScript)                         │  │
│  │  - HTTP/SSE Transport                                    │  │
│  │  - 8 GTM Tools                                          │  │
│  │  │  • gtm_add_company                                   │  │
│  │  │  • gtm_enrich_company (Gemini API)                   │  │
│  │  │  • gtm_generate_strategy                             │  │
│  │  │  • gtm_draft_email                                   │  │
│  │  │  • gtm_search_companies                              │  │
│  │  └─ • More...                                           │  │
│  └──────────┬──────────────────────────────┬────────────────┘  │
│             │                              │                   │
└─────────────┼──────────────────────────────┼──────────────────┘
              │                              │
              ↓                              ↓
┌─────────────────────────┐    ┌──────────────────────────────┐
│    GEMINI AI API        │    │     TURSO DATABASE           │
│  - Event Analysis       │    │  - Companies                 │
│  - Company Enrichment   │    │  - Employees                 │
│  - Strategy Generation  │    │  - Enriched Data            │
│  - Email Drafting       │    │  - Context                  │
└─────────────────────────┘    └──────────────┬───────────────┘
                                              │
                                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       FRONTEND LAYER                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React Web Dashboard                                     │  │
│  │  - Companies Management                                  │  │
│  │  - Events Tracking                                       │  │
│  │  - Strategy Generator                                    │  │
│  │  - Email Composer                                        │  │
│  └──────────┬───────────────────────────────────────────────┘  │
│             │ MCP Protocol (HTTP/SSE)                          │
└─────────────┼─────────────────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Supabase Backend                                        │  │
│  │  - Authentication (Auth.js)                              │  │
│  │  - PostgreSQL Database                                   │  │
│  │  │  Tables:                                              │  │
│  │  │  • user_profiles (onboarding, company info)           │  │
│  │  │  • events (analyzed conferences)                      │  │
│  │  │  • people (attendees, speakers)                       │  │
│  │  │  • expected_personas (AI predictions)                 │  │
│  │  │  • sponsors (event sponsors)                          │  │
│  │  │  • next_best_actions (AI recommendations)             │  │
│  │  - Row Level Security (RLS)                              │  │
│  │  - Real-time Subscriptions                               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 3. Data Flow Tabs

Create tabs for different data flows:

#### Tab 1: "Extension → Database"
**Title:** Event Analysis Flow

**Steps (use numbered cards):**
1. **User Action** 
   - User visits conference website
   - Clicks "Analyze Event" in extension
   
2. **Content Extraction**
   - Extension extracts page HTML
   - Identifies people, sponsors, event details
   
3. **AI Analysis**
   - Sends to Gemini API
   - Generates personas, ice breakers, talking points
   
4. **Local Storage**
   - Saves to chrome.storage.local (instant, offline)
   - Displays results in sidepanel
   
5. **Backend Sync** (if authenticated)
   - Extension calls backend-sync.js
   - POST to Supabase tables:
     - events table
     - people table (bulk insert)
     - expected_personas table
     - sponsors table
     - next_best_actions table
   
6. **Result**
   - Data available across devices
   - Accessible in web dashboard
   - Searchable and enrichable

#### Tab 2: "Dashboard → MCP → Database"
**Title:** Company Enrichment Flow

**Steps:**
1. **User Request**
   - User clicks "Enrich Company" in dashboard
   
2. **Frontend Call**
   - React app calls MCP client (`@/lib/mcp`)
   - `enrichCompany(companyName)`
   
3. **MCP Server**
   - Receives HTTP request
   - Tool: `gtm_enrich_company`
   - Fetches company from Turso
   
4. **AI Enrichment**
   - Sends company data to Gemini API
   - Prompt: "Analyze this company..."
   - Gets back: industry, description, insights
   
5. **Database Update**
   - Updates Turso with enriched_data JSON
   - Timestamp: enriched_at
   
6. **Response**
   - Returns enriched data to frontend
   - UI updates with new information

#### Tab 3: "Cross-Device Sync"
**Title:** Multi-Device Data Sync

**Flow:**
- **Device A (Chrome Extension)**
  - Analyzes event
  - Syncs to Supabase
  
- **Supabase (Central)**
  - Stores all data
  - RLS ensures user isolation
  
- **Device B (Web Dashboard)**
  - Loads data from Supabase
  - Shows all events/companies
  
- **Device C (Another Chrome)**
  - Signed in with same account
  - Pulls data from Supabase
  - Merges with local cache

### 4. Component Details Sections

#### Chrome Extension
**Tech Stack:**
- Manifest V3
- Vanilla JavaScript
- Gemini 2.0 Flash API
- chrome.storage.local
- Supabase JS client

**Key Files:**
- `background.js` - Service worker, API calls
- `sidepanel.js` - UI logic, rendering
- `backend-sync.js` - Supabase sync
- `auth-handler.js` - Authentication
- `mcp-integration.js` - MCP server calls

**Storage:**
```javascript
chrome.storage.local.set({
  userProfile: { ... },
  savedEvents: { ... }
})
```

#### Unified MCP Server
**Tech Stack:**
- Node.js + TypeScript
- MCP SDK (@modelcontextprotocol/sdk)
- Turso (libSQL)
- Gemini 1.5 Pro
- Express (HTTP transport)

**Key Files:**
- `src/index.ts` - Server entry
- `src/tools.ts` - Tool definitions
- `src/gtm-enrichment.ts` - GTM logic
- `src/gtm-db.ts` - Database layer

**Database (Turso):**
```sql
companies (id, name, description, industry, enriched_at)
employees (id, company_id, name, title, linkedin)
```

#### Web Dashboard
**Tech Stack:**
- React 18 + TypeScript
- Vite
- Tailwind CSS + Shadcn UI
- React Router
- TanStack Query

**Key Files:**
- `src/pages/` - Page components
- `src/components/` - Reusable components
- `src/lib/mcp.ts` - MCP client
- `src/integrations/supabase/` - Supabase

#### Supabase Backend
**Features:**
- PostgreSQL database
- Authentication (email/password, OAuth)
- Row Level Security
- Real-time subscriptions
- Edge Functions (optional)

**Tables (6):**
```sql
user_profiles
events
people
expected_personas
sponsors
next_best_actions
```

**RLS Policies:**
```sql
-- Users can only access their own data
CREATE POLICY "Users can view own events"
  ON events FOR SELECT
  USING (auth.uid() = user_id);
```

### 5. Security & Privacy Section

**Authentication:**
- Supabase Auth (JWT tokens)
- Extension: Optional sign-in
- Dashboard: Required sign-in
- Token refresh automatic

**Data Isolation:**
- Row Level Security on all tables
- User can only access their data
- No cross-user data leaks

**API Keys:**
- Gemini API key stored locally (extension)
- MCP server has separate Gemini key
- Turso auth token in environment variables

**Privacy:**
- No personal data collected
- User data encrypted at rest
- HTTPS required for all API calls
- Local-first: works offline

### 6. Performance Features

**Caching Strategy:**
```
Extension:
  chrome.storage.local (instant, 10MB limit)
  ↓
Supabase:
  PostgreSQL (persistent, unlimited)
  ↓
MCP Server:
  Turso (edge, low latency)
```

**Optimizations:**
- Local cache for instant load
- Background sync (non-blocking)
- Batch inserts for related data
- Indexed database fields
- Lazy loading of event details

### 7. API Endpoints Table

Create a table showing all API endpoints:

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/events` | POST | Save event analysis | Yes |
| `/events` | GET | List all events | Yes |
| `/events/:url` | GET | Get specific event | Yes |
| `/events/:url` | DELETE | Delete event | Yes |
| `/profile` | POST | Save user profile | Yes |
| `/profile` | GET | Get user profile | Yes |
| `/people/search` | GET | Search people | Yes |
| `/analytics/summary` | GET | Get analytics | Yes |

### 8. MCP Tools Table

| Tool Name | Input | Output | AI Used |
|-----------|-------|--------|---------|
| `gtm_add_company` | Company data | Company ID | No |
| `gtm_get_company` | Company name | Full company data | No |
| `gtm_list_companies` | None | Array of companies | No |
| `gtm_search_companies` | Query string | Matching companies | No |
| `gtm_enrich_company` | Company name | Enriched data | ✅ Gemini |
| `gtm_generate_strategy` | Company + your info | GTM strategy | ✅ Gemini |
| `gtm_draft_email` | Company + name | Personalized email | ✅ Gemini |
| `gtm_delete_company` | Company name | Success | No |

### 9. Tech Stack Summary Cards

Create grid of cards showing:

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- Shadcn UI
- React Router
- TanStack Query

**Backend:**
- Supabase (PostgreSQL)
- Supabase Auth
- Row Level Security
- Real-time

**Intelligence:**
- Node.js + TypeScript
- MCP Protocol
- Turso (libSQL)
- Express

**Extension:**
- Manifest V3
- Vanilla JS
- Gemini API
- Chrome APIs

**AI:**
- Gemini 2.0 Flash (Extension)
- Gemini 1.5 Pro (MCP)
- Context-aware prompts
- Structured outputs

### 10. Code Examples

Add expandable code blocks for key operations:

**Example 1: Sync Event to Database**
```javascript
// chrome-extension/backend-sync.js
async function syncEventToBackend(eventData) {
  const user = await getSupabaseUser();
  
  // 1. Insert event
  const { data: event } = await supabase
    .from('events')
    .upsert({ 
      user_id: user.id,
      url: eventData.url,
      event_name: eventData.eventName,
      // ...
    })
    .select()
    .single();
    
  // 2. Insert people
  await supabase.from('people').insert(
    eventData.people.map(p => ({
      event_id: event.id,
      user_id: user.id,
      name: p.name,
      title: p.title,
      // ...
    }))
  );
  
  return event.id;
}
```

**Example 2: Call MCP Tool**
```typescript
// src/lib/mcp.ts
export async function enrichCompany(name: string) {
  const response = await fetch(`${MCP_BASE_URL}/tools/call`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'gtm_enrich_company',
      arguments: { name }
    })
  });
  return response.json();
}
```

**Example 3: Query with RLS**
```sql
-- Automatically filtered by RLS
SELECT * FROM events WHERE user_id = auth.uid();
-- User only sees their own events
```

### Styling

Use Shadcn components:
- `Card` for sections
- `Tabs` for data flow views
- `Badge` for tech stack items
- `Separator` between sections
- `Code` for inline code
- `ScrollArea` for long content
- Lucide icons throughout
- Muted colors for secondary info
- Primary colors for important paths
- Arrows/flow indicators with CSS

### Navigation

Add to sidebar in `AppSidebar.tsx`:
```tsx
import { Cpu } from "lucide-react";

{ to: "/technical", icon: Cpu, label: "Architecture" }
```

### Responsive Design

- Desktop: Side-by-side diagrams
- Tablet: Stacked with scroll
- Mobile: Single column, collapsible sections

### Interactive Elements

- Click on components to expand details
- Hover on arrows to show data format
- Toggle between detailed/simplified view
- Copy code examples button
- Link to GitHub repo, documentation

## Success Criteria

✅ Clear visual representation of architecture
✅ Explains data flow from extension to database
✅ Shows all components and their connections
✅ Documents API endpoints and MCP tools
✅ Includes code examples
✅ Security and privacy section
✅ Tech stack clearly listed
✅ Responsive design
✅ Professional appearance

## Start Building!

Create `src/pages/TechnicalPage.tsx` with all the above sections. Use Mermaid diagrams if possible, or create custom SVG/CSS diagrams. Focus on clarity and visual hierarchy.
