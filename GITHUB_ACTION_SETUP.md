# GitHub Action Setup - Auto-Sync Extension

## ✅ What Was Created

### GitHub Action Workflow
**File:** `.github/workflows/sync-extension.yml`

**Function:** Automatically syncs `chrome-extension/` folder to public `ammonfife/kbyg` repository.

**Triggers:**
- ✅ Push to `main` branch (when `chrome-extension/**` changes)
- ✅ Manual workflow dispatch

### Documentation
- **Setup Guide:** `.github/SYNC_SETUP.md` (detailed instructions)
- **Quick Reference:** `.github/workflows/README.md`

### Updated Public Repo
- **Repository:** https://github.com/ammonfife/kbyg
- **README:** Updated to document auto-sync

## 🚀 How to Enable

### Step 1: Create Personal Access Token (PAT)

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Configure:
   - **Note:** `KBYG Extension Sync`
   - **Expiration:** 90 days (recommended) or No expiration
   - **Scopes:** ✅ `repo` (Full control of private repositories)
4. Click **"Generate token"**
5. **Copy the token** (format: `ghp_xxxxx...`)

### Step 2: Add as Repository Secret

1. Go to: https://github.com/altonalexander/easy-event-planner/settings/secrets/actions
2. Click **"New repository secret"**
3. Add:
   - **Name:** `KBYG_PAT`
   - **Value:** Paste the token from Step 1
4. Click **"Add secret"**

### Step 3: Test It

Make a test change:
```bash
cd easy-event-planner/chrome-extension
echo "// Auto-sync test" >> mcp-integration.js
git add .
git commit -m "Test: Trigger auto-sync"
git push
```

Check it worked:
1. Visit: https://github.com/altonalexander/easy-event-planner/actions
2. Look for: **"Sync Chrome Extension to Public Repo"** workflow
3. Should show ✅ green checkmark
4. Verify changes in: https://github.com/ammonfife/kbyg/tree/main/chrome-extension

## 🔄 How It Works

```
Developer makes change
        ↓
Commits to chrome-extension/
        ↓
Pushes to main branch
        ↓
GitHub Action detects change
        ↓
Copies chrome-extension/ folder
        ↓
Commits to ammonfife/kbyg
        ↓
Public repo updated! ✅
```

**Commit message format:**
```
Auto-sync: Update extension from easy-event-planner

Synced from commit: abc1234
Triggered by: benfife
Date: 2026-02-02 17:30:00 UTC
```

## 📁 What Gets Synced

**Included:**
- All files in `chrome-extension/`
- Subdirectories (icons/, etc.)
- README and docs

**Excluded:**
- Everything outside `chrome-extension/`
- .git folders
- node_modules

## 🎯 Use Cases

### Use Case 1: Update Extension Code
```bash
# Edit extension file
vim chrome-extension/sidepanel.js

# Commit and push
git add chrome-extension/
git commit -m "Fix: Update sidepanel UI"
git push

# Auto-syncs to kbyg repo automatically! ✅
```

### Use Case 2: Manual Sync
Even if no changes, you can manually trigger:
1. Go to: https://github.com/altonalexander/easy-event-planner/actions
2. Select **"Sync Chrome Extension to Public Repo"**
3. Click **"Run workflow"** → **"Run workflow"**

## 🐛 Troubleshooting

### Error: "Permission denied"
**Fix:** PAT needs `repo` scope
1. Regenerate PAT with correct scope
2. Update `KBYG_PAT` secret

### Error: "Repository not found"
**Fix:** PAT must be from `ammonfife` account
- Ensure you're logged in as `ammonfife` when creating PAT

### Action doesn't trigger
**Check:** Changes must be in `chrome-extension/` folder
- Changes outside this folder won't trigger sync

### Changes not appearing
**Check:** Look at Action logs
- May show "No changes to sync" if only whitespace changed

## 📊 Monitoring

**View all runs:**
https://github.com/altonalexander/easy-event-planner/actions/workflows/sync-extension.yml

**View specific run:**
```bash
gh run list --workflow=sync-extension.yml --limit 10
gh run view <run-id>
```

**Check public repo:**
https://github.com/ammonfife/kbyg

## 🔒 Security

- ✅ PAT is encrypted in GitHub Secrets
- ✅ Never exposed in logs or UI
- ✅ Limited to repo scope only
- ⚠️ Rotate token every 90 days

## 📚 Full Documentation

**Complete setup guide:**
See: `.github/SYNC_SETUP.md` (4.5KB with full details)

**Quick reference:**
See: `.github/workflows/README.md`

---

## ✅ Current Status

- [x] GitHub Action created
- [x] Documentation written
- [x] Public repo updated
- [ ] **Next:** Add PAT token (follow Step 1-2 above)

## 🎬 Demo

**Before setup:** Changes to extension require manual copy to kbyg repo

**After setup:** 
1. Edit `chrome-extension/mcp-integration.js`
2. Push to GitHub
3. **kbyg repo updates automatically in ~30 seconds!**

---

**Created:** 2026-02-02

**Repos:**
- Source: https://github.com/altonalexander/easy-event-planner
- Public: https://github.com/ammonfife/kbyg
