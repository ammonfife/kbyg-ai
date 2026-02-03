# GitHub Action Setup: Extension Auto-Sync

This GitHub Action automatically syncs the `chrome-extension/` folder to the public `ammonfife/kbyg-ai` repository whenever changes are pushed.

## 🔐 Setup Instructions

### 1. Create a Personal Access Token (PAT)

1. Go to GitHub → Settings → Developer settings → Personal access tokens → **Tokens (classic)**
   - Or visit: https://github.com/settings/tokens

2. Click **"Generate new token"** → **"Generate new token (classic)"**

3. Configure token:
   - **Note:** `KBYG Extension Sync`
   - **Expiration:** 90 days (or No expiration for permanent)
   - **Scopes:** Check these:
     - ✅ `repo` (Full control of private repositories)
       - This includes: `repo:status`, `repo_deployment`, `public_repo`, `repo:invite`

4. Click **"Generate token"**

5. **Copy the token immediately** (you won't see it again!)
   - Format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 2. Add Token as Repository Secret

1. Go to `altonalexander/easy-event-planner` repository

2. Settings → Secrets and variables → Actions

3. Click **"New repository secret"**

4. Add secret:
   - **Name:** `KBYG_PAT`
   - **Value:** Paste the token from step 1
   - Click **"Add secret"**

### 3. Verify Setup

1. Make a test change to any file in `chrome-extension/`:
   ```bash
   cd easy-event-planner/chrome-extension
   echo "// Test sync" >> mcp-integration.js
   git add .
   git commit -m "Test: Trigger extension sync"
   git push
   ```

2. Check GitHub Actions:
   - Go to: https://github.com/altonalexander/easy-event-planner/actions
   - Look for workflow: **"Sync Chrome Extension to Public Repo"**
   - Should show ✅ green checkmark

3. Verify in target repo:
   - Visit: https://github.com/ammonfife/kbyg-ai
   - Check that changes appeared in `chrome-extension/`

## 🚀 How It Works

**Trigger:** Any push to `main` branch that modifies `chrome-extension/**`

**Process:**
1. Checks out both repositories
2. Copies `chrome-extension/` folder
3. Commits changes to `ammonfife/kbyg-ai`
4. Pushes automatically

**Commit Message Format:**
```
Auto-sync: Update extension from easy-event-planner

Synced from commit: abc1234
Triggered by: benfife
Date: 2026-02-02 17:30:00 UTC
```

## 🔄 Manual Trigger

You can also manually trigger the sync:

1. Go to: https://github.com/altonalexander/easy-event-planner/actions
2. Select **"Sync Chrome Extension to Public Repo"**
3. Click **"Run workflow"** → Select `main` branch → **"Run workflow"**

## 🐛 Troubleshooting

### Action fails with "Permission denied"
**Cause:** PAT token doesn't have correct permissions

**Fix:**
1. Verify PAT has `repo` scope
2. Regenerate token if needed
3. Update `KBYG_PAT` secret with new token

### Action fails with "Repository not found"
**Cause:** PAT doesn't have access to `ammonfife/kbyg-ai` repo

**Fix:**
1. Ensure `ammonfife` account owns the PAT
2. Or ensure PAT has access to the organization

### Changes don't appear in target repo
**Cause:** No actual file changes detected

**Fix:**
- Check that files actually changed (not just whitespace)
- Look at Action logs: "No changes to sync" message

### Action doesn't trigger
**Cause:** Changes not in `chrome-extension/` folder

**Fix:**
- Only changes to `chrome-extension/**` trigger the action
- Check `paths:` filter in workflow file

## 🛡️ Security

- **PAT is encrypted** in GitHub Secrets (never exposed in logs)
- **Scope is limited** to repository access only
- **Token should be rotated** every 90 days for security
- **Only `ammonfife` account** should create the PAT

## 📝 Maintenance

### Update Token (Every 90 Days)

1. Generate new PAT (same steps as above)
2. Update `KBYG_PAT` secret with new token
3. Test with a small change

### Disable Sync

To temporarily disable:
1. Go to: https://github.com/altonalexander/easy-event-planner/actions
2. Select **"Sync Chrome Extension to Public Repo"**
3. Click "⋮" → **"Disable workflow"**

## 🎯 What Gets Synced

**Included:**
- All files in `chrome-extension/`
- Subdirectories (`icons/`, etc.)
- README and documentation

**Excluded:**
- Everything outside `chrome-extension/`
- `.git` folders
- Node modules (if any)

## 📊 Monitoring

**Check sync status:**
```bash
# View recent syncs
gh run list --workflow=sync-extension.yml --limit 10

# View specific run
gh run view <run-id>
```

**Or via web:**
https://github.com/altonalexander/easy-event-planner/actions/workflows/sync-extension.yml

---

**Status:** ⏳ Awaiting PAT setup

**Next Step:** Create PAT and add as `KBYG_PAT` secret
