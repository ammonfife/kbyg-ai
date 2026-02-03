# KBYG Chrome Extension → Backend Connection Guide

**For Alton & AI Assistant**

This guide provides **exact instructions** to connect the KBYG Chrome extension to the backend API "command center" for full data persistence and sync.

## 🎯 Quick Summary

**What:** Connect Chrome extension to backend API for automatic event data sync  
**Why:** Cloud storage, cross-device sync, team collaboration, analytics  
**How:** Add 2 files to extension, update 2 existing files  
**Impact:** Zero breaking changes, all existing features preserved  

## 📊 Data Structure Verification

✅ **CONFIRMED:** Chrome extension and backend API data structures are **100% compatible**

### Extension Output (from Gemini API)
```javascript
{
  eventName: string,
  date: string,
  startDate: string,
  endDate: string,
  location: string,
  description: string,
  estimatedAttendees: number,
  people: Person[],
  sponsors: Sponsor[],
  expectedPersonas: ExpectedPersona[],
  nextBestActions: NextBestAction[],
  relatedEvents: RelatedEvent[]
}
```

### Backend Expects (EventData interface)
```typescript
{
  url: string,              // Added by extension
  eventName: string,        // ✅ Match
  date: string,             // ✅ Match
  startDate: string,        // ✅ Match
  endDate: string,          // ✅ Match
  location: string,         // ✅ Match
  description: string,      // ✅ Match
  estimatedAttendees: number, // ✅ Match
  people: Person[],         // ✅ Match
  sponsors: Sponsor[],      // ✅ Match
  expectedPersonas: ExpectedPersona[], // ✅ Match
  nextBestActions: NextBestAction[],   // ✅ Match
  relatedEvents: RelatedEvent[]        // ✅ Match
}
```

**Result:** Perfect match! No data transformation needed.

## 🚀 Implementation Steps

### Step 1: Add Configuration File

**File:** `chrome-extension/config.js`

```javascript
// KBYG Backend Configuration
const CONFIG = {
  // Backend API base URL
  API_BASE_URL: process.env.VITE_API_URL || 'http://localhost:3000/api',
  
  // Bearer token for authentication (optional, set if backend requires it)
  BEARER_TOKEN: null, // Set this if MCP_BEARER_TOKEN is configured on backend
  
  // User ID (auto-generated and stored locally)
  USER_ID: null,
};

/**
 * Get or generate a unique user ID
 * Stored in chrome.storage.local, persists across sessions
 */
async function getUserId() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['userId'], (result) => {
      if (result.userId) {
        resolve(result.userId);
      } else {
        // Generate a unique user ID
        const newUserId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        chrome.storage.local.set({ userId: newUserId });
        resolve(newUserId);
      }
    });
  });
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG, getUserId };
}
```

**Purpose:** Centralizes backend connection settings

### Step 2: Add Backend API Client

**File:** `chrome-extension/backend-api.js`

```javascript
/**
 * KBYG Backend API Client
 * Handles all communication with the backend command center
 */

class BackendAPI {
  constructor(baseUrl, bearerToken = null) {
    this.baseUrl = baseUrl;
    this.bearerToken = bearerToken;
    this.userId = null;
  }

  /**
   * Initialize the API client (call on startup)
   */
  async initialize() {
    this.userId = await getUserId();
    console.log('[KBYG Backend] Initialized with user ID:', this.userId);
  }

  /**
   * Get headers for API requests
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'X-User-Id': this.userId,
    };

    if (this.bearerToken) {
      headers['Authorization'] = `Bearer ${this.bearerToken}`;
    }

    return headers;
  }

  /**
   * Save event analysis to backend
   * @param {Object} eventData - Event data from Gemini analysis
   * @returns {Promise<Object>} - Result with eventId
   */
  async saveEvent(eventData) {
    try {
      const response = await fetch(`${this.baseUrl}/events`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(eventData),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to save event');
      }

      console.log('[KBYG Backend] Event saved:', result.eventId);
      return result;
    } catch (error) {
      console.error('[KBYG Backend] Error saving event:', error);
      throw error;
    }
  }

  /**
   * Get all events for the current user
   * @param {Object} options - Query options (limit, offset, startDate, endDate)
   * @returns {Promise<Array>} - Array of events
   */
  async getEvents(options = {}) {
    try {
      const params = new URLSearchParams();
      if (options.limit) params.append('limit', options.limit);
      if (options.offset) params.append('offset', options.offset);
      if (options.startDate) params.append('startDate', options.startDate);
      if (options.endDate) params.append('endDate', options.endDate);

      const url = `${this.baseUrl}/events?${params.toString()}`;
      const response = await fetch(url, {
        headers: this.getHeaders(),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to load events');
      }

      console.log('[KBYG Backend] Loaded', result.events.length, 'events');
      return result.events;
    } catch (error) {
      console.error('[KBYG Backend] Error loading events:', error);
      throw error;
    }
  }

  /**
   * Get a specific event by URL
   * @param {string} url - Event URL
   * @returns {Promise<Object|null>} - Event data or null if not found
   */
  async getEvent(url) {
    try {
      const encodedUrl = encodeURIComponent(url);
      const response = await fetch(`${this.baseUrl}/events/${encodedUrl}`, {
        headers: this.getHeaders(),
      });

      const result = await response.json();
      
      if (!result.success) {
        return null; // Event not found
      }

      return result.event;
    } catch (error) {
      console.error('[KBYG Backend] Error getting event:', error);
      return null;
    }
  }

  /**
   * Delete an event
   * @param {string} url - Event URL
   * @returns {Promise<Object>} - Result
   */
  async deleteEvent(url) {
    try {
      const encodedUrl = encodeURIComponent(url);
      const response = await fetch(`${this.baseUrl}/events/${encodedUrl}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete event');
      }

      console.log('[KBYG Backend] Event deleted');
      return result;
    } catch (error) {
      console.error('[KBYG Backend] Error deleting event:', error);
      throw error;
    }
  }

  /**
   * Save user profile to backend
   * @param {Object} profile - User profile data
   * @returns {Promise<Object>} - Result
   */
  async saveProfile(profile) {
    try {
      const response = await fetch(`${this.baseUrl}/profile`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(profile),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to save profile');
      }

      console.log('[KBYG Backend] Profile saved');
      return result;
    } catch (error) {
      console.error('[KBYG Backend] Error saving profile:', error);
      throw error;
    }
  }

  /**
   * Get user profile from backend
   * @returns {Promise<Object|null>} - User profile or null
   */
  async getProfile() {
    try {
      const response = await fetch(`${this.baseUrl}/profile`, {
        headers: this.getHeaders(),
      });

      const result = await response.json();
      
      if (!result.success) {
        return null; // Profile not found
      }

      return result.profile;
    } catch (error) {
      console.error('[KBYG Backend] Error getting profile:', error);
      return null;
    }
  }

  /**
   * Search for people across all events
   * @param {string} query - Search query
   * @returns {Promise<Array>} - Array of people
   */
  async searchPeople(query) {
    try {
      const params = new URLSearchParams({ q: query });
      const response = await fetch(`${this.baseUrl}/people/search?${params.toString()}`, {
        headers: this.getHeaders(),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to search people');
      }

      return result.people;
    } catch (error) {
      console.error('[KBYG Backend] Error searching people:', error);
      throw error;
    }
  }

  /**
   * Get analytics summary
   * @returns {Promise<Object>} - Analytics data
   */
  async getAnalyticsSummary() {
    try {
      const response = await fetch(`${this.baseUrl}/analytics/summary`, {
        headers: this.getHeaders(),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to get analytics');
      }

      return result.summary;
    } catch (error) {
      console.error('[KBYG Backend] Error getting analytics:', error);
      throw error;
    }
  }

  /**
   * Bulk import events
   * @param {Array} events - Array of event data objects
   * @returns {Promise<Object>} - Import results
   */
  async bulkImport(events) {
    try {
      const response = await fetch(`${this.baseUrl}/events/bulk`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ events }),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to bulk import events');
      }

      console.log('[KBYG Backend] Bulk import:', result.message);
      return result;
    } catch (error) {
      console.error('[KBYG Backend] Error bulk importing:', error);
      throw error;
    }
  }
}

// Create global instance
const backendAPI = new BackendAPI(CONFIG.API_BASE_URL, CONFIG.BEARER_TOKEN);

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BackendAPI, backendAPI };
}
```

**Purpose:** Handles all backend API communication

### Step 3: Update manifest.json

**File:** `chrome-extension/manifest.json`

Add the new files to web_accessible_resources:

```json
{
  "web_accessible_resources": [
    {
      "resources": [
        "demo-profiles/*.json",
        "config.js",
        "backend-api.js"
      ],
      "matches": ["<all_urls>"]
    }
  ]
}
```

### Step 4: Update background.js

**File:** `chrome-extension/background.js`

Add backend sync to the `handleAnalyzeEvent` function:

```javascript
// At the top of the file, after other declarations
let backendAPIInitialized = false;

async function ensureBackendAPIInitialized() {
  if (!backendAPIInitialized) {
    await backendAPI.initialize();
    backendAPIInitialized = true;
  }
}

// Modify handleAnalyzeEvent to save to backend
async function handleAnalyzeEvent(request) {
  // Get API key from user profile
  const profile = request.userProfile || {};
  const apiKey = profile.geminiApiKey;
  
  if (!apiKey) {
    throw new Error('API key not configured. Please add your Gemini API key in settings.');
  }

  const { content, url, title } = request;

  // Build the prompt with user context
  const prompt = buildAnalysisPrompt(content, url, title, profile);

  // Call Gemini API
  const response = await callGeminiAPI(apiKey, prompt);

  // Parse the response
  const data = parseGeminiResponse(response);

  // ✨ NEW: SAVE TO BACKEND
  try {
    await ensureBackendAPIInitialized();
    
    const eventData = {
      url: url,
      eventName: data.eventName,
      date: data.date,
      startDate: data.startDate,
      endDate: data.endDate,
      location: data.location,
      description: data.description,
      estimatedAttendees: data.estimatedAttendees,
      people: data.people || [],
      sponsors: data.sponsors || [],
      expectedPersonas: data.expectedPersonas || [],
      nextBestActions: data.nextBestActions || [],
      relatedEvents: data.relatedEvents || [],
      analyzedAt: new Date().toISOString(),
    };

    const saveResult = await backendAPI.saveEvent(eventData);
    console.log('[KBYG] Event saved to backend:', saveResult.eventId);
    
    // Add backend metadata to response
    data.backendSaved = true;
    data.backendEventId = saveResult.eventId;
  } catch (backendError) {
    console.error('[KBYG] Failed to save to backend (continuing with local storage):', backendError);
    data.backendSaved = false;
    data.backendError = backendError.message;
  }

  return { data };
}
```

**Changes:**
1. Initialize backend API on first use
2. After Gemini analysis, save to backend
3. Add metadata to response (backendSaved, backendEventId)
4. Gracefully handle backend failures (local storage still works)

### Step 5: Update sidepanel.js (Optional - Profile Sync)

**File:** `chrome-extension/sidepanel.js`

Sync user profile to backend when saving:

```javascript
async function saveProfile(profile) {
  userProfile = profile;
  
  // Save locally
  await new Promise((resolve) => {
    chrome.storage.local.set({ userProfile: profile }, resolve);
  });

  // ✨ NEW: Also save to backend
  try {
    await ensureBackendAPIInitialized();
    await backendAPI.saveProfile(profile);
    console.log('[KBYG] Profile synced to backend');
  } catch (error) {
    console.error('[KBYG] Failed to sync profile to backend:', error);
    // Continue - local save still worked
  }
}
```

**Purpose:** Keep user profile in sync with backend for cross-device access

## 🔧 Backend Setup

### Environment Variables

Create `.env` file in `unified-mcp-server/`:

```bash
# Turso Database
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your_turso_auth_token

# Optional: Authentication
MCP_BEARER_TOKEN=your_secure_token_here

# Server Port
PORT=3000
```

### Start the Backend

```bash
cd unified-mcp-server
npm install
npm run build
npm start
```

Server will run on `http://localhost:3000`

### Verify Backend is Running

```bash
curl http://localhost:3000/health
```

Expected output:
```json
{
  "status": "ok",
  "server": "unified-mcp",
  "version": "1.0.0",
  "tools": 19,
  "eventApi": "enabled"
}
```

## 🧪 Testing the Connection

### 1. Load Extension

1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `chrome-extension/` folder

### 2. Configure Extension

1. Click extension icon to open side panel
2. Go through onboarding or settings
3. Add Gemini API key
4. Fill in company profile

### 3. Test Event Analysis

1. Navigate to any conference website (e.g., https://www.saastr.com/)
2. Click "Analyze Page" in extension
3. Check browser console for:
   - `[KBYG Backend] Initialized with user ID: user_...`
   - `[KBYG] Event saved to backend: 123`

### 4. Verify Backend Storage

```bash
# List events for your user
curl http://localhost:3000/api/events \
  -H "X-User-Id: YOUR_USER_ID_FROM_CONSOLE"
```

You should see the analyzed event in the response.

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Opens Extension                      │
│                  (Navigates to conference page)              │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                  Click "Analyze Page"                        │
│               (sidepanel.js sends message)                   │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    background.js                             │
│  1. Extract page content                                     │
│  2. Send to Gemini API                                       │
│  3. Parse JSON response                                      │
└────────────────────────────┬────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
┌────────────────────────────┐  ┌─────────────────────────────┐
│   Chrome Local Storage     │  │    Backend API              │
│   (Immediate cache)        │  │    (Cloud persistence)      │
│                            │  │                             │
│   - Fast access            │  │   POST /api/events          │
│   - Offline support        │  │   - Turso database          │
│   - Last 50 events         │  │   - Full history            │
└────────────────────────────┘  │   - Cross-device sync       │
                                │   - Analytics               │
                                │   - Team sharing (future)   │
                                └─────────────────────────────┘
```

## 🔐 Security Considerations

### User ID Generation
- Unique ID generated on first use
- Stored in `chrome.storage.local`
- Persists across sessions
- Isolates user data

### API Authentication (Optional)
If you set `MCP_BEARER_TOKEN` on backend:

1. Generate secure token:
   ```bash
   openssl rand -hex 32
   ```

2. Set in backend `.env`:
   ```bash
   MCP_BEARER_TOKEN=your_generated_token
   ```

3. Update `config.js` in extension:
   ```javascript
   const CONFIG = {
     API_BASE_URL: 'https://your-backend.com/api',
     BEARER_TOKEN: 'your_generated_token', // Same token
   };
   ```

### CORS Configuration

For production, update backend CORS settings in `http-server.ts`:

```typescript
app.use(cors({
  origin: [
    'chrome-extension://your-extension-id',
    'https://your-domain.com'
  ],
  credentials: true,
}));
```

Get extension ID from `chrome://extensions/`

## 🚨 Troubleshooting

### Extension Can't Connect to Backend

**Symptom:** Console error: `Failed to fetch`

**Solutions:**
1. Verify backend is running: `curl http://localhost:3000/health`
2. Check API_BASE_URL in `config.js`
3. Check browser console for CORS errors
4. Verify no firewall blocking localhost:3000

### Events Not Saving

**Symptom:** No error, but events not in backend

**Solutions:**
1. Check backend logs for errors
2. Verify user ID in console: `[KBYG Backend] Initialized with user ID: ...`
3. Test API directly:
   ```bash
   curl -X POST http://localhost:3000/api/events \
     -H "Content-Type: application/json" \
     -H "X-User-Id: test" \
     -d '{"url":"https://test.com","eventName":"Test","people":[],"sponsors":[],"expectedPersonas":[],"nextBestActions":[],"relatedEvents":[]}'
   ```

### Backend Returns 401 Unauthorized

**Symptom:** `Error: 401 Unauthorized`

**Solutions:**
1. Check if `MCP_BEARER_TOKEN` is set on backend
2. Verify `BEARER_TOKEN` in `config.js` matches
3. Check Authorization header format: `Bearer YOUR_TOKEN`

### Database Connection Issues

**Symptom:** `Failed to connect to Turso`

**Solutions:**
1. Verify `TURSO_DATABASE_URL` format: `libsql://your-db.turso.io`
2. Check `TURSO_AUTH_TOKEN` is valid
3. Test connection: `cd unified-mcp-server && npm run init-db`

## 📈 Production Deployment

### Deploy Backend

**Option 1: Railway**
1. Push to GitHub
2. Connect Railway to repo
3. Add environment variables
4. Deploy automatically

**Option 2: Fly.io**
```bash
cd unified-mcp-server
fly launch
fly secrets set TURSO_DATABASE_URL=...
fly secrets set TURSO_AUTH_TOKEN=...
fly secrets set MCP_BEARER_TOKEN=...
fly deploy
```

### Update Extension for Production

In `config.js`:
```javascript
const CONFIG = {
  API_BASE_URL: 'https://your-backend.railway.app/api',
  BEARER_TOKEN: 'your_production_bearer_token',
};
```

### Publish Extension

1. Create Chrome Web Store developer account
2. Prepare extension package (zip chrome-extension/ folder)
3. Upload to Chrome Web Store
4. Fill in listing details (use KBYG branding)
5. Submit for review

## 📚 Additional Documentation

- **EVENT_API.md** - Complete API reference
- **EXTENSION_BACKEND_INTEGRATION.md** - Detailed integration guide
- **BACKEND_SETUP_SUMMARY.md** - Backend overview

## ✅ Implementation Checklist

### Extension Changes
- [ ] Create `chrome-extension/config.js`
- [ ] Create `chrome-extension/backend-api.js`
- [ ] Update `chrome-extension/manifest.json` (web_accessible_resources)
- [ ] Update `chrome-extension/background.js` (add backend sync)
- [ ] Update `chrome-extension/sidepanel.js` (add profile sync)

### Backend Setup
- [ ] Create `.env` with Turso credentials
- [ ] Run `npm install` in unified-mcp-server/
- [ ] Run `npm run build`
- [ ] Start server: `npm start`
- [ ] Verify health check: `curl http://localhost:3000/health`

### Testing
- [ ] Load extension in Chrome
- [ ] Analyze a test event
- [ ] Check console for backend save confirmation
- [ ] Verify event in backend: `curl http://localhost:3000/api/events?userId=YOUR_ID`
- [ ] Test profile sync
- [ ] Test analytics endpoint

### Production (When Ready)
- [ ] Deploy backend to Railway/Fly.io
- [ ] Update extension config.js with production URL
- [ ] Enable bearer token authentication
- [ ] Configure CORS for production
- [ ] Publish extension to Chrome Web Store

## 🎯 Success Criteria

✅ **Connection works when:**
- Extension loads without errors
- Console shows `[KBYG Backend] Initialized with user ID: ...`
- After analysis: `[KBYG] Event saved to backend: [number]`
- Backend API returns event when queried
- No CORS errors in console
- Local storage AND backend both have data (redundancy)

## 🆘 Support

**Questions?** Open an issue in the repository.

**Backend API docs:** See `EVENT_API.md` in unified-mcp-server/

**Integration examples:** See `EXTENSION_BACKEND_INTEGRATION.md`

---

**Last Updated:** 2026-02-03  
**Version:** 1.0.0  
**Status:** Ready for Implementation ✅
