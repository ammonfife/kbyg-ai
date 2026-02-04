# Chrome Extension ↔ Web App Integration

## 🔗 Overview

The GTM Intelligence Hub consists of:
1. **Web App** (React + Supabase) - `easy-event-planner/`
2. **Chrome Extension** (Vanilla JS) - `chrome-extension/`
3. **MCP Server** (Node.js + Turso) - `unified-mcp-server/`

All three share the **same Turso database** for seamless data sync.

## 🎯 Use Cases

### Extension → Web App
**User captures leads at conference:**
1. Extension analyzes event page
2. Saves companies to Turso via MCP server
3. User opens web dashboard
4. **Sees all captured companies automatically**

### Web App → Extension
**User enriches data in dashboard:**
1. User adds/edits company in web app
2. Saves to Turso database
3. User opens extension
4. **Can generate strategies/emails for that company**

## 🔄 Data Flow

```
┌─────────────────────┐
│  Chrome Extension   │
│  (Conference Intel) │
└──────────┬──────────┘
           │
           ├─→ Gemini API (analysis)
           │
           ├─→ Railway MCP Server
           │   OR
           └─→ Supabase Edge Function
                    ↓
            ┌───────────────┐
            │  MCP Server   │
            │  (Railway)    │
            └───────┬───────┘
                    ↓
            ┌───────────────┐
            │ Turso Database│ ← Shared!
            │   (SQLite)    │
            └───────┬───────┘
                    ↓
            ┌───────────────┐
            │   Web App     │
            │  (Dashboard)  │
            └───────────────┘
```

## 🛠️ Technical Integration

### Shared Database Schema

**Tables:**
- `companies` - Company profiles (both extension + web)
- `employees` - Contacts/attendees
- `strategies` - Generated GTM strategies (future)
- `drafted_emails` - Email drafts (future)

**Multi-Tenancy:**
- Extension: Uses anonymous/public organization (for now)
- Web App: User-specific organizations
- Future: Extension login to sync with user's org

### API Compatibility

**Extension calls MCP tools:**
```javascript
// Extension (mcp-integration.js)
const result = await callMCPTool('gtm_add_company', {
  name: "TechCorp",
  employees: [{ name: "John", title: "CEO" }]
});
```

**Web App calls same tools via Supabase proxy:**
```typescript
// Web App (src/lib/mcp.ts)
const result = await callMCP('gtm_add_company', {
  name: "TechCorp",
  employees: [{ name: "John", title: "CEO" }]
});
```

**Both write to same Turso database!**

### Dual-Mode API (Extension)

Extension auto-detects best endpoint:

1. **Direct Mode** (Railway):
   - URL: `https://unified-mcp-server-production.up.railway.app`
   - Best for: Development, testing
   - No auth required

2. **Supabase Mode** (Web App Proxy):
   - URL: `https://etscbyzexyptgnppwyzv.supabase.co/functions/v1/mcp-proxy`
   - Best for: Production, authenticated users
   - Auth: Optional (uses anon key by default)

## 🎨 User Experience

### Scenario 1: Extension-First User

**Day 1 - At Conference:**
1. User installs extension
2. Analyzes Utah Tech Week website
3. Captures 15 companies + contacts

**Day 2 - At Office:**
1. Opens GTM Hub web app
2. Creates account
3. **Sees all 15 companies already there!**
4. Generates strategies, drafts emails

### Scenario 2: Web-First User

**Week 1 - Setup:**
1. User signs up for GTM Hub
2. Manually adds 5 target companies
3. Enriches with AI

**Week 2 - At Event:**
1. Installs extension
2. Analyzes event
3. **Extension enriches new companies**
4. Returns to web dashboard
5. Sees new + old companies together

## 🔐 Authentication Strategy

### Current (Phase 1)
- **Extension:** Anonymous (no login)
- **Web App:** Supabase Auth (email/password)
- **Data:** Shared via public organization

### Future (Phase 2)
- **Extension:** Optional login via Supabase Auth
- **Web App:** Same auth system
- **Data:** User-specific organizations
- **Sync:** Real-time across both platforms

## 🚀 Deployment

### Extension
```bash
cd chrome-extension
# No build step needed (vanilla JS)
# Load unpacked in Chrome → Extensions
```

### Web App
```bash
npm run dev           # Local development
npm run build         # Production build
# Deploy via Lovable.dev
```

### MCP Server
```bash
cd unified-mcp-server
npm run build         # Build TypeScript
npm start             # Start server
# Deployed on Railway
```

## 🧪 Testing Integration

### Test 1: Extension → Web App Sync

1. **Extension:**
   - Analyze test event page
   - Verify companies saved (check console)

2. **Web App:**
   - Refresh `/companies` page
   - Verify captured companies appear

### Test 2: Web App → Extension Query

1. **Web App:**
   - Add test company "Acme Corp"
   - Verify saved

2. **Extension:**
   - Open side panel
   - Search for "Acme"
   - Verify company found

### Test 3: Dual-Mode Switching

1. **Start Railway server:**
   ```bash
   cd unified-mcp-server && npm start
   ```
   - Extension should use Railway

2. **Stop Railway:**
   - Extension should fallback to Supabase

3. **Check console:**
   ```
   ✅ MCP: Using Supabase Edge Function proxy
   ```

## 📊 Monitoring

### Extension Health

Open side panel DevTools:
```javascript
// Check connection
const info = await getConnectionInfo();
console.log(info);
// { mode: 'direct', url: '...', config: {...} }

// Test API
const health = await checkMCPServerHealth();
console.log(health);
// { available: true, mode: 'direct', url: '...' }
```

### Web App Health

Check Network tab:
- Supabase Edge Function calls → `/functions/v1/mcp-proxy`
- Should return `{ success: true, data: {...} }`

### MCP Server Health

Direct check:
```bash
curl https://unified-mcp-server-production.up.railway.app/health
```

Response:
```json
{
  "status": "ok",
  "server": "unified-mcp",
  "version": "1.0.0",
  "tools": 19
}
```

## 🐛 Common Issues

### Companies not syncing

**Cause:** Extension and web app using different databases

**Fix:** Both should point to same Turso instance:
- Extension: `https://unified-mcp-server-production.up.railway.app`
- Web App: Supabase proxy → Railway → Same Turso
- Check `TURSO_DATABASE_URL` matches

### Extension can't connect

**Symptoms:** "MCP server not available" error

**Fix:**
1. Check Railway server: https://unified-mcp-server-production.up.railway.app/health
2. Check CORS headers (already configured)
3. Extension will auto-fallback to Supabase

### Data duplication

**Cause:** Same company added twice with slightly different names

**Fix:** MCP server has `UNIQUE(name)` constraint - should prevent duplicates

## 📚 Documentation

- **Extension Guide:** [EXTENSION_API_GUIDE.md](https://github.com/altonalexander/gtm-hackathon/blob/main/EXTENSION_API_GUIDE.md)
- **Extension README:** [chrome-extension/README.md](chrome-extension/README.md)
- **Auth Setup:** [AUTH_SETUP.md](AUTH_SETUP.md)
- **Multi-Tenant:** [MULTI_TENANT_IMPLEMENTATION.md](MULTI_TENANT_IMPLEMENTATION.md)

## 🎯 Roadmap

### Phase 1 (Current - Utah Tech Week)
- [x] Extension captures data
- [x] Web app displays data
- [x] Shared Turso database
- [x] Dual-mode API support
- [x] Basic auth (web only)

### Phase 2 (Post-Launch)
- [ ] Extension login (Supabase Auth)
- [ ] User-specific organizations
- [ ] Real-time sync (WebSockets)
- [ ] Chrome Web Store publish
- [ ] Mobile companion app

### Phase 3 (Growth)
- [ ] LinkedIn integration (OAuth)
- [ ] Email sending (SendGrid/Resend)
- [ ] CRM sync (Salesforce, HubSpot)
- [ ] Team collaboration features
- [ ] Analytics dashboard

---

**Status:** ✅ Extension and web app fully integrated via shared Turso database

**Last Updated:** 2026-02-02
