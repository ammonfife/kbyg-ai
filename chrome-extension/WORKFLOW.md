# GTM Hackathon - Complete Workflow

## End-to-End Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    1. EVENT DISCOVERY                        │
│   User browses conference website in Chrome                 │
└────────────┬─────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────┐
│                2. CHROME EXTENSION ANALYSIS                  │
│   - Click "Analyze Event" button                            │
│   - Extension extracts page content                          │
│   - Sends to Gemini API via background.js                   │
│   - Returns: companies, people, sponsors, personas          │
└────────────┬─────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────┐
│              3. RESULTS DISPLAYED IN SIDEPANEL               │
│   - Event name, date, location                              │
│   - List of people with ice breakers                        │
│   - Target personas with conversation starters              │
│   - Sponsors                                                 │
│   - Download CSV button                                     │
└────────────┬─────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────┐
│           4. AUTO-SAVE TO MCP SERVER (NEW!)                  │
│   - mcp-integration.js.autoSaveAnalysis() runs               │
│   - Extracts companies and employees                         │
│   - Calls unified-mcp-server HTTP API                       │
│   - POST /tools/call → gtm_add_company                      │
│   - Toast: "💾 Saved 8 companies to database"              │
└────────────┬─────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────┐
│            5. STORED IN TURSO DATABASE                       │
│   Tables:                                                    │
│   - companies (name, description, industry, context)        │
│   - employees (name, title, linkedin) → linked to company  │
│                                                              │
│   Now accessible from ANY MCP client!                       │
└────────────┬─────────────────────────────────────────────────┘
             │
             ├──────────────────────┬──────────────────────────┐
             ▼                      ▼                          ▼
┌────────────────────┐  ┌──────────────────────┐  ┌──────────────────┐
│  6A. CLAUDE        │  │  6B. MOLTBOT         │  │  6C. DIRECT MCP  │
│  DESKTOP           │  │  (BIG MAC)           │  │  CLIENT          │
│                    │  │                      │  │                  │
│  "List companies   │  │  "Enrich NextThera-  │  │  API calls to    │
│   from Utah        │  │   pist and generate  │  │  unified-mcp-    │
│   conference"      │  │   outreach strategy" │  │  server          │
│                    │  │                      │  │                  │
│  → gtm_list_       │  │  → gtm_enrich_       │  │  → Any GTM or    │
│    companies       │  │    company           │  │    Lovable tool  │
│                    │  │  → gtm_generate_     │  │                  │
│                    │  │    strategy          │  │                  │
└────────────────────┘  └──────────────────────┘  └──────────────────┘
```

## User Journey

### Phase 1: Conference Research (Chrome Extension)

**Scenario:** Ben is attending Utah Healthcare AI Conference

1. **Browse** conference website
2. **Click** extension icon → Open sidepanel
3. **Click** "Analyze Event" button
4. **View** results:
   - 25 speakers from 12 companies
   - Target personas: VP of Operations, CTOs, Founders
   - Ice breakers for each person
   - LinkedIn message templates
5. **Download** CSV for CRM import
6. **Auto-saved** → 12 companies + 25 employees → Turso database

### Phase 2: Enrichment & Strategy (MCP Client)

**In Claude Desktop (or Moltbot):**

```
User: "Show me all companies from the Utah conference"

Claude: [Uses gtm_list_companies]
Found 12 companies:
• NextTherapist (2 employees)
• HealthAI Inc (3 employees)
• MedTech Solutions (1 employee)
...

User: "Enrich NextTherapist and generate an outreach strategy"

Claude: [Uses gtm_enrich_company + gtm_generate_strategy]
✨ NextTherapist enriched!
Description: AI-powered therapy platform for mental health...
Industry: Healthcare Technology - Mental Health
Recent Activity: Series A funding announced...

📋 GTM Strategy:
1. Value Alignment
   Your decision intelligence platform can help NextTherapist...
   
2. Key Topics
   - Clinical workflow optimization
   - Patient outcome analytics
   ...

User: "Draft an email to their CEO"

Claude: [Uses gtm_draft_email]
📧 Subject: Improving clinical decision flows at NextTherapist
Dr. Sarah,
I saw you're speaking at the Utah Healthcare AI Conference...
```

### Phase 3: Execution (Follow-up)

**At the conference:**
- Use ice breakers from extension
- Reference specific insights from enrichment
- Natural, personalized conversations

**After the conference:**
- Send drafted emails (already personalized)
- Track in CRM (CSV export)
- Continue enriching companies as needed

## Data Persistence

### Chrome Extension Storage
**Location:** `chrome.storage.local`

```javascript
{
  userProfile: {
    geminiApiKey: "...",
    companyName: "Veydra",
    product: "Decision intelligence SaaS",
    ...
  },
  analysisHistory: [
    {
      eventName: "Utah Healthcare AI Conference",
      date: "2026-03-15",
      people: [...],
      sponsors: [...],
      analyzedAt: "2026-02-02T22:30:00Z"
    },
    // ... last 50 analyses
  ]
}
```

### Turso Database
**Location:** `libsql://gtmapp-gtmapp.aws-us-west-2.turso.io`

**Companies table:**
```sql
id | name              | description        | industry           | context
1  | NextTherapist     | AI therapy...      | Healthcare Tech    | Utah Conference
2  | HealthAI Inc      | Medical AI...      | Healthcare Tech    | Utah Conference
```

**Employees table:**
```sql
id | company_id | name          | title      | linkedin
1  | 1          | Dr. Sarah Chen| CEO        | linkedin.com/in/...
2  | 1          | Mike Johnson  | VP Product | linkedin.com/in/...
```

## Available Tools

### GTM Enrichment (8 tools)

| Tool | Input | Output |
|------|-------|--------|
| `gtm_add_company` | Company data | Saved to Turso |
| `gtm_get_company` | Company name | Full profile |
| `gtm_list_companies` | - | All companies |
| `gtm_search_companies` | Search query | Matching companies |
| `gtm_enrich_company` | Company name | AI-enriched profile |
| `gtm_generate_strategy` | Company + your product | GTM strategy |
| `gtm_draft_email` | Company + your name | Personalized email |
| `gtm_delete_company` | Company name | Deleted |

### Lovable.dev Control (11 tools)

| Tool | Input | Output |
|------|-------|--------|
| `lovable_create_project` | Project name | New project |
| `lovable_list_projects` | - | All projects |
| `lovable_send_command` | Project + command | AI response |
| `lovable_generate_code` | Project + prompt | Generated code |
| `lovable_deploy_project` | Project ID | Deployed URL |
| ... | | |

## Integration Points

### 1. Extension → MCP Server (HTTP)
```javascript
// mcp-integration.js
fetch('http://localhost:3000/tools/call', {
  method: 'POST',
  body: JSON.stringify({
    jsonrpc: '2.0',
    params: {
      name: 'gtm_add_company',
      arguments: { name, employees, ... }
    }
  })
})
```

### 2. MCP Server → Turso (SQL)
```typescript
// gtm-db.ts
const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

await client.execute({
  sql: 'INSERT INTO companies ...',
  args: [name, description, ...]
});
```

### 3. MCP Server → Gemini (AI)
```typescript
// gtm-enrichment.ts
const response = await fetch(
  'https://generativelanguage.googleapis.com/v1beta/...',
  { body: JSON.stringify({ prompt: ... }) }
);
```

### 4. MCP Client → MCP Server (Stdio or HTTP)
**Stdio (local):**
```json
{
  "mcpServers": {
    "unified": {
      "command": "node",
      "args": ["unified-mcp-server/dist/index.js"]
    }
  }
}
```

**HTTP (remote):**
```json
{
  "mcpServers": {
    "unified": {
      "url": "https://your-domain.com/sse",
      "auth": "Bearer token"
    }
  }
}
```

## Security & Privacy

### What's Stored Where

**Locally (Browser):**
- ✅ User profile (company, product, etc.)
- ✅ Analysis history (last 50)
- ✅ Gemini API key (encrypted by Chrome)

**Cloud (Turso):**
- ✅ Company profiles
- ✅ Employee names/titles/LinkedIn
- ❌ NO user API keys
- ❌ NO personal user data

**GitHub Secrets:**
- ✅ Turso credentials
- ✅ Gemini API key (for MCP server enrichment)
- ❌ NOT in code/commits

### Authentication

**Chrome Extension → MCP Server:**
- Currently: Open (localhost only)
- Production: Add Bearer token auth

**MCP Server → Turso:**
- JWT token (from GitHub secrets)
- HTTPS only

**MCP Server → Gemini:**
- API key (from GitHub secrets)
- Rate limited

## Deployment

### Local Development
```bash
# 1. Start MCP server
cd unified-mcp-server
npm run start:http

# 2. Load extension
# Chrome → Extensions → Load unpacked → select chrome-extension/

# 3. Test
# Visit conference page → Analyze → Check console for "✅ Auto-saved"
```

### Production
```bash
# 1. Deploy MCP server (Railway/Fly.io)
cd unified-mcp-server
railway up
railway variables set TURSO_DATABASE_URL=...
railway variables set TURSO_AUTH_TOKEN=...
railway variables set GEMINI_API_KEY=...

# 2. Update extension
# Edit mcp-integration.js → MCP_SERVER_URL = 'https://your-domain.com'

# 3. Publish extension
# Chrome Web Store or Enterprise distribution
```

## Next Steps

### Immediate (MVP)
- [x] Chrome extension extracts companies
- [x] Auto-save to Turso via MCP server
- [x] MCP clients can access companies
- [x] Basic enrichment and strategy generation

### Short-term (Next 2 weeks)
- [ ] UI in extension to view saved companies
- [ ] Batch enrichment (enrich all from event)
- [ ] Email drafting from extension UI
- [ ] Sync status indicator

### Long-term (Future)
- [ ] LinkedIn integration (auto-send messages)
- [ ] CRM sync (Salesforce, HubSpot)
- [ ] Analytics dashboard
- [ ] Multi-user / team features

---

**Status:** ✅ Integrated and functional  
**Last Updated:** 2026-02-02  
**Repo:** `altonalexander/gtm-hackathon` (private)
