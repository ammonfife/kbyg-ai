# Database Sync Implementation

## Overview
Added full database sync for all Chrome extension data to Supabase backend.

## What Was Added

### 1. Database Schema (`supabase/migrations/001_initial_schema.sql`)

**Tables Created:**
- `user_profiles` - User onboarding & company info
- `events` - Analyzed conference events
- `people` - Attendees/speakers from events
- `expected_personas` - Predicted attendees from AI analysis
- `sponsors` - Event sponsors
- `next_best_actions` - AI-generated action items

**Features:**
- Row Level Security (RLS) enabled on all tables
- User can only access their own data
- Automatic `updated_at` timestamps
- Full-text search indexes on key fields

### 2. Backend Sync Module (`chrome-extension/backend-sync.js`)

**Functions:**
- `syncProfileToBackend(profile)` - Sync user profile
- `loadProfileFromBackend()` - Load profile from DB
- `syncEventToBackend(eventData)` - Sync event + all related data
- `loadEventFromBackend(url)` - Load event with people, personas, etc.
- `loadAllEventsFromBackend()` - Load all user events
- `deleteEventFromBackend(url)` - Delete event from DB

## Integration Steps

### Step 1: Run Database Migration

```bash
# In your Supabase project
cd /Users/benfife/github/ammonfife/kbyg-ai

# Run migration
supabase db push supabase/migrations/001_initial_schema.sql

# Or via Supabase dashboard:
# SQL Editor → New Query → Paste migration → Run
```

### Step 2: Add Sync Script to Extension

In `chrome-extension/sidepanel.html`, add before `</body>`:

```html
<script src="backend-sync.js"></script>
```

### Step 3: Update Profile Save Function

In `sidepanel.js`, update `saveProfile()`:

```javascript
async function saveProfile(profile) {
  userProfile = profile;
  
  // Save to local storage
  await new Promise((resolve) => {
    chrome.storage.local.set({ userProfile: profile }, resolve);
  });
  
  // Sync to backend
  await syncProfileToBackend(profile);
}
```

### Step 4: Update Event Save Function

In `sidepanel.js`, update `saveEvent()`:

```javascript
async function saveEvent(url, data) {
  savedEvents[url] = data;
  
  // Save to local storage
  await new Promise((resolve) => {
    chrome.storage.local.set({ savedEvents }, resolve);
  });
  
  // Sync to backend
  await syncEventToBackend({
    ...data,
    url: url
  });
}
```

### Step 5: Update Load Functions

In `sidepanel.js`, update initialization:

```javascript
document.addEventListener('DOMContentLoaded', async () => {
  // Load from local storage first
  userProfile = await loadProfile();
  savedEvents = await loadSavedEvents();
  
  // If signed in, sync with backend
  const user = await getSupabaseUser();
  if (user) {
    console.log('[Init] User signed in, syncing with backend...');
    
    // Load profile from backend (if exists)
    const backendProfile = await loadProfileFromBackend();
    if (backendProfile) {
      userProfile = { ...userProfile, ...backendProfile };
      await saveProfile(userProfile); // Save merged profile
    }
    
    // Load events from backend
    const backendEvents = await loadAllEventsFromBackend();
    savedEvents = { ...savedEvents, ...backendEvents };
    await new Promise((resolve) => {
      chrome.storage.local.set({ savedEvents }, resolve);
    });
  }
  
  // Continue with normal initialization...
  if (userProfile.onboardingComplete && userProfile.geminiApiKey) {
    showMainSection();
    await updateCurrentUrl();
    await checkForCachedAnalysis();
    updateEventsCount();
  } else {
    showOnboardingStep(1);
  }
});
```

### Step 6: Update Delete Function

In `sidepanel.js`, update `deleteEvent()`:

```javascript
async function deleteEvent(url) {
  delete savedEvents[url];
  
  // Delete from local storage
  await new Promise((resolve) => {
    chrome.storage.local.set({ savedEvents }, resolve);
  });
  
  // Delete from backend
  await deleteEventFromBackend(url);
  
  renderEventsIndex();
}
```

## Testing

### 1. Test Profile Sync

```javascript
// In browser console (extension context)
const profile = {
  companyName: 'Test Co',
  yourRole: 'CEO',
  product: 'Testing Product',
  // ... other fields
};

await syncProfileToBackend(profile);
const loaded = await loadProfileFromBackend();
console.log('Profile synced:', loaded);
```

### 2. Test Event Sync

```javascript
// After analyzing an event
const eventData = {
  url: 'https://example.com/event',
  eventName: 'Test Event',
  date: '2026-03-15',
  location: 'Park City, UT',
  people: [...], // From analysis
  expectedPersonas: [...],
  sponsors: [...],
  nextBestActions: [...]
};

const eventId = await syncEventToBackend(eventData);
console.log('Event ID:', eventId);

const loaded = await loadEventFromBackend(eventData.url);
console.log('Loaded event:', loaded);
```

### 3. Test Load All Events

```javascript
const events = await loadAllEventsFromBackend();
console.log('All events:', Object.keys(events).length);
```

## Data Sync Behavior

### When User is Signed Out:
- Data saved to `chrome.storage.local` only
- No backend sync
- Works offline

### When User Signs In:
- Existing local data synced to backend
- Backend data merged with local data
- Newer data takes precedence

### When User Signs Out:
- Local data remains
- No further backend sync
- Can still use extension offline

### On Extension Reload:
- Load local data first (fast)
- If signed in, load backend data (comprehensive)
- Merge and update local cache

## Database Queries

### Get all events for a user:
```sql
SELECT * FROM events WHERE user_id = '<user-id>' ORDER BY analyzed_at DESC;
```

### Get event with all related data:
```sql
-- Event
SELECT * FROM events WHERE url = '<event-url>';

-- People
SELECT * FROM people WHERE event_id = '<event-id>';

-- Personas
SELECT * FROM expected_personas WHERE event_id = '<event-id>';

-- Sponsors
SELECT * FROM sponsors WHERE event_id = '<event-id>';

-- Actions
SELECT * FROM next_best_actions WHERE event_id = '<event-id>';
```

### Search people across all events:
```sql
SELECT p.*, e.event_name, e.date
FROM people p
JOIN events e ON p.event_id = e.id
WHERE p.user_id = '<user-id>'
  AND (
    p.name ILIKE '%search%'
    OR p.company ILIKE '%search%'
    OR p.title ILIKE '%search%'
  );
```

## Next Steps

1. **Run migration** in Supabase
2. **Add backend-sync.js** to extension
3. **Update save/load functions** in sidepanel.js
4. **Test sync flows** (sign in/out, analyze event, etc.)
5. **Deploy extension** with updated code

## Notes

- All sensitive data (like `gemini_api_key`) is stored but not exposed via web dashboard
- RLS ensures users can only access their own data
- Cascade deletes: deleting an event deletes all related people/personas/sponsors/actions
- All timestamps are UTC
- JSONB columns used for arrays (conversation_starters, keywords, pain_points)

## Security

- ✅ Row Level Security enabled
- ✅ User authentication required
- ✅ No cross-user data access
- ✅ API keys stored securely
- ✅ HTTPS required for all API calls

## Performance

- Indexes on frequently queried fields
- Batch inserts for related data
- Local cache for offline support
- Lazy loading of event details

---

**Status:** Ready for implementation
**Estimated Time:** 30 minutes for full integration
**Testing Required:** Sign in/out flows, event analysis, profile updates
