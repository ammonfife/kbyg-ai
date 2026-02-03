# 🔄 Reload Extension with New Auth Files

## The Problem

You're seeing the old welcome screen without the auth UI. The extension needs a fresh reload to pick up the new files.

## Solution: Hard Reload

### Step 1: Remove Old Extension

1. Go to `chrome://extensions/`
2. Find "Conference Intel & Execution Engine" or "KBYG"
3. Click **"Remove"** button
4. Confirm removal

### Step 2: Clear Extension Data (Optional but Recommended)

```bash
# Clear Chrome extension storage
rm -rf ~/Library/Application\ Support/Google/Chrome/Default/Extensions/*kbyg*
```

Or just continue to Step 3.

### Step 3: Load Fresh Extension

1. In `chrome://extensions/`
2. Enable **Developer mode** (toggle top-right)
3. Click **"Load unpacked"**
4. Select: `/Users/benfife/github/ammonfife/kbyg-ai/chrome-extension/`
5. Extension loads with new files

### Step 4: Verify New Files Loaded

1. Click extension icon
2. Click ⚙️ **Settings** button (top-right in side panel)
3. Look for tabs at top: **Account | Profile | Goals | API**

**If you see "Account" tab → Success!** Click it to see sign in/up UI.

**If you don't see "Account" tab:**
- Check Chrome console for errors
- Run syntax check:
  ```bash
  cd /Users/benfife/github/ammonfife/kbyg-ai/chrome-extension
  node -c auth-handler.js
  node -c supabase-client.js
  ```

---

## Quick Fix: Just Reload

If you already have it loaded:

1. `chrome://extensions/`
2. Find the extension
3. Click the **🔄 circular reload icon**
4. Close and reopen the side panel

---

## What You Should See

### After Fresh Load:

**Settings → Account Tab:**
```
┌──────────────────────────────────┐
│ [Account] [Profile] [Goals] [API]│
│                                   │
│ 🔐 Sign in to sync across devices│
│ ✅ Cloud backup                  │
│ ✅ Cross-device sync             │
│ ✅ Web dashboard access          │
│                                   │
│ [Sign In] [Sign Up]              │
│                                   │
│ Email: _______________           │
│ Password: _______________        │
│ [Sign In Button]                 │
└──────────────────────────────────┘
```

---

## Alternative: Check If Files Are There

```bash
cd /Users/benfife/github/ammonfife/kbyg-ai/chrome-extension
ls -lh auth-*.js supabase-client.js

# Should show:
# auth-handler.js       5.7KB
# auth-styles.css       1.7KB
# supabase-client.js    5.2KB
```

If files are missing, they weren't created. Let me know and I'll recreate them.

---

**TL;DR: Remove extension → Reload unpacked → Check Settings → Account tab** 🍔
