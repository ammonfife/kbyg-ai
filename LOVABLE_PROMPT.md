# GTM Intelligence Platform - Frontend Build Prompt

**For Lovable.dev AI Agent**

---

## Step 1: Connect to MCP Server

Before building the frontend, add the MCP server:

1. **Go to Settings → MCP Servers** (or click "Add MCP server")
2. **Add this server:**
   - **Server name:** `GTM Unified MCP`
   - **Server URL:** `https://unified-mcp-server-production.up.railway.app/sse`
   - **Authentication:** None (leave blank)
3. **Save** and verify connection shows 19 tools available

---

## Step 2: Build the Frontend

Create a modern GTM Intelligence Platform with the following features:

### 🎯 Application Overview

**Name:** GTM Intelligence Hub  
**Purpose:** Conference intelligence, company enrichment, and GTM strategy generation  
**Tech Stack:** React + TypeScript + Tailwind CSS + Shadcn UI

---

### 📱 Page Structure

#### 1. **Dashboard (Home)**
- Overview cards showing:
  - Total companies in database
  - Companies analyzed today
  - Pending enrichments
  - Recent strategies generated
- Quick actions:
  - "Analyze New Event"
  - "View Companies"
  - "Generate Strategy"
- Recent activity feed

#### 2. **Companies Page**
- **List View:**
  - Search bar (uses `gtm_search_companies` MCP tool)
  - Filter by industry, enrichment status, date added
  - Table showing:
    - Company name
    - # of employees
    - Industry
    - Last enriched date
    - Enrichment status badge
  - Actions per row:
    - "View Details"
    - "Enrich" button
    - "Generate Strategy"
    - "Draft Email"

- **Company Detail Modal:**
  - Company info (from `gtm_get_company`)
  - List of employees with titles/LinkedIn
  - Enriched data:
    - Description
    - Industry
    - Recent activity
  - Action buttons:
    - "Re-enrich" (calls `gtm_enrich_company`)
    - "Generate Strategy" (calls `gtm_generate_strategy`)
    - "Draft Email" (calls `gtm_draft_email`)
    - "Delete Company"

#### 3. **Strategy Generator Page**
- **Form:**
  - Company selector (autocomplete from `gtm_list_companies`)
  - Your company name (text input)
  - Your product/service (textarea)
  - Target personas (text input)
  - Target industries (text input)
  - "Generate Strategy" button

- **Results Display:**
  - Show generated strategy from `gtm_generate_strategy`
  - Formatted with sections:
    - Value Alignment
    - Key Topics
    - Tone & Voice
    - Product Positioning
    - Talking Points
    - Opening Line
    - What to Avoid
  - "Copy to Clipboard" button
  - "Save as PDF" button

#### 4. **Email Composer Page**
- **Form:**
  - Company selector
  - Your name (text input)
  - "Draft Email" button

- **Results:**
  - Show drafted email from `gtm_draft_email`
  - Editable textarea
  - Subject line shown
  - "Copy Email" button
  - "Send via Gmail" button (opens mailto:)
  - "Save Draft" button

#### 5. **Import Page** (Chrome Extension Integration)
- Instructions for installing Chrome extension
- "Sync from Extension" button
- Show recently imported companies
- Badge showing "X new companies imported today"

---

### 🎨 Design Requirements

**Style Guide:**
- Modern, clean interface
- Primary color: Blue (#3B82F6)
- Accent color: Green (#10B981)
- Dark mode support
- Responsive (mobile-friendly)

**Components to use (Shadcn UI):**
- `Button` - All actions
- `Card` - Dashboard widgets, company cards
- `Table` - Company lists
- `Dialog` - Company details, modals
- `Form` - Strategy generator, email composer
- `Input` - All text fields
- `Select` - Dropdowns for company selection
- `Badge` - Status indicators (enriched/pending)
- `Textarea` - Multi-line inputs
- `Tabs` - Switching between views
- `Toast` - Success/error notifications
- `Skeleton` - Loading states

**Icons:**
- Use Lucide React icons
- `Building2` for companies
- `Users` for employees
- `Sparkles` for AI enrichment
- `Mail` for emails
- `Target` for strategies
- `Search` for search
- `Plus` for add actions

---

### 🔧 MCP Tool Integration

**Use these MCP tools via function calls:**

```typescript
// List all companies
const companies = await mcpCall('gtm_list_companies', {});

// Search companies
const results = await mcpCall('gtm_search_companies', { 
  query: searchTerm 
});

// Get company details
const company = await mcpCall('gtm_get_company', { 
  name: companyName 
});

// Enrich company
const enriched = await mcpCall('gtm_enrich_company', { 
  name: companyName 
});

// Generate strategy
const strategy = await mcpCall('gtm_generate_strategy', {
  company_name: companyName,
  your_company: yourCompany,
  your_product: yourProduct,
  target_personas: personas,
  target_industries: industries
});

// Draft email
const email = await mcpCall('gtm_draft_email', {
  company_name: companyName,
  from_name: fromName
});

// Delete company
await mcpCall('gtm_delete_company', { 
  name: companyName 
});
```

---

### 🚀 User Flows

**Flow 1: View and Enrich Company**
1. User clicks "Companies" in nav
2. See list of companies (call `gtm_list_companies`)
3. User searches "healthcare" (call `gtm_search_companies`)
4. User clicks on "NextTherapist"
5. Modal opens showing company details (call `gtm_get_company`)
6. User clicks "Enrich"
7. Loading spinner appears
8. Call `gtm_enrich_company`
9. Modal updates with enriched data
10. Toast: "Company enriched successfully!"

**Flow 2: Generate GTM Strategy**
1. User clicks "Strategy Generator" in nav
2. Form appears
3. User selects company from dropdown
4. User fills in their company/product info
5. User clicks "Generate Strategy"
6. Loading state (show skeleton)
7. Call `gtm_generate_strategy`
8. Results appear in formatted sections
9. User clicks "Copy to Clipboard"
10. Toast: "Strategy copied!"

**Flow 3: Draft Email**
1. User clicks "Email Composer" in nav
2. Form appears
3. User selects company
4. User enters their name
5. User clicks "Draft Email"
6. Loading state
7. Call `gtm_draft_email`
8. Email appears in editable textarea
9. User clicks "Copy Email"
10. Toast: "Email copied to clipboard!"

---

### 📊 Data Display Examples

**Company Card:**
```
┌─────────────────────────────────────┐
│ 🏢 NextTherapist                    │
│ Healthcare Technology               │
│ ────────────────────────────────    │
│ 👥 2 employees                      │
│ ✨ Enriched: 2 hours ago            │
│ 📅 Added: Feb 2, 2026               │
│ ────────────────────────────────    │
│ [View Details] [Enrich] [Strategy]  │
└─────────────────────────────────────┘
```

**Strategy Output:**
```
# GTM Strategy for NextTherapist

## Value Alignment
Your decision intelligence platform can help NextTherapist...

## Key Topics
- Clinical workflow optimization
- Patient outcome analytics
...

[Copy to Clipboard] [Save as PDF]
```

---

### 🎯 Key Features to Implement

**Must Have:**
- ✅ List companies with search/filter
- ✅ View company details
- ✅ Enrich companies with AI
- ✅ Generate GTM strategies
- ✅ Draft personalized emails
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications

**Nice to Have:**
- 📊 Dashboard with analytics
- 📥 Export to CSV
- 🔄 Bulk operations (enrich multiple companies)
- 📱 Mobile-optimized views
- 🌙 Dark mode toggle
- 📧 Email preview before copy
- 💾 Save strategies locally
- 🔍 Advanced search filters

---

### 🚨 Error Handling

**Handle these scenarios:**

1. **MCP Server Unavailable**
   - Show error toast: "Unable to connect to server"
   - Disable action buttons
   - Show "Retry" button

2. **Company Not Found**
   - Show error: "Company '{name}' not found"
   - Suggest similar companies

3. **Enrichment Failed**
   - Toast: "Enrichment failed. Try again."
   - Keep existing data visible

4. **Network Timeout**
   - Show loading state for max 30 seconds
   - Then show timeout error with retry option

---

### 📝 Code Structure

```
src/
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── CompanyCard.tsx
│   ├── CompanyTable.tsx
│   ├── CompanyDetail.tsx
│   ├── StrategyForm.tsx
│   ├── StrategyDisplay.tsx
│   ├── EmailComposer.tsx
│   └── Dashboard.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── CompaniesPage.tsx
│   ├── StrategyPage.tsx
│   ├── EmailPage.tsx
│   └── ImportPage.tsx
├── lib/
│   ├── mcp.ts          # MCP client wrapper
│   └── utils.ts
└── App.tsx
```

---

### 🎬 Start Building!

**Instructions for Lovable.dev:**

1. ✅ **First, verify MCP connection** (check you see 19 tools)
2. 🎨 **Create the layout** with navigation sidebar
3. 📊 **Build Dashboard page** with overview cards
4. 🏢 **Build Companies page** with table and search
5. ✨ **Add enrichment functionality** using MCP tools
6. 🎯 **Build Strategy Generator page**
7. 📧 **Build Email Composer page**
8. 🎨 **Polish the UI** with animations and loading states
9. 🧪 **Test all MCP tool integrations**
10. 🚀 **Deploy and share!**

---

### ✨ Example Starting Code

**MCP Client Wrapper (lib/mcp.ts):**
```typescript
// Lovable.dev will handle MCP calls automatically
// You can use them directly in components:

async function listCompanies() {
  return await mcpCall('gtm_list_companies', {});
}

async function enrichCompany(name: string) {
  return await mcpCall('gtm_enrich_company', { name });
}
```

**Company Card Component:**
```tsx
function CompanyCard({ company }) {
  const [enriching, setEnriching] = useState(false);
  
  const handleEnrich = async () => {
    setEnriching(true);
    try {
      await mcpCall('gtm_enrich_company', { name: company.name });
      toast.success('Company enriched!');
    } catch (error) {
      toast.error('Enrichment failed');
    } finally {
      setEnriching(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{company.name}</CardTitle>
        <Badge>{company.industry}</Badge>
      </CardHeader>
      <CardContent>
        <p>{company.employees.length} employees</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleEnrich} disabled={enriching}>
          {enriching ? 'Enriching...' : 'Enrich'}
        </Button>
      </CardFooter>
    </Card>
  );
}
```

---

## 🎯 Success Criteria

**You've succeeded when:**
- ✅ User can see list of companies
- ✅ User can search companies
- ✅ User can view company details
- ✅ User can enrich companies with one click
- ✅ User can generate GTM strategies
- ✅ User can draft emails
- ✅ All MCP tools are integrated
- ✅ UI is clean and responsive
- ✅ Loading states work properly
- ✅ Errors are handled gracefully

---

**GO BUILD! 🚀**
