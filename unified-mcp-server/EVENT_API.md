# Event API Documentation

This document describes the Event API endpoints for receiving and managing data from the browser extension.

## Table of Contents
- [Setup](#setup)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
- [Data Models](#data-models)
- [Browser Extension Integration](#browser-extension-integration)

## Setup

### Environment Variables

```bash
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your_auth_token
MCP_BEARER_TOKEN=optional_bearer_token_for_auth
PORT=3000
```

### Initialize Database

The database schema is automatically created on server startup. Tables include:
- `user_profiles` - User configuration and preferences
- `events` - Event metadata
- `people` - People extracted from events
- `sponsors` - Event sponsors
- `expected_personas` - Target personas for events
- `next_best_actions` - Recommended actions
- `related_events` - Related/similar events

### Start the Server

```bash
cd unified-mcp-server
npm install
npm run build
npm start
```

Server will run on `http://localhost:3000` (or PORT env variable).

## Authentication

### Optional Bearer Token

If `MCP_BEARER_TOKEN` is set, all API requests require an `Authorization` header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### User Identification

Pass user ID via:
- Header: `X-User-Id: user123`
- Query param: `?userId=user123`

Default: `"default"` if not provided.

## Endpoints

### Event Management

#### POST /api/events
Save a new event analysis from the browser extension.

**Request Body:**
```json
{
  "url": "https://conference.com/event",
  "eventName": "AI Summit 2026",
  "date": "March 15-17, 2026",
  "startDate": "2026-03-15",
  "endDate": "2026-03-17",
  "location": "San Francisco, CA",
  "description": "Annual AI conference...",
  "estimatedAttendees": 5000,
  "people": [
    {
      "name": "Jane Smith",
      "role": "Speaker",
      "title": "VP of Engineering",
      "company": "TechCorp",
      "persona": "Executive",
      "linkedin": "https://linkedin.com/in/janesmith",
      "linkedinMessage": "Hi Jane, looking forward to your talk...",
      "iceBreaker": "I loved your recent post about AI ethics..."
    }
  ],
  "sponsors": [
    {
      "name": "CloudCo",
      "tier": "Platinum"
    }
  ],
  "expectedPersonas": [
    {
      "persona": "VP of Operations",
      "likelihood": "High",
      "count": "50+",
      "linkedinMessage": "Hi, I noticed you're attending...",
      "iceBreaker": "What brings you to the AI Summit?",
      "conversationStarters": [
        "How are you thinking about AI adoption?",
        "What's your biggest operational challenge?",
        "Have you seen the keynote schedule?"
      ],
      "keywords": ["operations", "efficiency", "automation"],
      "painPoints": ["Manual processes", "Data silos", "Scaling challenges"]
    }
  ],
  "nextBestActions": [
    {
      "priority": 1,
      "action": "Book meeting with Jane Smith before event",
      "reason": "She's a key decision maker at target account"
    }
  ],
  "relatedEvents": [
    {
      "name": "AI Expo 2026",
      "url": "https://aiexpo.com",
      "date": "April 2026",
      "relevance": "Similar audience, same organizer"
    }
  ],
  "analyzedAt": "2026-01-15T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "eventId": 123,
  "message": "Event saved successfully"
}
```

#### GET /api/events
List all events for a user.

**Query Parameters:**
- `limit` - Max number of events to return
- `offset` - Pagination offset
- `startDate` - Filter events starting on/after this date (YYYY-MM-DD)
- `endDate` - Filter events ending on/before this date (YYYY-MM-DD)
- `userId` - User ID (or use X-User-Id header)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "events": [...]
}
```

#### GET /api/events/:url
Get a specific event by URL (URL-encoded).

**Example:**
```
GET /api/events/https%3A%2F%2Fconference.com%2Fevent
```

**Response:**
```json
{
  "success": true,
  "event": { ... }
}
```

#### DELETE /api/events/:url
Delete an event by URL (URL-encoded).

**Response:**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

#### POST /api/events/bulk
Bulk import multiple events.

**Request Body:**
```json
{
  "events": [
    { ... },
    { ... }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Imported 5 of 5 events",
  "results": [
    { "success": true, "eventId": 1, "url": "..." },
    { "success": false, "url": "...", "error": "..." }
  ]
}
```

### User Profile

#### POST /api/profile
Save or update user profile.

**Request Body:**
```json
{
  "companyName": "MyCompany",
  "yourRole": "Sales Engineer",
  "product": "AI Platform",
  "valueProp": "10x faster data processing",
  "targetPersonas": "CTO, VP Engineering, Data Scientists",
  "targetIndustries": "SaaS, FinTech, Healthcare",
  "competitors": "CompetitorA, CompetitorB",
  "dealSize": "50000",
  "conversionRate": "15",
  "oppWinRate": "25",
  "eventGoal": "Generate 10 qualified leads per event",
  "notes": "Focus on Fortune 500 accounts",
  "onboardingComplete": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile saved successfully"
}
```

#### GET /api/profile
Get user profile.

**Response:**
```json
{
  "success": true,
  "profile": { ... }
}
```

### People Search

#### GET /api/people/search
Search for people across all events.

**Query Parameters:**
- `q` - Search query (searches name, company, title, persona)
- `userId` - User ID (or use X-User-Id header)

**Example:**
```
GET /api/people/search?q=engineer
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "people": [
    {
      "name": "John Doe",
      "role": "Speaker",
      "title": "Senior Engineer",
      "company": "TechCo",
      "persona": "Technical Lead",
      "linkedin": "...",
      "eventName": "AI Summit 2026",
      "eventUrl": "https://conference.com",
      "eventDate": "2026-03-15"
    }
  ]
}
```

### Analytics

#### GET /api/analytics/summary
Get aggregated analytics for a user.

**Response:**
```json
{
  "success": true,
  "summary": {
    "totalEvents": 25,
    "totalPeople": 450,
    "totalSponsors": 75,
    "upcomingEventsCount": 5,
    "topPersonas": [
      { "persona": "VP of Operations", "eventCount": 12 },
      { "persona": "CTO", "eventCount": 10 }
    ],
    "upcomingEvents": [
      {
        "eventName": "AI Summit 2026",
        "date": "March 15-17, 2026",
        "startDate": "2026-03-15",
        "location": "San Francisco",
        "url": "https://conference.com"
      }
    ]
  }
}
```

## Data Models

### EventData
```typescript
{
  id?: number;
  userId?: string;
  url: string;
  eventName: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  description?: string;
  estimatedAttendees?: number;
  people: Person[];
  sponsors: Sponsor[];
  expectedPersonas: ExpectedPersona[];
  nextBestActions: NextBestAction[];
  relatedEvents: RelatedEvent[];
  analyzedAt?: string;
  lastViewed?: string;
}
```

### Person
```typescript
{
  name: string;
  role: string;
  title?: string;
  company?: string;
  persona?: string;
  linkedin?: string;
  linkedinMessage?: string;
  iceBreaker?: string;
}
```

### ExpectedPersona
```typescript
{
  persona: string;
  likelihood?: string;
  count?: string;
  linkedinMessage?: string;
  iceBreaker?: string;
  conversationStarters?: string[];
  keywords?: string[];
  painPoints?: string[];
}
```

## Browser Extension Integration

### Configuration

Update the browser extension to point to your backend:

```javascript
// In background.js or config file
const API_BASE_URL = 'http://localhost:3000/api';
const BEARER_TOKEN = 'your_token_here'; // if authentication enabled
const USER_ID = 'user123'; // unique user identifier
```

### Saving Event Data

After analyzing an event, send the data to the backend:

```javascript
async function saveEventToBackend(eventData) {
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BEARER_TOKEN}`,
      'X-User-Id': USER_ID,
    },
    body: JSON.stringify(eventData),
  });
  
  const result = await response.json();
  if (result.success) {
    console.log('Event saved:', result.eventId);
  } else {
    console.error('Failed to save event:', result.error);
  }
}

// After Gemini analysis completes:
const analysisData = {
  url: currentUrl,
  eventName: data.eventName,
  date: data.date,
  startDate: data.startDate,
  endDate: data.endDate,
  location: data.location,
  description: data.description,
  estimatedAttendees: data.estimatedAttendees,
  people: data.people,
  sponsors: data.sponsors,
  expectedPersonas: data.expectedPersonas,
  nextBestActions: data.nextBestActions,
  relatedEvents: data.relatedEvents,
  analyzedAt: new Date().toISOString(),
};

await saveEventToBackend(analysisData);
```

### Loading Saved Events

Fetch events from the backend instead of (or in addition to) local storage:

```javascript
async function loadEventsFromBackend() {
  const response = await fetch(`${API_BASE_URL}/events`, {
    headers: {
      'Authorization': `Bearer ${BEARER_TOKEN}`,
      'X-User-Id': USER_ID,
    },
  });
  
  const result = await response.json();
  if (result.success) {
    return result.events;
  } else {
    console.error('Failed to load events:', result.error);
    return [];
  }
}
```

### Syncing User Profile

Sync user profile to the backend:

```javascript
async function syncProfileToBackend(userProfile) {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BEARER_TOKEN}`,
      'X-User-Id': USER_ID,
    },
    body: JSON.stringify(userProfile),
  });
  
  const result = await response.json();
  if (result.success) {
    console.log('Profile synced to backend');
  }
}
```

## CORS Configuration

The server has CORS enabled by default. For production, configure allowed origins:

```javascript
// In http-server.ts
app.use(cors({
  origin: ['https://yourdomain.com', 'chrome-extension://your-extension-id'],
  credentials: true,
}));
```

## Production Deployment

### Recommended Hosting
- **Railway** - Easy deploy from GitHub
- **Fly.io** - Edge hosting with SQLite
- **Vercel** - With edge functions

### Environment Variables
Set these in your hosting platform:
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `MCP_BEARER_TOKEN` (generate a secure token)
- `PORT` (usually auto-set)

### Security Checklist
- [ ] Enable bearer token authentication
- [ ] Use HTTPS only
- [ ] Configure CORS for your extension ID
- [ ] Set rate limiting
- [ ] Monitor API usage
- [ ] Regular database backups (Turso handles this)

## Testing

### Health Check
```bash
curl http://localhost:3000/health
```

### Save Event (with auth)
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_token" \
  -H "X-User-Id: test_user" \
  -d '{
    "url": "https://example.com/event",
    "eventName": "Test Event",
    "people": [],
    "sponsors": [],
    "expectedPersonas": [],
    "nextBestActions": [],
    "relatedEvents": []
  }'
```

### List Events
```bash
curl http://localhost:3000/api/events?userId=test_user \
  -H "Authorization: Bearer your_token"
```

## Troubleshooting

### Database Connection Issues
- Verify `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are set
- Check Turso dashboard for database status
- Ensure network allows outbound connections to Turso

### CORS Errors
- Check browser console for specific error
- Verify extension ID in CORS config
- Test with `curl` to isolate client vs server issues

### Data Not Saving
- Check server logs for errors
- Verify request body matches expected format
- Test with minimal event object first

## Support

For issues or questions:
- Check server logs: `npm start`
- Review TypeScript types in `event-db.ts`
- Test individual endpoints with `curl`
