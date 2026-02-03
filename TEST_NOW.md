# 🧪 KBYG Extension - Test Now

**Status:** ✅ Ready for testing  
**Date:** Feb 3, 2026 14:06 MST  
**Backend:** Railway (online)

---

## ✅ Pre-Test Checklist

**Files:**
- ✅ `config.js` (1.1KB) - Backend config
- ✅ `backend-api.js` (7.2KB) - API client  
- ✅ `background.js` (14KB) - Modified with backend sync
- ✅ `manifest.json` (608B) - Unchanged

**Validation:**
- ✅ All JavaScript syntax valid
- ✅ Backend online: `https://unified-mcp-server-production.up.railway.app`
- ✅ Health: `{"status":"ok","server":"unified-mcp","version":"1.0.0"}`

**Changes:**
- ✅ Repo synced (no new commits)
- ✅ .md files backed up to `/Users/benfife/clawd/backups/20260203-1405-kbyg-fresh/`
- ✅ Plan verified against `CHROME_EXTENSION_CONNECTION_GUIDE.md`

---

## 🚀 Test Steps

### 1. Load Extension

**Chrome should already be open on chrome://extensions/**

If not:
```bash
open -a "Google Chrome" "chrome://extensions/"
```

**In Chrome:**
1. Enable **Developer mode** (toggle top-right)
2. Click **"Load unpacked"**
3. Select folder: `/Users/benfife/github/ammonfife/kbyg-ai/chrome-extension/`
4. Click **Select**

**Expected:** Extension loads with no errors

---

### 2. First-Time Setup

1. Click extension icon (puzzle piece) in toolbar
2. Find "Conference Intel & Execution Engine"
3. Side panel opens
4. Click ⚙️ **Settings** (or go through onboarding)

**Add Gemini API Key:**
```
AIzaSyBEBxqZ6aKRjutQirnuxeSuVQa7KlOspps
```

*(Key stored in secrets vault: `secrets get google_ai_api_key`)*

**Optional - Add Profile:**
- Company: Veydra
- Product: Decision intelligence SaaS
- Value Prop: AI-powered GTM intelligence
- Target Personas: CTO, VP Operations, Founders
- Target Industries: SaaS, Healthcare Tech

Click **Save**

---

### 3. Test Event Analysis

**Open a test URL:**
```
https://www.saastr.com/
```

Or any of these:
- https://techweek.utah.edu/
- https://www.utstartupweek.com/
- https://www.linkedin.com/events/

**In extension side panel:**
1. Click **"Analyze Event"**
2. Wait 10-30 seconds

**Expected:**
- Loading spinner
- Results display (event name, people, sponsors, personas)

---

### 4. Verify Backend Integration

**Open Chrome DevTools:**
- Right-click in side panel → **Inspect**
- Click **Console** tab

**Look for these logs:**
```
[KBYG Backend] Initialized with user ID: user_1738612345_abc123
[KBYG] Event saved to backend: 1
```

**If you see:**
- ✅ `Event saved to backend: [number]` → SUCCESS!
- ❌ `Failed to save to backend` → Check error message

---

### 5. Verify Persistence (Backend API)

**Copy your user ID from console** (e.g., `user_1738612345_abc123`)

**Run this command:**
```bash
USER_ID="YOUR_USER_ID_HERE"

curl "https://unified-mcp-server-production.up.railway.app/api/events" \
  -H "X-User-Id: $USER_ID" | jq
```

**Expected output:**
```json
{
  "success": true,
  "events": [
    {
      "id": 1,
      "url": "https://www.saastr.com/",
      "eventName": "SaaStr Annual",
      "date": "2026-05-13",
      "people": [...],
      "sponsors": [...],
      "analyzedAt": "2026-02-03T21:06:00.000Z"
    }
  ]
}
```

---

## ✅ Success Criteria

**ALL GREEN:**
- ✅ Extension loads without errors
- ✅ Event analysis completes (Gemini works)
- ✅ Console shows: `[KBYG Backend] Initialized with user ID: ...`
- ✅ Console shows: `[KBYG] Event saved to backend: [number]`
- ✅ Backend API returns saved event when queried
- ✅ No CORS errors

**PARTIAL (graceful degradation):**
- ✅ Extension loads and analyzes
- ❌ Backend save fails BUT local storage still works
- Note: This is acceptable (graceful fallback)

**FAIL:**
- ❌ Extension won't load
- ❌ Gemini analysis broken
- ❌ importScripts error

---

## 🐛 Troubleshooting

### Extension Won't Load
**Error:** "Unexpected token" or syntax error

**Fix:**
```bash
cd /Users/benfife/github/ammonfife/kbyg-ai/chrome-extension
node -c config.js
node -c backend-api.js
node -c background.js
```

Check output for errors

### Backend Connection Failed
**Console:** `Failed to fetch`

**Check backend:**
```bash
curl https://unified-mcp-server-production.up.railway.app/health
```

Should return: `{"status":"ok"}`

### CORS Error
**Console:** `Access-Control-Allow-Origin`

Backend should allow all origins. Check Railway logs.

### Gemini API Key Error
**Console:** `API key not configured`

Re-enter API key in extension settings:
```
AIzaSyBEBxqZ6aKRjutQirnuxeSuVQa7KlOspps
```

---

## 📊 Test Report Template

```
✅ Test completed successfully

Environment:
- Date: 2026-02-03
- Chrome Version: [x.x.x]
- Extension Path: /Users/benfife/github/ammonfife/kbyg-ai/chrome-extension/

Results:
✅ Extension loaded
✅ Gemini analysis works
✅ Backend initialization logged
✅ Backend save successful: Event ID = [number]
✅ API query returned event
✅ No errors

User ID: user_[timestamp]_[random]
Test URL: https://www.saastr.com/
Event ID: [number]

Notes:
- [Any observations]
- [Performance: X seconds]
- [Issues encountered]
```

---

## 🔄 After Testing

### If Tests Pass ✅

**Document results above**, then:

```bash
cd /Users/benfife/github/ammonfife/kbyg-ai
git status
```

**DO NOT COMMIT OR PUSH YET** - wait for instruction

### If Tests Fail ❌

**Rollback:**
```bash
cd /Users/benfife/github/ammonfife/kbyg-ai
git checkout chrome-extension/background.js
rm chrome-extension/config.js chrome-extension/backend-api.js
```

Reload extension in Chrome

---

## 📚 Additional Documentation

- **Full test plan:** `chrome-extension/TEST_PLAN.md` (if needed)
- **Integration guide:** `CHROME_EXTENSION_CONNECTION_GUIDE.md`
- **Implementation:** `IMPLEMENTATION_SUMMARY.md` (from backup)

---

**Chrome should be open now. Start testing!** 🍔

Extension path to load:
```
/Users/benfife/github/ammonfife/kbyg-ai/chrome-extension/
```
