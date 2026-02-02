# Unified MCP Server

**All-in-one MCP server combining GTM Enrichment and Lovable.dev Control.**

## 🎯 What This Is

A single MCP server that provides **19 tools** across two domains:

### 📊 GTM Enrichment (8 tools)
- Company profile management (add, get, list, search, delete)
- AI-powered enrichment (Gemini API)
- GTM strategy generation
- Personalized email drafting

### 🚀 Lovable.dev Control (11 tools)
- Project management (create, list, status, delete)
- AI communication (send commands, chat with agent)
- Code generation and editing
- Build and deployment management

## ⚡ Quick Start

```bash
cd unified-mcp-server
npm install
npm run build

# Start stdio server (local clients)
npm start

# Start HTTP server (remote clients)
npm run start:http
```

## 🔧 Configuration

Create `.env` file:

```bash
# GTM Enrichment
TURSO_DATABASE_URL=libsql://gtmapp-gtmapp.aws-us-west-2.turso.io
TURSO_AUTH_TOKEN=your_turso_token
GEMINI_API_KEY=your_gemini_key

# Lovable.dev Control
LOVABLE_API_KEY=your_lovable_key
LOVABLE_API_URL=https://api.lovable.dev/v1

# HTTP Server (optional)
PORT=3000
MCP_BEARER_TOKEN=optional_auth_token
```

## 🎮 Usage

### Local (Stdio) - Claude Desktop, Moltbot

Add to MCP client config:

```json
{
  "mcpServers": {
    "unified": {
      "command": "node",
      "args": ["/Users/benfife/clawd/unified-mcp-server/dist/index.js"],
      "env": {
        "TURSO_DATABASE_URL": "libsql://...",
        "TURSO_AUTH_TOKEN": "...",
        "GEMINI_API_KEY": "...",
        "LOVABLE_API_KEY": "..."
      }
    }
  }
}
```

### Remote (HTTP/SSE) - Lovable.dev

```bash
npm run start:http

# Or deploy and use public URL
# https://your-domain.com/sse
```

## 📚 Available Tools

### GTM Enrichment Tools

| Tool | Description |
|------|-------------|
| `gtm_add_company` | Add company profile to database |
| `gtm_get_company` | Retrieve company by name |
| `gtm_list_companies` | List all companies |
| `gtm_search_companies` | Search companies (fuzzy) |
| `gtm_enrich_company` | AI-enrich profile (Gemini) |
| `gtm_generate_strategy` | Generate GTM strategy |
| `gtm_draft_email` | Draft outreach email |
| `gtm_delete_company` | Delete company |

### Lovable.dev Control Tools

| Tool | Description |
|------|-------------|
| `lovable_create_project` | Create new project |
| `lovable_list_projects` | List all projects |
| `lovable_get_project_status` | Get project status |
| `lovable_delete_project` | Delete project |
| `lovable_send_command` | Send command to AI |
| `lovable_chat_with_agent` | Chat with AI agent |
| `lovable_generate_code` | Generate code via AI |
| `lovable_deploy_project` | Deploy project |
| `lovable_get_build_status` | Check build status |
| `lovable_edit_file` | Edit project file |
| `lovable_read_file` | Read project file |

## 📖 Examples

### GTM Workflow

```javascript
// 1. Add company from conference
{
  "name": "gtm_add_company",
  "arguments": {
    "name": "NextTherapist",
    "employees": [
      { "name": "Dr. Sarah Chen", "title": "CEO" }
    ],
    "context": "Met at Utah Healthcare AI Conference"
  }
}

// 2. Enrich with AI
{
  "name": "gtm_enrich_company",
  "arguments": { "name": "NextTherapist" }
}

// 3. Generate strategy
{
  "name": "gtm_generate_strategy",
  "arguments": {
    "company_name": "NextTherapist",
    "your_company": "Veydra",
    "your_product": "Decision intelligence SaaS"
  }
}

// 4. Draft email
{
  "name": "gtm_draft_email",
  "arguments": {
    "company_name": "NextTherapist",
    "from_name": "Ben"
  }
}
```

### Lovable.dev Workflow

```javascript
// 1. Create project
{
  "name": "lovable_create_project",
  "arguments": {
    "name": "My App",
    "template": "react"
  }
}

// 2. Generate code
{
  "name": "lovable_generate_code",
  "arguments": {
    "projectId": "proj_123",
    "prompt": "Create a hero section with gradient background"
  }
}

// 3. Deploy
{
  "name": "lovable_deploy_project",
  "arguments": {
    "projectId": "proj_123",
    "environment": "production"
  }
}
```

## 🏗️ Architecture

```
┌─────────────────────────────────┐
│      MCP Client                 │
│  (Claude Desktop, Lovable, etc) │
└──────────────┬──────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│    Unified MCP Server            │
│  ┌────────────────────────────┐  │
│  │  Tool Router               │  │
│  │  - GTM tools → GTM handler │  │
│  │  - Lovable → Lovable client│  │
│  └────────────────────────────┘  │
│                                  │
│  ┌───────────┐   ┌────────────┐ │
│  │ GTM Layer │   │ Lovable    │ │
│  │ - DB      │   │ Client     │ │
│  │ - Enrich  │   │            │ │
│  └─────┬─────┘   └─────┬──────┘ │
└────────┼───────────────┼─────────┘
         │               │
    ┌────┴────┐     ┌───┴────┐
    │  Turso  │     │ Lovable│
    │ Gemini  │     │  API   │
    └─────────┘     └────────┘
```

## 🚀 Deployment

### Railway

```bash
railway init
railway up
railway variables set TURSO_DATABASE_URL=...
railway variables set TURSO_AUTH_TOKEN=...
railway variables set GEMINI_API_KEY=...
railway variables set LOVABLE_API_KEY=...
```

### Fly.io

```bash
fly launch
fly deploy
fly secrets set TURSO_DATABASE_URL=...
fly secrets set TURSO_AUTH_TOKEN=...
fly secrets set GEMINI_API_KEY=...
fly secrets set LOVABLE_API_KEY=...
```

## 📂 Project Structure

```
unified-mcp-server/
├── src/
│   ├── index.ts           # Stdio transport (local)
│   ├── http-server.ts     # HTTP/SSE transport (remote)
│   ├── tools.ts           # Tool definitions (GTM + Lovable)
│   ├── tool-handler.ts    # Unified tool routing
│   ├── gtm-db.ts          # GTM database layer
│   ├── gtm-enrichment.ts  # GTM AI enrichment
│   └── lovable-client.ts  # Lovable API client
├── dist/                  # Compiled output
├── .env                   # Environment config
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Security

For production:
- Use HTTPS (required for Lovable.dev)
- Set `MCP_BEARER_TOKEN` for authentication
- Never commit `.env` file
- Rotate API keys regularly

## 🛠️ Development

```bash
# Watch mode (auto-rebuild)
npm run dev

# Build
npm run build

# Test stdio
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | npm start

# Test HTTP
curl http://localhost:3000/health
```

## 🤝 Credits

Combines functionality from:
- **GTM Enrichment MCP** - Company intelligence (BIGMAC)
- **Lovable MCP** - Lovable.dev control (VanDam)

---

**Built by Big Mac** 🍔  
**Version:** 1.0.0  
**License:** MIT
