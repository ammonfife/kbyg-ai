# GTM Enrichment MCP Server

Model Context Protocol (MCP) server for GTM company enrichment with Turso database persistence and AI-powered insights.

## Features

- 📊 **Turso Database** - Durable storage for company profiles
- 🤖 **AI Enrichment** - Automatic company insights via Gemini
- 📧 **Email Drafting** - Personalized outreach emails
- 🎯 **GTM Strategies** - Custom communication strategies per company
- 🔍 **Search** - Fuzzy search across companies and employees

## Installation

```bash
npm install
npm run build
```

## Configuration

Create a `.env` file:

```bash
TURSO_DATABASE_URL=libsql://gtmapp-gtmapp.aws-us-west-2.turso.io
TURSO_AUTH_TOKEN=your_token_here
GEMINI_API_KEY=your_gemini_key_here
```

## Usage

### As MCP Server

Add to your MCP client config (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "gtm-enrichment": {
      "command": "node",
      "args": ["/path/to/gtm-hackathon/mcp-server/dist/index.js"],
      "env": {
        "TURSO_DATABASE_URL": "libsql://gtmapp-gtmapp.aws-us-west-2.turso.io",
        "TURSO_AUTH_TOKEN": "your_token_here",
        "GEMINI_API_KEY": "your_gemini_key_here"
      }
    }
  }
}
```

Restart your MCP client and the tools will be available.

### Direct Testing

```bash
# Start server (stdio mode)
npm start

# Or with env vars
TURSO_DATABASE_URL="..." TURSO_AUTH_TOKEN="..." GEMINI_API_KEY="..." npm start
```

## Available Tools

### `add_company`
Add a new company profile.

**Input:**
- `name` (string, required) - Company name
- `employees` (array, required) - List of { name, title, linkedin? }
- `description` (string, optional) - Company description
- `industry` (string, optional) - Industry vertical
- `context` (string, optional) - Additional context (e.g., event attended)

**Example:**
```json
{
  "name": "NextTherapist",
  "employees": [
    { "name": "John Doe", "title": "CEO", "linkedin": "linkedin.com/in/johndoe" }
  ],
  "context": "Met at Utah Healthcare AI Conference"
}
```

### `get_company`
Retrieve a company profile by name.

**Input:**
- `name` (string, required) - Company name

### `list_companies`
List all companies in the database.

### `search_companies`
Search companies by name, description, industry, or employee name.

**Input:**
- `query` (string, required) - Search term

### `enrich_company`
Enrich a company profile with AI-generated insights.

**Input:**
- `name` (string, required) - Company name

### `generate_strategy`
Generate a personalized GTM communication strategy.

**Input:**
- `company_name` (string, required) - Target company
- `your_company` (string, optional) - Your company name
- `your_product` (string, optional) - Your product/service
- `target_personas` (string, optional) - Target roles
- `target_industries` (string, optional) - Target industries

**Example:**
```json
{
  "company_name": "NextTherapist",
  "your_company": "Veydra",
  "your_product": "Decision intelligence SaaS platform"
}
```

### `draft_email`
Draft a personalized cold outreach email.

**Input:**
- `company_name` (string, required) - Target company
- `from_name` (string, required) - Your name

### `delete_company`
Delete a company from the database.

**Input:**
- `name` (string, required) - Company name

## Database Schema

### `companies` table
- `id` - Primary key
- `name` - Company name (unique)
- `description` - Company description
- `industry` - Industry vertical
- `context` - Additional context
- `recent_activity` - Recent news/activity
- `enriched_at` - Last enrichment timestamp
- `created_at` - Created timestamp
- `updated_at` - Updated timestamp

### `employees` table
- `id` - Primary key
- `company_id` - Foreign key to companies
- `name` - Employee name
- `title` - Job title
- `linkedin` - LinkedIn URL
- `created_at` - Created timestamp

## Architecture

```
┌─────────────────┐
│  MCP Client     │  (Claude Desktop, etc.)
│  (stdio)        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  MCP Server     │
│  (Node.js)      │
│                 │
│  ├─ db.ts       │  Database layer
│  ├─ enrichment  │  AI enrichment
│  └─ index.ts    │  MCP handlers
└────────┬────────┘
         │
         ├──────────────┐
         ▼              ▼
┌──────────────┐  ┌──────────────┐
│ Turso DB     │  │ Gemini API   │
│ (SQLite)     │  │ (AI)         │
└──────────────┘  └──────────────┘
```

## Development

```bash
# Watch mode
npm run dev

# Build
npm run build

# Start
npm start
```

## Integration with Chrome Extension

The MCP server provides durable storage and AI enrichment for the Conference Intel Chrome extension. When the extension captures company profiles from conference sites, it can:

1. Store profiles via `add_company`
2. Enrich profiles via `enrich_company`
3. Generate outreach strategies via `generate_strategy`
4. Draft emails via `draft_email`

This enables offline-first data collection (extension) with cloud-synced AI-powered enrichment (MCP server + Turso).

## License

MIT
