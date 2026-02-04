# Easy Event Planner - Project Structure

## Overview

This repository combines a **React frontend** (built with Lovable.dev) with **backend MCP servers** for GTM intelligence and Chrome extension integration.

## Directory Structure

```
easy-event-planner/
├── src/                      # Frontend (Lovable.dev - React + Vite + Shadcn)
│   ├── components/           # UI components
│   ├── pages/               # Page components
│   └── lib/                 # Utilities, MCP client
│
├── mcp-server/              # GTM Enrichment MCP Server (8 tools)
│   ├── src/
│   │   ├── db.ts            # Turso database layer
│   │   ├── enrichment.ts    # Gemini AI enrichment
│   │   └── index.ts         # Stdio transport
│   ├── package.json
│   └── README.md
│
├── unified-mcp-server/      # Unified MCP Server (19 tools: GTM + Lovable)
│   ├── src/
│   │   ├── gtm-db.ts        # GTM database
│   │   ├── gtm-enrichment.ts # GTM AI enrichment
│   │   ├── lovable-client.ts # Lovable.dev API
│   │   ├── http-server.ts   # HTTP/SSE transport
│   │   ├── index.ts         # Stdio transport
│   │   ├── tools.ts         # Tool definitions
│   │   └── tool-handler.ts  # Routing logic
│   ├── package.json
│   └── README.md
│
├── chrome-extension/        # Conference Intel Chrome Extension
│   ├── manifest.json
│   ├── background.js        # Gemini API calls
│   ├── sidepanel.js         # UI logic
│   ├── mcp-integration.js   # MCP server integration
│   └── README-MCP-INTEGRATION.md
│
├── WORKFLOW.md              # End-to-end workflow documentation
├── LOVABLE_PROMPT.md        # Original build prompt for Lovable.dev
└── README.md                # This file
```

## Components

### 1. Frontend (Lovable.dev)
**Location:** `src/`  
**Tech:** React + TypeScript + Vite + Tailwind + Shadcn UI  
**Purpose:** User interface for GTM intelligence platform  
**Features:**
- Company management dashboard
- AI enrichment interface
- GTM strategy generator
- Email composer
- Chrome extension integration

### 2. GTM Enrichment MCP Server
**Location:** `mcp-server/`  
**Tech:** TypeScript + Node.js  
**Purpose:** Company intelligence and enrichment  
**Tools (8):**
- `add_company` - Save company profiles
- `get_company` - Retrieve company data
- `list_companies` - List all companies
- `search_companies` - Search/filter companies
- `enrich_company` - AI-enrich profiles (Gemini)
- `generate_strategy` - Generate GTM strategies
- `draft_email` - Draft outreach emails
- `delete_company` - Remove companies

**Database:** Turso SQLite (cloud-synced)  
**AI:** Gemini 1.5 Pro

### 3. Unified MCP Server
**Location:** `unified-mcp-server/`  
**Tech:** TypeScript + Node.js + Express  
**Purpose:** Combined GTM + Lovable.dev control  
**Deployment:** Railway  
**Live URL:** https://unified-mcp-server-production.up.railway.app

**Tools (19 total):**
- **GTM tools (8):** Same as GTM Enrichment MCP Server
- **Lovable tools (11):** Project management, AI commands, code generation, builds, deploys

**Transports:**
- Stdio (local MCP clients: Claude Desktop, Moltbot)
- HTTP/SSE (remote clients: Lovable.dev, webhooks)

### 4. Chrome Extension
**Location:** `chrome-extension/`  
**Purpose:** Conference intelligence extraction  
**Features:**
- Analyze conference websites
- Extract companies, people, sponsors
- Generate ice breakers and conversation starters
- Auto-save to Turso via MCP server
- Export to CSV

**Integration:** Sends data to unified MCP server for persistent storage

## Data Flow

```
┌────────────────────────────────────────────────────────┐
│           1. CHROME EXTENSION                          │
│   User analyzes conference website                    │
│   → Extracts companies and people via Gemini          │
└──────────────────┬─────────────────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────────────────┐
│        2. AUTO-SAVE TO MCP SERVER                      │
│   mcp-integration.js → unified-mcp-server              │
│   → POST /tools/call (gtm_add_company)                │
└──────────────────┬─────────────────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────────────────┐
│           3. TURSO DATABASE                            │
│   Companies + Employees stored                        │
│   Accessible from anywhere                            │
└──────────────────┬─────────────────────────────────────┘
                   │
                   ├──────────────────┬──────────────────┐
                   ▼                  ▼                  ▼
         ┌──────────────┐   ┌─────────────┐   ┌─────────────┐
         │   Frontend   │   │ Claude      │   │  Moltbot    │
         │  (Lovable)   │   │ Desktop     │   │  (BigMac)   │
         │              │   │             │   │             │
         │  - List      │   │  - Enrich   │   │  - Strategy │
         │  - Enrich    │   │  - Strategy │   │  - Email    │
         │  - Strategy  │   │  - Email    │   │             │
         └──────────────┘   └─────────────┘   └─────────────┘
```

## Environment Variables

### MCP Servers
**Required:**
```bash
TURSO_DATABASE_URL=libsql://gtmapp-gtmapp.aws-us-west-2.turso.io
TURSO_AUTH_TOKEN=<token>
GEMINI_API_KEY=<api_key>
```

**Optional (unified-mcp-server):**
```bash
PORT=3000
LOVABLE_API_KEY=<optional>
MCP_BEARER_TOKEN=<optional>
```

### Chrome Extension
Stored in `chrome.storage.local`:
- User profile (company, product, etc.)
- Gemini API key (encrypted by Chrome)

### Frontend
**.env:**
```bash
VITE_MCP_SERVER_URL=https://unified-mcp-server-production.up.railway.app
```

## Deployment

### Frontend (Lovable.dev)
- Auto-deploys from this repo
- Live URL: TBD (provided by Lovable)

### Unified MCP Server (Railway)
```bash
cd unified-mcp-server
railway up
railway variables set TURSO_DATABASE_URL="..."
railway variables set TURSO_AUTH_TOKEN="..."
railway variables set GEMINI_API_KEY="..."
```

**Live:** https://unified-mcp-server-production.up.railway.app

### Chrome Extension
- Load unpacked in Chrome
- Or publish to Chrome Web Store

## Development

### Frontend
```bash
npm install
npm run dev
```

### MCP Servers
```bash
# GTM MCP Server (stdio)
cd mcp-server
npm install && npm run build
npm start

# Unified MCP Server (HTTP)
cd unified-mcp-server
npm install && npm run build
npm start  # HTTP mode on port 3000
```

### Chrome Extension
1. Open Chrome → Extensions
2. Enable Developer Mode
3. Load unpacked → select `chrome-extension/` folder
4. Click extension icon to open sidepanel

## GitHub Secrets

Configured in repository settings:
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `GEMINI_API_KEY`

Used by GitHub Actions for CI/CD.

## Documentation

- **WORKFLOW.md** - Complete end-to-end workflow
- **LOVABLE_PROMPT.md** - Original build prompt for frontend
- **mcp-server/README.md** - GTM MCP Server docs
- **unified-mcp-server/README.md** - Unified MCP Server docs
- **chrome-extension/README-MCP-INTEGRATION.md** - Extension integration docs

## Repository

**GitHub:** https://github.com/altonalexander/easy-event-planner  
**Private:** Yes  
**Owner:** altonalexander

---

**Last Updated:** 2026-02-02  
**Version:** 1.0.0
