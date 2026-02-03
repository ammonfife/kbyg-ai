# Conference Intel Chrome Extension

AI-powered conference event analysis for GTM teams integrated with GTM Intelligence Hub.

## 🎯 Features

- **One-Click Capture:** Extract company and contact data from conference websites
- **AI Analysis:** Gemini-powered event analysis and lead insights
- **Auto-Sync:** Automatically saves to GTM Hub (web dashboard)
- **Dual-Mode API:** Works with both Railway MCP server and Supabase proxy
- **Offline Support:** Local storage backup when offline

## 🚀 Installation

### Method 1: Load Unpacked (Development)

1. Clone this repo:
   ```bash
   git clone https://github.com/altonalexander/easy-event-planner.git
   cd easy-event-planner/chrome-extension
   ```

2. Open Chrome → Extensions → Enable Developer Mode

3. Click "Load unpacked" and select the `chrome-extension` folder

4. Pin the extension to your toolbar

### Method 2: Chrome Web Store (Coming Soon)

Extension will be published to Chrome Web Store after Utah Tech Week demo.

## ⚙️ Configuration

### First Time Setup

1. Click the extension icon to open side panel

2. Complete onboarding:
   - **API Key:** Add your Gemini API key (get from [Google AI Studio](https://aistudio.google.com/app/apikey))
   - **Company Info:** Your company name, product, value prop
   - **Goals:** Target personas, industries, event goals

3. Start analyzing events!

### API Connection

The extension automatically connects to the best available API:

**Priority:**
1. ✅ Railway MCP Server (production)
2. ✅ Localhost MCP Server (development)
3. ✅ Supabase Edge Function (web app proxy)

**No manual configuration needed!**

## 📖 Usage

### Analyze Conference Page

1. Visit a conference website (e.g., Utah Tech Week, LinkedIn event)

2. Open extension side panel

3. Click **"Analyze Event"**

4. View results:
   - Event summary
   - Key speakers & companies
   - Sponsorship opportunities
   - Target recommendations
   - ROI analysis

5. Data automatically saves to:
   - Local storage (offline backup)
   - GTM Hub web dashboard (if online)

### View Saved Data

**In Extension:**
- Click "View Targets" to see all analyzed events
- Filter by priority, ROI, or date

**In Web Dashboard:**
- Visit https://easy-event-planner.lovable.app
- Login with your account
- See all companies synced from extension

## 🔗 API Integration

### Endpoints Used

Extension communicates with:

**Railway MCP Server:**
```
https://unified-mcp-server-production.up.railway.app
```

**Supabase Proxy:**
```
https://etscbyzexyptgnppwyzv.supabase.co/functions/v1/mcp-proxy
```

### Tools Called

- `gtm_add_company` - Save captured companies
- `gtm_enrich_company` - Enrich with AI insights
- `gtm_generate_strategy` - Generate GTM strategy
- `gtm_draft_email` - Draft outreach email
- `gtm_list_companies` - List saved companies

See [API Documentation](https://github.com/altonalexander/gtm-hackathon/blob/main/EXTENSION_API_GUIDE.md) for full reference.

## 🛠️ Development

### Local Testing

1. **Start MCP Server (optional):**
   ```bash
   cd ../unified-mcp-server
   npm install
   npm start
   # Server runs on http://localhost:3000
   ```

2. **Load Extension:**
   - Chrome → Extensions → Developer Mode → Load unpacked
   - Select `chrome-extension` folder

3. **Test:**
   - Visit any conference website
   - Open extension side panel
   - Run analysis

### Debug Mode

Open Chrome DevTools while side panel is open:

```javascript
// Check connection status
const info = await getConnectionInfo();
console.log('Mode:', info.mode); // 'direct' or 'supabase'
console.log('URL:', info.url);

// Test API call
const health = await checkMCPServerHealth();
console.log('Health:', health);
```

## 📁 Files

```
chrome-extension/
├── manifest.json           # Extension configuration
├── mcp-integration.js      # Dual-mode API client (updated)
├── sidepanel.js            # Main UI logic
├── sidepanel.html          # UI markup
├── sidepanel.css           # Styles
├── background.js           # Service worker (Gemini API)
├── content.js              # Page content extraction
├── popup.html              # Quick action popup
├── popup.js                # Popup logic
└── icons/                  # Extension icons
```

## 🔐 Privacy & Security

- **API Keys:** Stored locally in Chrome storage (never sent to server)
- **Data:** Synced to Turso database (encrypted at rest)
- **Auth:** Anonymous mode for extension, optional login for web dashboard
- **Permissions:** Required for page analysis and storage

## 🐛 Troubleshooting

### Extension won't load
- Check Chrome version (requires v88+)
- Disable other GTM extensions (conflicts)
- Reload extension: Chrome → Extensions → Reload

### API connection failed
- Extension auto-fallbacks to Supabase proxy
- Check browser console for errors
- Verify Railway server is running: https://unified-mcp-server-production.up.railway.app/health

### Data not syncing to web dashboard
- Both use same Turso database (should sync automatically)
- Check web dashboard login (may need to authenticate)
- Verify API mode: `getConnectionInfo()`

### Analysis returns empty results
- Page may not be a conference website
- Try different page on same site
- Check Gemini API key in settings

## 🎬 Demo Video

*Coming soon after Utah Tech Week 2025*

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/altonalexander/easy-event-planner/issues)
- **Docs:** [API Guide](https://github.com/altonalexander/gtm-hackathon/blob/main/EXTENSION_API_GUIDE.md)
- **Web App:** https://easy-event-planner.lovable.app

## 📄 License

MIT License - see [LICENSE](../LICENSE)

---

**Built for Utah Tech Week 2025** 🚀

**Integrated with:** [GTM Intelligence Hub](https://easy-event-planner.lovable.app)
