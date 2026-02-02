# Update: Backend Components Added

## Quick Summary

I've merged backend MCP servers and a Chrome extension into this repo. You now have access to **19 MCP tools** for GTM intelligence.

## What's Available

### MCP Server (Already Connected)
**URL:** `https://unified-mcp-server-production.up.railway.app/sse`  
**Status:** ✅ Live and running  
**Tools:** 19 available

### GTM Intelligence Tools (8 tools)

Use these to power the frontend:

```typescript
// List all companies in database
await mcpCall('gtm_list_companies', {})

// Search companies by name/industry/employee
await mcpCall('gtm_search_companies', { 
  query: "healthcare" 
})

// Get full company details
await mcpCall('gtm_get_company', { 
  name: "NextTherapist" 
})

// AI-enrich company with Gemini
await mcpCall('gtm_enrich_company', { 
  name: "NextTherapist" 
})

// Generate GTM strategy
await mcpCall('gtm_generate_strategy', {
  company_name: "NextTherapist",
  your_company: "Veydra",
  your_product: "Decision intelligence SaaS",
  target_personas: "VP of Operations",
  target_industries: "Healthcare"
})

// Draft personalized outreach email
await mcpCall('gtm_draft_email', {
  company_name: "NextTherapist",
  from_name: "Ben"
})

// Add new company to database
await mcpCall('gtm_add_company', {
  name: "CompanyName",
  employees: [
    { name: "John Doe", title: "CEO", linkedin: "..." }
  ],
  industry: "Healthcare",
  context: "Met at conference"
})

// Delete company
await mcpCall('gtm_delete_company', { 
  name: "CompanyName" 
})
```

## What to Build/Update

### 1. Update the Dashboard
- Show **total companies** in database (use `gtm_list_companies`)
- Show **recently enriched** companies
- Quick actions: "View Companies", "Generate Strategy"

### 2. Add Companies Page
Create a page with:
- **Table/Grid** showing all companies (`gtm_list_companies`)
- **Search bar** (use `gtm_search_companies`)
- **"Enrich" button** per company (calls `gtm_enrich_company`)
- **Company detail view** when clicking a company

### 3. Add Company Detail Modal/Page
Show:
- Company name, industry, description
- List of employees (name, title, LinkedIn)
- Enrichment status and last enriched date
- Actions:
  - "Re-enrich" → calls `gtm_enrich_company`
  - "Generate Strategy" → calls `gtm_generate_strategy`
  - "Draft Email" → calls `gtm_draft_email`

### 4. Add Strategy Generator Page
Form with:
- Company selector (dropdown from `gtm_list_companies`)
- Your company name input
- Your product/service textarea
- Target personas input
- "Generate Strategy" button → calls `gtm_generate_strategy`

Display results:
- Formatted strategy with sections
- "Copy to Clipboard" button
- "Save as PDF" button (optional)

### 5. Add Email Composer Page
Form with:
- Company selector
- Your name input
- "Draft Email" button → calls `gtm_draft_email`

Display:
- Editable email textarea
- "Copy Email" button
- "Open in Gmail" button (mailto: link)

## Integration Example

Update your MCP client wrapper to use these tools:

```typescript
// lib/mcp.ts or similar
export async function getCompanies() {
  return await mcpCall('gtm_list_companies', {});
}

export async function searchCompanies(query: string) {
  return await mcpCall('gtm_search_companies', { query });
}

export async function getCompany(name: string) {
  return await mcpCall('gtm_get_company', { name });
}

export async function enrichCompany(name: string) {
  return await mcpCall('gtm_enrich_company', { name });
}

export async function generateStrategy(params: {
  companyName: string;
  yourCompany: string;
  yourProduct: string;
  targetPersonas?: string;
  targetIndustries?: string;
}) {
  return await mcpCall('gtm_generate_strategy', {
    company_name: params.companyName,
    your_company: params.yourCompany,
    your_product: params.yourProduct,
    target_personas: params.targetPersonas,
    target_industries: params.targetIndustries
  });
}

export async function draftEmail(companyName: string, fromName: string) {
  return await mcpCall('gtm_draft_email', {
    company_name: companyName,
    from_name: fromName
  });
}
```

## Backend Documentation

Reference these files for more details:

- **`PROJECT_STRUCTURE.md`** - Complete repo structure
- **`WORKFLOW.md`** - End-to-end workflow
- **`LOVABLE_PROMPT.md`** - Original build prompt with UI specs
- **`unified-mcp-server/README.md`** - MCP server docs
- **`chrome-extension/README-MCP-INTEGRATION.md`** - Extension integration

## Data Flow

```
User Action (Frontend)
    ↓
MCP Tool Call (your code)
    ↓
Unified MCP Server (Railway)
    ↓
Turso Database (SQLite)
    ↓
Return Results
    ↓
Display in UI
```

## Next Steps

1. ✅ Verify MCP connection (should show 19 tools)
2. 🎨 Update existing pages to use `gtm_list_companies`
3. 🏗️ Build Companies page with search and enrichment
4. 🎯 Build Strategy Generator page
5. 📧 Build Email Composer page
6. 🧪 Test all MCP integrations
7. 🎨 Polish UI with loading states and error handling

## Testing MCP Tools

You can test the tools directly:

```typescript
// Quick test in console or component
const companies = await mcpCall('gtm_list_companies', {});
console.log(companies); // Should return list of companies

const search = await mcpCall('gtm_search_companies', { query: 'health' });
console.log(search); // Companies matching "health"
```

## Questions?

Check the docs above or ask me to clarify any tool usage!

---

**TL;DR:** You now have 19 MCP tools available. Use `gtm_*` tools to build company management, enrichment, strategy generation, and email drafting features in the frontend.
