# Database Status - Demo Data Loaded

**Last Updated:** February 2, 2026  
**Database:** Turso (libsql://gtmapp-gtmapp.aws-us-west-2.turso.io)

## Current State

✅ **13 Companies Loaded**  
✅ **13 Employees** (1 per company on average)  
✅ **Source:** State of Healthcare Tech: CEOs on AI, Innovation, and What It Takes to Build (Feb 2, Pleasant Grove, UT)

## Companies in Database

| # | Company | Employees | Industry | Context |
|---|---------|-----------|----------|---------|
| 1 | Amalga Group | 1 | Healthcare Technology | Jens Gould - Founder and CEO |
| 2 | Blackrock Benefits | 1 | Healthcare Technology | Bret Harding - President |
| 3 | Crofter Market | 1 | Healthcare Technology | Phillip Taylor - VP of Operation |
| 4 | Emerald Beacon LLC | 1 | Healthcare Technology | Josh Dennis - Founder and CEO |
| 5 | Impact Investing & Venture Capital | 1 | Healthcare Technology | Lis Green - Director |
| 6 | Nexio Payments | 1 | Healthcare Technology | Adam Fairbanks - CIO |
| 7 | **NextTherapist** | 1 | Healthcare Technology | Greg Dunn - Co-Founder |
| 8 | Office of AI Policy (Utah Dept of Commerce) | 1 | Healthcare Technology | Brady Young - Lead Legal and Policy Analyst |
| 9 | Philo Ventures | 1 | Healthcare Technology | Cory Cozzens - Co-founder and Studio Managing Partner |
| 10 | R&D Advantage | 1 | Healthcare Technology | Brandy Price - Director of Business Development |
| 11 | TechCorp AI | 0 | - | Test company (added by Lovable) |
| 12 | Utah Tech Week | 1 | Healthcare Technology | Adriel Johnson |
| 13 | Vendr | 1 | Healthcare Technology | Benjamin Reece - Full-stack developer and storyteller |

## Event Details

**Event:** State of Healthcare Tech: CEOs on AI, Innovation, and What It Takes to Build  
**Date:** February 2, 2026  
**Location:** 389 S 1300 W St bldg e1, Pleasant Grove, UT 84062, USA  
**Total Attendees:** 26 (12 with company affiliations)

## Featured Companies

### NextTherapist
- **Co-Founder:** Greg Dunn
- **LinkedIn:** https://www.linkedin.com/in/jgregdunn
- **Context:** Healthcare AI therapy platform
- **Target for Demo:** ✅ Perfect for GTM strategy generation

### Vendr
- **Developer:** Benjamin Reece - Full-stack developer and storyteller
- **LinkedIn:** https://www.linkedin.com/in/bnjreece
- **Context:** Tech/SaaS company

### Philo Ventures
- **Managing Partner:** Cory Cozzens
- **Focus:** Venture capital, studio model
- **Context:** Potential investor/partner profile

## Demo Workflow Examples

### 1. View NextTherapist Details
```bash
# Via MCP server
curl -X POST https://unified-mcp-server-production.up.railway.app/tools/call \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"gtm_get_company","arguments":{"name":"NextTherapist"}}}'
```

### 2. Enrich Company with AI
```bash
# Via MCP server
curl -X POST https://unified-mcp-server-production.up.railway.app/tools/call \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"gtm_enrich_company","arguments":{"name":"NextTherapist"}}}'
```

### 3. Generate GTM Strategy
```bash
# Via frontend or MCP
gtm_generate_strategy({
  company_name: "NextTherapist",
  your_company: "Veydra",
  your_product: "Decision intelligence SaaS platform",
  target_personas: "Healthcare CTOs, VP of Operations",
  target_industries: "Healthcare Technology"
})
```

### 4. Draft Email
```bash
# Via frontend or MCP
gtm_draft_email({
  company_name: "NextTherapist",
  from_name: "Ben Fife"
})
```

## Data Population

**Script:** `scripts/populate-demo-data.js`

**Usage:**
```bash
node scripts/populate-demo-data.js
```

**Features:**
- Reads from `event-contacts.csv`
- Groups attendees by company
- Automatically adds context from event details
- Calls MCP server to persist to Turso
- Shows progress and success/fail counts

**Source CSV:** `event-contacts.csv` (26 rows)

## Database Schema

### Companies Table
```sql
CREATE TABLE companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  industry TEXT,
  context TEXT,
  recent_activity TEXT,
  enriched_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
)
```

### Employees Table
```sql
CREATE TABLE employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  title TEXT,
  linkedin TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
)
```

## Next Steps

### Immediate
- ✅ Data loaded
- ✅ Verify in frontend (Companies page)
- ⏳ Test enrichment on NextTherapist
- ⏳ Generate sample GTM strategy
- ⏳ Draft sample email

### Future Enhancements
- Add more event data (multiple conferences)
- Enrich all companies with AI
- Add company logos/images
- Track enrichment history
- Add notes/tags per company

## Access

**Frontend:** https://lovable.dev/projects/65338123-c8d4-4ee6-abe1-bdb2c16f85df  
**MCP Server:** https://unified-mcp-server-production.up.railway.app  
**Database:** Turso (private, credentials in GitHub secrets)

---

**Status:** ✅ Database populated and ready for demo  
**Total Records:** 13 companies, 13 employees  
**Quality:** Real event data from healthcare tech conference
