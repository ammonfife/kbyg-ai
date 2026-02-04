# Extension ↔ API Integration Summary

## ✅ Completed Tasks

### 1. **Migrated Chrome Extension**
- Copied full extension from `kbyg-ai` repo
- Location: `easy-event-planner/chrome-extension/`
- All files preserved (manifest, sidepanel, background, content scripts)

### 2. **Upgraded API Client (Dual-Mode)**
- **File:** `chrome-extension/mcp-integration.js`
- **Features:**
  - Auto-detects best available endpoint
  - Supports Railway MCP server (primary)
  - Falls back to Supabase proxy (web app API)
  - Falls back to localhost (development)
  - No manual configuration needed

### 3. **API Compatibility**
- Extension calls same tools as web app:
  - `gtm_add_company`
  - `gtm_list_companies`
  - `gtm_get_company`
  - `gtm_search_companies`
  - `gtm_enrich_company`
  - `gtm_generate_strategy`
  - `gtm_draft_email`
- Both write to **same Turso database**
- Seamless data sync between platforms

### 4. **Documentation Created**

#### In `easy-event-planner` repo:
- **`chrome-extension/README.md`**
  - Installation instructions
  - Usage guide
  - Development setup
  - Troubleshooting

- **`CHROME_EXTENSION_INTEGRATION.md`**
  - Technical integration details
  - Data flow diagrams
  - Testing procedures
  - Deployment guide

#### In `kbyg-ai` repo:
- **`EXTENSION_API_GUIDE.md`**
  - Complete API reference
  - All tools documented with examples
  - Dual-mode configuration
  - Authentication guide
  - Error handling patterns

## 🔄 Data Flow

```
Conference Website
        ↓
Chrome Extension (Gemini AI)
        ↓
   [Auto-detect]
        ↓
┌───────┴───────┐
│ Railway MCP   │ (Priority 1)
│      OR       │
│ Localhost MCP │ (Priority 2)
│      OR       │
│ Supabase Edge │ (Priority 3)
└───────┬───────┘
        ↓
  Turso Database ← Shared!
        ↓
   Web Dashboard
```

## 🎯 Integration Points

### Extension → Web App
1. Extension captures companies at conference
2. Saves via MCP server to Turso
3. User opens web dashboard
4. **Companies appear automatically**

### Web App → Extension
1. User adds/edits company in dashboard
2. Saves to Turso
3. User opens extension
4. **Can query/enrich that company**

## 🚀 API Endpoints

### Railway MCP Server (Primary)
```
https://unified-mcp-server-production.up.railway.app
```

**Endpoints:**
- `GET /health` - Health check
- `POST /tools/call` - Call MCP tool

### Supabase Proxy (Fallback)
```
https://etscbyzexyptgnppwyzv.supabase.co/functions/v1/mcp-proxy
```

**Endpoint:**
- `POST /functions/v1/mcp-proxy` - Proxy to MCP server

### Localhost (Development)
```
http://localhost:3000
```

## 🧪 Testing

### Test Extension → Web App Sync

**Terminal 1:**
```bash
cd easy-event-planner/chrome-extension
# Load extension in Chrome (Load unpacked)
```

**Terminal 2:**
```bash
cd easy-event-planner
npm run dev
# Open http://localhost:8080
```

**Steps:**
1. Open extension side panel
2. Analyze test page (any conference site)
3. Verify companies saved (check console)
4. Refresh web dashboard `/companies`
5. **Verify captured companies appear**

### Test API Modes

**Railway Mode:**
```bash
# Extension console should show:
✅ MCP: Using direct Railway server
```

**Supabase Mode:**
```bash
# Stop Railway server, extension should show:
✅ MCP: Using Supabase Edge Function proxy
```

**Localhost Mode:**
```bash
cd easy-event-planner/unified-mcp-server
npm start
# Extension should detect localhost:3000
```

## 📊 Database Schema

**Shared Tables:**
- `companies` - Company profiles
- `employees` - Contacts/attendees
- `strategies` - GTM strategies (future)
- `drafted_emails` - Email drafts (future)

**Location:** Turso @ `libsql://gtmapp-gtmapp.aws-us-west-2.turso.io`

## 🔐 Authentication

### Current (Phase 1)
- **Extension:** Anonymous (no login required)
- **Web App:** Supabase Auth (email/password)
- **Data:** Shared via public endpoint

### Future (Phase 2)
- **Extension:** Optional login via Supabase Auth
- **Web App:** Same auth system
- **Data:** User-specific organizations
- **Benefit:** Private data scoped to user's organization

## 📁 File Structure

```
easy-event-planner/
├── chrome-extension/              # 🆕 Chrome extension
│   ├── manifest.json
│   ├── mcp-integration.js         # 🔄 Upgraded (dual-mode)
│   ├── sidepanel.js
│   ├── sidepanel.html
│   ├── background.js
│   ├── content.js
│   └── README.md                  # 🆕 Extension docs
├── unified-mcp-server/            # MCP server (Railway)
├── supabase/functions/mcp-proxy/  # Supabase Edge Function
├── src/                           # Web app (React)
├── CHROME_EXTENSION_INTEGRATION.md # 🆕 Integration guide
└── INTEGRATION_SUMMARY.md         # 🆕 This file
```

## 🎬 Demo Flow (Utah Tech Week)

**Setup:**
1. Show web dashboard with 0 companies
2. Open Chrome extension side panel

**Live Demo:**
1. Visit Utah Tech Week website
2. Click "Analyze Event"
3. Show extracted companies/speakers
4. Click "Save to GTM Hub"
5. Refresh web dashboard
6. **Companies appear instantly!**

**Show Strategy:**
1. Click on company in dashboard
2. Generate GTM strategy
3. Show personalized talking points
4. Draft cold email

## 🐛 Known Issues & Fixes

### Issue: Extension can't connect
**Fix:** Extension auto-falls back to Supabase proxy

### Issue: Duplicate companies
**Fix:** Database has UNIQUE constraint on company name

### Issue: Data not syncing
**Fix:** Both platforms use same Turso database - should sync instantly

## 📞 Support Resources

**Extension Help:**
- `chrome-extension/README.md` - Setup guide
- GitHub Issues: https://github.com/altonalexander/easy-event-planner/issues

**API Reference:**
- `kbyg-ai/EXTENSION_API_GUIDE.md` - Complete API docs
- Railway Server: https://unified-mcp-server-production.up.railway.app/health

**Web App Help:**
- `AUTH_SETUP.md` - Authentication
- `MULTI_TENANT_IMPLEMENTATION.md` - Database schema

## 🎯 Next Steps

### Before Demo:
- [ ] Test extension on Utah Tech Week site
- [ ] Verify data syncs to web dashboard
- [ ] Test all API endpoints
- [ ] Prepare demo script

### Post-Demo:
- [ ] Publish to Chrome Web Store
- [ ] Add extension login (Supabase Auth)
- [ ] Enable user-specific organizations
- [ ] Real-time sync (WebSockets)

---

**Status:** ✅ Extension fully integrated with web app

**Last Updated:** 2026-02-02

**Commits:**
- `2366580` - Extension + dual-mode API
- `f57d996` - API guide (kbyg-ai repo)
