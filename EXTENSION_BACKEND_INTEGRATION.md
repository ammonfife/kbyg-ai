# Browser Extension → Backend Integration Guide

This guide shows how to integrate the Chrome extension with the backend API to automatically save event analyses to the database.

## Quick Start

### 1. Update Extension Configuration

Create a config file in the extension:

**`chrome-extension/config.js`:**
```javascript
const CONFIG = {
  API_BASE_URL: 'http://localhost:3000/api', // Change for production
  BEARER_TOKEN: null, // Set if backend requires auth
  USER_ID: null, // Will be generated/loaded from storage
};

// Generate or load user ID
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

### 2. Add Backend API Client

Create a new file to handle backend communication:

**`chrome-extension/backend-api.js`:**
```javascript
class BackendAPI {
  constructor(baseUrl, bearerToken = null) {
    this.baseUrl = baseUrl;
    this.bearerToken = bearerToken;
    this.userId = null;
  }

  async initialize() {
    this.userId = await getUserId();
  }

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

      return result;
    } catch (error) {
      console.error('Error saving event to backend:', error);
      throw error;
    }
  }

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

      return result.events;
    } catch (error) {
      console.error('Error loading events from backend:', error);
      throw error;
    }
  }

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
      console.error('Error getting event from backend:', error);
      return null;
    }
  }

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

      return result;
    } catch (error) {
      console.error('Error deleting event from backend:', error);
      throw error;
    }
  }

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

      return result;
    } catch (error) {
      console.error('Error saving profile to backend:', error);
      throw error;
    }
  }

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
      console.error('Error getting profile from backend:', error);
      return null;
    }
  }

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
      console.error('Error searching people:', error);
      throw error;
    }
  }

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
      console.error('Error getting analytics:', error);
      throw error;
    }
  }

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

      return result;
    } catch (error) {
      console.error('Error bulk importing events:', error);
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

### 3. Update manifest.json

Add the new script files:

```json
{
  "web_accessible_resources": [
    {
      "resources": ["demo-profiles/*.json", "config.js", "backend-api.js"],
      "matches": ["<all_urls>"]
    }
  ]
}
```

### 4. Modify background.js to Save to Backend

In `background.js`, update the `handleAnalyzeEvent` function:

```javascript
// At the top of background.js
let backendAPIInitialized = false;

async function ensureBackendAPIInitialized() {
  if (!backendAPIInitialized) {
    await backendAPI.initialize();
    backendAPIInitialized = true;
  }
}

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

  // SAVE TO BACKEND
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
    console.log('Event saved to backend:', saveResult.eventId);
    
    // Add backend metadata to response
    data.backendSaved = true;
    data.backendEventId = saveResult.eventId;
  } catch (backendError) {
    console.error('Failed to save to backend (continuing with local storage):', backendError);
    data.backendSaved = false;
    data.backendError = backendError.message;
  }

  return { data };
}
```

### 5. Sync User Profile to Backend

In `sidepanel.js`, update the profile saving functions:

```javascript
async function saveProfile(profile) {
  userProfile = profile;
  
  // Save locally
  await new Promise((resolve) => {
    chrome.storage.local.set({ userProfile: profile }, resolve);
  });

  // Also save to backend
  try {
    await ensureBackendAPIInitialized();
    await backendAPI.saveProfile(profile);
    console.log('Profile synced to backend');
  } catch (error) {
    console.error('Failed to sync profile to backend:', error);
    // Continue - local save still worked
  }
}
```

### 6. Load Events from Backend (Optional)

To sync events from backend on startup:

```javascript
// In sidepanel.js initialization
document.addEventListener('DOMContentLoaded', async () => {
  userProfile = await loadProfile();
  savedEvents = await loadSavedEvents();
  
  // NEW: Sync with backend
  try {
    await ensureBackendAPIInitialized();
    const backendEvents = await backendAPI.getEvents();
    
    // Merge backend events with local storage
    for (const event of backendEvents) {
      const eventKey = normalizeUrl(event.url);
      // Backend is source of truth - overwrite local
      savedEvents[eventKey] = event;
    }
    
    // Save merged events back to local storage
    await new Promise((resolve) => {
      chrome.storage.local.set({ savedEvents }, resolve);
    });
    
    console.log(`Loaded ${backendEvents.length} events from backend`);
  } catch (error) {
    console.error('Failed to sync with backend, using local data:', error);
  }
  
  if (userProfile.onboardingComplete && userProfile.geminiApiKey) {
    showMainSection();
    await updateCurrentUrl();
    await checkForCachedAnalysis();
    updateEventsCount();
  } else {
    showOnboardingStep('mode');
  }
});
```

## Testing the Integration

### 1. Start the Backend Server

```bash
cd unified-mcp-server
npm install
npm run build
npm start
```

Server should start on `http://localhost:3000`.

### 2. Test Backend Health

```bash
curl http://localhost:3000/health
```

Should return:
```json
{
  "status": "ok",
  "server": "unified-mcp",
  "version": "1.0.0",
  "tools": 19,
  "eventApi": "enabled"
}
```

### 3. Load Extension

1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `chrome-extension` folder

### 4. Test Event Analysis

1. Navigate to a conference website (e.g., https://www.saastr.com/)
2. Open the extension side panel
3. Click "Analyze Page"
4. Check browser console for "Event saved to backend" message

### 5. Verify Backend Storage

```bash
curl http://localhost:3000/api/events \
  -H "X-User-Id: your_user_id_from_console"
```

Should return the saved events.

## Production Deployment

### Backend Deployment

**Option 1: Railway**
1. Push code to GitHub
2. Connect Railway to your repo
3. Set environment variables
4. Deploy automatically

**Option 2: Fly.io**
```bash
fly launch
fly secrets set TURSO_DATABASE_URL=...
fly secrets set TURSO_AUTH_TOKEN=...
fly secrets set MCP_BEARER_TOKEN=...
fly deploy
```

### Update Extension Configuration

In production, update `config.js`:

```javascript
const CONFIG = {
  API_BASE_URL: 'https://your-backend.railway.app/api',
  BEARER_TOKEN: 'your_production_token',
  USER_ID: null,
};
```

### Enable Authentication

1. Generate a secure bearer token:
```bash
openssl rand -hex 32
```

2. Set on backend:
```bash
export MCP_BEARER_TOKEN=your_generated_token
```

3. Update extension config with the same token

## Hybrid Mode (Offline Support)

For best UX, keep local storage as fallback:

```javascript
async function saveEventHybrid(eventData) {
  // Always save locally first (immediate)
  const eventKey = normalizeUrl(eventData.url);
  savedEvents[eventKey] = {
    ...eventData,
    lastViewed: new Date().toISOString()
  };
  await new Promise(resolve => {
    chrome.storage.local.set({ savedEvents }, resolve);
  });

  // Then sync to backend (async, non-blocking)
  try {
    await backendAPI.saveEvent(eventData);
    savedEvents[eventKey].backendSynced = true;
  } catch (error) {
    console.error('Backend sync failed, will retry later:', error);
    savedEvents[eventKey].backendSynced = false;
    savedEvents[eventKey].pendingSync = true;
  }
  
  return eventData;
}
```

Add a background sync job to retry failed uploads.

## Troubleshooting

### "Failed to save to backend" Error

1. Check backend is running: `curl http://localhost:3000/health`
2. Check browser console for detailed error
3. Verify CORS is enabled on backend
4. Check network tab for failed requests

### CORS Issues

Update `http-server.ts`:
```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'chrome-extension://your-extension-id'
  ],
  credentials: true
}));
```

Get your extension ID from `chrome://extensions/`

### Events Not Syncing

1. Check user ID is consistent: Look in browser console for "User ID: ..."
2. Verify X-User-Id header is being sent
3. Check backend logs for errors
4. Test API directly with curl

## Next Steps

- [ ] Add automatic retry for failed syncs
- [ ] Implement conflict resolution for offline edits
- [ ] Add background sync service worker
- [ ] Create admin dashboard to view all users' events
- [ ] Add webhook support for real-time updates
- [ ] Implement team sharing features

## Support

Check backend logs:
```bash
npm start
```

Enable verbose logging in extension:
```javascript
const DEBUG = true;
```
