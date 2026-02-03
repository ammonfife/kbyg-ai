# Lovable Frontend Updates for Event API

## ✅ Changes Made

### New Page Created

**File:** `src/pages/EventsPage.tsx`

**Purpose:** Display events analyzed by the KBYG Chrome Extension

**Features:**
- ✅ Fetches events from backend API (`/api/events`)
- ✅ Displays event details (name, date, location, attendees)
- ✅ Shows people extracted from each event
- ✅ Displays target personas with conversation starters
- ✅ Lists sponsors and next best actions
- ✅ Search/filter functionality
- ✅ Delete event functionality
- ✅ Responsive card-based layout

### Updated Files

**1. `src/App.tsx`**
- Added import for `EventsPage`
- Added route: `/events` → `<EventsPage />`

**2. `src/components/AppSidebar.tsx`**
- Added `Calendar` icon import
- Added "Conference Events" navigation item
- Routes to `/events` page

---

## 🔌 API Integration

### Environment Variable

The frontend uses: `VITE_API_URL` environment variable

**Default:** `http://localhost:3000/api`

**To configure:**
```bash
# .env file
VITE_API_URL=https://your-backend.com/api
```

### API Endpoints Used

**GET /api/events**
- Fetches all events for the current user
- Query param: `userId` (from localStorage, defaults to "default")

**DELETE /api/events/:url**
- Deletes a specific event by URL
- Query param: `userId`

### Data Flow

```
Chrome Extension → Backend API → Lovable Frontend
                      ↓
                  Turso Database
```

1. Chrome extension analyzes conference page
2. Extension sends event data to backend: `POST /api/events`
3. Backend saves to Turso database
4. Lovable frontend fetches from backend: `GET /api/events`
5. User sees analyzed events in the UI

---

## 🎨 UI Components Used

From shadcn/ui:
- `Card` - Event containers
- `Badge` - Tags for sponsors, likelihood
- `Button` - Actions (delete, open URL)
- `Input` - Search bar
- `Toast` - Notifications

Icons from lucide-react:
- `Calendar` - Events/dates
- `MapPin` - Location
- `Users` - People/attendees
- `Target` - Target personas
- `Trash2` - Delete action
- `ExternalLink` - Open event URL

---

## 📊 What Gets Displayed

### Event Card Shows:

**Header:**
- Event name (title)
- Date/dates
- Location
- Estimated attendees
- Actions (open URL, delete)

**Content:**
- Event description
- **People section:**
  - Name, title, company
  - Ice breaker suggestions
  - Shows first 5, with "+X more" indicator
- **Target Personas section:**
  - Persona type (VP Operations, CTO, etc.)
  - Likelihood badge (High/Medium/Low)
  - Estimated count
  - Conversation starter
- **Sponsors:**
  - Company names with tier badges
- **Next Best Actions:**
  - Numbered list of recommended actions
  - Reasons for each action

**Footer:**
- Analysis timestamp

---

## 🧪 Testing

### 1. Start Backend

```bash
cd unified-mcp-server
npm run build
npm start
```

Verify: `curl http://localhost:3000/health`

### 2. Start Frontend

```bash
# In root directory
npm run dev
```

Opens on `http://localhost:5173` (or similar)

### 3. Test Flow

1. Log in to Lovable app
2. Navigate to "Conference Events" in sidebar
3. Should see empty state if no events
4. Use Chrome extension to analyze a conference
5. Refresh events page - new event should appear
6. Test delete functionality
7. Test search/filter

---

## 🔐 User ID Handling

**Current Implementation:**
- Uses `localStorage.getItem('userId')` or defaults to `"default"`
- Same userId should be used by Chrome extension

**Future Enhancement:**
- Sync userId with authenticated user in Lovable
- Use Supabase user ID
- Store userId in user profile

**To Align with Extension:**

The Chrome extension generates a unique userId on first use. For the frontend to show those events, either:

1. **Option A:** Share userId between extension and Lovable
   - Extension could POST userId to API
   - Frontend reads from same endpoint
   
2. **Option B:** Use authenticated user ID
   - Lovable uses Supabase auth
   - Extension uses same user ID from auth flow
   
3. **Option C:** Manual import
   - Export from extension
   - Import into Lovable

**For MVP:** Option A is simplest - extension and frontend both use `localStorage.getItem('userId')`

---

## 🚀 Deployment

### Environment Variables

**Production `.env`:**
```bash
VITE_API_URL=https://your-backend.railway.app/api
```

### Build

```bash
npm run build
```

Outputs to `dist/` folder

### Deploy

Lovable handles deployment automatically, but ensure:
- ✅ Environment variable `VITE_API_URL` is set
- ✅ Backend API is accessible from frontend domain
- ✅ CORS is configured on backend

**Backend CORS Update:**

In `unified-mcp-server/src/http-server.ts`:

```typescript
app.use(cors({
  origin: [
    'http://localhost:5173', // Local dev
    'https://your-lovable-app.lovable.app' // Production
  ],
  credentials: true
}));
```

---

## 📋 Next Steps (Optional Enhancements)

### 1. Event Details Modal
- Click event → show full details in modal
- All people, all personas, full actions list

### 2. Analytics Dashboard
- Total events analyzed
- Top conferences
- Most common personas
- Event calendar view

### 3. People Search
- Search across all events for specific people
- Filter by company, title, persona

### 4. Export Functionality
- Export events to CSV
- Export people to CRM format
- Print-friendly view

### 5. User Sync
- Link extension userId with Supabase auth
- Multi-device sync
- Team sharing

### 6. Real-time Updates
- WebSocket connection
- Auto-refresh when extension adds new event
- Live updates badge

---

## ✅ Summary

**What Was Added:**
- ✅ EventsPage component (12KB)
- ✅ Route configuration in App.tsx
- ✅ Navigation item in AppSidebar
- ✅ Full CRUD for events (read, delete)
- ✅ Search/filter functionality
- ✅ Responsive UI with shadcn/ui components

**API Integration:**
- ✅ Connects to backend event API
- ✅ Uses environment variable for API URL
- ✅ Handles errors gracefully with toasts
- ✅ Loading states

**Ready For:**
- ✅ Local development
- ✅ Production deployment
- ✅ Chrome extension integration

**Time to Implement:** ~30 minutes

**Files Changed:** 3 files
- 1 new page created
- 2 existing files updated

---

**Status:** ✅ Frontend ready to display events from Chrome extension!

**Next:** Set `VITE_API_URL` and deploy! 🚀
