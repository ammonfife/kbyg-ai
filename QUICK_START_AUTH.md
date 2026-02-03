# 🚀 Quick Start - OAuth Authentication

**Status:** ✅ Ready to test  
**Time:** 5-10 minutes

---

## What You Get

✅ **Cross-device sync** - Sign in on multiple devices, share data  
✅ **Web dashboard integration** - Extension data syncs with web app  
✅ **Cloud backup** - Never lose your event analyses  
✅ **Anonymous fallback** - Still works without signing in

---

## Quick Test

### 1. Load Extension

Chrome should already be open. If not:
```bash
open -a "Google Chrome" "chrome://extensions/"
```

1. Enable **Developer mode** (top-right toggle)
2. Click **"Load unpacked"**
3. Select: `/Users/benfife/github/ammonfife/kbyg-ai/chrome-extension/`

### 2. Create Account

1. Click extension icon → **Settings** → **Account** tab
2. Click **"Sign Up"** button
3. Enter:
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm: `password123`
4. Click **"Create Account"**

**Expected:** Shows signed-in state with your email

### 3. Test Sync

1. Go to **Profile** tab in settings
2. Enter some company info
3. Click **"Save Changes"**
4. Navigate to: https://www.saastr.com/
5. Click **"Analyze Event"**
6. Open console (right-click → Inspect → Console)

**Look for:**
```
[Config] Using Supabase user ID: 12345678-abcd-...
[KBYG Backend] Initialized with authenticated user: 12345678-abcd-...
[KBYG] Event saved to backend: 1
```

### 4. Test Sign Out

1. Go back to **Account** tab
2. Click **"Sign Out"**
3. Confirm

**Expected:** Shows signed-out state

### 5. Test Anonymous Mode

1. Analyze another event (or same one)
2. Check console

**Look for:**
```
[Config] Generated anonymous user ID: anon_1738612345_abc123
[KBYG Backend] Initialized with anonymous user: anon_1738612345_abc123
```

**Still works!** Just no sync.

---

## 🎯 Success = All This Works

✅ Sign up creates account  
✅ Shows user email when signed in  
✅ Events save with Supabase user ID  
✅ Sign out returns to anonymous mode  
✅ Events still save in anonymous mode  
✅ No console errors

---

## 📊 Verify Backend

Check your events are saved:

```bash
# Get your user ID from console (the UUID, not anon_...)
USER_ID="12345678-abcd-1234-abcd-1234567890ab"

curl "https://unified-mcp-server-production.up.railway.app/api/events" \
  -H "X-User-Id: $USER_ID" | jq
```

Should return your analyzed events.

---

## 🐛 If Something Breaks

**Extension won't load:**
- Check `chrome://extensions/` for error messages
- Click "Errors" on extension card

**Sign up fails:**
- Check console for error message
- Network issue? Backend down?

**Events not saving:**
- Check console logs
- Backend should still work (graceful degradation)

**Full instructions:** `OAUTH_IMPLEMENTATION.md`

---

## 📁 What Was Added

```
NEW FILES:
- supabase-client.js   (Supabase auth)
- auth-handler.js      (UI logic)
- auth-styles.css      (Styling)
- config.js            (User ID logic)
- backend-api.js       (API client)

MODIFIED:
- background.js        (Import scripts)
- sidepanel.html       (Account tab UI)
```

---

**Go test it now!** 🍔

Extension folder:
```
/Users/benfife/github/ammonfife/kbyg-ai/chrome-extension/
```
