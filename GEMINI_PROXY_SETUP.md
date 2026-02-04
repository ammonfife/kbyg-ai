# Gemini API Proxy Setup

**Problem:** Chrome extensions can't safely store API keys (anyone can inspect the code and steal them).

**Solution:** Backend proxy that handles Gemini API calls securely.

## Architecture

```
Chrome Extension → Backend API (authenticated) → Gemini API
                   (has the key)                (secure)
```

## What Was Built

### 1. Backend Proxy (`unified-mcp-server/src/gemini-proxy.ts`)

**Class:** `GeminiProxy`

**Methods:**
- `generate()` - Generic text generation
- `analyzeConferenceEvent()` - Conference intelligence analysis
- `extractCompanyProfiles()` - Company data extraction

### 2. API Endpoints (`unified-mcp-server/src/http-server.ts`)

**Added routes:**
- `POST /api/gemini/generate` - Generic Gemini text generation
- `POST /api/gemini/analyze` - Conference event analysis
- `POST /api/gemini/extract` - Extract company profiles

**Authentication:** Bearer token (optional, recommended for production)

### 3. Extension Integration (`chrome-extension/gemini-backend.js`)

**Helper functions:**
- `callGemini(request)` - Call Gemini with any prompt
- `analyzeConferenceEvent(params)` - Analyze conference pages
- `extractCompanyProfiles(text)` - Extract companies from text

## Setup Instructions

### Step 1: Configure Backend

1. **Set environment variables** (`.env` or hosting platform):

```bash
# Required: Gemini API key
GEMINI_API_KEY=your_gemini_key_here

# Recommended: Authentication token
MCP_BEARER_TOKEN=random_secure_token_here

# Database (already configured)
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
```

2. **Start the backend:**

```bash
cd unified-mcp-server
npm install
npm run build
npm start
```

**Output should show:**
```
✅ Event database initialized
🚀 Unified MCP Server running on http://localhost:3000

🤖 Gemini API Endpoints:
   POST   /api/gemini/generate      - Generic text generation
   POST   /api/gemini/analyze       - Analyze conference event
   POST   /api/gemini/extract       - Extract company profiles

🔒 Authentication: Bearer token required
```

### Step 2: Configure Extension

1. **Update `chrome-extension/gemini-backend.js`:**

```javascript
// Change these values:
const BACKEND_URL = 'https://your-backend.com'; // Production URL
const BEARER_TOKEN = 'your_bearer_token'; // Same as MCP_BEARER_TOKEN
```

2. **Add to `manifest.json`** (if not already included):

```json
{
  "background": {
    "service_worker": "background.js"
  },
  "permissions": [
    "storage",
    "activeTab"
  ],
  "host_permissions": [
    "https://your-backend.com/*"
  ]
}
```

### Step 3: Use in Extension Code

#### Example 1: Analyze Current Page

```javascript
// In sidepanel.js or background.js
async function analyzeCurrentPage() {
  // Get page content
  const pageContent = document.body.innerText;
  const eventName = document.title;
  const eventUrl = window.location.href;

  try {
    const result = await analyzeConferenceEvent({
      eventName,
      eventUrl,
      pageContent,
      specificQuery: 'Who are the key exhibitors?'
    });

    console.log('Analysis:', result.analysis);
    displayAnalysis(result.analysis);
  } catch (error) {
    console.error('Analysis failed:', error);
  }
}
```

#### Example 2: Extract Companies

```javascript
async function extractCompaniesFromPage() {
  const pageText = document.body.innerText;

  try {
    const result = await extractCompanyProfiles(pageText);
    console.log('Found companies:', result.profiles);
    
    // Save to local storage or display
    result.profiles.forEach(company => {
      console.log(`- ${company.name}: ${company.description}`);
    });
  } catch (error) {
    console.error('Extraction failed:', error);
  }
}
```

#### Example 3: Custom Gemini Request

```javascript
async function customAnalysis() {
  try {
    const result = await callGemini({
      prompt: 'Analyze this speaker lineup...',
      systemInstruction: 'You are a conference intelligence expert',
      temperature: 0.5,
      model: 'gemini-2.0-flash-exp'
    });

    console.log('Result:', result.text);
  } catch (error) {
    console.error('Request failed:', error);
  }
}
```

## Security

### ✅ What's Secure

- **API key never in extension code** - Only on backend server
- **Bearer token authentication** - Prevents unauthorized use
- **HTTPS required in production** - Encrypts all requests
- **CORS enabled** - Only allows requests from authorized domains

### ⚠️ Production Checklist

- [ ] Deploy backend to secure hosting (Render, Railway, Vercel, etc.)
- [ ] Set `MCP_BEARER_TOKEN` environment variable
- [ ] Use HTTPS for all requests
- [ ] Update `BACKEND_URL` in extension to production URL
- [ ] Configure CORS to allow only your extension's domain
- [ ] Rotate bearer token regularly

## Deployment

### Option 1: Railway

```bash
cd unified-mcp-server
railway init
railway add
# Set environment variables in Railway dashboard
railway up
```

### Option 2: Render

1. Connect GitHub repo to Render
2. Create new Web Service
3. Set build command: `cd unified-mcp-server && npm install && npm run build`
4. Set start command: `cd unified-mcp-server && npm start`
5. Add environment variables in Render dashboard

### Option 3: Vercel

```bash
cd unified-mcp-server
vercel
# Follow prompts, set env vars in Vercel dashboard
```

## Testing

### Test Backend Locally

```bash
# Start backend
cd unified-mcp-server
npm start

# In another terminal, test endpoints
curl -X POST http://localhost:3000/api/gemini/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_token" \
  -d '{"prompt": "Hello, Gemini!"}'
```

### Test Extension Integration

1. Load extension in Chrome
2. Open DevTools Console
3. Run test function:

```javascript
callGemini({ prompt: 'Test message' })
  .then(result => console.log('Success:', result))
  .catch(error => console.error('Error:', error));
```

## Troubleshooting

### Error: "Gemini API not configured"

**Cause:** `GEMINI_API_KEY` not set in backend environment

**Fix:** Set environment variable and restart backend

### Error: "Unauthorized: Missing or invalid Bearer token"

**Cause:** Token mismatch between backend and extension

**Fix:** Ensure `MCP_BEARER_TOKEN` (backend) matches `BEARER_TOKEN` (extension)

### Error: "CORS error"

**Cause:** Extension origin not allowed by backend

**Fix:** Update CORS configuration in `http-server.ts`:

```javascript
app.use(cors({
  origin: ['chrome-extension://your-extension-id']
}));
```

### Error: "Network request failed"

**Cause:** Backend not running or wrong URL

**Fix:** 
- Check backend is running: `curl http://localhost:3000/health`
- Verify `BACKEND_URL` in extension matches backend location

## API Reference

### POST /api/gemini/generate

**Request:**
```json
{
  "prompt": "Your prompt text",
  "systemInstruction": "Optional system instruction",
  "model": "gemini-2.0-flash-exp",
  "temperature": 0.7,
  "maxTokens": 2500
}
```

**Response:**
```json
{
  "text": "Generated response",
  "model": "gemini-2.0-flash-exp",
  "tokensUsed": 234
}
```

### POST /api/gemini/analyze

**Request:**
```json
{
  "eventName": "Tech Summit 2026",
  "eventUrl": "https://example.com/event",
  "pageContent": "Full page text...",
  "specificQuery": "Optional: who are the sponsors?"
}
```

**Response:**
```json
{
  "analysis": "Structured analysis text..."
}
```

### POST /api/gemini/extract

**Request:**
```json
{
  "text": "Companies mentioned: Acme Corp does X, Beta Inc does Y..."
}
```

**Response:**
```json
{
  "profiles": [
    {
      "name": "Acme Corp",
      "description": "Does X",
      "industry": "...",
      "context": "..."
    }
  ]
}
```

---

## Next Steps

1. ✅ Backend proxy implemented
2. ✅ API endpoints added
3. ✅ Extension helper functions created
4. ⏳ Update existing extension code to use backend (not direct API)
5. ⏳ Deploy backend to production
6. ⏳ Test end-to-end flow
7. ⏳ Remove any hardcoded API keys from extension

**Status:** Ready for integration. Extension code needs to be updated to use `gemini-backend.js` instead of direct API calls.
